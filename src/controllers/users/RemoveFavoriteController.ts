import type { ObjectId } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type { ProductModel } from "../../database/ProductModel";
import type { UserModel } from "../../database/UserModel";
import { SelectUserController } from "./SelectUserController";
import { SelectSellerProductController } from "../products/SelectSellerProductController";

export class RemoveFavoriteController {
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
    const products = selectedUser.favorites.map((fav) => ({
      productId: fav.productId,
      name: fav.productName,
      description: fav.productDescription,
      price: fav.productPrice
    }));

    if (products.length === 0) {
      console.log("Nenhum produto favorito encontrado.");
      return;
    }
    const selectedProduct = await new SelectSellerProductController(
      this.productModel,
      this.input,
    ).handle(products);
    if (!selectedProduct) return;
    const favoriteProduct = {
      productId: selectedProduct.productId as ObjectId,
      productName: selectedProduct.name,
      productDescription: selectedProduct.description,
      productPrice: selectedProduct.price,
    };
    await this.userModel.removeFavorite(
      selectedUser._id,
      favoriteProduct.productId,
    );
  }
}
