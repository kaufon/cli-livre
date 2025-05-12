import type { IInput } from "../../core/interfaces";
import type { SellerModel } from "../../database/SellerModel";
import { ListAllSellersController } from "./ListSellerController";

export class SelectSellerController {
	private sellerModel: SellerModel;
	private input: IInput;
	constructor(sellerModel: SellerModel, input: IInput) {
		this.sellerModel = sellerModel;
		this.input = input;
	}

	async handle(): Promise<{
		_id: string;
		name: string;
		email: string;
		city: string;
		street: string;
		zipcode: string;
		number: string;
		products: {
			productId: string;
			name: string;
			description: string;
			price: number;
		}[];
	} | null> {
		const sellers = await this.sellerModel.listAllSellers();
		if (sellers.length === 0) {
			console.log("Nenhum vendedor encontrado.");
			return null;
		}

		await new ListAllSellersController(this.sellerModel).handle();

		let selectedSeller = null;
		while (!selectedSeller) {
			const selectedEmail = await this.input.textInput(
				"Digite o email do vendedor: ",
			);
			const foundSeller = sellers.find((s) => s.email === selectedEmail);
			if (!foundSeller) {
				console.log("Vendedor não encontrado. Tente novamente.");
				continue;
			}

			selectedSeller = await this.sellerModel.findSellerWithProducts(
				foundSeller.id,
			);
			if (!selectedSeller) {
				console.log("Erro ao buscar dados completos do vendedor.");
				return null;
			}

			console.log(`Vendedor selecionado: ${selectedSeller.name}`);
		}

		return {
			_id: selectedSeller.id,
			name: selectedSeller.name,
			email: selectedSeller.email,
			city: selectedSeller.city,
			street: selectedSeller.street,
			zipcode: selectedSeller.zipcode,
			number: selectedSeller.number,
			products: selectedSeller.products.map((p) => ({
				productId: p.product_id,
				name: p.name,
				description: p.description,
				price: Number(p.price),
			})),
		};
	}
}
