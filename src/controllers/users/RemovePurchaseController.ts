import type { ObjectId } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type { ProductModel } from "../../database/ProductModel";
import type { SellerModel } from "../../database/SellerModel";
import type { UserModel } from "../../database/UserModel";
import { SelectProductController } from "../products/SelectProductController";
import { SelectUserController } from "./SelectUserController";
import { SelectPurchaseController } from "./SelectPurchaseController";

export class RemovePurchaseController {
  private input: IInput;
  private userModel: UserModel;
  private sellerModel: SellerModel;
  private productModel: ProductModel;
  constructor(
    input: IInput,
    userModel: UserModel,
    sellerModel: SellerModel,
    productModel: ProductModel,
  ) {
    this.input = input;
    this.userModel = userModel;
    this.sellerModel = sellerModel;
    this.productModel = productModel;
  }
  async handle(): Promise<void> {
    const selectedUser = await new SelectUserController(
      this.userModel,
      this.input,
    ).handle();
    if (!selectedUser) return;
    const selectedPurchase = await new SelectPurchaseController(
      this.userModel,
      this.input,
    ).handle(selectedUser._id);
    if (!selectedPurchase) return;
    await this.userModel.cancelPurchase(selectedUser._id, selectedPurchase._id);
    const sellerID = await this.sellerModel.findSellerIdByProductId(
      selectedPurchase.productId,
    );
    if (!sellerID) {
      console.log("vendedor não encontrado");
      return;
    }
    await this.sellerModel.removeSell(sellerID, selectedPurchase._id);
    console.log("compra cancelada com sucesso");
  }
}
