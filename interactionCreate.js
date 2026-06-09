const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        // Apdorojame Slash komandas (/verifybot)
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'Įvyko klaida vykdant šią komandą!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'Įvyko klaida vykdant šią komandą!', ephemeral: true });
                }
            }
        } 
        // Apdorojame Mygtuku paspaudimus (patvirtinimo paneleje)
        else if (interaction.isButton()) {
            if (interaction.customId === 'verify_button') {
                const roleId = process.env.ROLE_ID;

                if (!roleId) {
                    return interaction.reply({ content: 'Klaida: Serverio administratorius dar nenustatė ROLE_ID .env faile.', ephemeral: true });
                }

                const role = interaction.guild.roles.cache.get(roleId);
                if (!role) {
                    return interaction.reply({ content: 'Klaida: Nurodyta rolė nerasta šiame serveryje.', ephemeral: true });
                }

                if (interaction.member.roles.cache.has(roleId)) {
                    return interaction.reply({ content: 'Jūs jau esate patvirtintas ir turite šią rolę!', ephemeral: true });
                }

                try {
                    await interaction.member.roles.add(role);
                    await interaction.reply({ content: 'Sėkmingai pasitvirtinote! Dabar turite priėjimą prie serverio. Sveiki atvykę į LunaX.LT!', ephemeral: true });
                } catch (error) {
                    console.error('[KLAIDA] Nepavyko suteikti rolės vartotojui:', error);
                    await interaction.reply({ content: 'Įvyko klaida. Patikrinkite ar botas turi tinkamas teises ir ar jo rolė serverio nustatymuose yra AUKŠČIAU nei rolė, kurią jis bando uždėti.', ephemeral: true });
                }
            }
        }
    },
};
