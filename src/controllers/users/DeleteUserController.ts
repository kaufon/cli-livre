import type { IInput } from "../../core/interfaces";
import type { UserModel } from "../../database/UserModel";
import { SelectUserController } from "./SelectUserController";

export class DeleteUserController {
  private userModel: UserModel;
  private input: IInput;
  constructor(userModel: UserModel, input: IInput) {
    this.userModel = userModel;
    this.input = input;
  }
  async handle() {
    const selectedUser = await new SelectUserController(
      this.userModel,
      this.input,
    ).handle();
    this.userModel.deleteUser(selectedUser._id.toString());
    console.log("Usuário deletado com sucesso!");
    return;
  }
}
