import "@/app/globals.css";
import { getDisplayLanguage, t } from "@/app/i18n";
import Provider from "@/app/store/provider";

export const metadata = {
  title: t("metadata.title"),
  description: t("metadata.description"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={getDisplayLanguage()}>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
