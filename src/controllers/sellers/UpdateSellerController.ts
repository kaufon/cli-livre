import type { IInput } from "../../core/interfaces";
import { SellerModel } from "../../database/SellerModel";
import { SelectSellerController } from "./SelectSellerController";

export class UpdateSellerController {
  private sellerModel: SellerModel;
  private input: IInput;
  constructor(sellerModel: SellerModel, input: IInput) {
    this.sellerModel = sellerModel;
    this.input = input;
  }
  async handle() {
    const selectedSeller = await new SelectSellerController(
      this.sellerModel,
      this.input,
    ).handle();
    const sellerId = selectedSeller._id.toHexString();
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
          await this.sellerModel.updateSeller({ id: sellerId, name });
          console.log("Nome atualizado com sucesso!");
          break;
        }
        case "email": {
          const email = await this.input.textInput("Novo email:");
          await this.sellerModel.updateSeller({ id: sellerId, email });
          console.log("Email atualizado com sucesso!");
          break;
        }
        case "password": {
          const password = await this.input.textInput("Nova senha:");
          await this.sellerModel.updateSeller({ id: sellerId, password });
          console.log("Senha atualizada com sucesso!");
          break;
        }
        case "address": {
          const street = await this.input.textInput("Nova rua:");
          const city = await this.input.textInput("Nova cidade:");
          const number = await this.input.textInput("Novo numero:");
          const zipCode = await this.input.textInput("Novo CEP:");
          await this.sellerModel.updateSeller({
            id: sellerId,
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
