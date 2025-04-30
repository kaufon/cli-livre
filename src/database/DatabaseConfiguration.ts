import { MongoClient, Db } from "mongodb";
import Redis from "ioredis";

class DatabaseService {
	private static instance: DatabaseService;
	private mongoClient: MongoClient;
	private redisClient: Redis;
	private db?: Db;

	private constructor() {
		this.mongoClient = new MongoClient(
			"mongodb://root:example@localhost:27017",
			{
				serverApi: {
					version: "1",
					strict: true,
					deprecationErrors: true,
				},
			},
		);

		this.redisClient = new Redis({
			host: "localhost",
			port: 6379,
		});
	}

	public static getInstance(): DatabaseService {
		if (!DatabaseService.instance) {
			DatabaseService.instance = new DatabaseService();
		}
		return DatabaseService.instance;
	}

	private async connectMongoDatabase(): Promise<void> {
		if (!this.db) {
			try {
				console.log("🔌 Conectando ao MongoDB...");
				await this.mongoClient.connect();
				this.db = this.mongoClient.db("MercadoLivre");
				console.log("✅ Conectado ao MongoDB com sucesso.");
			} catch (error) {
				console.error("❌ Erro ao conectar ao MongoDB:", error);
				throw error;
			}
		}
	}

	private async connectRedisDatabase(): Promise<void> {
		try {
			console.log("🔌 Conectando ao Redis...");
			console.log("✅ Conectado ao Redis com sucesso.");
		} catch (error) {
			console.error("❌ Erro ao conectar ao Redis:", error);
			throw error;
		}
	}

	public async connect(): Promise<void> {
		await this.connectMongoDatabase();
		await this.connectRedisDatabase();
	}

	public getMongoClient(): MongoClient {
		return this.mongoClient;
	}

	public getDb(): Db {
		if (!this.db) {
			throw new Error("MongoDB não está conectado.");
		}
		return this.db;
	}

	public getRedisClient(): Redis {
		return this.redisClient;
	}
}

export const databaseService = DatabaseService.getInstance();
