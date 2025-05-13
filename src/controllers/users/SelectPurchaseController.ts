import type { IInput } from "../../core/interfaces";
import type { UserModel } from "../../database/UserModel";

export class SelectPurchaseController {
	private userModel: UserModel;
	private input: IInput;

	constructor(userModel: UserModel, input: IInput) {
		this.userModel = userModel;
		this.input = input;
	}

	async handle(userId: string): Promise<
		| {
				_id: string;
				productId: string;
				productName: string;
				productPrice: number;
				quantity: number;
				totalPrice: number;
		  }
		| undefined
	> {
		const purchases = await this.userModel.listPurchases(userId);

		if (purchases.length === 0) {
			console.log("Nenhuma compra encontrada.");
			return;
		}

		const displayedPurchases = purchases.map((purchase, index) => ({
			Nome: purchase.product_name,
			Preço: purchase.product_price._intVal,
			Quantidade: purchase.quantity,
			"Preço Total": purchase.total_price._intVal,
		}));
		console.table(displayedPurchases);

		let selectedIndex: number | undefined;
		while (true) {
			const input = await this.input.textInput("Digite o índice da compra: ");
			const parsedIndex = Number(input);

			if (
				!Number.isNaN(parsedIndex) &&
				parsedIndex >= 0 &&
				parsedIndex < purchases.length
			) {
				selectedIndex = parsedIndex;
				break;
			}

			console.log("Índice inválido. Tente novamente.");
		}

		const selectedPurchase = purchases[selectedIndex];
		return {
			_id: selectedPurchase.purchase_id,
			productId: selectedPurchase.product_id,
			productName: selectedPurchase.product_name,
			productPrice: selectedPurchase.product_price._intVal,
			quantity: selectedPurchase.quantity,
			totalPrice: selectedPurchase.total_price._intVal,
		};
	}
}
