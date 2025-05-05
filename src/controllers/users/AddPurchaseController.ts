import { ObjectId } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type { ProductModel, SellerModel, UserModel } from "../../database";
import { CacheController } from "./CacheController";
import type { Redis } from "ioredis";

export class AddPurchaseController extends CacheController {
	private sellerModel: SellerModel;
	constructor(
		input: IInput,
		userModel: UserModel,
		sellerModel: SellerModel,
		productModel: ProductModel,
		redis: Redis,
	) {
		super(userModel, input, productModel, redis);
		this.sellerModel = sellerModel;
	}
	async handle(): Promise<void> {
		const selectedUser = await this.getUser();
		if (!selectedUser) return;
		const selectedProduct = await this.getProduct();
		if (!selectedProduct) return;
		const quantity = await this.input.numberInput(
			"Qual a quantidade que deseja comprar?",
		);

		const sellId = new ObjectId();
		const purchase = {
			_id: sellId,
			productId: selectedProduct._id as ObjectId,
			productName: selectedProduct.name,
			productPrice: selectedProduct.price,
			quantity: quantity,
			totalPrice: selectedProduct.price * quantity,
		};
		const sell = {
			_id: sellId,
			productId: selectedProduct._id as ObjectId,
			productName: selectedProduct.name,
			quantity: quantity,
			price: selectedProduct.price * quantity,
		};

		const userCacheData = await this.getUserPurchasesCache(selectedUser.email);
		userCacheData.push(purchase);
		await this.redis.set(
			`purchases:user:${selectedUser.email}`,
			JSON.stringify(userCacheData),
		);

		await this.sellerModel.addSell(
			selectedProduct.seller._id as ObjectId,
			sell,
		);
		console.log("compra feita com sucesso");
	}
}
