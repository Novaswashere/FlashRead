export const appConfig = {
  name: "ReadPilot",
  version: "1.0.0-mvp",
  isProduction: process.env.NODE_ENV === "production",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
};
