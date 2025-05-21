import { ObjectId, ServerDescriptionChangedEvent } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type {
	ProductDocument,
	ProductModel,
} from "../../database/ProductModel";
import { ListAllProductsController } from "./ListAllProductsController";

export class SelectProductController {
	private productModel: ProductModel;
	private input: IInput;
	constructor(productModel: ProductModel, input: IInput) {
		this.productModel = productModel;
		this.input = input;
	}
	async handle(): Promise<ProductDocument | null> {
		const products = await this.productModel.listAll();
		if (products.length === 0) {
			console.log("Nenhum produto encontrado.");
			return null;
		}

		const list = new ListAllProductsController(this.productModel);
		await list.handle();

		let selectedProduct: ProductDocument | undefined;

		while (true) {
			const indexInput = await this.input.textInput(
				"Digite o indice do produto",
			);
			const index = Number(indexInput);

			if (!Number.isInteger(index) || index < 0 || index >= products.length) {
				console.log("Índice inválido. Tente novamente.");
				continue;
			}

			selectedProduct = products[index];
			break;
		}

		return selectedProduct;
	}
}
