import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { isAllowedGoogleEmail } from "@/app/server/allowedGoogleEmails";

type ResponseData = {
  authenticated: boolean;
  allowed: boolean;
  email: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      authenticated: false,
      allowed: false,
      email: null,
    });
  }

  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email ?? null;

  return res.status(200).json({
    authenticated: Boolean(session),
    allowed: isAllowedGoogleEmail(email),
    email,
  });
}
