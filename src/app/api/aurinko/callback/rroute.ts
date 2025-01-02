import { waitUntil } from "@vercel/functions";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { exchangeCodeForAccessToken, getAccountDetails } from "~/lib/aurinko";
import { db } from "~/server/db";
import axios from "axios";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  console.log(userId);
  if (!userId) {
    return NextResponse.json({ message: "UnAuthorised" }, { status: 401 });
  }
  console.log("userId", userId);
  const params = req.nextUrl.searchParams;
  console.log("params", params);

  const status = params.get("status");
  if (status != "success") {
    return NextResponse.json({ message: "No Code Provided" }, { status: 400 });
  }

  const code = params.get("code");
  if (!code) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
  }
  console.log("code:", code, status);

  const token = await exchangeCodeForAccessToken(code);

  console.log("token:", token);
  if (!token) {
    return NextResponse.json({
      message: "Failed to exchange code for access token",
    });
  }

  const accountDetails = await getAccountDetails(token.accessToken);
  if (!accountDetails) {
    return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
  }
  console.log("Upsert function", userId);

  console.log("token:", token);
  console.log("accountDetails:", accountDetails);
  console.log("userId:", userId);

  if (!token || !accountDetails || !userId) {
    // throw new Error(
    //   "Missing required data: token, accountDetails, or userId",
    // );
    return NextResponse.json(
      {
        message: "Missing required data: token, accountDetails, or userId",
      },
      { status: 401 },
    );
  }

  await db.account.upsert({
    where: {
      id: token.accountId.toString(),
    },
    create: {
      id: token.accountId.toString(),
      userId: userId.toString(),
      emailAddress: accountDetails.email,
      name: accountDetails.name,
      accessToken: token.accessToken,
    },
    update: {
      accessToken: token.accessToken,
    },
  });

  console.log("Upsert function completed successfully.");

  //triger for syn mail from aurinko
  console.log("callback aurinko, waitUntil...", token);
  console.log(process.env.NEXT_PUBLIC_URL);
  // const syncPromise = axios
  //   .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
  //     accountId: token.accountId.toString(),
  //     userId,
  //   })
  //   .then((res) => {
  //     console.log("Initial sync triggered", res.data);
  //   })
  //   .catch((er) => console.log("Failed to trigger initial sync", er));

  // waitUntil(syncPromise);

  return NextResponse.redirect(new URL("/mail", req.url));
};
