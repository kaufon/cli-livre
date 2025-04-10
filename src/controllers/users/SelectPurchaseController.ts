import type { ObjectId } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type { UserModel } from "../../database/UserModel";
import { ListAllUsersControler } from "./ListUserController";

export class SelectPurchaseController {
  private userModel: UserModel;
  private input: IInput;
  constructor(userModel: UserModel, input: IInput) {
    this.userModel = userModel;
    this.input = input;
  }
  async handle(userId: ObjectId): Promise<
    | {
      _id: ObjectId;
      productId: ObjectId;
      productName: string;
      productPrice: number;
      quantity: number;
      totalPrice: number;
    }
    | undefined
  > {
    const purchases = await this.userModel.listPurchases(userId);
    const filteredPurchases = purchases.map((purchase) => ({
      ID: purchase._id.toHexString(),
      Nome: purchase.productName,
      Preço: purchase.productPrice,
      Quantidade: purchase.quantity,
      "Preço Total": purchase.totalPrice,
    }));
    if (filteredPurchases.length === 0) {
      console.log("Nenhuma compra encontrada.");
      return;
    }
    console.table(filteredPurchases);

    let selectedPurchase;
    while (true) {
      const selectedPurchaseId = await this.input.textInput(
        "Digite o id da compra: ",
      );
      selectedPurchase = purchases.find(
        (purchase) => purchase._id.toString() === selectedPurchaseId,
      );
      if (selectedPurchase) {
        console.log(`Compra selecionada: ${selectedPurchase._id.toString()}`);
        break;
      } else {
        console.log("Compra não encontrada. Tente novamente.");
      }
    }
    return selectedPurchase;
  }
}
