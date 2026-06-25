import Image from "next/image";

import { t } from "@/app/i18n";

export default function PageHeader() {
  return (
    <header className="bg-gray-900">
      <div className="flex items-center gap-x-4 p-4 mx-auto max-w-lg">
        <Image
          src="/assets/images/icons8-pub-64.png"
          alt="logo header"
          width={64}
          height={64}
          className="w-10"
        />

        <h1 className="text-2xl text-white">
          {t("app.titlePrefix")}{" "}
          <b className="italic">{t("app.titleEmphasis")}</b>
        </h1>
      </div>
    </header>
  );
}
