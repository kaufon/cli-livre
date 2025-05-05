import type { IInput } from "../../core/interfaces";
import { SelectPurchaseController } from "./SelectPurchaseController";
import { CacheController } from "./CacheController";
import type { ProductModel, SellerModel, UserModel } from "../../database";
import type { Redis } from "ioredis";
import { ObjectId } from "mongodb";

export class RemovePurchaseController extends CacheController {
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
		await this.setInitialUserPurchaseCache(selectedUser.email);
		const cachedPurchases = await this.getUserPurchasesCache(
			selectedUser.email,
		);

		const selectedPurchase = await new SelectPurchaseController(
			this.input,
		).handle(cachedPurchases);
		if (!selectedPurchase) return;

		const sellerID = await this.sellerModel.findSellerIdByProductId(
			new ObjectId(selectedPurchase.productId),
		);
		if (!sellerID) {
			console.log("vendedor não encontrado");
			return;
		}
		const filteredCache = cachedPurchases.filter(
			(item) => item._id !== selectedPurchase._id,
		);
		await this.redis.set(
			`purchases:user:${selectedUser.email}`,
			JSON.stringify(filteredCache),
		);
		await this.sellerModel.removeSell(sellerID, selectedPurchase._id as ObjectId);
		console.log("compra cancelada com sucesso");
	}
}
