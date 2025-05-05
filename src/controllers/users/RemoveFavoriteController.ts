import type { ObjectId } from "mongodb";
import { CacheController } from "./CacheController";

export class RemoveFavoriteController extends CacheController {
	async handle(): Promise<void> {
		const selectedUser = await this.getUser();
		if (!selectedUser) return;
		await this.setUserInitialFavoriteCache(selectedUser.email);
		const cachedFavorites = await this.getUserFavoriteCache(selectedUser.email);
		const products = cachedFavorites.map((fav) => ({
			productId: fav.productId,
			name: fav.productName,
			description: fav.productDescription,
			price: fav.productPrice,
		}));
		if (products.length === 0) {
			console.log("Nenhum produto favorito encontrado.");
			return;
		}
		const selectedProduct = await this.getProductsFromUser(products);
		if (!selectedProduct) return;
		const filterdCache = cachedFavorites.filter(
			(item) => item.productId !== selectedProduct.productId,
		);
		await this.redis.set(
			`favorites:user:${selectedUser.email}`,
			JSON.stringify(filterdCache),
		);
	}
}
