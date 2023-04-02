const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith('!suggest')) {
    const dmChannel = await message.author.createDM();
    await dmChannel.send("What's your suggestion?");

    const filter = (m) => m.author.id === message.author.id && m.channel.type === 'DM';
    const collector = dmChannel.createMessageCollector(filter, { max: 1 });

    collector.on('collect', async (msg) => {
      const suggestion = msg.content;
      const embed = new Discord.MessageEmbed()
        .setTitle('New Suggestion')
        .setDescription(suggestion)
        .setColor('#ff5733');

      const channel = client.channels.cache.get('1086993838813491281'); // Replace with the actual channel ID
      const sentMessage = await channel.send({ embeds: [embed] });

      await sentMessage.react('👍');
      await sentMessage.react('👎');

      await message.reply('Thanks for your suggestion!');
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand() || interaction.commandName !== 'suggest') return;
  await interaction.deferReply();

  const dmChannel = await interaction.user.createDM();
  await dmChannel.send("What's your suggestion?");

  const filter = (m) => m.author.id === interaction.user.id && m.channel.type === 'DM';
  const collector = dmChannel.createMessageCollector(filter, { max: 1 });

  collector.on('collect', async (msg) => {
    const suggestion = msg.content;
    const embed = new Discord.MessageEmbed()
      .setTitle('New Suggestion')
      .setDescription(suggestion)
      .setColor('#ff5733');

    const channel = client.channels.cache.get('1086993838813491281'); // Replace with the actual channel ID
    const sentMessage = await channel.send({ embeds: [embed] });

    await sentMessage.react('👍');
    await sentMessage.react('👎');

    await interaction.editReply('Thanks for your suggestion!');
  });
});

// Sync the commands with the Discord API
client.on('ready', async () => {
  const guildIds = ['1046015667859619870']; // Replace with the actual guild IDs

  // Remove any existing commands before syncing
  for (const guildId of guildIds) {
    const commands = await client.guilds.cache.get(guildId)?.commands.fetch();
    for (const command of commands.values()) {
      await client.guilds.cache.get(guildId)?.commands.delete(command.id);
    }
  }

  // Sync the commands with the Discord API
  await client.application.commands.set([
    {
      name: 'suggest',
      description: 'Suggest something!',
      options: [
        {
          name: 'suggestion',
          description: 'Your suggestion',
          type: 'STRING',
          required: true,
        },
      ],
    },
  ], guildIds);

  console.log(`Synced commands with Discord API for guilds ${guildIds}`);
});

client.login('MTA4Njk5MzM1MTk3NjQzMTY4Nw.GXEoOr.VHqR18byZBn1LFD2h2IZwWQaXf0kptc_NcefrE');
