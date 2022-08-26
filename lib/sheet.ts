import * as google from "@googleapis/sheets";
import fs from "fs/promises";
import { type Config, config } from "./config";

/* CONSTANTS */

const REQUIRED_SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const DATA_RANGE = "A:D" as const;

const sheets = await createGoogleSheetsApi(config);

/* READ FROM SPREADSHEET */

export async function queryItems<T>(decode: (item: unknown[]) => T): Promise<T[]> {
  const { data } = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: config.spreadsheetId,
    ranges: [DATA_RANGE],
  });

  if (data.valueRanges) {
    const results: T[] = [];
    for (const range of data.valueRanges) {
      if (range.values) {
        // TODO: Opt-in header row support. Currently we just strip them.
        // FIXME: If there are more than 1 ranges in sheet, the first row of each ranges would be stripped.
        results.push(...range.values.slice(1).map(decode));
      }
    }

    return results;
  } else {
    return [];
  }
}

type PutItem<T> = {
  encode(value: T): unknown[];
};

export async function putItem<T>(item: T, { encode }: PutItem<T>): Promise<void> {
  const values = encode(item);
  await sheets.spreadsheets.values.append({
    valueInputOption: "RAW",
    spreadsheetId: config.spreadsheetId,
    range: DATA_RANGE,
    requestBody: {
      values: [values],
    },
  });
}

/* CREATE DEFAULT API */

async function createGoogleSheetsApi(config: Config) {
  const contents = await fs.readFile(config.googleServiceKeyFile, { encoding: "utf8" });
  const keys = JSON.parse(contents);
  return google.sheets({
    version: "v4",
    auth: new google.auth.JWT({
      email: keys.client_email!,
      key: keys.private_key!,
      scopes: REQUIRED_SCOPES,
    }),
  });
}
