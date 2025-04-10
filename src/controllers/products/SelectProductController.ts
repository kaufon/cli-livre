import { ObjectId, ServerDescriptionChangedEvent } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type {
  ProductDocument,
  ProductModel,
} from "../../database/ProductModel";
import { ListAllProductsController } from "./ListAllProductsController";

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
    let selectedProduct;
    while (true) {
      const selectedProductId = await this.input.textInput(
        "Digite o id do produto",
      );
      selectedProduct = products.find(
        (product) => product._id?.toHexString() === selectedProductId,
      );
      if (selectedProduct) {
        console.log(`Produto selecionado: ${selectedProduct.name}`);
        break;
      }
      console.log("Produto não encontrado. Tente novamente.");
    }
    return selectedProduct;
  }
}
