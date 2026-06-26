import { useDispatch, useSelector } from "react-redux";

import {
  clearStagingPayer,
  setStagingPayer,
  persistStagingPayer,
} from "@/app/store/reducers/payers";
import { t } from "@/app/i18n";
import type { RootState } from "@/app/store";
import { MAX_IMPORTED_ITEM_TITLE_LENGTH } from "@/app/utils";

export default function SavePayerForm() {
  const currentPayer = useSelector(
    (state: RootState) => state.payers.stagingPayer,
  );
  const dispatch = useDispatch();
  const payerNameLength = currentPayer?.name.length ?? 0;
  const trimmedName = currentPayer?.name.trim() ?? "";
  const canSavePayer =
    trimmedName.length > 0 &&
    trimmedName.length <= MAX_IMPORTED_ITEM_TITLE_LENGTH;

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(clearStagingPayer());
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!canSavePayer) return;

    dispatch(persistStagingPayer());
  };

  const handleBlur = () => {
    if (!canSavePayer) return;

    dispatch(persistStagingPayer());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input: { [key: string]: string } = {};

    input[e.target.name] = e.target.value;

    dispatch(setStagingPayer({ ...input }));
  };

  return (
    <>
      {currentPayer && (
        <form className="mt-4 bg-gray-200 p-4 rounded" onSubmit={handleSubmit}>
          <div>
            <label className="block">{t("forms.name")}</label>

            <input
              name="name"
              className="w-full rounded outline-none py-1 px-2 text-right"
              onChange={handleInputChange}
              onBlur={handleBlur}
              value={currentPayer.name}
              autoFocus
            />

            <div
              className={`mt-1 text-right text-xs ${
                payerNameLength > MAX_IMPORTED_ITEM_TITLE_LENGTH
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {payerNameLength}/{MAX_IMPORTED_ITEM_TITLE_LENGTH}
            </div>
          </div>

          <div className="mt-2 text-right">
            <button
              type="button"
              className="text-red-600 underline font-bold"
              onClick={handleCancel}
            >
              {t("forms.cancel")}
            </button>

            {canSavePayer && (
              <button
                type="submit"
                className="text-blue-600 underline font-bold ml-4"
              >
                {t("forms.save")}
              </button>
            )}
          </div>
        </form>
      )}
    </>
  );
}
