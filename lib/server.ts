import fastify from "fastify";
import { nanoid } from "nanoid";
import * as Estate from "./estate";
import { putItem, queryItems } from "./sheet";

/* GLOBAL INSTANCES */

const app = fastify({ logger: true });

/* ROUTES */

app.get<{ Querystring: { limit: number } }>("/", {}, async (request, reply) => {
  const limit = request.query.limit;
  const allEstates = await queryItems(Estate.decodeFromValues);
  const responseData =
    !isNaN(limit) && limit <= allEstates.length ? allEstates.slice(0, limit) : allEstates;

  reply.send(responseData);
});

app.put<{ Querystring: { address: string } }>("/example", async (request, reply) => {
  await putItem(
    {
      id: nanoid().toLocaleUpperCase(),
      address: request.query.address || "",
      price: (Math.random() * 1000) | 0,
      reside: false,
    },
    { encode: Estate.encodeToValues }
  );

  reply.send({ ok: true });
});

/* MAIN */

async function main() {
  try {
    await app.listen({ port: 9000 });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

/* INTERNALS */
