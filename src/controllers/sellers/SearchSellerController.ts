import { IInput } from "../../core/interfaces";
import { SellerModel } from "../../database/SellerModel";
import { SelectSellerController } from "./SelectSellerController";

export class SearchSellerController {
  private sellerModel: SellerModel;
  private input: IInput;
  constructor(sellerModel: SellerModel, input: IInput) {
    this.sellerModel = sellerModel;
    this.input = input;
  }
  async handle() {
    const selectedSeller = await new SelectSellerController(
      this.sellerModel,
      this.input,
    ).handle();
    if (!selectedSeller) return
    const filteredSeller = {
      Nome: selectedSeller.name,
      Email: selectedSeller.email,
      Cidade: selectedSeller.address.city,
      Rua: selectedSeller.address.street,
      CEP: selectedSeller.address.zipCode,
      Número: selectedSeller.address.number,
      Produtos: selectedSeller.products.map((product) => ({
        Nome: product.name,
        Descrição: product.description,
        Preço: product.price,
      })),
    };
    console.table(filteredSeller);
    return
  }
}
