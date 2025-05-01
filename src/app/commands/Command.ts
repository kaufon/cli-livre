import type Redis from "ioredis";
import type { IInput } from "../../core/interfaces";

export abstract class Command {
	protected input: IInput;
	protected redis: Redis;

	constructor(input: IInput, redis: Redis) {
		this.input = input;
		this.redis = redis;
	}
	protected async validateSession(): Promise<boolean> {
		const userSession = await this.redis.get("session:user");
		if (!userSession) {
			console.log("❌ Você não está logado.");
			const email = await this.input.textInput("Digite seu email");
			const password = await this.input.textInput("Digite sua senha");
			const user = await this.redis.set(
				"session:user",
				JSON.stringify({ email, password }),
			);
			await this.redis.expire("session:user", 60 * 60);
			return false;
		}
		return true;
	}
	abstract run(): Promise<void>;
}
