import { Collection } from "mongodb";
import mongoDB from "./DatabaseConfiguration";
import client from "./DatabaseConfiguration";

export class UserModel {
  private collection: Collection
  constructor(collection: Collection) {
    this.collection = collection
  }
  async addUser(
    name: string,
    email: string,
    password: string,
    address: Array<{
      city: string;
      street: string;
      zipCode: string;
      number: string;
    }>,
  ) {
    const user = {
      name,
      email,
      password,
      address,
      favorites: [],
      purchases: []
    };
    console.log(user)
    const result = await this.collection.insertOne(user);
    return result
  }
}
