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
      className="bg-surface-container-lowest border border-border-subtle rounded-xl p-space-lg"
      id="paste-section"
    >
      <div className="flex items-center justify-between mb-space-md">
        <label className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">
          Quick Paste &amp; Read
        </label>
        <span className="text-xs text-outline font-label-mono">
          {text.length.toLocaleString()} characters
        </span>
      </div>
      <textarea
        className="w-full min-h-[320px] bg-transparent border-none focus:ring-0 font-body-md text-on-surface resize-none custom-scrollbar p-0 outline-none"
        placeholder="Paste your text content here..."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (errorMsg) setErrorMsg("");
        }}
      ></textarea>

      {errorMsg && (
        <div className="text-red-500 text-xs mt-2 font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="mt-space-lg flex justify-end gap-space-md border-t border-border-subtle pt-space-md">
        <button
          onClick={() => {
            setText("");
            setErrorMsg("");
          }}
          className="px-space-lg py-2 rounded-lg font-label-mono text-label-mono text-outline hover:text-on-surface transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handlePasteClipboard}
          className="px-space-lg py-2 rounded-lg font-label-mono text-label-mono text-primary hover:text-primary-variant transition-colors"
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
