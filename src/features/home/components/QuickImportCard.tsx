import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface QuickImportCardProps {
  onImportClick: () => void;
}

export const QuickImportCard: React.FC<QuickImportCardProps> = ({
  onImportClick
}) => {
  return (
    <Card className="my-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md bg-primary-container/10 border-primary/20">
      <div className="flex items-center gap-space-md text-left w-full sm:w-auto">
        <span className="material-symbols-outlined text-primary text-4xl">add_circle</span>
        <div>
          <h4 className="font-bold text-on-surface">Import New Book</h4>
          <p className="text-sm text-on-surface-variant">Add EPUB, PDF, TXT or clipboard text to get started.</p>
        </div>
      </div>
      <Button variant="primary" onClick={onImportClick} className="w-full sm:w-auto shrink-0">
        Import Now
      </Button>
    </Card>
  );
};
