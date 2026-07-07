import JSZip from "jszip";
import { ParsedBook, Chapter, Block, ImageAsset } from "../../types";
import { IDocumentParser, ParseOptions } from "./contract";
import { ParserError, InvalidEpubError, CorruptedFileError } from "../../lib/errors";

export class EpubParser implements IDocumentParser {
  async parse(data: File | string, options?: ParseOptions): Promise<ParsedBook> {
    const signal = options?.signal;
    const onProgress = options?.onProgress;

    if (signal?.aborted) {
      throw new ParserError("Parsing aborted", "ABORTED");
    }

    if (typeof data === "string") {
      throw new ParserError("EPUB parser expects a binary file, not a string", "INVALID_INPUT");
    }

    onProgress?.(5);

    let zip: JSZip;
    try {
      zip = await JSZip.loadAsync(data);
    } catch (err: any) {
      throw new CorruptedFileError(`Failed to read EPUB file zip structure: ${err?.message || err}`);
    }

    if (signal?.aborted) {
      throw new ParserError("Parsing aborted", "ABORTED");
    }

    onProgress?.(15);

    // 1. Read container.xml to find OPF path
    const containerFile = zip.file("META-INF/container.xml");
    if (!containerFile) {
      throw new InvalidEpubError("Missing META-INF/container.xml in EPUB archive");
    }

    const containerText = await containerFile.async("text");
    const parser = new DOMParser();
    const containerDoc = parser.parseFromString(containerText, "text/xml");
    const rootfile = containerDoc.getElementsByTagName("rootfile")[0];
    const opfPath = rootfile?.getAttribute("full-path");

    if (!opfPath) {
      throw new InvalidEpubError("Rootfile full-path attribute not found in container.xml");
    }

    if (signal?.aborted) {
      throw new ParserError("Parsing aborted", "ABORTED");
    }

    onProgress?.(25);

    // 2. Read OPF file contents
    const opfFile = zip.file(opfPath);
    if (!opfFile) {
      throw new InvalidEpubError(`OPF metadata file not found at path: ${opfPath}`);
    }

    const opfText = await opfFile.async("text");
    const opfDoc = parser.parseFromString(opfText, "text/xml");

    // Helper for relative path resolution
    const opfDir = opfPath.includes("/") ? opfPath.substring(0, opfPath.lastIndexOf("/")) : "";
    const resolvePath = (relative: string) => {
      if (!opfDir) return relative;
      const parts = (opfDir + "/" + relative).split("/");
      const resolved: string[] = [];
      for (const part of parts) {
        if (part === "." || part === "") continue;
        if (part === "..") resolved.pop();
        else resolved.push(part);
      }
      return resolved.join("/");
    };

    // 3. Extract metadata
    const title = opfDoc.getElementsByTagName("dc:title")[0]?.textContent ||
                  opfDoc.getElementsByTagName("title")[0]?.textContent ||
                  data.name.replace(/\.[^/.]+$/, "");
    const author = opfDoc.getElementsByTagName("dc:creator")[0]?.textContent ||
                   opfDoc.getElementsByTagName("creator")[0]?.textContent ||
                   "Unknown Author";
    const language = opfDoc.getElementsByTagName("dc:language")[0]?.textContent ||
                     opfDoc.getElementsByTagName("language")[0]?.textContent ||
                     "en";
    const description = opfDoc.getElementsByTagName("dc:description")[0]?.textContent ||
                        opfDoc.getElementsByTagName("description")[0]?.textContent ||
                        "";
    const publisher = opfDoc.getElementsByTagName("dc:publisher")[0]?.textContent ||
                      opfDoc.getElementsByTagName("publisher")[0]?.textContent ||
                      "";
    const publicationDate = opfDoc.getElementsByTagName("dc:date")[0]?.textContent ||
                            opfDoc.getElementsByTagName("date")[0]?.textContent ||
                            "";

    // 4. Map manifest and spine
    const manifestItems = opfDoc.getElementsByTagName("item");
    const manifest = new Map<string, { href: string; mediaType: string }>();
    for (let i = 0; i < manifestItems.length; i++) {
      const item = manifestItems[i];
      const id = item.getAttribute("id");
      const href = item.getAttribute("href");
      const mediaType = item.getAttribute("media-type");
      if (id && href) {
        manifest.set(id, { href, mediaType: mediaType || "" });
      }
    }

    const spineItems = opfDoc.getElementsByTagName("itemref");
    const spine: string[] = [];
    for (let i = 0; i < spineItems.length; i++) {
      const idref = spineItems[i].getAttribute("idref");
      if (idref) {
        const item = manifest.get(idref);
        if (item) {
          spine.push(item.href);
        }
      }
    }

    if (spine.length === 0) {
      throw new InvalidEpubError("No readable spine items found in OPF file");
    }

    const bookId = `book-${Math.random().toString(36).substring(2, 9)}`;
    const assets: ImageAsset[] = [];
    const chapters: Chapter[] = [];
    let totalWords = 0;

    // Helper for resolving asset MIME types
    const getMimeType = (path: string) => {
      const ext = path.substring(path.lastIndexOf(".")).toLowerCase();
      switch (ext) {
        case ".jpg":
        case ".jpeg": return "image/jpeg";
        case ".png": return "image/png";
        case ".gif": return "image/gif";
        case ".svg": return "image/svg+xml";
        case ".webp": return "image/webp";
        default: return "application/octet-stream";
      }
    };

    // 5. Extract cover image (if any)
    let coverAssetId: string | undefined;
    let coverHref: string | null = null;
    let coverMetaId: string | null = null;

    // A. Check meta tag named "cover"
    const metaTags = opfDoc.getElementsByTagName("meta");
    for (let i = 0; i < metaTags.length; i++) {
      if (metaTags[i].getAttribute("name") === "cover") {
        coverMetaId = metaTags[i].getAttribute("content");
        break;
      }
    }

    if (coverMetaId) {
      const item = manifest.get(coverMetaId);
      if (item) coverHref = item.href;
    }

    // B. Check manifest properties cover-image
    if (!coverHref) {
      for (let i = 0; i < manifestItems.length; i++) {
        const item = manifestItems[i];
        if (item.getAttribute("properties") === "cover-image") {
          coverHref = item.getAttribute("href");
          break;
        }
      }
    }

    if (coverHref) {
      const coverFullPath = resolvePath(coverHref);
      const coverFile = zip.file(coverFullPath);
      if (coverFile) {
        const coverBlob = await coverFile.async("blob");
        coverAssetId = `cover-${Math.random().toString(36).substring(2, 9)}`;
        assets.push({
          id: coverAssetId,
          bookId,
          mimeType: getMimeType(coverFullPath),
          data: coverBlob,
        });
      }
    }

    // 6. Ingest XHTML Spine items
    const totalSpine = spine.length;
    for (let index = 0; index < totalSpine; index++) {
      if (signal?.aborted) {
        throw new ParserError("Parsing aborted", "ABORTED");
      }

      // Increment progress bar: 30% to 90%
      const progressPercent = 30 + Math.round((index / totalSpine) * 60);
      onProgress?.(progressPercent);

      const spineHref = spine[index];
      const htmlFullPath = resolvePath(spineHref);
      const htmlFile = zip.file(htmlFullPath);
      if (!htmlFile) continue;

      const htmlText = await htmlFile.async("text");
      const doc = parser.parseFromString(htmlText, "text/html");

      const blocks: Block[] = [];
      let chapterTitle = `Chapter ${index + 1}`;
      let chapterWordCount = 0;

      // Extract title from head if available
      const headTitle = doc.querySelector("title")?.textContent?.trim();
      if (headTitle) {
        chapterTitle = headTitle;
      }

      // Walk DOM tree in order
      const walkNode = async (node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tagName = el.tagName.toLowerCase();

          if (tagName === "p") {
            const text = el.textContent?.trim() || "";
            if (text) {
              const pId = `para-${Math.random().toString(36).substring(2, 9)}`;
              blocks.push({
                id: pId,
                type: "paragraph",
                text,
              });
              chapterWordCount += text.split(/\s+/).filter(Boolean).length;
            }
            return;
          }

          if (tagName.match(/^h[1-6]$/)) {
            const text = el.textContent?.trim() || "";
            const level = parseInt(tagName[1], 10);
            if (text) {
              const hId = `head-${Math.random().toString(36).substring(2, 9)}`;
              blocks.push({
                id: hId,
                type: "heading",
                level,
                text,
              });
              chapterWordCount += text.split(/\s+/).filter(Boolean).length;
            }
            return;
          }

          if (tagName === "img") {
            const src = el.getAttribute("src") || "";
            if (src) {
              const htmlDir = spineHref.includes("/")
                ? spineHref.substring(0, spineHref.lastIndexOf("/"))
                : "";
              const imgRelPath = htmlDir ? htmlDir + "/" + src : src;
              const imgFullPath = resolvePath(imgRelPath);

              const imgFile = zip.file(imgFullPath);
              if (imgFile) {
                const assetId = `img-${Math.random().toString(36).substring(2, 9)}`;
                blocks.push({
                  id: `img-block-${Math.random().toString(36).substring(2, 9)}`,
                  type: "image",
                  assetId,
                  caption: el.getAttribute("title") || el.getAttribute("alt") || undefined,
                  altText: el.getAttribute("alt") || undefined,
                  originalPosition: blocks.length,
                });

                const imgBlob = await imgFile.async("blob");
                assets.push({
                  id: assetId,
                  bookId,
                  mimeType: getMimeType(imgFullPath),
                  data: imgBlob,
                });
              }
            }
            return;
          }
        }

        const childNodes = Array.from(node.childNodes);
        for (const child of childNodes) {
          await walkNode(child);
        }
      };

      await walkNode(doc.body);

      // Only push non-empty chapters
      if (blocks.length > 0) {
        const flatContent = blocks
          .filter((b) => b.type === "paragraph" || b.type === "heading")
          .map((b) => (b as any).text)
          .join("\n\n");

        chapters.push({
          id: `chap-${Math.random().toString(36).substring(2, 9)}`,
          title: chapterTitle,
          blocks,
          content: flatContent,
          wordCount: chapterWordCount,
        });

        totalWords += chapterWordCount;
      }
    }

    onProgress?.(100);

    return {
      id: bookId,
      bookId,
      chapters,
      totalWords,
      metadata: {
        title,
        author,
        language,
        description,
        publisher,
        publicationDate,
        coverAssetId,
        fileName: data.name,
        fileSize: data.size,
        contentType: "epub",
      },
      assets,
    };
  }
}
export default EpubParser;
