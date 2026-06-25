import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../auth/[...nextauth]";

const OPENAI_CHAT_COMPLETIONS_URL =
  "https://api.openai.com/v1/chat/completions";
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type ReceiptItem = {
  title: string;
  price: number;
};

type ReceiptExtraction = {
  receiptDetected: boolean;
  items: ReceiptItem[];
  total: number | null;
  currency: string | null;
  sumMatchesTotal: boolean | null;
  warning: string | null;
};

type ErrorResponse = {
  error: string;
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "12mb",
    },
  },
};

const getImageMetadata = (image: string) => {
  const match = image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) return null;

  return {
    mediaType: match[1],
    base64: match[2],
    size: Buffer.byteLength(match[2], "base64"),
  };
};

const parseOpenAiJson = (content: string): ReceiptExtraction => {
  const trimmedContent = content.trim();
  const jsonContent = trimmedContent
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(jsonContent);
};

const sanitizeExtraction = (
  extraction: ReceiptExtraction,
): ReceiptExtraction => {
  const items = Array.isArray(extraction.items)
    ? extraction.items
        .filter(
          (item) =>
            item &&
            typeof item.title === "string" &&
            typeof item.price === "number" &&
            Number.isFinite(item.price) &&
            item.price > 0,
        )
        .map((item) => ({
          title: item.title.trim(),
          price: Number(item.price.toFixed(2)),
        }))
    : [];

  const total =
    typeof extraction.total === "number" && Number.isFinite(extraction.total)
      ? Number(extraction.total.toFixed(2))
      : null;

  const itemsSum = Number(
    items.reduce((sum, item) => sum + item.price, 0).toFixed(2),
  );
  const sumMatchesTotal =
    total === null ? null : Math.abs(itemsSum - total) <= 0.02;

  return {
    receiptDetected: Boolean(extraction.receiptDetected) && items.length > 0,
    items,
    total,
    currency:
      typeof extraction.currency === "string" ? extraction.currency : null,
    sumMatchesTotal,
    warning: typeof extraction.warning === "string" ? extraction.warning : null,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReceiptExtraction | ErrorResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Authentication is required" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI API key is not configured" });
  }

  const image = typeof req.body?.image === "string" ? req.body.image : "";
  const metadata = getImageMetadata(image);

  if (!metadata) {
    return res
      .status(400)
      .json({ error: "A valid base64 image data URL is required" });
  }

  if (!ALLOWED_IMAGE_TYPES.has(metadata.mediaType)) {
    return res.status(400).json({ error: "Unsupported image type" });
  }

  if (metadata.size > MAX_IMAGE_SIZE_BYTES) {
    return res.status(400).json({ error: "Image is too large" });
  }

  const openAiResponse = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_RECEIPT_MODEL ?? "gpt-4o-mini",
      temperature: 0,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "restaurant_receipt_extraction",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              receiptDetected: {
                type: "boolean",
                description:
                  "Whether the image clearly contains a restaurant, bar, or food-service bill receipt.",
              },
              items: {
                type: "array",
                description:
                  "Line items purchased by the customer. Exclude taxes, tips, service fees, discounts, payment method lines, subtotals, and totals unless they are the only readable charge lines.",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: {
                      type: "string",
                      description:
                        "Short readable item description in the original language when possible.",
                    },
                    price: {
                      type: "number",
                      description:
                        "Final positive item price as a decimal number using dot as decimal separator.",
                    },
                  },
                  required: ["title", "price"],
                },
              },
              total: {
                type: ["number", "null"],
                description:
                  "The receipt final total amount if visible, excluding change due.",
              },
              currency: {
                type: ["string", "null"],
                description:
                  "Detected currency code or symbol, such as BRL, USD, EUR, or R$.",
              },
              sumMatchesTotal: {
                type: ["boolean", "null"],
                description:
                  "Whether the extracted item prices sum to the visible final total. Null when no total is visible.",
              },
              warning: {
                type: ["string", "null"],
                description:
                  "Brief explanation when confidence is low, receipt is not detected, prices are unclear, or item sum differs from total.",
              },
            },
            required: [
              "receiptDetected",
              "items",
              "total",
              "currency",
              "sumMatchesTotal",
              "warning",
            ],
          },
        },
      },
      messages: [
        {
          role: "system",
          content:
            "You extract structured data from restaurant and bar receipt images for a bill-splitting app. Return only valid JSON that matches the schema. Be conservative: if the image is not a receipt, set receiptDetected to false and return an empty items array.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image. If it is a restaurant/bar receipt, extract purchased line items and their prices. Ignore totals, subtotals, taxes, service fees, tips, discounts, payment method lines, loyalty text, addresses, CNPJ/tax IDs, and receipt metadata. If item quantity is shown with a total line price, use the final line price. If only unit price and quantity are clear, multiply them. Confirm whether item prices sum to the visible final total. If not a receipt, return receiptDetected false, empty items, null total/currency/sumMatchesTotal, and a warning.",
            },
            {
              type: "image_url",
              image_url: {
                url: image,
                detail: "high",
              },
            },
          ],
        },
      ],
    }),
  });

  if (!openAiResponse.ok) {
    const errorBody = await openAiResponse.text();
    console.error("OpenAI receipt extraction failed:", errorBody);
    return res.status(502).json({ error: "Receipt extraction failed" });
  }

  const openAiPayload = await openAiResponse.json();
  const content = openAiPayload?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    return res
      .status(502)
      .json({ error: "Receipt extraction returned an invalid response" });
  }

  try {
    return res.status(200).json(sanitizeExtraction(parseOpenAiJson(content)));
  } catch (error) {
    console.error("Failed to parse receipt extraction:", error);
    return res
      .status(502)
      .json({ error: "Receipt extraction returned invalid JSON" });
  }
}
