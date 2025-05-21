import { ObjectId } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type { ProductModel } from "../../database/ProductModel";
import type { SellerModel } from "../../database/SellerModel";
import type { UserModel } from "../../database/UserModel";
import { SelectProductController } from "../products/SelectProductController";
import { SelectUserController } from "./SelectUserController";

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
      productId: selectedProduct.product.id,
      productName: selectedProduct.product.name,
      productPrice: selectedProduct.product.price,
      quantity: quantity,
      totalPrice: selectedProduct.product.price * quantity,
    };
    const sell = {
      _id: sellId,
      productId: selectedProduct.product.id,
      productName: selectedProduct.product.name,
      quantity: quantity,
      price: selectedProduct.product.price * quantity,
    };
    await this.userModel.addPurchase(selectedUser.id, purchase);
    console.log("compra feita com sucesso");
  }
}
