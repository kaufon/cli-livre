import { CacheController } from "./CacheController";

export class GetCurrentUserController extends CacheController {
	public async handle(): Promise<void> {
		const userSession = await this.redis.keys("session:user*");
		const userEmail = userSession[0].split(":")[2];
		const user = await this.userModel.getUserFromEmail(userEmail);
		if (!user) return;
		const formatedUser = {
			Nome: user.name,
			Email: user.email,
			Cidade: user.address.city,
			Rua: user.address.street,
			CEP: user.address.zipCode,
			Número: user.address.number,
			Favoritos: user.favorites
				.map((fav) => `${fav.productName} (${fav.productDescription})`)
				.join(", "),
			Compras: user.purchases
				.map(
					(pur) =>
						`${pur.productName} (Qtd: ${pur.quantity}, Preço: R$${pur.totalPrice})`,
				)
				.join(", "),
		};
		console.table(formatedUser);
	}
}
