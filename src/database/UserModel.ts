import type { Collection } from "mongodb";

export class UserModel {
  private connection: Collection;
  constructor(connection: Collection) {
    this.connection = connection;
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
    await this.connection.insertOne(user);
  }
}
