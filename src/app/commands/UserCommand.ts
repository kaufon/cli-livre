import type { Collection, Db } from "mongodb";
import { CreateUserController } from "../../controllers/users/CreateUserController";
import type { IInput } from "../../core/interfaces";
import { UserModel } from "../../database/UserModel";
import { ListAllUsersControler } from "../../controllers/users/ListUserController";
import {
  DeleteUserController,
  SearchUserController,
  UpdateUserController,
} from "../../controllers/users";
export class UsersCommands {
  private input: IInput;
  private database: Db;
  private model: UserModel;
  constructor(input: IInput, db: Db) {
    this.input = input;
    this.database = db;
    this.model = new UserModel(db.collection("users"));
  }
  public async run(): Promise<void> {
    const options = await this.input.selectInput("Pls escolha", [
      ["Cadastrar Cliente", "add"],
      ["Atualizar Cliente", "update"],
      ["Deletar Cliente", "delete"],
      ["Buscar Clientes", "search"],
      ["Adicionar favorito", "add-favorite"],
      ["Remover favorito", "remove-favorite"],
      ["Comprar produto", "buy-product"],
      ["Cancelar compra", "cancel-purchase"],
      ["Voltar", "exit"],
    ]);
    switch (options) {
      case "add": {
        const controller = await new CreateUserController(
          this.model,
          this.input,
        );
        await controller.handle();
        return;
      }
      case "update": {
        const controller = await new UpdateUserController(
          this.model,
          this.input,
        );
        await controller.handle()
        return
      }
      case "search": {
        const controller = await new SearchUserController(
          this.model,
          this.input,
        );
        await controller.handle();
        return;
      }
      case "delete": {
        const controller = await new DeleteUserController(
          this.model,
          this.input,
        );
        await controller.handle();
        return;
      }
      case "exit":
        return;
      default: {
        console.log("Error XDD");
        return;
      }
    }
  }
}
