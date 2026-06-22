const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});
client.once('ready', () => {
    console.log('Welcome Bot Ready')
});

client.on('guildMemberAdd', async member => {

console.log('عضو دخل:', member.user.tag); 

    const channel = member.guild.channels.cache.get('1518393319032357035');

    if (!channel) return;

    channel.send({
        content: `🎉 ارحــــب مليــون${member} فــــي الــســـيـــرفـــر!`,
        files: ['welcome.png']
    });

});

client.login('MTUxODMwNTcxMDg1OTg3ODQ0MA.Gw8WWm.3sf1ggvP29dXUHu7N0PfgSPIW99pflvaf8sO44')