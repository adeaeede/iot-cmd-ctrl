define(["app/plugins/sdk"], function(__WEBPACK_EXTERNAL_MODULE_1__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PanelCtrl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdk = __webpack_require__(1);

__webpack_require__(2);

__webpack_require__(3);

__webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // will be resolved to app/plugins/sdk

// Remove next imports if you don't need separate styles for light and dark themes


// Remove up to here

var Ctrl = function (_PanelCtrl) {
    _inherits(Ctrl, _PanelCtrl);

    function Ctrl($scope, $injector) {
        _classCallCheck(this, Ctrl);

        var _this = _possibleConstructorReturn(this, (Ctrl.__proto__ || Object.getPrototypeOf(Ctrl)).call(this, $scope, $injector));

        _this.response = '';
        _this.toggle = false;
        _this.template = 'home';
        _this.credentials = new Object();
        _this.currentState = new Object();
        _this.init();

        return _this;
    }

    _createClass(Ctrl, [{
        key: 'link',
        value: function link(scope, element) {
            this.initStyles();
        }
    }, {
        key: 'switchTemplate',
        value: function switchTemplate(template) {
            this.toggle = !this.toggle;
            if (template == 'credentials') {
                this.template = 'credentials';
                return;
            }
            if (this.toggle) {
                this.template = 'settings';
            } else {
                this.template = 'home';
            }
        }
    }, {
        key: 'initCredentials',
        value: function initCredentials() {
            this.credentials = {
                'uri': localStorage.getItem('uri') || '',
                'apiToken': localStorage.getItem('api_token') || '',
                'thingId': localStorage.getItem('thing_id') || '',
                'server': localStorage.getItem('server') || ''
            };
        }
    }, {
        key: 'testConnection',
        value: function testConnection() {
            this.currentState.isTesting = true;
            this.initWebsocket();
            this.currentState.isTesting = false;
        }
    }, {
        key: 'storeCredentials',
        value: function storeCredentials(username, password, apiToken, thingId, server) {
            try {
                var token = encodeURIComponent(username.toString()) + ':' + encodeURIComponent(password.toString());
            } catch (e) {
                console.log(e);
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
    }, {
        key: 'checkCredentials',
        value: function checkCredentials() {
            var _this2 = this;

            Object.keys(this.credentials).forEach(function (k) {
                if (_this2.credentials[k] == "") {
                    return false;
                }
            });
            return true;
        }
    }, {
        key: 'showMessageStatus',
        value: function showMessageStatus(msg) {
            var _this3 = this;

            var data = JSON.parse(msg.data);
            if (data.status == 200) {
                this.currentState.messageStatus = data.value;
            } else {
                this.currentState.messageStatus = data.value.message;
            }
            setTimeout(function () {
                return _this3.currentState.messageStatus = "";
            }, 1000);
            this.$scope.$apply();
        }
    }, {
        key: 'initWebsocket',
        value: function initWebsocket() {
            var _this4 = this;

            this.connect().then(function (ws) {
                _this4.currentState.isConnected = true;
                _this4.$scope.$apply();
                _this4.ws = ws;
                _this4.ws.onmessage = function (e) {
                    return _this4.showMessageStatus(e);
                };
            }).catch(function (err) {
                _this4.response = 'Could not initialize connection.';
                _this4.currentState.isConnected = false;
                console.log(err);
            });
        }
    }, {
        key: 'init',
        value: function init() {
            this.currentState = {
                "isStored": false,
                "isTesting": false,
                "isConnected": false,
                "isInitialized": false,
                "messageStatus": ""
            };
            this.initCredentials();
            if (this.checkCredentials()) {
                this.initWebsocket();
            } else {
                this.response = 'Credentials missing or corrupted.';
            }
            this.currentState.isInitialized = true;
        }
    }, {
        key: 'sendMessage',
        value: function sendMessage(msg) {
            var topic = this.credentials.thingId.split(':');
            var testMsg = {
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
    }, {
        key: 'connect',
        value: function connect() {
            var uri = this.credentials.uri;
            var server = this.credentials.server;
            var apiToken = this.credentials.apiToken;
            return new Promise(function (resolve, reject) {
                var ws = new WebSocket('wss://' + uri + '@' + server + '/ws/2?x-cr-api-token=' + apiToken);
                ws.onopen = function () {
                    resolve(ws);
                };
                ws.onerror = function (err) {
                    reject(err);
                };
            });
        }
    }, {
        key: 'initStyles',
        value: function initStyles() {
            window.System.import(this.panelPath + 'css/panel.base.css!');
            // Remove next lines if you don't need separate styles for light and dark themes
            if (grafanaBootData.user.lightTheme) {
                window.System.import(this.panelPath + 'css/panel.light.css!');
            } else {
                window.System.import(this.panelPath + 'css/panel.dark.css!');
            }
            // Remove up to here
        }
    }, {
        key: 'panelPath',
        get: function get() {
            if (this._panelPath === undefined) {
                this._panelPath = '/public/plugins/' + this.pluginId + '/';
            }
            return this._panelPath;
        }
    }]);

    return Ctrl;
}(_sdk.PanelCtrl);

Ctrl.templateUrl = 'partials/template.html';

exports.PanelCtrl = Ctrl;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ])});;
//# sourceMappingURL=module.js.map