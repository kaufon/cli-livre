import type { Client } from "cassandra-driver";
import type { IInput } from "../core/interfaces";
import { ProductsCommands } from "./commands/ProductsCommand";
import { SellersCommands } from "./commands/SellersCommand";
import { UsersCommands } from "./commands/UserCommand";
import { Input } from "./libs/Input";
export class MercadoLivreSystem {
  private input: IInput;
  private client: Client
  constructor(client:Client) {
    this.input = new Input();
    this.client = client
  }
  public async run(): Promise<void> {
    let isRunning = true;
    while (isRunning) {
      const option = await this.input.selectInput("Pls escolha", [
        ["Clientes", "clients"],
        ["Produtos", "products"],
        ["Vendedores", "sellers"],
        ["Sair", "exit"],
      ]);
      switch (option) {
        case "clients": {
          const command = new UsersCommands(this.input, this.client);
          await command.run();
          break;
        }
        case "products": {
          const command = new ProductsCommands(this.input, this.client);
          await command.run();
          break;
        }
        case "sellers": {
          const command = new SellersCommands(this.input, this.client);
          await command.run();
          break;
        }
        case "exit":
          isRunning = false;
          break;
      }
    }
    console.log("Saindo tao cedo :(");
    process.exit(0);
  }
}
