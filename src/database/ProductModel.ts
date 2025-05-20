import { driver } from "./DatabaseConfiguration";

type Address = {
	city: string;
	street: string;
	zipCode: string;
	number: string;
};

type Seller = {
	_id: string;
	name: string;
	address: Address;
};

export type ProductDocument = {
	id: string;
	name: string;
	seller: Seller;
	price: number;
	description: string;
};

export class ProductModel {
	public session = driver.session();

	async addProduct(product: ProductDocument): Promise<void> {
		const { name, price, seller } = product;
		const { address } = seller;
		await this.session.run(
			`
      MERGE (v:Vendedor {
      name: $sellerName,
      city: $city,
      street: $street,
      zipCode: $zipCode
      number: $number
})
    CREATE (p:Produto {name: $productName,price: $price})
    MERGE (v)-[:VENDE]->(p)
`,
			{
				sellerName: seller.name,
				productName: name,
				price,
				city: address.city,
				street: address.street,
				zipCode: address.zipCode,
				number: address.number,
			},
		);
	}

	async getProductById(id: string): Promise<ProductDocument | null> {
		const result = await this.session.run(
			`
      MATCH (p:Produto { id: $id })
      RETURN p
      `,
			{ id },
		);

		const record = result.records[0];
		if (!record) return null;

		const props = record.get("p").properties;
		return {
			id: props.id,
			name: props.name,
			description: props.description,
			price: props.price,
		};
	}
	//
	// async deleteProductById(id: ObjectId): Promise<boolean> {
	//   const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
	//   return result.deletedCount === 1;
	// }

	// async updateProductById(
	//   id: ObjectId,
	//   updates: Partial<ProductDocument>,
	// ): Promise<boolean> {
	//   const result = await this.collection.updateOne(
	//     { _id: new ObjectId(id) },
	//     { $set: updates },
	//   );
	//   return result.modifiedCount === 1;
	// }

	async listAll(): Promise<any[]> {
		const result = await this.session.run(
			`
MATCH (p:Produto)<-[:VENDE]-(v:Vendedor)
RETURN p,v
`,
		);
		return result.records.map((record) => ({
			product: record.get("p").properties,
			seller: record.get("v").properties,
		}));
	}
}
