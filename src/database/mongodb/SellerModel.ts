import { type Collection, ObjectId } from "mongodb";
import type { ProductDocument } from "./ProductModel";

type Address = {
  city: string;
  street: string;
  zipCode: string;
  number: string;
};
type Product = {
  productId: ObjectId;
  name: string;
  description: string;
  price: number;
};
type Sells = {
  _id: ObjectId;
  productId: ObjectId;
  productName: string;
  quantity: number;
  price: number;
};
type SellerDocument = {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  address: Address;
  products: Product[];
  sells: Sells[];
};
type UpdateSellerParams = {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  address?: Address;
};
export class SellerModel {
  constructor(private collection: Collection<SellerDocument>) { }
  async addSeller(
    name: string,
    address: Address,
    email: string,
    password: string,
  ) {
    const seller: SellerDocument = {
      name,
      email,
      password,
      address,
      products: [],
      sells: [],
    };
    return await this.collection.insertOne(seller);
  }
  async listAllSellers() {
    return await this.collection.find().toArray();
  }
  async deleteSeller(id: string) {
    const objectId = new ObjectId(id);
    return await this.collection.deleteOne({ _id: objectId });
  }
  async updateSeller({
    id,
    name,
    email,
    password,
    address,
  }: UpdateSellerParams) {
    const objectId = new ObjectId(id);
    const updateData: Partial<SellerDocument> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (address) updateData.address = address;

    return await this.collection.updateOne(
      { _id: objectId },
      { $set: updateData },
    );
  }
  async addProduct(
    { _id, name, price, description }: ProductDocument,
    sellerId: ObjectId,
  ) {
    const objectId = new ObjectId(sellerId);
    const product: Product = {
      productId: new ObjectId(_id),
      name,
      description,
      price,
    };
    return await this.collection.updateOne(
      { _id: objectId },
      { $push: { products: product } },
    );
  }
  async removeProduct(productId: ObjectId, sellerId: ObjectId) {
    const objectId = new ObjectId(sellerId);
    return await this.collection.updateOne(
      { _id: objectId },
      { $pull: { products: { productId: new ObjectId(productId) } } },
    );
  }
  async updateSellerProduct(
    sellerId: ObjectId,
    productId: ObjectId,
    updates: Partial<Omit<Product, "productId">>,
  ) {
    const updateFields: Record<string, any> = {};

    for (const [key, value] of Object.entries(updates)) {
      updateFields[`products.$.${key}`] = value;
    }

    return await this.collection.updateOne(
      { _id: sellerId, "products.productId": productId },
      { $set: updateFields },
    );
  }
  async addSell(sellerId: ObjectId, sell: Sells) {
    return await this.collection.updateOne(
      { _id: sellerId },
      { $push: { sells: sell } },
    );
  }
  async removeSell(sellerId: ObjectId, sellId: ObjectId) {
    return await this.collection.updateOne(
      { _id: sellerId },
      { $pull: { sells: { _id: sellId } } },
    );
  }
  async findSellerIdByProductId(productId: ObjectId): Promise<ObjectId | null> {
    const seller = await this.collection.findOne(
      { "products.productId": productId },
      { projection: { _id: 1 } },
    );
    return seller?._id ?? null
  }
}
