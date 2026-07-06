import React from "react";

export default function ReaderLoading() {
  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center md:pl-64 animate-pulse pt-16">
      <div className="max-w-reader-width w-full h-96 flex flex-col items-center justify-center">
        <div className="h-12 w-64 bg-surface-container rounded-lg"></div>
      </div>
      <div className="fixed bottom-space-xl left-1/2 -translate-x-1/2 w-full max-w-[600px] px-space-md h-36 bg-surface-container rounded-xl"></div>
    </div>
  );
}
