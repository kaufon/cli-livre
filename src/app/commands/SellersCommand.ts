import { Db } from "mongodb";
import type { IInput } from "../../core/interfaces";
import { SellerModel } from "../../database/SellerModel";
import {
  CreateSellerController,
  DeleteSellerController,
  SearchSellerController,
  UpdateSellerController,
} from "../../controllers/sellers";
export class SellersCommands {
  private input: IInput;
  private database: Db;
  private model: SellerModel;
  constructor(input: IInput, db: Db) {
    this.input = input;
    this.database = db;
    this.model = new SellerModel(db.collection("sellers"));
  }
  public async run(): Promise<void> {
    const options = await this.input.selectInput("Pls escolha", [
      ["Cadastrar Vendedor", "add"],
      ["Atualizar Vendedor", "update"],
      ["Deletar Vendedor", "delete"],
      ["Buscar Vendedor", "search"],
      ["Voltar", "exit"],
    ]);
    switch (options) {
      case "add": {
        const controller = await new CreateSellerController(
          this.model,
          this.input,
        );
        await controller.handle();
        return;
      }
      case "search": {
        const controller = await new SearchSellerController(
          this.model,
          this.input,
        );
        await controller.handle();
        return;
      }
      case "update": {
        const controller = await new UpdateSellerController(
          this.model,
          this.input,
        );
        await controller.handle();
        return;
      }
      case "delete": {
        const controller = await new DeleteSellerController(
          this.model,
          this.input,
        );
        await controller.handle();
        return;
      }
      case "exit": {
        return;
      }
      default: {
        console.log("Opção inválida");
        return;
      }
    }
  }
}
