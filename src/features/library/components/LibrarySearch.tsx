import React from "react";
import { SearchBar } from "@/components/shared/SearchBar";

export interface LibrarySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const LibrarySearch: React.FC<LibrarySearchProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="mb-space-xl">
      <div className="flex flex-col gap-space-md">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Library</h2>
        <SearchBar placeholder="Search titles, authors, or topics..." value={value} onChange={onChange} />
      </div>
    </div>
  );
};
