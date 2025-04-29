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
		const filteredUser = {
			Nome: selectedUser.name,
			Email: selectedUser.email,
			Cidade: selectedUser.address.city,
			Rua: selectedUser.address.street,
			CEP: selectedUser.address.zipCode,
			Número: selectedUser.address.number,
			Favoritos: selectedUser.favorites
				.map((fav) => `${fav.productName} (${fav.productDescription})`)
				.join(", "),
			Compras: selectedUser.purchases
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
