import { ObjectId, ServerDescriptionChangedEvent } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type {
  ProductModel,
} from "../../database";
import { ListAllProductsController } from "./ListAllProductsController";
import { ProductDocument } from "../../database/mongodb/ProductModel";

export class SelectProductController {
  private productModel: ProductModel;
  private input: IInput;
  constructor(productModel: ProductModel, input: IInput) {
    this.productModel = productModel;
    this.input = input;
  }
  async handle(): Promise<ProductDocument | null> {
    const products = await this.productModel.listAll();
    if (products.length === 0) {
      console.log("Nenhum produto encontrado.");
      return null;
    }
    const list = new ListAllProductsController(this.productModel);
    await list.handle();
    let selectedProduct: ProductDocument | null = null;
    while (true) {
      const selectedIndex = await this.input.textInput(
        "Digite o índice do produto (começando de 0):"
      );
      const index = Number.parseInt(selectedIndex, 10);
      if (!Number.isNaN(index) && index >= 0 && index < products.length) {
        selectedProduct = products[index];
        console.log(`Produto selecionado: ${selectedProduct.name}`);
        break;
      }
      console.log("Índice inválido. Tente novamente.");
    }
    return selectedProduct;
  }
}

