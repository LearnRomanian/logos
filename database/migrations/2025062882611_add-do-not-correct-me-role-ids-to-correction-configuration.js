import { migrateDocuments } from "../helpers.js";

// This block is executed when the migration is enacted.
async function up(database) {
	migrateDocuments(database, {
		collection: "Guilds",
		migrate: async (document) => {
			if (!document.enabledFeatures.corrections) {
				return;
			}

			document.features.corrections = {
				doNotCorrectRoleIds: [],
			};
		},
	});
}

// This block is executed when the migration is rolled back.
async function down(_) {
	// No changes to make when rolling back.
}

export { up, down };
