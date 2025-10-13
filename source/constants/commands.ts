function isSlashCommand(type: Discord.ApplicationCommandTypes): type is Discord.ApplicationCommandTypes.ChatInput {
	return type === Discord.ApplicationCommandTypes.ChatInput;
}

function isContextCommand(
	type: Discord.ApplicationCommandTypes,
): type is Discord.ApplicationCommandTypes.User | Discord.ApplicationCommandTypes.Message {
	return [Discord.ApplicationCommandTypes.User, Discord.ApplicationCommandTypes.Message].includes(type);
}

export { isSlashCommand, isContextCommand };
