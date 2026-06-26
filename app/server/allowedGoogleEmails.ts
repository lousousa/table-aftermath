const normalizeEmail = (email?: string | null) =>
  email?.trim().toLowerCase() ?? "";

const ALLOWED_GOOGLE_EMAILS = process.env.ALLOWED_GOOGLE_EMAILS ?? "";

export const getAllowedGoogleEmails = () =>
  new Set(
    ALLOWED_GOOGLE_EMAILS.split(",")
      .map((email) => normalizeEmail(email))
      .filter(Boolean),
  );

export const isAllowedGoogleEmail = (email?: string | null) =>
  getAllowedGoogleEmails().has(normalizeEmail(email));

export { normalizeEmail };
