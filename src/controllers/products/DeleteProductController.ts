import type { IInput } from "../../core/interfaces";
import type { ProductModel } from "../../database/ProductModel";
import type { SellerModel } from "../../database/SellerModel";
import { SelectSellerController } from "../sellers/SelectSellerController";
import { SelectSellerProductController } from "./SelectSellerProductController";
export class DeleteProductController {
  private input: IInput;
  private productModel: ProductModel;
  private sellerModel: SellerModel;
  constructor(
    input: IInput,
    productModel: ProductModel,
    sellerModel: SellerModel,
  ) {
    this.input = input;
    this.productModel = productModel;
    this.sellerModel = sellerModel;
  }
  public async handle() {
    const seller = await new SelectSellerController(
      this.sellerModel,
      this.input,
    ).handle();
    if (!seller) {
      return;
    }
    console.log(seller.products)
    const product = await new SelectSellerProductController(
      this.productModel,
      this.input,
    ).handle(seller?.products);
    if (!product) {
      return;
    }
    await this.productModel.deleteProductById(product.productId);
    await this.sellerModel.removeProduct(product.productId, seller._id);
  }
}
