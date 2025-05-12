import { Client } from "cassandra-driver";
import { createKeyspace, createTables } from "./DatabaseInit";

const cassandraClient = new Client({
	contactPoints: ["127.0.0.1:"],
	localDataCenter: "datacenter1",
  keyspace: "mercadolivre",
  socketOptions: {
    connectTimeout: 200000,
    readTimeout: 200000,
  }
});

let isConnected = false;

export const connectToDatabase = async (): Promise<{ client: Client }> => {
	if (!isConnected) {
		try {
			console.log("🔌 Connecting to Cassandra...");
			await createKeyspace();
			await createTables();

			await cassandraClient.connect();
			isConnected = true;
			console.log("✅ Connected to Cassandra successfully.");
		} catch (error) {
			console.error("❌ Failed to connect to Cassandra:", error);
			throw error;
		}
	}

	return { client: cassandraClient };
};

export { cassandraClient as client };
