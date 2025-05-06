import type Redis from "ioredis";

export class LogoutController {
	private redis: Redis;
	constructor(redis: Redis) {
		this.redis = redis;
	}
	public async handle(): Promise<void> {
		const redisClient = this.redis;
		const pattern = "session:user:*";

		try {
			let cursor = "0";
			do {
				const [nextCursor, keys] = await redisClient.scan(
					cursor,
					"MATCH",
					pattern,
					"COUNT",
					100,
				);
				cursor = nextCursor;

				if (keys.length > 0) {
					await redisClient.del(...keys);
				}
			} while (cursor !== "0");

			console.log("Voce foi deslogado com sucesso!");
		} catch (error) {
			console.error("Erro kkkkkj", error);
		}
	}
}
