import { MercadoLivreSystem } from "./app/Main";
import { databaseService } from "./database/DatabaseConfiguration";

async function run() {
	const mongoClient = databaseService.getMongoClient();
	const redisClient = databaseService.getRedisClient();
	await databaseService.connect();
	const db = databaseService.getDb();
	const app = new MercadoLivreSystem(db, redisClient);
	await app.run();
	await mongoClient.close();
}
run();
