import { z } from "zod";

export interface Estate {
  id: string;
  address: string;
  price: number;
  reside: boolean;
}

const estateRecordSchema = z.object({
  id: z.string().min(1),
  address: z.string().min(1),
  price: z.string().transform((str) => {
    const [hi, lo] = str.split(" ");
    return Number(hi + "." + lo);
  }),
  reside: z.enum(["TRUE", "FALSE"]).transform((str) => Boolean(str.toLocaleLowerCase())),
});

export function decodeFromValues(input: unknown[]): Estate {
  return estateRecordSchema.parse({
    id: input[0],
    address: input[1],
    price: input[2],
    reside: input[3],
  });
}

export function encodeToValues(estate: Estate): unknown[] {
  return [estate.id, estate.address, formatPrice(estate.price), estate.reside ? "TRUE" : "FALSE"];
}

function formatPrice(price: number): string {
  const str = price.toString();
  if (str.indexOf(".") !== -1) {
    return str.replace(/\./, " ");
  } else {
    return str + " 0";
  }
}
