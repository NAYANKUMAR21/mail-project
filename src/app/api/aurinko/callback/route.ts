"use server";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForAccessToken, getAccountDetails } from "~/lib/aurinko";
import { db } from "~/server/db";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  console.log(userId);
  if (!userId)
    return NextResponse.json({ message: "UnAuthorised" }, { status: 401 });
  console.log("userId", userId);
  const params = req.nextUrl.searchParams;
  console.log(params);
  const status = params.get("status");
  if (status != "success") {
    return NextResponse.json({ message: "No Code Provided" }, { status: 400 });
  }
  const code = params.get("code");
  if (!code) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }
  const token = await exchangeCodeForAccessToken(code);

  if (!token) {
    return NextResponse.json({
      message: "Failed to exchange code for access token",
    });
  }

  const accountDetails = await getAccountDetails(token.accessToken);

  if (!accountDetails) {
    return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
  }

  await db.account.upsert({
    where: {
      id: token.accountId.toString(),
    },
    update: {
      accessToken: token.accessToken,
    },
    create: {
      id: token.accountId.toString(),
      userId,
      emailAddress: accountDetails.email,
      name: accountDetails.name,
      accessToken: token.accessToken,
    },
  });

  return NextResponse.redirect(new URL("/mail", req.url));
};
