import { MongoClient } from "mongodb";

require("dotenv").config();

const uri = process.env.MONGO_URL ?? "";

const client = new MongoClient(uri);
const mongoDB = client.db("mercadolivre")

export default mongoDB;
