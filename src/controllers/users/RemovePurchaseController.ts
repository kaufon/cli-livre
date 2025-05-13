import type { IInput } from "../../core/interfaces";
import type { ProductModel } from "../../database/ProductModel";
import type { SellerModel } from "../../database/SellerModel";
import type { UserModel } from "../../database/UserModel";
import { SelectUserController } from "./SelectUserController";
import { SelectPurchaseController } from "./SelectPurchaseController";

export class RemovePurchaseController {
	private input: IInput;
	private userModel: UserModel;
	private sellerModel: SellerModel;
	constructor(input: IInput, userModel: UserModel, sellerModel: SellerModel) {
		this.input = input;
		this.userModel = userModel;
		this.sellerModel = sellerModel;
	}
	async handle(): Promise<void> {
		const selectedUser = await new SelectUserController(
			this.userModel,
			this.input,
		).handle();
		if (!selectedUser) return;
		const selectedPurchase = await new SelectPurchaseController(
			this.userModel,
			this.input,
		).handle(selectedUser.id);
		if (!selectedPurchase) return;
		await this.userModel.cancelPurchase(selectedUser.id, selectedPurchase._id);
		const sellerID = await this.sellerModel.findSellerIdByProductId(
			selectedPurchase.productId,
		);
		if (!sellerID) {
			console.log("vendedor não encontrado");
			return;
		}
		await this.sellerModel.removeSell(sellerID, selectedPurchase._id);
		console.log("compra cancelada com sucesso");
	}
}
