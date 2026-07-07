"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/features/import/components/UploadDropzone";
import { PasteTextCard } from "@/features/import/components/PasteTextCard";
import { ImportHelpSection } from "@/features/import/components/ImportHelpSection";
import { SupportedFormatsCard } from "@/features/import/components/SupportedFormatsCard";
import { Toast } from "@/components/ui/Toast";

export default function ImportPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleFileDrop = (file: File) => {
    setIsProcessing(true);
    setToastMessage(`Selected file: ${file.name}. Processing...`);
    setShowToast(true);

    setTimeout(() => {
      setIsProcessing(false);
      setToastMessage("Document imported successfully!");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }, 2000);
  };

  const handlePasteText = (text: string) => {
    setIsProcessing(true);
    setToastMessage(`Pasted text (${text.substring(0, 15)}...). Processing...`);
    setShowToast(true);

    setTimeout(() => {
      setIsProcessing(false);
      setToastMessage("Text imported successfully!");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }, 1500);
  };

  const handleFormatSelect = (formatLabel: string) => {
    setToastMessage(`Selected action: ${formatLabel}`);
    setShowToast(true);
  };

  return (
    <main className="pt-24 pb-20 md:pb-8 md:pl-72 px-space-md max-w-container-max mx-auto min-h-screen text-left">
      <div className="max-w-[800px] mx-auto">
        <div className="mb-space-xl">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
            Import New Content
          </h2>
          <p className="text-on-surface-variant font-body-md">
            Add documents or raw text to your library to start speed reading.
          </p>
        </div>

        <SupportedFormatsCard onFormatSelect={handleFormatSelect} />
        <UploadDropzone
          onFileDrop={handleFileDrop}
          isProcessing={isProcessing}
        />
        <PasteTextCard onPasteText={handlePasteText} />
        <ImportHelpSection />
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        type="success"
        onClose={() => setShowToast(false)}
      />
    </main>
  );
}
