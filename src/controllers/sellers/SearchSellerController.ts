import { IInput } from "../../core/interfaces";
import { SellerModel } from "../../database/SellerModel";
import { SelectSellerController } from "./SelectSellerController";

export class SearchSellerController {
	private sellerModel: SellerModel;
	private input: IInput;
	constructor(sellerModel: SellerModel, input: IInput) {
		this.sellerModel = sellerModel;
		this.input = input;
	}
	async handle() {
		const selectedSeller = await new SelectSellerController(
			this.sellerModel,
			this.input,
		).handle();
		if (!selectedSeller) return;
		const filteredSeller = {
			Nome: selectedSeller.name,
			Email: selectedSeller.email,
			Cidade: selectedSeller.city,
			Rua: selectedSeller.street,
			CEP: selectedSeller.zipCode,
			Número: selectedSeller.number,
			// Produtos: selectedSeller.products.map(
			// 	(product) =>
			// 		`${product.name} (${product.description}),Preco: R$ ${product.price}`,
			// ).join(", "),
		};
		console.table(filteredSeller);
		return;
	}
}
