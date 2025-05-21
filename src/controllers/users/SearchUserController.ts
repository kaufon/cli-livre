import type { IInput } from "../../core/interfaces";
import type { UserModel } from "../../database/UserModel";
import { SelectUserController } from "./SelectUserController";

export class SearchUserController {
	private userModel: UserModel;
	private input: IInput;
	constructor(userModel: UserModel, input: IInput) {
		this.userModel = userModel;
		this.input = input;
	}
	async handle() {
		const selectedUser = await new SelectUserController(
			this.userModel,
			this.input,
		).handle();
		if (!selectedUser) return;
    const user = await this.userModel.getUserAndFavoritesAndPurchasesByUserId(selectedUser.id)
		const filteredUser = {
			Nome: user.user.name,
			Email: user.user.email,
			Cidade: user.user.city,
			Rua: user.user.street,
			CEP: user.user.zipCode,
			Número: user.user.number,
			Favoritos: user.favorites
				.map((fav) => `${fav.name} (${fav.description}) ${fav.price}`)
				.join(", "),
			Compras: user.purchases
				.map(
					(pur) =>
						`${pur.productName} (Qtd: ${pur.quantity}, Preço: R$${pur.totalPrice})`,
				)
				.join(", "),
		};
		console.table(filteredUser);
		return;
	}
}
