import type { Client } from "logos/client";
import { InteractionCollector } from "logos/collectors";

type ConfirmEvent = () => Promise<void>;
type CancelEvent = () => Promise<void>;

class ConfirmationPrompt {
	readonly client: Client;
	readonly collector: InteractionCollector;
	readonly title: string;
	readonly description: string;
	readonly yes: string;
	readonly no: string;

	#onConfirm?: ConfirmEvent;
	#onCancel?: CancelEvent;

	constructor(
		client: Client,
		{
			interaction,
			title,
			description,
			yes,
			no,
		}: { interaction: Logos.Interaction; title: string; description: string; yes: string; no: string },
	) {
		this.client = client;
		this.collector = new InteractionCollector(client, {
			guildId: interaction.guildId,
			only: [interaction.user.id],
		});
		this.title = title;
		this.description = description;
		this.yes = yes;
		this.no = no;
	}

	async initialise(): Promise<void> {
		this.collector.onInteraction(async (buttonPress) => {
			await this.client.postponeReply(buttonPress);

			const confirmButton = new InteractionCollector(this.client, {
				only: [buttonPress.user.id],
				dependsOn: this.collector,
				isSingle: true,
			});
			const cancelButton = new InteractionCollector(this.client, {
				only: [buttonPress.user.id],
				dependsOn: this.collector,
				isSingle: true,
			});

			confirmButton.onInteraction(async (_) => {
				this.client.deleteReply(buttonPress).ignore();
				this.#onConfirm?.();
			});

			cancelButton.onInteraction((_) => {
				this.client.deleteReply(buttonPress).ignore();
				this.#onCancel?.();
			});

			await this.client.registerInteractionCollector(confirmButton);
			await this.client.registerInteractionCollector(cancelButton);

			this.client
				.pushedBack(buttonPress, {
					flags: Discord.MessageFlags.IsComponentV2,
					components: [
						{
							type: Discord.MessageComponentTypes.Container,
							components: [
								{
									type: Discord.MessageComponentTypes.TextDisplay,
									content: `# ${this.title}\n${this.description}`,
								},
								{
									type: Discord.MessageComponentTypes.Separator,
									spacing: Discord.SeparatorSpacingSize.Large,
								},
								{
									type: Discord.MessageComponentTypes.ActionRow,
									components: [
										{
											type: Discord.MessageComponentTypes.Button,
											customId: confirmButton.customId,
											label: this.yes,
											style: Discord.ButtonStyles.Success,
										},
										{
											type: Discord.MessageComponentTypes.Button,
											customId: cancelButton.customId,
											label: this.no,
											style: Discord.ButtonStyles.Danger,
										},
									],
								},
							],
						},
					],
				})
				.ignore();
		});

		await this.client.registerInteractionCollector(this.collector);
	}

	onConfirm(callback: ConfirmEvent): void {
		this.#onConfirm = callback;
	}

	onCancel(callback: CancelEvent): void {
		this.#onCancel = callback;
	}
}

export { ConfirmationPrompt };
