import { Input } from "../../app/libs/Input";
import type { IInput } from "../../core/interfaces";
import type { UserModel } from "../../database/UserModel";
import { SelectUserController } from "./SelectUserController";

export class UpdateUserController {
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
    const userId = selectedUser._id.toHexString()

    let isRunning = true;
    while (isRunning) {
      const choice = await this.input.selectInput("O que deseja atualizar?", [
        ["Nome", "name"],
        ["Email", "email"],
        ["Senha", "password"],
        ["Endereço", "address"],
        ["Voltar", "exit"],
      ]);

      switch (choice) {
        case "name": {
          const name = await this.input.textInput("Novo nome:");
          await this.userModel.updateUser({ id: userId, name });
          console.log("Nome atualizado com sucesso!");
          break;
        }
        case "email": {
          const email = await this.input.textInput("Novo email:");
          await this.userModel.updateUser({ id: userId, email });
          console.log("Email atualizado com sucesso!");
          break;
        }
        case "password": {
          const password = await this.input.textInput("Nova senha:");
          await this.userModel.updateUser({ id: userId, password });
          console.log("Senha atualizada com sucesso!");
          break;
        }
        case "address": {
          const street = await this.input.textInput("Nova rua:");
          const city = await this.input.textInput("Nova cidade:");
          const number = await this.input.textInput("Novo numero:");
          const zipCode = await this.input.textInput("Novo CEP:");
          await this.userModel.updateUser({
            id: userId,
            address: { street, city, zipCode, number },
          });
          console.log("Endereço atualizado com sucesso!");
          break;
        }
        case "exit": {
          isRunning = false;
          console.log("Saindo do modo de atualização...");
          break;
        }
      }
    }
  }
}
