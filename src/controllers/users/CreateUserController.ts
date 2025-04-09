import { Collection } from "mongodb";
import { Input } from "../../app/libs/Input";
import type { IInput } from "../../core/interfaces";
import type { UserModel } from "../../database/UserModel";

export class CreateUserController {
  private userModel: UserModel;
  private input: IInput;
  constructor(userModel: UserModel, input: IInput) {
    this.userModel = userModel;
    this.input = input
  }
  async handle() {
    const name = await this.input.textInput("Escreva o nome: ");
    const email = await this.input.textInput("Escreva o email: ");
    const password = await this.input.textInput("Escreva a senha: ");
    const address: Array<{
      city: string;
      street: string;
      zipCode: string;
      number: string;
    }> = [];
    const addressCount = await this.input.numberInput(
      "Quantos endereços você deseja adicionar? ",
    );
    for (let i = 0; i < addressCount; i++) {
      const city = await this.input.textInput("Escreva a cidade: ");
      const street = await this.input.textInput("Escreva a rua: ");
      const zipCode = await this.input.textInput("Escreva o CEP: ");
      const number = await this.input.textInput("Escreva o número: ");
      address.push({ city, street, zipCode, number });
    }
    await this.userModel.addUser(name, email, password, address, );
    return
  }
}
