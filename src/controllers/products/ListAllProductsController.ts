import { ObjectId } from "mongodb";
import { ProductDocument, ProductModel } from "../../database/ProductModel";

export class ListAllProductsController {
  private productModel: ProductModel;
  constructor(productModel: ProductModel) {
    this.productModel = productModel;
  }
  async handle() {
    const products = await this.productModel.listAll();
    const filteredSellers = products.map((product) => ({
      ID: product._id?.toHexString(),
      Preco: product.price,
      Nome: product.name,
    }));
    console.table(filteredSellers);
    return;
  }
}
