import type { ObjectId } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type { ProductModel } from "../../database";
import type { UserModel } from "../../database";
import { SelectProductController } from "../products/SelectProductController";
import { SelectUserController } from "./SelectUserController";
import type Redis from "ioredis";

export class AddFavoriteController {
	private userModel: UserModel;
	private input: IInput;
	private productModel: ProductModel;
	private redis: Redis;
	constructor(
		userModel: UserModel,
		input: IInput,
		productModel: ProductModel,
		redis: Redis,
	) {
		this.userModel = userModel;
		this.input = input;
		this.redis = redis;
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
		const userFavoritesKey = `favorites:user:${selectedUser.email}`;
		const userFavorites = await this.redis.get(userFavoritesKey);
		const userFavoritesArray = userFavorites ? JSON.parse(userFavorites) : [];
		userFavoritesArray.push(favoriteProduct);
		await this.redis.set(userFavoritesKey, JSON.stringify(userFavoritesArray));
	}
}
