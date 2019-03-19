import {PanelCtrl} from 'grafana/app/plugins/sdk'; // will be resolved to app/plugins/sdk

import './css/panel.base.scss';
// Remove next imports if you don't need separate styles for light and dark themes
import './css/panel.dark.scss';
import './css/panel.light.scss';

// Remove up to here

class Ctrl extends PanelCtrl {

    constructor($scope, $injector) {
        super($scope, $injector);
        this.credentials = {
            'thingId': 'my.things:mything',
            'b64': btoa('JFQVAK9UHT\\adrian_g:eQL7|%`e?Owq8TY.4!k?'),
            'apiToken': 'e8183eeba24345aab0741506c56a4198'
        }
        console.log(this.credentials)

        this.toggle = false;
        this.template = 'home';
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
            'b64': localStorage.getItem('basic64') || '',
            'apiToken': localStorage.getItem('api_token') || '',
            'thingId': localStorage.getItem('thing_id') || ''
        }
    }

    storeCredentials(username, password, apiToken, thingId) {
        let token = username.toString() + ':' + password.toString();
        let b64 = btoa(token);
        localStorage.setItem('basic64', b64);
        localStorage.setItem('api_token', apiToken);
        localStorage.setItem('thing_id', thingId);
        this.initCredentials();
        this.response = 'Credentials saved';
    }

    sendMessage(msg) {
        let b64 = this.credentials.b64;
        let thingId = this.credentials.thingId;
        let apiToken = this.credentials.apiToken;
        let message = msg;
        let subject = 'message';
        let url = 'https://things.eu-1.bosch-iot-suite.com/api/2/things/' + thingId +
            '/inbox/messages/' + subject + '?timeout=0';
        let headers = {
                'Accept': 'application/json',
                'x-cr-api-token': apiToken,
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + b64
            }

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: JSON.stringify(message)
        }).then((response) => {console.log(response)});

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
