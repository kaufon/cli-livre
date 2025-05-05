import type { Redis } from "ioredis";
import type { IInput } from "../../core/interfaces";
import { ProductModel, SellerModel, UserModel } from "../../database";
import { Command } from "./Command";
import type { Db } from "mongodb";
import { AddPurchaseController } from "../../controllers/users/AddPurchaseController";
import { RemovePurchaseController } from "../../controllers/users/RemovePurchaseController";
import { SynchronizePurchaseCacheController } from "../../controllers/users/SynchronizePurchaseCacheController";

export class PurchasesCommand extends Command {
	private userModel: UserModel;
	private productModel: ProductModel;
	private sellerModel: SellerModel;
	constructor(db: Db, input: IInput, redis: Redis) {
		super(input, redis);
		this.userModel = new UserModel(db.collection("users"));
		this.productModel = new ProductModel(db.collection("products"));
		this.sellerModel = new SellerModel(db.collection("sellers"));
	}
	async run(): Promise<void> {
		const isLoggedIn = await this.validateSession();
		if (!isLoggedIn) {
			return;
		}
		while (true) {
			const option = await this.input.selectInput("Pls escolha", [
				["Adicionar Compra", "add-purchase"],
				["Remover Compra", "remove-favorite"],
				["Sincronizar compras", "synchronize"],
				["Voltar", "exit"],
			]);
			switch (option) {
				case "add-purchase": {
					const controller = new AddPurchaseController(
						this.input,
						this.userModel,
						this.sellerModel,
						this.productModel,
						this.redis,
					);
					await controller.handle();
					break;
				}
				case "remove-favorite": {
					const controlller = new RemovePurchaseController(
						this.input,
						this.userModel,
						this.sellerModel,
						this.productModel,
						this.redis,
					);
					await controlller.handle();
					break;
				}
				case "synchronize": {
					const controller = new SynchronizePurchaseCacheController(
						this.redis,
						this.userModel,
					);
          await controller.handle()
					return;
				}
				case "exit": {
					return;
				}
				default:
					console.log("Opção inválida");
					break;
			}
		}
	}
}
