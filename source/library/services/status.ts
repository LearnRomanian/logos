import type { Client } from "logos/client";
import { Collector } from "logos/collectors";
import { GlobalService } from "logos/services/service";

class StatusService extends GlobalService {
	readonly #readies: Collector<"ready">;

	constructor(client: Client) {
		super(client, { identifier: "StatusService" });

		this.#readies = new Collector();
	}

	async start(): Promise<void> {
		this.#readies.onCollect(this.#setBotStatus.bind(this));

		this.client.registerCollector("ready", this.#readies);
	}

	async #setBotStatus(): Promise<void> {
		await this.client.bot.gateway
			.editBotStatus({
				activities: [
					{
						name: "custom",
						type: Discord.ActivityTypes.Custom,
						state: constants.STATUS_MESSAGE,
					},
				],
				status: "online",
				since: null,
				afk: false,
			})
			.catch((error) => this.log.warn(error, "Unable to edit bot status."));
	}
}

export { StatusService };
