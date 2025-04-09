import type { IInput } from "../../core/interfaces";
import type { SellerModel } from "../../database/SellerModel";
import { SelectSellerController } from "./SelectSellerController";

export class DeleteSellerController {
  private sellerModel: SellerModel;
  private input: IInput;
  constructor(sellerModel: SellerModel, input: IInput) {
    this.sellerModel = sellerModel;
    this.input = input;
  }
  async handle() {
    const selectedUser = await new SelectSellerController(
      this.sellerModel,
      this.input,
    ).handle();
    this.sellerModel.deleteSeller(selectedUser._id.toString());
    console.log("Vendedor deletado com sucesso!");
    return;
  }
}
