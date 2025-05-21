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
      Preco: product.product.price,
      Nome: product.product.name,
      Descricao: product.product.description
    }));
    console.table(filteredSellers);
    return;
  }
}
