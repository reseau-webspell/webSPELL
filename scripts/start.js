//
const pm2 = require('pm2');
//

// Start process
console.log('>> Starting webSpell');
pm2.connect((err) => {
    if (err) {
        console.error(err);
        process.exit(2);
    }
    pm2.start({
        script: 'index.js',
        args: ['--color'],
        name: 'WebSpell',
        exec_mode : 'fork',
        max_memory_restart : '1G',
        cwd: 'src',
        error: './logs/error.err',
        output: './logs/output.log',
        pid: './logs/pid.pid',
        node_args: '-r esm',
        autorestart: true,
        wait_ready: true,
    }, (err) => {
        pm2.disconnect();
        if (err) throw err;
    });
});
//
