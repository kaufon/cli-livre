import { ObjectId, type Collection } from "mongodb";
import { FavoritesCommand } from "../../app/commands/FavoritesCommand";

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
	productPrice: number;
};

type Purchases = {
	_id: ObjectId;
	productId: ObjectId;
	productName: string;
	productPrice: number;
	quantity: number;
	totalPrice: number;
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
		address: Address,
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
			{ $set: updateFields },
		);
	}

	async addFavorite(id: ObjectId, product: FavoriteProduct) {
		return await this.collection.updateOne(
			{ _id: id },
			{ $push: { favorites: product } },
		);
	}

	async removeFavorite(userId: ObjectId, favoriteId: ObjectId) {
		return await this.collection.updateOne(
			{ _id: userId },
			{ $pull: { favorites: { productId: ObjectId } } },
		);
	}

	async addPurchase(userId: ObjectId, purchase: Purchases) {
		return await this.collection.updateOne(
			{ _id: userId },
			{ $push: { purchases: purchase } },
		);
	}
	async getFavoritesFromUserEmail(email: string): Promise<FavoriteProduct[]> {
		const user = await this.collection.findOne({ email: email });
		return user?.favorites ?? [];
	}
	async getPurchasesFromUserEmail(email: string): Promise<Purchases[]> {
		const user = await this.collection.findOne({ email: email });
		return user?.purchases ?? [];
	}
	async listPurchases(userId: ObjectId) {
		const user = await this.collection.findOne({ _id: userId });
		if (!user) {
			throw new Error("User not found");
		}
		return user.purchases;
	}
	async cancelPurchase(userId: ObjectId, purchaseId: ObjectId) {
		return await this.collection.updateOne(
			{ _id: userId },
			{ $pull: { purchases: { _id: purchaseId } } },
		);
	}
	async setFavorites(userEmail: string, favorites: FavoriteProduct[]) {
		return await this.collection.updateOne(
			{ email: userEmail },
			{ $set: { favorites: favorites } },
		);
	}
}
