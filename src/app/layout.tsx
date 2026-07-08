import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SettingsProvider } from "@/providers/SettingsProvider";
import { LibraryProvider } from "@/providers/LibraryProvider";
import { ReaderProvider } from "@/providers/ReaderProvider";
import { LayoutProvider } from "@/providers/LayoutProvider";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { NavigationDrawer } from "@/components/layout/NavigationDrawer";
import { BottomNavBar } from "@/components/layout/BottomNavBar";

export const metadata = {
  title: "FlashRead - Focus Your Mind",
  description:
    "A professional e-reader app optimized for rapid serial visual presentation reading.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <SettingsProvider>
            <LibraryProvider>
              <ReaderProvider>
                <LayoutProvider>
                  <div className="flex flex-col min-h-screen">
                    <TopAppBar />
                    <div className="flex flex-1">
                      <NavigationDrawer />
                      <div className="flex-1">{children}</div>
                    </div>
                    <BottomNavBar />
                  </div>
                </LayoutProvider>
              </ReaderProvider>
            </LibraryProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
