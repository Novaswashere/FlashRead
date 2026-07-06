import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface PasteTextCardProps {
  onPasteText: (text: string) => void;
}

export const PasteTextCard: React.FC<PasteTextCardProps> = ({
  onPasteText
}) => {
  const [text, setText] = useState("");

  const handleProcess = () => {
    if (text.trim()) {
      onPasteText(text);
    }
  };

  return (
    <Card className="bg-surface-container-lowest border border-border-subtle rounded-xl p-space-lg" id="paste-section">
      <div className="flex items-center justify-between mb-space-md">
        <label className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">
          Quick Paste &amp; Read
        </label>
        <span className="text-xs text-outline font-label-mono">{text.length.toLocaleString()} characters</span>
      </div>
      <textarea
        className="w-full min-h-[320px] bg-transparent border-none focus:ring-0 font-body-md text-on-surface resize-none custom-scrollbar p-0 outline-none"
        placeholder="Paste your text content here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className="mt-space-lg flex justify-end gap-space-md border-t border-border-subtle pt-space-md">
        <button
          onClick={() => setText("")}
          className="px-space-lg py-2 rounded-lg font-label-mono text-label-mono text-outline hover:text-on-surface transition-colors"
        >
          Clear
        </button>
        <Button variant="primary" onClick={handleProcess} className="h-10 text-sm">
          Process Text
        </Button>
      </div>
    </Card>
  );
};
