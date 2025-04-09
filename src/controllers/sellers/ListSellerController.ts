import { SellerModel } from "../../database/SellerModel";

export class ListAllSellersController{
  private sellerModel: SellerModel
  constructor(sellerModel: SellerModel){
    this.sellerModel = sellerModel
  }
  async handle(){
    const sellers = await this.sellerModel.listAllSellers()
    const filteredSellers = sellers.map((seller) => ({
      ID: seller._id.toHexString(),
      Nome: seller.name,
      Email: seller.email,
      Cidade: seller.address.city,
      Rua: seller.address.street,
      CEP: seller.address.zipCode,
    }))
    console.table(filteredSellers)
    return
  }
}
