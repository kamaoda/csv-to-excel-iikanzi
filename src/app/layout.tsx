import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CONVERT .csv TO .xlsx",
  description: "You can convert .csv to .xlsx on the client. Your data will not be uploaded to any server.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
