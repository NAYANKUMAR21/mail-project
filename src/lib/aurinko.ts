"use server";
import axios from "axios";
import { auth } from "@clerk/nextjs/server";

export const getAurinkoAuthUrl = async (
  serviceType: "Google" | "Office365",
) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Un-authorised");
  }

  const params = new URLSearchParams({
    clientId: process.env.AURINKO_CLIENT_ID as string,
    serviceType,
    scopes: "Mail.Read Mail.Send",
    responseType: "code",
    returnUrl: `http://localhost:3000/api/aurinko/callback`,
  });

  const authUrl = `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
  return authUrl;
};

export const exchangeCodeForAccessToken = async (code: string) => {
  try {
    // second object is body
    const response = await axios.post(
      "https://api.aurinko.io/v1/auth/token/" + code,
      {},
      {
        auth: {
          username: process.env.AURINKO_CLIENT_ID as string,
          password: process.env.AURINKO_CLIENT_SECRET as string,
        },
      },
    );

    return response.data as {
      accountId: number;
      accessToken: string;
      userId: string;
      userSession: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
    }
    console.log(error);
  }
};

export const getAccountDetails = async (accessToken: string) => {
  try {
    const response = await axios.get("https://api.aurinko.io/v1/account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data as {
      email: string;
      name: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error);
    }
    console.error("Un expected error while fetching data");
  }
};
