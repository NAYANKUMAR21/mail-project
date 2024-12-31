"use client";

import { getAurinkoAuthUrl } from "~/lib/aurinko";
import { Button } from "./ui/button";

export default function LinkBitton() {
  return (
    <Button
      onClick={async () => {
        const data = await getAurinkoAuthUrl("Google");
        // window.location.href = data;
        console.log(data);
      }}
    >
      Link Account
    </Button>
  );
}

// https://api.aurinko.io/v1/auth/authorize?clientId=75b1eb1b729f2b1ba12c85308f8c5aa4&serviceType=Google&scopes=Mail.Read+Mail.Send&responseType=code&returnUrl=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Faurinko%2Fcallback
