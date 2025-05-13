import type { IInput } from "../../core/interfaces";
import type { UserModel } from "../../database/UserModel";
import { ListAllUsersControler } from "./ListUserController";

export class SelectUserController {
	private userModel: UserModel;
	private input: IInput;
	constructor(userModel: UserModel, input: IInput) {
		this.userModel = userModel;
		this.input = input;
	}

	async handle(): Promise<{
		id: string;
		name: string;
		email: string;
		city: string;
		street: string;
		zipCode: string;
		number: string;
		favorites: {
			productId: string;
			productName: string;
			productDescription: string;
			productPrice: number;
		}[];
		purchases: {
			productId: string;
			productName: string;
			totalPrice: number;
			quantity: string;
		}[];
	} | null> {
		const users = await this.userModel.listAllUsers();
		if (users.length === 0) {
			console.log("Nenhum usuário encontrado.");
			return null;
		}

		await new ListAllUsersControler(this.userModel).handle();

		let selectedUser = null;
		while (!selectedUser) {
			const email = await this.input.textInput("Digite o email do usuário: ");
			const basicUser = users.find((user) => user.email === email);
			if (!basicUser) {
				console.log("Usuário não encontrado. Tente novamente.");
				continue;
			}

			selectedUser = await this.userModel.findUserWithRelations(basicUser.id);
			if (!selectedUser) {
				console.log("Erro ao buscar dados completos do usuário.");
				return null;
			}

			console.log(`Usuário selecionado: ${selectedUser.name}`);
		}

		return {
			id: selectedUser.id,
			name: selectedUser.name,
			email: selectedUser.email,
			city: selectedUser.city,
			street: selectedUser.street,
			zipCode: selectedUser.zipCode,
			number: selectedUser.number,
			favorites: selectedUser.favorites.map((f: any) => ({
				productId: f.product_id,
				productName: f.product_name,
				productDescription: f.product_description,
				productPrice: Number(f.product_price),
			})),
			purchases: selectedUser.purchases.map((p: any) => ({
				productId: p.product_id,
				productName: p.product_name,
				// totalPrice: (p.quantity.toNumber() / 4607182418800017408) * p.product_price,
				// quantity: p.quantity.toNumber() / 4607182418800017408,
			})),
		};
	}
}
