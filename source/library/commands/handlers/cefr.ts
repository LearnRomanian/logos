import type { Client } from "logos/client";
import { CefrGuideView } from "logos/commands/components/tabbed-views/cefr-guide-view";
import { Guild } from "logos/models/guild";

async function handleDisplayCefrGuide(client: Client, interaction: Logos.Interaction): Promise<void> {
	const guildDocument = await Guild.getOrCreate(client, { guildId: interaction.guildId.toString() });

	const component = new CefrGuideView(client, { interaction, guildDocument });

	await component.open();
}

export { handleDisplayCefrGuide };
