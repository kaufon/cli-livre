import type { ObjectId } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type { UserModel } from "../../database/UserModel";
import { ListAllUsersControler } from "./ListUserController";

export class SelectUserController {
  private userModel: UserModel;
  private input: IInput;
  constructor(userModel: UserModel, input: IInput) {
    this.userModel = userModel;
    this.input = input;
  }
  async handle(): Promise<{
    _id: ObjectId;
    name: string;
    email: string;
    address: { city: string; street: string; zipCode: string; number: string };
    favorites: {
      productId: ObjectId;
      productName: string;
      productDescription: string;
    }[];
    purchases: {
      productId: ObjectId;
      productName: string;
      price: number;
      quantity: string;
    }[];
  } | null> {
    const users = await this.userModel.listAllUsers();
    if (users.length === 0) {
      console.log("Nenhum usuário encontrado.");
      return null;
    }
    const list = new ListAllUsersControler(this.userModel);
    let selectedUser;
    await list.handle();
    while (true) {
      const selectedUserEmail = await this.input.textInput(
        "Digite o email do usuário: ",
      );
      selectedUser = users.find((user) => user.email === selectedUserEmail);
      if (selectedUser) {
        console.log(`Usuário selecionado: ${selectedUser.name}`);
        break;
      } else {
        console.log("Usuário não encontrado. Tente novamente.");
      }
    }
    return selectedUser;
  }
}
