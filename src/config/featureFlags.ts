export const featureFlags = {
  enableAuth: process.env.NEXT_PUBLIC_ENABLE_AUTH === "true",
  enableCloudSync: process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC === "true",
  enablePdfImport: true,
  enableEpubImport: true,
};
