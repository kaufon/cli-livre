import { driver } from "./DatabaseConfiguration";

type Seller = {
	_id: string;
	name: string;
	city: string;
	zipCode: string;
	street: string;
	number: string;
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
		await this.session.run(
			`
      MERGE (v:Seller {
      name: $sellerName,
      city: $city,
      street: $street,
      zipCode: $zipCode,
      number: $number
      })
    CREATE (p:Product {id: $productId,name: $productName,price: $price, description: $description})
    MERGE (v)-[:VENDE]->(p)
`,
			{
        productId: product.id,
				sellerName: seller.name,
				productName: name,
				description: product.description,
				price,
				city: seller.city,
				street: seller.street,
				zipCode: seller.zipCode,
				number: seller.number,
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
MATCH (p:Product)<-[:VENDE]-(v:Seller)
RETURN p,v
`,
		);
		return result.records.map((record) => ({
			product: record.get("p").properties,
			seller: record.get("v").properties,
		}));
	}
}
