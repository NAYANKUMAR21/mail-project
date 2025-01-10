"use server";
import { NextRequest, NextResponse } from "next/server";
import { Account } from "~/lib/account";
import { syncEmailToDatabase } from "~/lib/sync-to-db";
import { db } from "~/server/db";

export async function POST(req: Request | NextRequest) {
  console.log("Req", 1);

  const body = await req.json();
  const { accountId, userId } = body;
  if (!accountId || !userId) {
    return NextResponse.json(
      { error: "Missing accountId and userId" },
      { status: 400 },
    );
  }
  console.log("Req", 2);

  const dbAccount = await db.account.findUnique({
    where: {
      id: accountId,
      userId,
    },
  });
  console.log("Req", 3);

  if (!dbAccount) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }
  console.log("Req", 4);

  console.log(dbAccount.accessToken);
  console.log("accessToken:-------------- ", dbAccount.accessToken);
  const account = new Account(dbAccount.accessToken);

  const response = await account.performInitialSync();
  if (!response) {
    return NextResponse.json(
      { error: "failed to perform initial Sync" },
      { status: 500 },
    );
  }
  console.log("Req", 5);

  const { emails, deltaToken } = response;

  // console.log(emails.length, emails[0]);

  await db.account.update({
    where: {
      id: accountId,
    },

    data: {
      nextDeltaToken: deltaToken,
    },
  });
  await syncEmailToDatabase(emails, accountId);

  //   console.log("emails:", emails);
  console.log("Sync completed , delta token");
  return NextResponse.json(
    { success: true, message: "Emails fetched Successfully.." },
    { status: 200 },
  );
  //   const emails = await performInitialSync(dbAccount, accessToken);
}
