import React from "react";
import { EmptyState } from "@/components/shared/EmptyState";

export interface EmptyLibraryStateProps {
  onImportClick: () => void;
}

export const EmptyLibraryState: React.FC<EmptyLibraryStateProps> = ({
  onImportClick,
}) => {
  return (
    <EmptyState
      icon="library_books"
      title="Your Library is Empty"
      description="You haven't imported any documents yet. Get started by uploading EPUB, PDF, TXT or pasting raw content."
      actionLabel="Import New Document"
      onAction={onImportClick}
      className="mt-12 py-16"
    />
  );
};
