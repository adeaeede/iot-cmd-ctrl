import {PanelCtrl} from 'grafana/app/plugins/sdk'; // will be resolved to app/plugins/sdk

import './css/panel.base.scss';
// Remove next imports if you don't need separate styles for light and dark themes
import './css/panel.dark.scss';
import './css/panel.light.scss';

// Remove up to here

class Ctrl extends PanelCtrl {

    constructor($scope, $injector) {
        super($scope, $injector);
        this.response = '';
        this.toggle = false;
        this.template = 'home';
        this.credentials = new Object();
        this.currentState = new Object()
        this.init();

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
        };
    }

    testConnection() {
        this.currentState.isTesting = true;
        this.initWebsocket();
        this.currentState.isTesting = false;
    }

    storeCredentials(username, password, apiToken, thingId, server) {
        try {
            var token = encodeURIComponent(username.toString()) + ':' + encodeURIComponent(password.toString());

        } catch (e) {
            console.log(e)
        }
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
        this.currentState.isStored = true;
        this.response = 'Credentials stored';
        this.testConnection();
    }

    checkCredentials() {
        Object.keys(this.credentials).forEach(k => {
            if (this.credentials[k] == "") {
                return false;
            }
        });
        return true;
    }

    showMessageStatus(msg) {
        let data = JSON.parse(msg.data);
        if (data.status == 200) {
            this.currentState.messageStatus = data.value;
        } else {
            this.currentState.messageStatus = data.value.message;
        }
        setTimeout(() => this.currentState.messageStatus = "", 1000);
        this.$scope.$apply();
    }

    initWebsocket() {
        this.connect().then((ws) => {
            this.currentState.isConnected = true;
            this.$scope.$apply();
            this.ws = ws;
            this.ws.onmessage = (e) => this.showMessageStatus(e);
        }).catch((err) => {
            this.response = 'Could not initialize connection.';
            this.currentState.isConnected = false;
            console.log(err)
        })
    }

    init() {
        this.currentState = {
            "isStored": false,
            "isTesting": false,
            "isConnected": false,
            "isInitialized": false,
            "messageStatus": ""
        };
        this.initCredentials();
        if (this.checkCredentials()) {
            this.initWebsocket()
        } else {
            this.response = 'Credentials missing or corrupted.';
        }
        this.currentState.isInitialized = true;
    }

    sendMessage(msg) {
        let topic = this.credentials.thingId.split(':');
        let testMsg = {
            "topic": topic[0] + "/" + topic[1] + "/things/live/messages/message",
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
                + apiToken);
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
