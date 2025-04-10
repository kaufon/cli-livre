import type { ObjectId } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type { ProductModel } from "../../database/ProductModel";
import type { UserModel } from "../../database/UserModel";
import { SelectProductController } from "../products/SelectProductController";
import { SelectUserController } from "./SelectUserController";

export class AddFavoriteController {
  private userModel: UserModel;
  private input: IInput;
  private productModel: ProductModel;
  constructor(userModel: UserModel, input: IInput, productModel: ProductModel) {
    this.userModel = userModel;
    this.input = input;
    this.productModel = productModel;
  }
  async handle(): Promise<void> {
    const selectedUser = await new SelectUserController(
      this.userModel,
      this.input,
    ).handle();
    if (!selectedUser) return;
    const selectedProduct = await new SelectProductController(
      this.productModel,
      this.input,
    ).handle();
    if (!selectedProduct) return;
    const favoriteProduct = {
      productId: selectedProduct._id as ObjectId,
      productName: selectedProduct.name,
      productDescription: selectedProduct.description,
      productPrice: selectedProduct.price,
    };
    await this.userModel.addFavorite(selectedUser._id, favoriteProduct);
  }
}
