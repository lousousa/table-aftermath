import { useSelector, useDispatch } from "react-redux";
import { getPayersColors } from "@/app/utils";
import { t } from "@/app/i18n";

import SavePayerForm from "@/app/components/SavePayerForm";

import {
  setStagingPayer,
  clearStagingPayer,
} from "@/app/store/reducers/payers";
import type { RootState } from "@/app/store";

export default function PayersSection() {
  const payersList = useSelector((state: RootState) => state.payers.list);
  const dispatch = useDispatch();

  const editPayer = (payerId: number) => {
    dispatch(clearStagingPayer());

    const payer = payersList.find((payer) => payer.id === payerId);
    dispatch(setStagingPayer(payer));
  };

  return (
    <div className="w-full">
      <h2 className="mt-4 mb-4 font-bold">{t("payers.title")}</h2>

      <div className="flex flex-wrap gap-2">
        {payersList.map((payer, idx) => (
          <div
            key={"payer_" + payer.id}
            className={`cursor-pointer text-gray-900 rounded py-1 px-2 text-xs font-bold break-words max-w-full ${getPayersColors()[idx]}`}
            onClick={() => editPayer(payer.id)}
          >
            {payer.name}
          </div>
        ))}
      </div>

      <SavePayerForm />
    </div>
  );
}
