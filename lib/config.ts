export interface Config {
  googleServiceKeyFile: string;
  spreadsheetId: string;
}

export const config = getConfigFromEnv();

function getConfigFromEnv(): Config {
  const envOrThrow = (key: string) => {
    const value = process.env[key];
    if (!value) {
      throw new Error(`env var required: ${key}`);
    }

    return value;
  };

  return {
    googleServiceKeyFile: envOrThrow("GOOGLE_SERVICE_KEY_FILE"),
    spreadsheetId: envOrThrow("SPREADSHEET_ID"),
  };
}