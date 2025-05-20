import { MercadoLivreSystem } from "./app/Main";
import { session } from "./database/DatabaseConfiguration";

async function run() {
  const app = new MercadoLivreSystem(session);
  await app.run();
}
run();
