import {PanelCtrl} from 'grafana/app/plugins/sdk'; // will be resolved to app/plugins/sdk

import './css/panel.base.scss';
// Remove next imports if you don't need separate styles for light and dark themes
import './css/panel.dark.scss';
import './css/panel.light.scss';

// Remove up to here

class Ctrl extends PanelCtrl {

    constructor($scope, $injector) {
        super($scope, $injector);
        // this.credentials = {
        //     'thingId': 'my.things:my_thing',
        //     'uri': encodeURIComponent('JFQVAK9UHT\\adrian_g') + ':' + encodeURIComponent('eQL7|%`e?Owq8TY.4!k?'),
        //     'apiToken': 'e8183eeba24345aab0741506c56a4198',
        //     'server': 'things.eu-1.bosch-iot-suite.com'
        // };
        this.toggle = false;
        this.template = 'home';
        this.init();
        // this.credentials = {};

    }

    link(scope, element) {
        this.initStyles();
    }

    switchTemplate(template) {
        this.toggle = !this.toggle;
        if (template == 'credentials') {
            this.template = 'credentials';
            return;
        }
        if (this.toggle) {
            this.template = 'settings'
        } else {
            this.template = 'home';
        }

    }

    initCredentials() {
        this.credentials = {
            'uri': localStorage.getItem('uri') || '',
            'apiToken': localStorage.getItem('api_token') || '',
            'thingId': localStorage.getItem('thing_id') || '',
            'server': localStorage.getItem('server') || ''
        }
    }

    storeCredentials(username, password, apiToken, thingId, server) {
        let token = encodeURIComponent(username.toString()) + ':' + encodeURIComponent(password.toString());
        localStorage.setItem('uri', token);
        localStorage.setItem('api_token', apiToken);
        localStorage.setItem('thing_id', thingId);
        switch (server) {
            case 'AWS':
                localStorage.setItem('server', 'things.eu-1.bosch-iot-suite.com');
                break;
            case 'BIC':
                localStorage.setItem('server', 'things.s-apps.de1.bosch-iot-cloud.com');
                break;
            default:
                localStorage.setItem('server', 'things.eu-1.bosch-iot-suite.com');
        }
        this.initCredentials();
        this.response = 'Credentials saved';
    }

    init() {
        this.initCredentials();
        if (Object.keys(this.credentials).length === 0) {
            this.response = 'No credentials';
            return;
        }
        this.connect().then((ws) => {
            this.response = 'Connected';
            this.ws = ws;
            this.ws.onmessage = (e) => console.log(e.data)
        }).catch((err) => {
            this.response = 'Connection error';
            console.log(err)

        })
    }

    sendMessage(msg){
        let topic = this.credentials.thingId.split(':');
        let testMsg = {
            "topic": topic[0] + "/" + topic[1] +  "/things/live/messages/message",
            "headers": {
                "content-type": "text/plain",
                "correlation-id": this.credentials.thingId
            },
            "path": "/inbox/messages/message",
            "value": msg
        };
        this.ws.send(JSON.stringify(testMsg));
    }

    connect() {
        let uri = this.credentials.uri;
        let server = this.credentials.server;
        let apiToken = this.credentials.apiToken;
        return new Promise(function (resolve, reject) {
            let ws = new WebSocket('wss://' + uri + '@'
                + server + '/ws/2?x-cr-api-token='
                + apiToken );
            ws.onopen = function () {
                resolve(ws);
            };
            ws.onerror = function (err) {
                reject(err);
            };
        });
    }


    initStyles() {
        window.System.import(this.panelPath + 'css/panel.base.css!');
        // Remove next lines if you don't need separate styles for light and dark themes
        if (grafanaBootData.user.lightTheme) {
            window.System.import(this.panelPath + 'css/panel.light.css!');
        } else {
            window.System.import(this.panelPath + 'css/panel.dark.css!');
        }
        // Remove up to here
    }

    get panelPath() {
        if (this._panelPath === undefined) {
            this._panelPath = `/public/plugins/${this.pluginId}/`;
        }
        return this._panelPath;
    }

}

Ctrl.templateUrl = 'partials/template.html';

export {Ctrl as PanelCtrl}
