import { MercadoLivreSystem } from "./app/Main";
import { client, connectToDatabase } from "./database/DatabaseConfiguration";

async function run() {
  const { db,client } = await connectToDatabase()
  const app = new MercadoLivreSystem(db);
  await app.run();
  await client.close()
}
run();
