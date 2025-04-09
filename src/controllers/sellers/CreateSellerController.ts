import type { IInput } from "../../core/interfaces";
import type { SellerModel } from "../../database/SellerModel";

export class CreateSellerController {
  private sellerModel: SellerModel;
  private input: IInput;
  constructor(sellerModel: SellerModel, input: IInput) {
    this.sellerModel = sellerModel;
    this.input = input;
  }
  async handle() {
    const name = await this.input.textInput("Escreva o nome: ");
    const email = await this.input.textInput("Escreva o email: ");
    const password = await this.input.textInput("Escreva a senha: ");
    const city = await this.input.textInput("Escreva a cidade: ");
    const street = await this.input.textInput("Escreva a rua: ");
    const zipCode = await this.input.textInput("Escreva o CEP: ");
    const number = await this.input.textInput("Escreva o número: ");
    const address = { city, street, zipCode, number };
    await this.sellerModel.addSeller(name, address, email, password);
    return
  }
}
