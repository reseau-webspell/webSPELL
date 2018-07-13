//
const pm2 = require('pm2');
//

// Start process
console.log('>> Starting SplashtonBot');
pm2.connect(function(err) {
    if (err) {
        console.error(err);
        process.exit(2);
    }
    pm2.start({
        script: 'stableMain.js',
        args: [ '--color' ],
        name: 'SplashtonBot',
        exec_mode : 'fork',
        max_memory_restart : '1G',
        cwd: 'src/main',
        error: '../../logs/Stable/error.err',
        output: '../../logs/Stable/output.log',
        pid: '../../logs/Stable/pid.pid',
        node_args: '-r esm',
        autorestart: true,
        wait_ready: true,
    }, function(err) {
        pm2.disconnect();
        if (err) throw err;
    });
});
//
