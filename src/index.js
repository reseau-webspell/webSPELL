import Bot from './Bot';

// packages
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/webSpellDB')
    .then(() => {
        Bot.Logger.notice('Connected to webSpell DataBase.');
        Bot.AxonUtils.triggerWebhook('loader', {
            color: 0x008000,
            description: 'Connected to WebSPELL DataBase!',
        }, 'DATABASE');
    })
    .catch(err => {
        Bot.Logger.emerg('Could NOT connect to WebSpell DataBase.\n' + err.stack);
        Bot.AxonUtils.triggerWebhook('loader', {
            color: 0xFF0000,
            description: `Could not connect to WebSpell DataBase!\n${err.message}`,
        }, 'DATABASE');
    });


Bot.start();
Bot.Logger.notice('=== ONLINE ===');
Bot.AxonUtils.triggerWebhook('status', {
    color: 0x008000,
    description: 'ONLINE!',
});
