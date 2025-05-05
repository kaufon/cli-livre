import type { IInput } from "../../core/interfaces";
import type { UserModel } from "../../database";
import { ListAllUsersControler } from "./ListUserController";
import type { UserDto } from "../../core/dtos/UserDto";

export class SelectUserController {
	private userModel: UserModel;
	private input: IInput;

	constructor(userModel: UserModel, input: IInput) {
		this.userModel = userModel;
		this.input = input;
	}

	async handle(): Promise<UserDto | null> {
		const users = await this.userModel.listAllUsers();
		if (users.length === 0) {
			console.log("Nenhum usuário encontrado.");
			return null;
		}

		const list = new ListAllUsersControler(this.userModel);
		await list.handle();

		let selectedUser: UserDto | undefined;
		while (true) {
			const selectedIndex = await this.input.textInput(
				"Digite o índice do usuário: ",
			);

			const index = Number.parseInt(selectedIndex, 10);
			if (!Number.isNaN(index) && index >= 0 && index < users.length) {
				selectedUser = users[index];
				console.log(`Usuário selecionado: ${selectedUser.name}`);
				break;
			}

			console.log("Índice inválido. Tente novamente.");
		}

		return selectedUser;
	}
}
