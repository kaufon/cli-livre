import type { IInput } from "../../core/interfaces";
import type { ProductModel } from "../../database/ProductModel";
import { SelectProductController } from "./SelectProductController";

export class SearchProductController {
  private productModel: ProductModel;
  private input: IInput;
  constructor(productModel: ProductModel, input: IInput) {
    this.productModel = productModel;
    this.input = input;
  }
  async handle(): Promise<void> {
    const product = await new SelectProductController(this.productModel, this.input).handle();
    if(!product) return
    const filterdProduct = {
      ID: product._id?.toHexString(),
      Preco: product.price,
      Nome: product.name,
      Descricao: product.description,
      Vendedor: product.seller.name,
      Cidade: product.seller.address.city,
      CEP: product.seller.address.zipCode,
    };
    console.table(filterdProduct);
  }
}
