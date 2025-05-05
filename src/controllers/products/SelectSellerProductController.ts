import type { ObjectId } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type {
  ProductModel,
} from "../../database";
import { ListProductsController } from "./ListProductsController";

export class SelectSellerProductController {
  private productModel: ProductModel;
  private input: IInput;
  constructor(productModel: ProductModel, input: IInput) {
    this.productModel = productModel;
    this.input = input;
  }
  async handle(
    products: Array<{
      productId: ObjectId;
      name: string;
      description: string;
      price: number;
    }>,
  ): Promise<{
    productId: ObjectId;
    name: string;
    description: string;
    price: number;
    seller?: {
      name: string;
      address: {
        city: string;
        street: string;
        zipCode: string;
        number: string;
      };
    };
  } | null> {
    if (products.length === 0) {
      console.log("Nenhum produto encontrado.");
      return null;
    }
      const list = new ListProductsController(this.productModel);
      let selectedProduct;
      await list.handle(products);
      while (true) {
        const selectedIndex = Number.parseInt(
          await this.input.textInput("Digite o índice do produto: "),
          10,
        );
        if (!Number.isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < products.length) {
          selectedProduct = products[selectedIndex];
          console.log(`Produto selecionado: ${selectedProduct.name}`);
          break;
        }
        console.log("Índice inválido. Tente novamente.");
      }
    return selectedProduct;
  }
}
