import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = "mongodb://root:example@localhost:27017"

const client = new MongoClient(uri, {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
});
let db: Db;

export const connectToDatabase = async (): Promise<{
  client: MongoClient;
  db: Db;
}> => {
  if (!db) {
    try {
      console.log("🔌 Conectando ao MongoDB...");
      await client.connect();
      db = client.db("MercadoLivre"); 
      console.log("✅ Conectado ao MongoDB com sucesso.");
    } catch (error) {
      console.error("❌ Erro ao conectar ao MongoDB:", error);
      throw error;
    }
  }

  return { client, db };
};
export { client };
