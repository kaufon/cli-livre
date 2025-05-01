import type { Db } from "mongodb";
import { CreateUserController } from "../../controllers/users/CreateUserController";
import type { IInput } from "../../core/interfaces";
import {
	DeleteUserController,
	SearchUserController,
	UpdateUserController,
} from "../../controllers/users";
import { AddPurchaseController } from "../../controllers/users/AddPurchaseController";
import { RemovePurchaseController } from "../../controllers/users/RemovePurchaseController";
import { ProductModel, SellerModel, UserModel } from "../../database";
import { Command } from "./Command";
import type Redis from "ioredis";
import { FavoritesCommand } from "./FavoritesCommand";
export class UsersCommands extends Command {
	private userModel: UserModel;
	private productModel: ProductModel;
	private sellerModel: SellerModel;
	private db: Db;
	constructor(input: IInput, db: Db, redis: Redis) {
		super(input, redis);
		this.input = input;
		this.db = db;
		this.userModel = new UserModel(db.collection("users"));
		this.productModel = new ProductModel(db.collection("products"));
		this.sellerModel = new SellerModel(db.collection("sellers"));
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
			["Purchases", "purchases"],
			["Voltar", "exit"],
		]);
		switch (options) {
			case "buy-product": {
				const controller = new AddPurchaseController(
					this.input,
					this.userModel,
					this.sellerModel,
					this.productModel,
				);
				await controller.handle();
				return;
			}
			case "cancel-purchase": {
				const controller = new RemovePurchaseController(
					this.input,
					this.userModel,
					this.sellerModel,
					this.productModel,
				);
				await controller.handle();
				return;
			}
			case "favorites": {
				const command = new FavoritesCommand(this.db, this.input, this.redis);
				await command.run();
        break
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
