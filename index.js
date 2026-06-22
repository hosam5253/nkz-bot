const {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits
} = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('clientReady', async () => {
    console.log('Bot Ready');

    const channel = await client.channels.fetch('1518343740257730687');

    const menu = new StringSelectMenuBuilder()
        .setCustomId('ticket_menu')
        .setPlaceholder('اختر نوع التذكرة')
        .addOptions([
            {
                label: 'استفسار',
                description: 'للاستفسارات العامة',
                value: 'استفسار',
                emoji: '📩'
            },
            {
                label: 'شراء سيرفر جاهز',
                description: 'طلب شراء سيرفر جاهز',
                value: 'شراء-سيرفر',
                emoji: '🛒'
            },
            {
                label: 'تصميم سيرفر',
                description: 'طلب تصميم سيرفر',
                value: 'تصميم-سيرفر',
                emoji: '🎨'
            },
            {
                label: 'برمجة سيرفر',
                description: 'طلب برمجة سيرفر',
                value: 'برمجة-سيرفر',
                emoji: '💻'
            },
            {
                label: 'برمجة بوتات',
                description: 'طلب برمجة بوتات',
                value: 'برمجة-بوتات',
                emoji: '🤖'
            }
        ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await channel.send({
        content: '## 🎫 نظام التذاكر\nاختر القسم المناسب من القائمة بالأسفل',
        components: [row]
    });
});

client.on('interactionCreate', async interaction => {

    if (interaction.isButton()) {

        if (interaction.customId === 'close_ticket') {

            await interaction.reply({
                content: '🔒 سيتم حذف التذكرة بعد 5 ثواني',
                ephemeral: true
            });

            setTimeout(async () => {
                await interaction.channel.delete().catch(() => {});
            }, 5000);

            return;
        }
    }

    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'ticket_menu') return;

    try {

        await interaction.deferReply({ ephemeral: true });

        const type = interaction.values[0];

        const ticket = await interaction.guild.channels.create({
            name: `${type}-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: '1518355521965654036',

            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel]
                }
            ]
        });

        const closeButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('🔒 إغلاق التذكرة')
                    .setStyle(ButtonStyle.Danger)
            );

        await ticket.send({
            content: `أهلاً ${interaction.user}\nتم فتح تذكرتك في قسم **${type}**`,
            components: [closeButton]
        });

        await interaction.editReply({
            content: `✅ تم إنشاء التذكرة: ${ticket}`
        });

    } catch (err) {
        console.error(err);

        if (interaction.deferred) {
            await interaction.editReply({
                content: '❌ حدث خطأ أثناء إنشاء التذكرة'
            });
        }
    }
});

client.login('MTUxODMwNTcxMDg1OTg3ODQ0MA.Gw8WWm.3sf1ggvP29dXUHu7N0PfgSPIW99pflvaf8sO44');