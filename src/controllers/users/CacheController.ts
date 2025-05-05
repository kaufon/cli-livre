import type Redis from "ioredis";
import type { IInput } from "../../core/interfaces";
import type { ProductModel, UserModel } from "../../database";
import { SelectUserController } from "./SelectUserController";
import { SelectProductController } from "../products/SelectProductController";
import { SelectSellerProductController } from "../products";

export abstract class CacheController {
	protected userModel: UserModel;
	protected input: IInput;
	protected productModel: ProductModel;
	protected redis: Redis;
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
	async getUser() {
		const selectedUser = await new SelectUserController(
			this.userModel,
			this.input,
		).handle();
		return selectedUser;
	}
	async getProduct() {
		const selectedProduct = await new SelectProductController(
			this.productModel,
			this.input,
		).handle();
		return selectedProduct;
	}
	async getProductsFromUser(products: any[]) {
		const selectedProduct = await new SelectSellerProductController(
			this.productModel,
			this.input,
		).handle(products);
		return selectedProduct;
	}
	async getUserFavoriteCache(userEmail: string): Promise<any[]> {
		const cache = await this.redis.get(`favorites:user:${userEmail}`);
		const data = cache ? JSON.parse(cache) : [];
		return data;
	}
	async setUserInitialFavoriteCache(userEmail: string): Promise<void> {
		const userFavoritesKey = `favorites:user:${userEmail}`;
		const cachedFavorites = await this.getUserFavoriteCache(userEmail);
		const userFavorites =
			await this.userModel.getFavoritesFromUserEmail(userEmail);
		const mergedFavorites = Array.from(
			new Set([...(cachedFavorites || []), ...(userFavorites || [])]),
		);
		await this.redis.set(userFavoritesKey, JSON.stringify(mergedFavorites));
	}
	async setUserPurchaseCache(userEmail: string): Promise<string> {
		const userPurchasesKey = `purchases:user:${userEmail}`;
		const userPurchases =
			await this.userModel.getPurchasesFromUserEmail(userEmail);
		const userPurchasesArray = userPurchases
			? JSON.stringify(userPurchases)
			: [];
		await this.redis.set(userPurchasesKey, JSON.stringify(userPurchasesArray));
		return userPurchasesKey;
	}
	abstract handle(): Promise<void>;
}
