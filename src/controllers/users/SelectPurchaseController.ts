import type { IInput } from "../../core/interfaces";
import type { PurchaseDto } from "../../core/dtos/PurchaseDto";

export class SelectPurchaseController {
	private input: IInput;

	constructor(input: IInput) {
		this.input = input;
	}

	async handle(purchases: PurchaseDto[]): Promise<PurchaseDto | undefined> {
		const filteredPurchases = purchases.map((purchase, index) => ({
			Nome: purchase.productName,
			Preço: purchase.productPrice,
			Quantidade: purchase.quantity,
			"Preço Total": purchase.totalPrice,
		}));

		if (filteredPurchases.length === 0) {
			console.log("Nenhuma compra encontrada.");
			return;
		}
		console.table(filteredPurchases);

		let selectedPurchase: PurchaseDto | undefined;
		while (true) {
			const selectedIndex = await this.input.textInput(
				"Digite o índice da compra: ",
			);
			const index = Number.parseInt(selectedIndex, 10);

			if (!Number.isNaN(index) && index >= 0 && index < purchases.length) {
				selectedPurchase = purchases[index];
				console.log(
					`Compra selecionada: ${selectedPurchase._id ? selectedPurchase._id : "ID não disponível"}`,
				);
				break;
			}
			console.log("Índice inválido. Tente novamente.");
		}
		return selectedPurchase;
	}
}
