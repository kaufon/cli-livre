import type { UserModel } from "../../database/UserModel";

export class ListAllUsersControler {
  private userModel: UserModel;
  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }
  async handle() {
    const users = await this.userModel.listAllUsers();
    const filteredUsers = users.map((user) => ({
      ID: user._id.toHexString(),
      Nome: user.name,
      Email: user.email,
      Cidade: user.address.city,
      Rua: user.address.street,
      CEP: user.address.zipCode,
    }));
    console.table(filteredUsers);
    return;
  }
}
