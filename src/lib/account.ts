import axios, { all } from "axios";
import { EmailMessage, SyncResponse, SyncUpdatedResponse } from "./types";

export class Account {
  private token: string;
  constructor(token: string) {
    this.token = token;
  }

  async startSync() {
    const response = await axios.post<SyncResponse>(
      "https://api.aurinko.io/v1/email/sync",
      {},
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          daysWithin: 2,
          bodyType: "html",
        },
      },
    );
    console.log("Start Sync completed", response.data);
    return response.data;
  }
  async getUpdatedEmail({
    deltaToken,
    pageToken,
  }: {
    deltaToken?: string;
    pageToken?: string;
  }) {
    let params: Record<string, string> = {};

    if (pageToken) params.pageToken = pageToken;
    if (deltaToken) params.deltaToken = deltaToken;

    const response = await axios.get<SyncUpdatedResponse>(
      "https://api.aurinko.io/v1/email/sync/updated",
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params,
      },
    );
    console.log("get updated emails completed", response.data.records[0]);

    return response.data;
  }
  async performInitialSync() {
    try {
      let syncResponse = await this.startSync();
      while (!syncResponse.ready) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        syncResponse = await this.startSync();
      }
      let storedDeltaToken: string = syncResponse.syncUpdatedToken;
      let updatedResponse = await this.getUpdatedEmail({
        deltaToken: storedDeltaToken,
      });

      if (updatedResponse.nextDeltaToken) {
        // sync has completed
        storedDeltaToken = updatedResponse.nextDeltaToken;
      }

      let allEmails: EmailMessage[] = updatedResponse.records;

      // fetch all pages

      while (updatedResponse.nextPageToken) {
        updatedResponse = await this.getUpdatedEmail({
          pageToken: updatedResponse.nextPageToken,
        });

        allEmails = allEmails.concat(updatedResponse.records);
        if (updatedResponse.nextDeltaToken) {
          storedDeltaToken = updatedResponse.nextDeltaToken;
        }
      }
      console.log(
        "Sync Completed..., we have synced ",
        allEmails.length,
        "Emails",
      );
      //store the delta token for the future incremental purposes

      return {
        emails: allEmails,
        deltaToken: storedDeltaToken,
      };
      //access he bookmark delta token
      // const stored
    } catch (er) {
      if (axios.isAxiosError(er)) {
        console.error(
          "Error during sync:",
          JSON.stringify(er.response?.data, null, 2),
        );
      } else {
        console.error("Error during sync:", er);
      }
    }
  }
}
