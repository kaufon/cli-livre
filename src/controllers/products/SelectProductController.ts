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
			const inputIndex = await this.input.textInput(
				"Digite o index do produto: ",
			);
			const index = Number.parseInt(inputIndex, 10);

			if (!Number.isNaN(index) &&  index <= products.length) {
				selectedProduct = products[index];
				console.log(`Produto selecionado: ${selectedProduct.name}`);
				break;
			}

			console.log("Número inválido. Tente novamente.");
		}

		return selectedProduct;
	}
}
