import { MercadoLivreSystem } from "./app/Main";
import { connectToDatabase } from "./database/DatabaseConfiguration";

async function run() {
	const { client } = await connectToDatabase();
	const app = new MercadoLivreSystem(client);
	await app.run();
	await client.shutdown();
}
run();
