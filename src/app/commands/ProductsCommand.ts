import type { IInput } from "../../core/interfaces";
import { SellerModel } from "../../database/SellerModel";
import { ProductModel } from "../../database/ProductModel";
import {
	CreateProductController,
	SearchProductController,
	DeleteProductController,
	UpdateProductController,
} from "../../controllers/products";
import type { Client } from "cassandra-driver";
export class ProductsCommands {
	private input: IInput;
	private sellerModel: SellerModel;
	private productModel: ProductModel;
	constructor(input: IInput, cassandraClient: Client) {
		this.input = input;
		this.sellerModel = new SellerModel(cassandraClient);
		this.productModel = new ProductModel(cassandraClient);
	}
	public async run(): Promise<void> {
		const options = await this.input.selectInput("Pls escolha", [
			["Cadastrar Produto", "add"],
			["Atualizar Produto", "update"],
			["Deletar Produto", "delete"],
			["Buscar Produto", "search"],
			["Voltar", "exit"],
		]);
		switch (options) {
			case "add": {
				const controller = new CreateProductController(
					this.input,
					this.productModel,
					this.sellerModel,
				);
				await controller.handle();
				return;
			}
			case "search": {
				const controller = new SearchProductController(
					this.productModel,
					this.input,
				);
				await controller.handle();
				return;
			}
			case "delete": {
				const controller = new DeleteProductController(
					this.input,
					this.productModel,
					this.sellerModel,
				);
				await controller.handle();
				return;
			}
			case "update": {
				const controller = new UpdateProductController(
					this.input,
					this.productModel,
					this.sellerModel,
				);
				await controller.handle();
				return;
			}
			case "exit": {
				return;
			}
			default: {
				return;
			}
		}
	}
}
