import type { ObjectId } from "mongodb";
import type { IInput } from "../../core/interfaces";
import type { SellerModel } from "../../database/SellerModel";
import { ListAllSellersController } from "./ListSellerController";

export class SelectSellerController {
  private sellerModel: SellerModel;
  private input: IInput;
  constructor(sellerModel: SellerModel, input: IInput) {
    this.sellerModel = sellerModel;
    this.input = input;
  }
  async handle(): Promise<{
    _id: ObjectId;
    name: string;
    email: string;
    address: { city: string; street: string; zipCode: string; number: string };
    products: {
      productId: ObjectId;
      name: string;
      description: string;
      price: number;
    }[];
  } | null> {
    const sellers = await this.sellerModel.listAllSellers();
    if (sellers.length === 0) {
      console.log("Nenhum vendedor encontrado.");
      return null;
    }

    const list = new ListAllSellersController(this.sellerModel);
    let selectedSeller;
    await list.handle();
    while (true) {
      const selectedSellerEmail = await this.input.textInput(
        "Digite o email do vendedor: ",
      );
      selectedSeller = sellers.find(
        (seller) => seller.email === selectedSellerEmail,
      );
      if (selectedSeller) {
        console.log(`Vendedor selecionado: ${selectedSeller.name}`);
        break;
      } else {
        console.log("Vendedor não encontrado. Tente novamente.");
      }
    }
    return selectedSeller;
  }
}
