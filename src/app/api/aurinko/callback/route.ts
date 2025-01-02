// import { getAccountDetails, exchangeCodeForAccessToken } from "@/lib/aurinko";
import { waitUntil } from "@vercel/functions";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { exchangeCodeForAccessToken, getAccountDetails } from "~/lib/aurinko";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  if (status !== "success")
    return NextResponse.json(
      { error: "Account connection failed" },
      { status: 400 },
    );

  const code = params.get("code");
  const token = await exchangeCodeForAccessToken(code as string);
  if (!token)
    return NextResponse.json(
      { error: "Failed to fetch token" },
      { status: 400 },
    );
  const accountDetails = await getAccountDetails(token.accessToken);
  if (!accountDetails) {
    return NextResponse.json(
      { error: "Failed to fetch account details" },
      { status: 400 },
    );
  }
  await db.account.upsert({
    where: { id: token.accountId.toString() },
    create: {
      id: token.accountId.toString(),
      userId,
      accessToken: token.accessToken,
      // provider: "Aurinko",
      emailAddress: accountDetails.email,
      name: accountDetails.name,
    },
    update: {
      accessToken: token.accessToken,
    },
  });
  waitUntil(
    axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
        accountId: token.accountId.toString(),
        userId,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log("herer--------------");
        console.log(err);
      }),
  );

  return NextResponse.redirect(new URL("/mail", req.url));
};
