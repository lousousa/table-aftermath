import { useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "@/app/store";
import { formatCurrency } from "@/app/utils";

const payerColors = [
  "#60A5FA",
  "#F87171",
  "#A78BFA",
  "#F59E0B",
  "#4ADE80",
  "#FDE047",
  "#2DD4BF",
  "#F9A8D4",
  "#22D3EE",
  "#CBD5E1",
];

const add10Percent = (value: number) =>
  Number((value + value * 0.1).toFixed(2));

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const getResultsTotalText = (
  currentTotal: number,
  itemsTotal: number,
  show10Percent?: boolean,
  showCalculation?: boolean,
) => {
  if (show10Percent) {
    const totalAdd10Percent = add10Percent(currentTotal);
    const itemsAdd10Percent = add10Percent(itemsTotal);

    if (totalAdd10Percent !== itemsAdd10Percent) {
      return `total: ${formatCurrency(totalAdd10Percent)} (falta ${formatCurrency(itemsAdd10Percent - totalAdd10Percent)})`;
    }

    if (showCalculation) {
      return `total: ${formatCurrency(currentTotal)} (${formatCurrency(totalAdd10Percent)})`;
    }

    return `total: ${formatCurrency(totalAdd10Percent)}`;
  }

  if (currentTotal !== Number(itemsTotal.toFixed(2))) {
    return `total: ${formatCurrency(currentTotal)} (falta ${formatCurrency(itemsTotal - currentTotal)})`;
  }

  return `total: ${formatCurrency(currentTotal)}`;
};

export default function ScreenshotButton() {
  const payersList = useSelector((state: RootState) => state.payers.list);
  const itemsList = useSelector((state: RootState) => state.items.list);
  const paymentsList = useSelector((state: RootState) => state.payments.list);
  const currentResults = useSelector(
    (state: RootState) => state.payments.results,
  );

  const [status, setStatus] = useState<string | null>(null);

  const drawScreenshot = () => {
    if (!currentResults || !itemsList.length || !payersList.length) return null;

    const scale = 2;
    const padding = 20;
    const contentWidth = 640;
    const payerBoxSize = 34;
    const payerGap = 8;
    const itemRowHeight = 28;
    const boardCellSize = 24;
    const boardWidth = payersList.length * boardCellSize;
    const itemRowsHeight = Math.max(itemsList.length * itemRowHeight, 1);
    const resultsRowsHeight = currentResults.payersData.length * 26 + 48;
    const bottomPadding = padding;
    const height =
      padding +
      128 +
      itemRowsHeight +
      24 +
      resultsRowsHeight +
      34 +
      bottomPadding;

    const canvas = document.createElement("canvas");
    canvas.width = contentWidth * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.scale(scale, scale);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, contentWidth, height);
    ctx.textBaseline = "alphabetic";

    let y = padding + 16;

    ctx.fillStyle = "#000000";
    ctx.font = "700 22px Arial, sans-serif";
    ctx.fillText("pagantes:", padding, y);
    y += 16;

    ctx.font = "700 16px Arial, sans-serif";
    payersList.forEach((payer, idx) => {
      const x = padding + idx * (payerBoxSize + payerGap);
      drawRoundedRect(ctx, x, y, payerBoxSize, 30, 4);
      ctx.fillStyle = payerColors[idx] ?? "#CBD5E1";
      ctx.fill();
      ctx.fillStyle = "#111827";
      ctx.textAlign = "center";
      ctx.fillText(payer.name, x + payerBoxSize / 2, y + 20);
    });
    ctx.textAlign = "left";
    y += 74;

    ctx.fillStyle = "#000000";
    ctx.font = "700 22px Arial, sans-serif";
    ctx.fillText("itens / pagamentos:", padding, y);
    y += 12;

    const boardX = contentWidth - padding - boardWidth;
    const itemTextX = padding;
    const lineEndX = boardX - 12;
    const firstItemY = y;

    itemsList.forEach((item, itemIdx) => {
      const rowY = firstItemY + itemIdx * itemRowHeight;
      const centerY = rowY + 10;

      ctx.fillStyle = "#000000";
      ctx.font = "400 20px Arial, sans-serif";
      const itemText = `${item.title ? item.title + ": " : ""}${formatCurrency(item.price)}`;
      ctx.fillText(itemText, itemTextX, rowY + 16);

      const lineStartX = Math.min(
        itemTextX + ctx.measureText(itemText).width + 12,
        lineEndX,
      );

      if (lineStartX < lineEndX) {
        ctx.strokeStyle = "#4B5563";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(lineStartX, centerY);
        ctx.lineTo(lineEndX, centerY);
        ctx.stroke();
      }

      payersList.forEach((payer, payerIdx) => {
        const cellX = boardX + payerIdx * boardCellSize;
        const cellY = rowY - 4;
        const checkboxX = cellX + 4;
        const checkboxY = cellY + 4;
        const payment = paymentsList.find(
          (payment) =>
            payment.itemId === item.id && payment.payerId === payer.id,
        );

        ctx.fillStyle = payerColors[payerIdx] ?? "#CBD5E1";
        ctx.fillRect(cellX, cellY, boardCellSize, boardCellSize);

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(checkboxX, checkboxY, 15, 15);
        ctx.strokeStyle = "#6B7280";
        ctx.lineWidth = 1;
        ctx.strokeRect(checkboxX, checkboxY, 15, 15);

        if (payment?.paid) {
          ctx.fillStyle = "#3B82F6";
          ctx.fillRect(checkboxX, checkboxY, 15, 15);
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(checkboxX + 3, checkboxY + 8);
          ctx.lineTo(checkboxX + 7, checkboxY + 12);
          ctx.lineTo(checkboxX + 13, checkboxY + 4);
          ctx.stroke();
        }
      });
    });

    y += itemRowsHeight + 24;

    const resultsBoxHeight = resultsRowsHeight + 34 + 12;
    drawRoundedRect(
      ctx,
      padding,
      y,
      contentWidth - padding * 2,
      resultsBoxHeight,
      4,
    );
    ctx.fillStyle = "#E5E7EB";
    ctx.fill();

    y += 34;
    ctx.fillStyle = "#000000";
    ctx.font = "700 22px Arial, sans-serif";
    ctx.fillText("divisão:", padding + 24, y);
    y += 28;

    ctx.font = "400 20px Arial, sans-serif";
    currentResults.payersData.forEach((payerData) => {
      let amountText = formatCurrency(payerData.amount);

      if (currentResults.show10Percent) {
        amountText = currentResults.showCalculation
          ? `${formatCurrency(payerData.amount)} (${formatCurrency(add10Percent(payerData.amount))})`
          : formatCurrency(add10Percent(payerData.amount));
      }

      const calculationText = currentResults.showCalculation
        ? `${payerData.calculation} = `
        : "";

      ctx.fillText(
        `${payerData.payer.name}: ${calculationText}${amountText}`,
        padding + 24,
        y,
      );
      y += 26;
    });

    y += 12;
    ctx.font = "700 20px Arial, sans-serif";
    const itemsTotal = itemsList.reduce((sum, item) => sum + item.price, 0);
    ctx.fillText(
      getResultsTotalText(
        currentResults.total,
        itemsTotal,
        currentResults.show10Percent,
        currentResults.showCalculation,
      ),
      padding + 24,
      y,
    );

    return canvas;
  };

  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `table-aftermath-${Date.now()}.png`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const takeScreenshot = async () => {
    try {
      const canvas = drawScreenshot();
      if (!canvas) return;

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      if (!blob) return;

      const clipboard = navigator.clipboard as Clipboard & {
        write?: (data: ClipboardItem[]) => Promise<void>;
      };

      if (clipboard.write && typeof ClipboardItem !== "undefined") {
        try {
          await clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ]);
          setStatus("screenshot copiado!");
        } catch {
          downloadBlob(blob);
          setStatus("screenshot baixado!");
        }
      } else {
        downloadBlob(blob);
        setStatus("screenshot baixado!");
      }

      window.setTimeout(() => setStatus(null), 1500);
    } catch (error) {
      console.error("failed to create screenshot", error);

      const canvas = drawScreenshot();
      const dataUrl = canvas?.toDataURL("image/png");
      if (dataUrl) window.open(dataUrl, "_blank");

      setStatus("screenshot gerado!");
      window.setTimeout(() => setStatus(null), 1500);
    }
  };

  return (
    <div>
      <button className="underline" onClick={() => takeScreenshot()}>
        tirar screenshot
      </button>

      {status && <span className="text-blue-300 font-bold ml-4">{status}</span>}
    </div>
  );
}
