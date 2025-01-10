// /api/clerk/webhook
"use server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

console.log("here");
export async function POST(req: NextRequest) {
  const { data } = await req.json();
  console.log("Cleark data received", data);

  const email_address = data.email_addresses[0].email_address;
  const first_name = data.first_name;
  const last_name = data.last_name;
  const image_url = data.image_url;
  const id = data.id;
  await db.user.create({
    data: {
      id,
      emailAddress: email_address,
      firstName: first_name,
      lastName: last_name,
      imageUrl: image_url,
    },
  });
  console.log("User created...");
  return NextResponse.json("Webhook received ", { status: 200 });
}

/* 
{
  "data": {
    "birthday": "",
    "created_at": 1654012591514,
    "email_addresses": [
      {
        "email_address": "example@example.org",  want
        "id": "idn_29w83yL7CwVlJXylYLxcslromF1",
        "linked_to": [],
        "object": "email_address",
        "verification": {
          "status": "verified",
          "strategy": "ticket"
        }
      }
    ],
    "external_accounts": [],
    "external_id": "567772",
    "first_name": "Example", want
    "gender": "",
    "id": "user_29w83sxmDNGwOuEthce5gg56FcC", want
    "image_url": "https://img.clerk.com/xxxxxx", want
    "last_name": "Example",                     want
    "last_sign_in_at": 1654012591514,
    "object": "user",
    "password_enabled": true,
    "phone_numbers": [],
    "primary_email_address_id": "idn_29w83yL7CwVlJXylYLxcslromF1",
    "primary_phone_number_id": null,
    "primary_web3_wallet_id": null,
    "private_metadata": {},
    "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
    "public_metadata": {},
    "two_factor_enabled": false,
    "unsafe_metadata": {},
    "updated_at": 1654012591835,
    "username": null,
    "web3_wallets": []
  },
  "event_attributes": {
    "http_request": {
      "client_ip": "0.0.0.0",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
  },
  "object": "event",
  "timestamp": 1654012591835,
  "type": "user.created"
}

*/
