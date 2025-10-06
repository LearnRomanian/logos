import commands from "logos:constants/emojis/commands";
import events from "logos:constants/emojis/events";
import flags from "logos:constants/emojis/flags";
import roles from "logos:constants/emojis/roles";
import services from "logos:constants/emojis/services";

export default Object.freeze({
	commands,
	events,
	roles,
	flags,
	services,
	link: "🔗",
	source: "©️",
	interactions: {
		menu: {
			controls: {
				back: "←",
				forward: "→",
			},
		},
	},
	showInChat: "🗨️",
	edit: "📝",
	delete: "🗑️",
	continue: "➡️",
	cancel: "❌",
} as const);
