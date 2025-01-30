import { cookies } from "next/headers";
import { PropsWithChildren } from "react";

import { ModeContextProvider } from "@-ft/mode-next";
import { DarkModeSelect } from "@/_internal/components/DarkModeSelect";

import "./index.css";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={cookies().get("THEME")?.value === "dark" ? "dark" : undefined}
      suppressHydrationWarning
    >
      <head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <script src="/chess/mode.js" />
      </head>
      <body>
        <ModeContextProvider
          variableName="npm:@-ft/mode-codegen"
          ssrInitialMode={"system"}
        >
          <div className="min-h-screen bg-background text-foreground">
            <header className="container mx-auto p-4">
              <DarkModeSelect />
            </header>
            <main className="container mx-auto p-4">{children}</main>
          </div>
        </ModeContextProvider>
      </body>
    </html>
  );
}
