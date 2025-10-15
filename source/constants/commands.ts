function isSlashCommand(type: Discord.ApplicationCommandTypes): type is Discord.ApplicationCommandTypes.ChatInput {
	return type === Discord.ApplicationCommandTypes.ChatInput;
}

function isContextCommand(
	type: Discord.ApplicationCommandTypes,
): type is Discord.ApplicationCommandTypes.User | Discord.ApplicationCommandTypes.Message {
	return [Discord.ApplicationCommandTypes.User, Discord.ApplicationCommandTypes.Message].includes(type);
}

export default Object.freeze({
	contexts: [
		Discord.DiscordInteractionContextType.Guild,
		Discord.DiscordInteractionContextType.BotDm,
		Discord.DiscordInteractionContextType.PrivateChannel,
	] satisfies Discord.DiscordInteractionContextType[],
} as const);
export { isSlashCommand, isContextCommand };
