import { useDispatch } from "react-redux";

import { setResults } from "@/app/store/reducers/payments";
import { t } from "@/app/i18n";

export default function ResultsOptions() {
  const dispatch = useDispatch();

  const handleShowCalculation = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setResults({ showCalculation: e.target.checked }));
  };

  const handleShow10Percent = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setResults({ show10Percent: e.target.checked }));
  };

  return (
    <div className="mt-4">
      <h2 className="font-bold">{t("options.title")}</h2>

      <div>
        <input
          id="10_percent_checkbox"
          type="checkbox"
          onChange={handleShow10Percent}
        />

        <label className="ml-2" htmlFor="10_percent_checkbox">
          {t("options.include10Percent")} <b>10%</b> ┻━┻ ヘ╰( •̀ε•́ ╰)
        </label>
      </div>

      <div>
        <input
          id="calculation_checkbox"
          type="checkbox"
          onChange={handleShowCalculation}
        />

        <label className="ml-2" htmlFor="calculation_checkbox">
          {t("options.showCalculation")} ¯\_(ツ)_/¯
        </label>
      </div>
    </div>
  );
}
