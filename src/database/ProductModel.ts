import { Collection, ObjectId } from "mongodb";

type Address = {
  city: string
  street: string
  zipCode: string
  number: string
}

type Seller ={
  _id?:ObjectId
  name: string
  address:Address
}


type ProductProperties = Record<string, string | number | boolean | null>;

type ProductDocument = {
  _id?: ObjectId;
  name: string;
  seller: Seller;
  price: number 
  description: string
};
      

export class ProductModel {
  constructor(private collection: Collection<ProductDocument>) {}

  async addProduct(product: ProductDocument): Promise<string> {
    const result = await this.collection.insertOne(product);
    return result.insertedId?.toString() || '';
  }

  async getProductById(id: string): Promise<ProductDocument | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async deleteProductById(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  async updateProductById(id: string, updates: Partial<ProductDocument>): Promise<boolean> {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    return result.modifiedCount === 1;
  }

  async listAll(): Promise<ProductDocument[]> {
    return await this.collection.find().toArray();
  }
}
      
