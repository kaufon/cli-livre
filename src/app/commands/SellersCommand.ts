import type { Db } from "mongodb";
import type { IInput } from "../../core/interfaces";
import {
	CreateSellerController,
	DeleteSellerController,
	SearchSellerController,
	UpdateSellerController,
} from "../../controllers/sellers";
import { SellerModel } from "../../database";
import { Command } from "./Command";
import type Redis from "ioredis";
export class SellersCommands extends Command {
	private mongoDatabase: Db;
	private model: SellerModel;
	constructor(input: IInput, db: Db, redis: Redis) {
		super(input, redis);
		this.input = input;
		this.mongoDatabase = db;
		this.model = new SellerModel(db.collection("sellers"));
	}
	public async run(): Promise<void> {
		const isLogged = await this.validateSession();
		if (!isLogged) {
			return;
		}
		const options = await this.input.selectInput("Pls escolha", [
			["Cadastrar Vendedor", "add"],
			["Atualizar Vendedor", "update"],
			["Deletar Vendedor", "delete"],
			["Buscar Vendedor", "search"],
			["Voltar", "exit"],
		]);
		switch (options) {
			case "add": {
				const controller = await new CreateSellerController(
					this.model,
					this.input,
				);
				await controller.handle();
				return;
			}
			case "search": {
				const controller = await new SearchSellerController(
					this.model,
					this.input,
				);
				await controller.handle();
				return;
			}
			case "update": {
				const controller = await new UpdateSellerController(
					this.model,
					this.input,
				);
				await controller.handle();
				return;
			}
			case "delete": {
				const controller = await new DeleteSellerController(
					this.model,
					this.input,
				);
				await controller.handle();
				return;
			}
			case "exit": {
				return;
			}
			default: {
				console.log("Opção inválida");
				return;
			}
		}
	}
}
