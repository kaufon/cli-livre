import { Collection } from "mongodb";
import { Input } from "../../app/libs/Input";
import type { IInput } from "../../core/interfaces";
import type { UserModel } from "../../database/UserModel";

export class CreateUserController {
	private userModel: UserModel;
	private input: IInput;
	constructor(userModel: UserModel, input: IInput) {
		this.userModel = userModel;
		this.input = input;
	}
	async handle() {
		const name = await this.input.textInput("Escreva o nome: ");
		const email = await this.input.textInput("Escreva o email: ");
		const users = await this.userModel.listAllUsers();
		if (users.find((user) => user.email === email)) {
			console.log("Email já cadastrado");
			return;
		}
		const password = await this.input.textInput("Escreva a senha: ");
		const city = await this.input.textInput("Escreva a cidade: ");
		const street = await this.input.textInput("Escreva a rua: ");
		const zipCode = await this.input.textInput("Escreva o CEP: ");
		const number = await this.input.textInput("Escreva o número: ");
		const address = { city, street, zipCode, number };
		await this.userModel.addUser(name, email, password, address);
		return;
	}
}
