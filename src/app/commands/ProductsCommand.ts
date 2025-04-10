import { Db } from "mongodb";
import type { IInput } from "../../core/interfaces";
import { SellerModel } from "../../database/SellerModel";
import { ProductModel } from "../../database/ProductModel";
import { CreateProductController } from "../../controllers/products/CreateProductController";
import { DeleteProductController } from "../../controllers/products/DeleteProductController";
import { UpdateProductController } from "../../controllers/products/UpdateProductController";
import { SearchProductController } from "../../controllers/products/SearchProductController";
export class ProductsCommands {
  private input: IInput;
  private database: Db;
  private sellerModel: SellerModel;
  private productModel: ProductModel;
  constructor(input: IInput, db: Db) {
    this.input = input;

    this.database = db;
    this.sellerModel = new SellerModel(db.collection("sellers"));
    this.productModel = new ProductModel(db.collection("products"));
  }
  public async run(): Promise<void> {
    const options = await this.input.selectInput("Pls escolha", [
      ["Cadastrar Produto", "add"],
      ["Atualizar Produto", "update"],
      ["Deletar Produto", "delete"],
      ["Buscar Produto", "search"],
      ["Voltar", "exit"],
    ]);
    switch (options) {
      case "add": {
        const controller = await new CreateProductController(
          this.input,
          this.productModel,
          this.sellerModel,
        );
        await controller.handle();
        return;
      }
      case "search": {
        const controller = await new SearchProductController(
          this.productModel,
          this.input,
        );
        await controller.handle();
        return;
      }
      case "delete": {
        const controller = await new DeleteProductController(
          this.input,
          this.productModel,
          this.sellerModel,
        );
        await controller.handle();
        return;
      }
      case "update": {
        const controller = await new UpdateProductController(
          this.input,
          this.productModel,
          this.sellerModel,
        );
        await controller.handle();
        return;
      }
      case "exit": {
        return;
      }
      default: {
        return;
      }
    }
  }
}
