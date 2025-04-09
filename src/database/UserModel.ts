import { ObjectId, type Collection } from "mongodb";

type Address = {
  city: string;
  street: string;
  zipCode: string;
  number: string;
};

type FavoriteProduct = {
  productId: ObjectId;
  productName: string;
  productDescription: string;
};

type Purchases = {
  productId: ObjectId;
  productName: string;
  price: number;
  quantity: string;
};

type UserDocument = {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  address: Address;
  favorites: FavoriteProduct[];
  purchases: Purchases[];
};

type UpdateUserParams = {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  address?: Address;
};

export class UserModel {
  constructor(private collection: Collection<UserDocument>) {}

  async addUser(
    name: string,
    email: string,
    password: string,
    address: Address
  ) {
    const user: UserDocument = {
      name,
      email,
      password,
      address,
      favorites: [],
      purchases: [],
    };
    return await this.collection.insertOne(user);
  }

  async listAllUsers() {
    return await this.collection.find().toArray();
  }

  async deleteUser(id: string) {
    const objectId = new ObjectId(id);
    return await this.collection.deleteOne({ _id: objectId });
  }

  async updateUser({ id, name, email, password, address }: UpdateUserParams) {
    const objectId = new ObjectId(id);
    const updateFields: Partial<UserDocument> = {};

    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (password !== undefined) updateFields.password = password;
    if (address !== undefined) updateFields.address = address;

    return await this.collection.updateOne(
      { _id: objectId },
      { $set: updateFields }
    );
  }

  async addFavorite(id: string, product: FavoriteProduct) {
    const objectId = new ObjectId(id);
    return await this.collection.updateOne(
      { _id: objectId },
      { $push: { favorites: product } }
    );
  }

  async removeFavorite(userId: string, favoriteId: string) {
    const userObjectId = new ObjectId(userId);
    const favoriteObjectId = new ObjectId(favoriteId);
    return await this.collection.updateOne(
      { _id: userObjectId },
      { $pull: { favorites: { productId: favoriteObjectId } } }
    );
  }

  async addPurchase(userId: string, purchase: Purchases) {
    const userObjectId = new ObjectId(userId);
    return await this.collection.updateOne(
      { _id: userObjectId },
      { $push: { purchases: purchase } }
    );
  }

  async cancelPurchase(userId: string, purchaseId: string) {
    const userObjectId = new ObjectId(userId);
    const purchaseIdObjectId = new ObjectId(purchaseId);
    return await this.collection.updateOne(
      { _id: userObjectId },
      { $pull: { purchases: { productId: purchaseIdObjectId } } }
    );
  }
}

