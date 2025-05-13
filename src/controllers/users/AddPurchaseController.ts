import type { IInput } from "../../core/interfaces";
import type { ProductModel } from "../../database/ProductModel";
import type { SellerModel } from "../../database/SellerModel";
import type { UserModel } from "../../database/UserModel";
import { SelectProductController } from "../products/SelectProductController";
import { SelectUserController } from "./SelectUserController";
import { v4 } from "uuid";

export class AddPurchaseController {
	private input: IInput;
	private userModel: UserModel;
	private sellerModel: SellerModel;
	private productModel: ProductModel;
	constructor(
		input: IInput,
		userModel: UserModel,
		sellerModel: SellerModel,
		productModel: ProductModel,
	) {
		this.input = input;
		this.userModel = userModel;
		this.sellerModel = sellerModel;
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
		const quantity = await this.input.numberInput(
			"Qual a quantidade que deseja comprar?",
		);
		const sellId = v4();
		const purchase = {
			purchaseId: sellId,
			productId: selectedProduct.id,
			productName: selectedProduct.name,
			productPrice: selectedProduct.price,
			quantity: quantity,
			totalPrice: selectedProduct.price * quantity,
		};
		const sell = {
			sellId: sellId,
			productId: selectedProduct.id,
			productName: selectedProduct.name,
			quantity: quantity,
			price: selectedProduct.price * quantity,
		};
		await this.userModel.addPurchase(selectedUser.id, purchase);
		await this.sellerModel.addSell(selectedProduct.seller.id, sell);
		console.log("compra feita com sucesso");
	}
}
