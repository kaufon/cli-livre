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
    const filteredUser = {
      Nome: selectedUser.name,
      Email: selectedUser.email,
      Cidade: selectedUser.address.city,
      Rua: selectedUser.address.street,
      CEP: selectedUser.address.zipCode,
      Número: selectedUser.address.number,
      Favoritos: selectedUser.favorites.map((favorite) => ({
        Nome: favorite.productName,
        Descrição: favorite.productDescription,
      })),
      Compras: selectedUser.purchases.map((purchase) => ({
        Nome: purchase.productName,
        Preço: purchase.price,
        Quantidade: purchase.quantity,
      })),
    };
    console.table(filteredUser);
    return
  }
}
