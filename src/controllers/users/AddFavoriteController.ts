import type { ObjectId } from "mongodb";
import { CacheController } from "./CacheController";

export class AddFavoriteController extends CacheController {
	async handle(): Promise<void> {
		const selectedUser = await this.getUser();
		const selectedProduct = await this.getProduct();
		if (!selectedUser) return;
		await this.setUserInitialFavoriteCache(selectedUser.email);
		if (!selectedProduct) return;
		const favoriteProduct = {
			productId: selectedProduct._id as ObjectId,
			productName: selectedProduct.name,
			productDescription: selectedProduct.description,
			productPrice: selectedProduct.price,
		};
		const userCacheData = await this.getUserFavoriteCache(selectedUser.email);
    if (userCacheData.some((item) => item.productId === favoriteProduct.productId)) {
      console.log("Produto já está nos favoritos.");
      return;
    }
		userCacheData.push(favoriteProduct);
   await this.redis.set(`favorites:user:${selectedUser.email}`, JSON.stringify(userCacheData));
	}
}
