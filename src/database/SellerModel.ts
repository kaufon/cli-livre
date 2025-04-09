import { type Collection, ObjectId } from "mongodb";
import { UpdateUserController } from "../controllers/users";

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
type SellerDocument = {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  address: Address;
  products: Product[];
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
  async updateSeller({id,name,email,password,address}:UpdateSellerParams){
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
}
