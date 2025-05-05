import type { Redis } from "ioredis";
import { AddFavoriteController } from "../../controllers/users/AddFavoriteController";
import type { IInput } from "../../core/interfaces";
import { ProductModel, UserModel } from "../../database";
import { Command } from "./Command";
import type { Db } from "mongodb";
import { RemoveFavoriteController } from "../../controllers/users/RemoveFavoriteController";
import { SynchronizeFavoritesCacheController } from "../../controllers/users/SynchronizeFavoriteCacheController";

export class FavoritesCommand extends Command {
	private userModel: UserModel;
	private productModel: ProductModel;
	constructor(db: Db, input: IInput, redis: Redis) {
		super(input, redis);
		this.userModel = new UserModel(db.collection("users"));
		this.productModel = new ProductModel(db.collection("products"));
	}
	async run(): Promise<void> {
		const isLoggedIn = await this.validateSession();
		if (!isLoggedIn) {
			return;
		}
		while (true) {
			const option = await this.input.selectInput("Pls escolha", [
				["Adicionar Favorito", "add-favorite"],
				["Remover Favorito", "remove-favorite"],
				["Voltar", "exit"],
			]);
			switch (option) {
				case "add-favorite": {
					const controller = new AddFavoriteController(
						this.userModel,
						this.input,
						this.productModel,
						this.redis,
					);
					await controller.handle();
					break;
				}
				case "remove-favorite": {
					const controller = new RemoveFavoriteController(
						this.userModel,
						this.input,
						this.productModel,
						this.redis,
					);
					await controller.handle();
					break;
				}
				case "exit": {
					const controller = new SynchronizeFavoritesCacheController(
						this.redis,
						this.userModel,
					);
					await controller.handle();
					return;
				}
				default:
					console.log("Opção inválida");
					break;
			}
		}
	}
}
