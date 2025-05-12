import type { ObjectId } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type {
  ProductDocument,
  ProductModel,
} from "../../database/ProductModel";
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
      productId: string;
      name: string;
      description: string;
      price: number;
    }>,
  ): Promise<{
    productId: string;
    name: string;
    description: string;
    price: number;
    seller: {
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
    await list.handle(products);

    let selectedProductIndex;
    while (true) {
      const selectedIndexInput = await this.input.textInput(
        "Digite o índice do produto (começando de 0): ",
      );

      selectedProductIndex = Number.parseInt(selectedIndexInput, 10);
      if (Number.isNaN(selectedProductIndex)) {
        console.log("Índice inválido. Por favor, digite um número válido.");
        continue;
      }

      if (selectedProductIndex >= 0 && selectedProductIndex < products.length) {
        const selectedProduct = products[selectedProductIndex];
        console.log(`Produto selecionado: ${selectedProduct.name}`);
        return selectedProduct;  // Return the selected product based on the index
      }

      console.log("Índice fora do intervalo. Tente novamente.");
    }
  }
}
