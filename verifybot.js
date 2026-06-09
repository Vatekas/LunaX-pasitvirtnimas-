const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verifybot')
        .setDescription('Išsiunčia LunaX.LT serverio patvirtinimo panelę'),
    async execute(interaction) {
        // Patikriname ar vartotojas yra Administratorius
        if (!interaction.member.permissions.has('Administrator')) {
            return interaction.reply({ content: 'Neturite teisės naudoti šios komandos! Reikalingos Administratoriaus teisės.', flags: 64 });
        }

        // Tikriname, ar vartotojas įkėlė logo.png (arba logo.jpg) į boto aplanką
        const pngPath = path.join(__dirname, '..', 'logo.png');
        const jpgPath = path.join(__dirname, '..', 'logo.jpg');
        
        let imagePath = null;
        let attachmentName = null;
        if (fs.existsSync(pngPath)) {
            imagePath = pngPath;
            attachmentName = 'logo.png';
        } else if (fs.existsSync(jpgPath)) {
            imagePath = jpgPath;
            attachmentName = 'logo.jpg';
        }

        const embed = new EmbedBuilder()
            .setTitle('SVEIKI ATVYKĘ Į LUNAX.LT')
            .setDescription(
                'Sveikiname prisijungus prie **LunaX.LT** bendruomenės!\n\n' +
                'Kad galėtumėte matyti visus serverio kanalus ir pilnai naudotis mūsų sistema, jums reikia **pasitvirtinti**.\n\n' +
                'Spauskite žemiau esantį mygtuką **Patvirtinti**!'
            )
            .setColor('#2b2d31') // Moderni tamsiai pilka spalva (kaip Discord fono)
            .setTimestamp();

        const files = [];
        if (imagePath) {
            const file = new AttachmentBuilder(imagePath);
            embed.setImage(`attachment://${attachmentName}`);
            files.push(file);
            embed.setFooter({ text: 'Made By LunaX Developer', iconURL: interaction.guild.iconURL() });
        } else {
            embed.setFooter({ text: 'Made By LunaX Developer' });
        }

        // Ieškome tavo įkelto emoji serveryje pagal pavadinimą "verify"
        const customEmoji = interaction.guild.emojis.cache.find(e => e.name.includes('verify'));

        const verifyButton = new ButtonBuilder()
            .setCustomId('verify_button')
            .setLabel('Patvirtinti')
            .setStyle(ButtonStyle.Primary);

        // Jei botas randa emoji, uždeda jį. Jei ne, naudoja paprastą varnelę.
        if (customEmoji) {
            verifyButton.setEmoji(customEmoji.id);
        } else {
            verifyButton.setEmoji('✅');
        }

        const row = new ActionRowBuilder().addComponents(verifyButton);

        try {
            await interaction.channel.send({ embeds: [embed], components: [row], files: files });
            await interaction.reply({ content: 'Patvirtinimo panelė sėkmingai sugeneruota ir išsiųsta šitame kanale!', flags: 64 });
        } catch (error) {
            if (error.code === 50001) {
                await interaction.reply({ content: 'KLAIDA: Botas neturi leidimo rašyti į šį kanalą! Eikite į kanalo nustatymus (Edit Channel -> Permissions) ir suteikite botui "View Channel" bei "Send Messages" teises.', flags: 64 });
            } else {
                console.error(error);
                await interaction.reply({ content: 'Įvyko nenumatyta klaida siunčiant panelę.', flags: 64 });
            }
        }
    },
};
