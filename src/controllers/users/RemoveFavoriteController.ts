import type { ObjectId } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type { ProductModel, UserModel } from "../../database";
import { SelectSellerProductController } from "../products/SelectSellerProductController";
import { SelectUserController } from "./SelectUserController";
import { CacheController } from "./FavoriteController";
import Redis from "ioredis";

export class RemoveFavoriteController extends CacheController {
  async handle(): Promise<void> {
    const selectedUser = await this.getUser()
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
