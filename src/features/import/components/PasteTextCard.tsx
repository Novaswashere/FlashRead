import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface PasteTextCardProps {
  onPasteText: (text: string) => void;
}

export const PasteTextCard: React.FC<PasteTextCardProps> = ({
  onPasteText,
}) => {
  const [text, setText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleProcess = () => {
    if (!text.trim()) {
      setErrorMsg("Please paste or type text content first.");
      return;
    }
    setErrorMsg("");
    onPasteText(text);
  };

  const handlePasteClipboard = async () => {
    try {
      setErrorMsg("");
      const clipboardText = await navigator.clipboard.readText();
      if (!clipboardText.trim()) {
        setErrorMsg("Clipboard is empty or contains no readable text.");
        return;
      }
      setText(clipboardText);
    } catch (err) {
      setErrorMsg(
        "Unable to access clipboard. Please paste manually (Ctrl+V)."
      );
    }
  };

  return (
    <Card
      className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg"
      id="paste-section"
    >
      <div className="flex items-center justify-between mb-md">
        <label className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">
          Quick Paste &amp; Read
        </label>
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {text.length.toLocaleString()} characters
        </span>
      </div>
      <textarea
        className="w-full min-h-[320px] bg-surface-container-lowest border border-outline-variant/30 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface resize-none custom-scrollbar p-md outline-none transition-colors"
        placeholder="Paste your text content here..."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (errorMsg) setErrorMsg("");
        }}
      ></textarea>

      {errorMsg && (
        <div className="text-error font-label-sm text-label-sm mt-sm font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="mt-lg flex justify-end gap-md border-t border-outline-variant/30 pt-md">
        <button
          onClick={() => {
            setText("");
            setErrorMsg("");
          }}
          className="px-lg py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handlePasteClipboard}
          className="px-lg py-2 rounded-lg font-label-md text-label-md text-primary hover:text-primary-fixed-dim transition-colors"
          id="paste-clipboard-btn"
        >
          Paste Clipboard
        </button>
        <Button
          variant="primary"
          onClick={handleProcess}
          className="h-10 text-sm"
        >
          Process Text
        </Button>
      </div>
    </Card>
  );
};
