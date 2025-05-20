import type { UserModel } from "../../database/UserModel";

export class ListAllUsersControler {
  private userModel: UserModel;
  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }
  async handle() {
    const users = await this.userModel.listAllUsers();
    const filteredUsers = users.map((user) => ({
      Nome: user.name,
      Email: user.email,
    }));
    console.table(filteredUsers);
    return;
  }
}
