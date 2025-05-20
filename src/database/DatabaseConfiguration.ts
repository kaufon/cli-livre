import dotenv from "dotenv";
import neo4j from "neo4j-driver";

dotenv.config();

const uri = process.env.NEO4J_URI as string;
const user = process.env.NEO4J_USERNAME as string;
const password = process.env.NEO4J_PASSWORD as string;

export const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export async function verifyConnection() {
	try {
		await driver.getServerInfo();
		console.log("✅ Connected to Neo4j");
	} catch (err) {
		console.error("❌ Neo4j connection failed:", err);
		process.exit(1); // Opcional: interrompe se a conexão falhar
	}
}
