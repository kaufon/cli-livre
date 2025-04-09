import mongoDB from "../database/DatabaseConfiguration";
import { UserModel } from "../database/UserModel";

export class UsersController {
  private userModel;
  constructor(userModel) {
    this.userModel = new UserModel(mongoDB.collection("users"));
  }
  async addUser(
    name: string,
    email: string,
    password: string,
    phone: string,
    address: Array<{
      city: string;
      street: string;
      zipCode: string;
      number: string;
    }>,
  ) {
    return await this.userModel.addUser(name, email, password, phone, address);
  }
}
