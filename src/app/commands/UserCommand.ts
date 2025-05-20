import type { Collection, Db } from "mongodb";
import { CreateUserController } from "../../controllers/users/CreateUserController";
import type { IInput } from "../../core/interfaces";
import { UserModel } from "../../database/UserModel";
import { ListAllUsersControler } from "../../controllers/users/ListUserController";
import {
	DeleteUserController,
	SearchUserController,
	UpdateUserController,
} from "../../controllers/users";
import { ProductModel } from "../../database/ProductModel";
import { AddFavoriteController } from "../../controllers/users/AddFavoriteController";
import { RemoveFavoriteController } from "../../controllers/users/RemoveFavoriteController";
import { AddPurchaseController } from "../../controllers/users/AddPurchaseController";
import { SellerModel } from "../../database/SellerModel";
import { RemovePurchaseController } from "../../controllers/users/RemovePurchaseController";
export class UsersCommands {
	private input: IInput;
	private database: Db;
	private userModel: UserModel;
	private productModel: ProductModel;
	private sellerModel: SellerModel;
	constructor(input: IInput) {
		this.input = input;
		this.userModel = new UserModel();
		this.productModel = new ProductModel();
		this.sellerModel = new SellerModel();
	}
	public async run(): Promise<void> {
		const options = await this.input.selectInput("Pls escolha", [
			["Cadastrar Cliente", "add"],
			["Buscar Clientes", "search"],
			["Adicionar favorito", "add-favorite"],
			["Comprar produto", "buy-product"],
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
				// const controller = await new RemovePurchaseController(
				//   this.input,
				//   this.userModel,
				//   this.sellerModel,
				//   this.productModel,
				// );
				// await controller.handle();
				return;
			}
			case "add-favorite": {
				const controller = new AddFavoriteController(
					this.userModel,
					this.input,
					this.productModel,
				);
				await controller.handle();
				return;
			}
			// case "remove-favorite": {
			//   const controller = await new RemoveFavoriteController(
			//     this.userModel,
			//     this.input,
			//     this.productModel,
			//   );
			//   await controller.handle();
			//   return;
			// }
			case "add": {
				const controller = new CreateUserController(this.userModel, this.input);
				await controller.handle();
				return;
			}
			// case "update": {
			//   const controller = await new UpdateUserController(
			//     this.userModel,
			//     this.input,
			//   );
			//   await controller.handle();
			//   return;
			// }
			case "search": {
				const controller = new SearchUserController(this.userModel, this.input);
				await controller.handle();
				return;
			}
			// case "delete": {
			//   const controller = await new DeleteUserController(
			//     this.userModel,
			//     this.input,
			//   );
			//   await controller.handle();
			//   return;
			// }
			case "exit":
				return;
			default: {
				console.log("Error XDD");
				return;
			}
		}
	}
}
