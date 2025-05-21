import { randomUUID } from "node:crypto";
import type { IInput } from "../../core/interfaces";
import type { ProductModel } from "../../database/ProductModel";
import type { SellerModel } from "../../database/SellerModel";
import { SelectSellerController } from "../sellers/SelectSellerController";

export class CreateProductController {
	private input: IInput;
	private productModel: ProductModel;
	private sellerModel: SellerModel;
	constructor(
		input: IInput,
		productModel: ProductModel,
		sellerModel: SellerModel,
	) {
		this.input = input;
		this.productModel = productModel;
		this.sellerModel = sellerModel;
	}
	public async handle() {
		const seller = await new SelectSellerController(
			this.sellerModel,
			this.input,
		).handle();
		if (!seller) {
			return;
		}
		const name = await this.input.textInput("Escreva o nome do produto: ");
		const price = await this.input.numberInput("Escreva o preço do produto: ");
		const description = await this.input.textInput(
			"Escreva a descrição do produto: ",
		);
    const product = {
      id: randomUUID().toString(),
			name: name,
			price,
			description,
			seller: {
        id: seller.id,
				name: seller.name,
				city: seller.city,
				zipCode: seller.zipCode,
				street: seller.street,
				number: seller.number,
			},
    }
		await this.productModel.addProduct(product);
		this.sellerModel.addProduct(product, seller.id);
		return;
	}
}
