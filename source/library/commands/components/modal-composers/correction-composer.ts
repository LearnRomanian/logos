import { trim } from "logos:constants/formatting";
import type { Client } from "logos/client";
import { type Modal, ModalComposer } from "logos/commands/components/modal-composers/modal-composer";

interface CorrectionFormData {
	readonly original: string;
	readonly corrected: string;
}
type ValidationError = "texts-not-different";
class CorrectionComposer extends ModalComposer<CorrectionFormData, ValidationError> {
	constructor(
		client: Client,
		{ interaction, original, corrected }: { interaction: Logos.Interaction; original: string; corrected: string },
	) {
		super(client, {
			interaction,
			initialFormData: { original, corrected },
		});
	}

	buildModal(
		submission: Logos.Interaction,
		{ formData }: { formData: CorrectionFormData },
	): Modal<CorrectionFormData> {
		const strings = constants.contexts.correctionModal({
			localise: this.client.localise,
			locale: submission.locale,
		});

		return {
			title: strings.title,
			elements: [
				{
					type: Discord.MessageComponentTypes.ActionRow,
					components: [
						{
							customId: "original",
							type: Discord.MessageComponentTypes.TextInput,
							label: trim(strings.fields.original, 45),
							style: Discord.TextStyles.Paragraph,
							required: false,
							value: formData.original,
						},
					],
				},
				{
					type: Discord.MessageComponentTypes.ActionRow,
					components: [
						{
							customId: "corrected",
							type: Discord.MessageComponentTypes.TextInput,
							label: trim(strings.fields.corrected, 45),
							style: Discord.TextStyles.Paragraph,
							required: true,
							value: formData.corrected,
						},
					],
				},
			],
		};
	}

	validate({ formData }: { formData: CorrectionFormData }): ValidationError | undefined {
		if (formData.corrected === formData.original) {
			return "texts-not-different";
		}

		return undefined;
	}

	getErrorMessage(submission: Logos.Interaction, _: { error: ValidationError }): Discord.TextDisplayComponent {
		const strings = constants.contexts.correctionTextsNotDifferent({
			localise: this.client.localise,
			locale: submission.locale,
		});

		return {
			type: Discord.MessageComponentTypes.TextDisplay,
			content: `# ${strings.title}\n${strings.description}`,
		};
	}
}

export { CorrectionComposer };
export type { CorrectionFormData };
