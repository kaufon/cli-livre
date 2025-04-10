import type { ObjectId } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type { ProductDocument, ProductModel } from "../../database/ProductModel";
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
      price?: number;
    }>,
  ): Promise<{
    productId: ObjectId;
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
    let selectedProduct;
    await list.handle(products);
    while (true) {
      const selectedProductId = await this.input.textInput(
        "Digite o id do produto: ",
      );
      selectedProduct = products.find(
        (product) => product.productId?.toHexString() === selectedProductId,
      );
      if (selectedProduct) {
        console.log(`Produto selecionado: ${selectedProduct.name}`);
        break;
      } else {
        console.log("Produto não encontrado. Tente novamente.");
      }
    }
    return selectedProduct;
  }
}
