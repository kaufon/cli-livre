import { ObjectId } from "mongodb";
import type { IInput } from "../../core/interfaces";
import { SelectProductController } from "../products/SelectProductController";
import { SelectUserController } from "./SelectUserController";
import type { ProductModel, SellerModel, UserModel } from "../../database";

export class AddPurchaseController {
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
    const selectedProduct = await new SelectProductController(
      this.productModel,
      this.input,
    ).handle();
    if (!selectedProduct) return;
    const quantity = await this.input.numberInput(
      "Qual a quantidade que deseja comprar?",
    );
    const sellId = new ObjectId();
    const purchase = {
      _id: sellId,
      productId: selectedProduct._id as ObjectId,
      productName: selectedProduct.name,
      productPrice: selectedProduct.price,
      quantity: quantity,
      totalPrice: selectedProduct.price * quantity,
    };
    const sell = {
      _id: sellId,
      productId: selectedProduct._id as ObjectId,
      productName: selectedProduct.name,
      quantity: quantity,
      price: selectedProduct.price * quantity,
    };
    await this.userModel.addPurchase(selectedUser._id, purchase);
    await this.sellerModel.addSell(
      selectedProduct.seller._id as ObjectId,
      sell,
    );
    console.log("compra feita com sucesso");
  }
}
