const { Events, REST, Routes } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`[VTDC] Prisijungta kaip ${client.user.tag}`);
        console.log(`[VTDC] Botas ONLINE ir laukia komandu!`);

        // Register slash commands
        if (!process.env.CLIENT_ID) {
            console.warn('[ISPEJIMAS] CLIENT_ID nerastas .env faile. / komandos nebus registruojamos automatiskai.');
            return;
        }

        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        const commands = client.commands.map(cmd => cmd.data.toJSON());

        try {
            console.log('[VTDC] Bandoma registruoti komandas Discord serveryje...');
            if (process.env.GUILD_ID) {
                await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                    { body: commands },
                );
                console.log('[VTDC] Komandos sekmingai uzregistruotos Jusu serveryje!');
            } else {
                await rest.put(
                    Routes.applicationCommands(process.env.CLIENT_ID),
                    { body: commands },
                );
                console.log('[VTDC] Komandos sekmingai uzregistruotos globaliai (gali uztrukti iki valandos kol atsiras)!');
            }
        } catch (error) {
            console.error('[KLAIDA] Nepavyko uzregistruoti komandu:', error);
        }
    },
};
