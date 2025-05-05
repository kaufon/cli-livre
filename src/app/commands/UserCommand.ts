import type { Db } from "mongodb";
import { CreateUserController } from "../../controllers/users/CreateUserController";
import type { IInput } from "../../core/interfaces";
import {
	DeleteUserController,
	SearchUserController,
	UpdateUserController,
} from "../../controllers/users";
import { UserModel } from "../../database";
import { Command } from "./Command";
import type Redis from "ioredis";
import { FavoritesCommand } from "./FavoritesCommand";
import { PurchasesCommand } from "./PurchasesCommand";
export class UsersCommands extends Command {
	private userModel: UserModel;
	private db: Db;
	constructor(input: IInput, db: Db, redis: Redis) {
		super(input, redis);
		this.input = input;
		this.db = db;
		this.userModel = new UserModel(db.collection("users"));
	}
	public async run(): Promise<void> {
		const isLoggedIn = await this.validateSession();
		if (!isLoggedIn) {
			return;
		}
		const options = await this.input.selectInput("Pls escolha", [
			["Cadastrar Cliente", "add"],
			["Atualizar Cliente", "update"],
			["Deletar Cliente", "delete"],
			["Buscar Clientes", "search"],
			["Favoritos", "favorites"],
			["Compras", "purchases"],
			["Voltar", "exit"],
		]);
		switch (options) {
			case "purchases": {
				const command = new PurchasesCommand(this.db, this.input, this.redis);
				await command.run();
				return;
			}
			case "favorites": {
				const command = new FavoritesCommand(this.db, this.input, this.redis);
				await command.run();
				break;
			}
			case "add": {
				const controller = new CreateUserController(this.userModel, this.input);
				await controller.handle();
				return;
			}
			case "update": {
				const controller = new UpdateUserController(this.userModel, this.input);
				await controller.handle();
				return;
			}
			case "search": {
				const controller = new SearchUserController(this.userModel, this.input);
				await controller.handle();
				return;
			}
			case "delete": {
				const controller = new DeleteUserController(this.userModel, this.input);
				await controller.handle();
				return;
			}
			case "exit":
				return;
			default: {
				console.log("Error XDD");
				return;
			}
		}
	}
}
