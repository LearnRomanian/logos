import type { Client } from "logos/client";
import { removeDiacritics } from "logos:constants/formatting";

async function handleSimpleAutocomplete<T>(
	client: Client,
	interaction: Logos.Interaction,
	{
		query,
		elements,
		formatChoice,
	}: { query: string; elements: T[]; formatChoice: (element: T) => Discord.ApplicationCommandOptionChoice },
): Promise<void> {
	const queryLowercase = removeDiacritics(query.toLowerCase());
	const choices = elements
		.map((element) => formatChoice(element))
		.filter((choice) => removeDiacritics(choice.name.toLowerCase()).includes(queryLowercase))
		.slice(0, constants.discord.MAXIMUM_AUTOCOMPLETE_CHOICES);

	client.respond(interaction, choices).ignore();
}

export { handleSimpleAutocomplete };
