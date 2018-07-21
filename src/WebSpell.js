'use strict';

import AxonClient from 'axoncore';

import * as modules from './modules/index';

/**
 * Example - Client constructor
 *
 * @author KhaaZ
 * 
 * @class Client
 * @extends {AxonCore.AxonClient}
 */
class WebSpell extends AxonClient {
    constructor(token, options, config) {
        super(token, options, config, modules);

    }

    initStaff() {
        this.staff.manager = [];
    }

    /** CURRENTLY DISABLED */
    $init() {
        return new Promise((resolve, reject) => {
            try {
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }    

    /** CURRENTLY DISABLED */
    $initStatus() {
        this.editStatus(null, {
            name: `webSPELL | ${this.params.prefix[0]}help`,
            type: 0
        });
    }

}

export default WebSpell;
