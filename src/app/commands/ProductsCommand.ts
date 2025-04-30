import type { Db } from "mongodb";
import type { IInput } from "../../core/interfaces";
import { SelectProductController } from "../../controllers/products/SelectProductController";
import { CreateProductController } from "../../controllers/products/CreateProductController";
import { DeleteProductController } from "../../controllers/products/DeleteProductController";
import { UpdateProductController } from "../../controllers/products/UpdateProductController";
import { SearchProductController } from "../../controllers/products/SearchProductController";
import { ProductModel, SellerModel } from "../../database";
import { Command } from "./Command";
import type Redis from "ioredis";
export class ProductsCommands extends Command {
	private database: Db;
	private sellerModel: SellerModel;
	private productModel: ProductModel;
	constructor(input: IInput, db: Db, redis: Redis) {
		super(input, redis);
		this.database = db;
		this.sellerModel = new SellerModel(db.collection("sellers"));
		this.productModel = new ProductModel(db.collection("products"));
	}
	public async run(): Promise<void> {
		const isLogged = await this.validateSession();
		if (!isLogged) {
			return;
		}
		const options = await this.input.selectInput("Pls escolha", [
			["Cadastrar Produto", "add"],
			["Atualizar Produto", "update"],
			["Deletar Produto", "delete"],
			["Buscar Produto", "search"],
			["Voltar", "exit"],
		]);
		switch (options) {
			case "add": {
				const controller = await new CreateProductController(
					this.input,
					this.productModel,
					this.sellerModel,
				);
				await controller.handle();
				return;
			}
			case "search": {
				const controller = await new SearchProductController(
					this.productModel,
					this.input,
				);
				await controller.handle();
				return;
			}
			case "delete": {
				const controller = await new DeleteProductController(
					this.input,
					this.productModel,
					this.sellerModel,
				);
				await controller.handle();
				return;
			}
			case "update": {
				const controller = await new UpdateProductController(
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
