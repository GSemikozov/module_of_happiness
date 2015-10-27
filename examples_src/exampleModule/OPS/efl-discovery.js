/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(3);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _moduleEventsJs = __webpack_require__(2);

	var EFLDiscoveryModule = (function () {
	    function EFLDiscoveryModule(context) {
	        var _this = this;

	        _classCallCheck(this, EFLDiscoveryModule);

	        this.context = context;

	        context.handleMessageProxy = function (event) {
	            _this.handleMessage(event);
	        };

	        this.context.addEventListener('message', this.context.handleMessageProxy, false);
	        this.pendingEvents = [];
	    }

	    _createClass(EFLDiscoveryModule, [{
	        key: 'removeListener',
	        value: function removeListener() {
	            this.context.removeEventListener('message', this.context.handleMessageProxy);
	        }
	    }, {
	        key: 'handleMessage',
	        value: function handleMessage(event) {
	            if (event.origin !== document.location.origin) {
	                return;
	            }
	            var eventData = JSON.parse(event.data);
	            var stepName;
	            var config;
	            var lang;
	            switch (eventData.type) {
	                case _moduleEventsJs.MODULE_EVENTS.INITIALIZE_MODULE:
	                    if (eventData.data) {
	                        stepName = eventData.data.stepName;
	                        config = eventData.data.config;
	                    }
	                    this.initializeModule(event.source, stepName, config);
	                    break;
	                case _moduleEventsJs.MODULE_EVENTS.PRESSED_NAVIGATION_BUTTON:
	                    if (eventData.data.button === 'back' && this.backButtonHandler) {
	                        this.backButtonHandler();
	                    } else if (eventData.data.button === 'next' && this.nextButtonHandler) {
	                        this.nextButtonHandler();
	                    }
	                    break;
	                case _moduleEventsJs.MODULE_EVENTS.CHANGED_LANGUAGE:
	                    if (eventData.data) {
	                        lang = eventData.data.language;
	                    }
	                    if (this.changedLanguageHandler) {
	                        this.changedLanguageHandler(lang);
	                    }
	                    break;
	                default:
	                    break;
	            }
	        }
	    }, {
	        key: 'init',
	        value: function init(config) {
	            if (config instanceof Object) {
	                this.initModuleHandler = config.initModuleHandler;
	                this.backButtonHandler = config.backButtonHandler;
	                this.nextButtonHandler = config.nextButtonHandler;
	                this.changedLanguageHandler = config.changedLanguageHandler;
	            }
	        }
	    }, {
	        key: 'initializeModule',
	        value: function initializeModule(eventSource, stepName, config) {
	            if (eventSource !== undefined) {
	                this.eventsDestination = eventSource;
	                this.stepName = stepName;
	                for (var i = 0; i < this.pendingEvents.length; i++) {
	                    var eventData = this.pendingEvents[i];
	                    this.eventsDestination.postMessage(JSON.stringify(eventData), document.location.origin);
	                }
	                this.pendingEvents = [];
	            }
	            if (this.initModuleHandler) {
	                this.initModuleHandler(stepName, config);
	            }
	        }
	    }, {
	        key: 'sendPostMessage',
	        value: function sendPostMessage(type, data) {
	            var eventData;
	            if (type !== undefined) {
	                eventData = {
	                    type: type
	                };
	                if (data !== undefined) {
	                    eventData.data = data;
	                }
	            }

	            if (this.eventsDestination !== undefined) {
	                this.eventsDestination.postMessage(JSON.stringify(eventData), document.location.origin);
	            } else {
	                this.pendingEvents.push(eventData);
	            }
	        }
	    }, {
	        key: 'loadedModule',
	        value: function loadedModule() {
	            this.sendPostMessage(_moduleEventsJs.MODULE_EVENTS.LOADED_MODULE, { stepName: this.stepName });
	        }
	    }, {
	        key: 'finishedModule',
	        value: function finishedModule(observations) {
	            var data = {
	                'stepName': this.stepName
	            };
	            if (observations) {
	                data.observations = observations;
	            }
	            this.sendPostMessage(_moduleEventsJs.MODULE_EVENTS.FINISHED_MODULE, data);
	        }
	    }, {
	        key: 'loadedScreen',
	        value: function loadedScreen(navigation) {
	            var value = {};
	            if (navigation) {
	                if (navigation.showNextButton === true) {
	                    value.showNextButton = true;
	                }
	                if (navigation.showBackButton === true) {
	                    value.showBackButton = true;
	                }
	                if (navigation.hideTitle === true) {
	                    value.hideTitle = true;
	                }
	                if (navigation.hideProgress === true) {
	                    value.hideProgress = true;
	                }
	            }
	            this.sendPostMessage(_moduleEventsJs.MODULE_EVENTS.LOADED_SCREEN, { 'navigation': value });
	        }
	    }, {
	        key: 'finishedScreen',
	        value: function finishedScreen(progress) {
	            this.sendPostMessage(_moduleEventsJs.MODULE_EVENTS.FINISHED_SCREEN, { 'progress': progress });
	        }
	    }, {
	        key: 'caughtException',
	        value: function caughtException(category, message) {
	            var data = {};
	            if (category) {
	                data.category = category;
	            }
	            if (message) {
	                data.message = message;
	            }
	            this.sendPostMessage(_moduleEventsJs.MODULE_EVENTS.CAUGHT_EXCEPTION, data);
	        }
	    }]);

	    return EFLDiscoveryModule;
	})();

	exports.EFLDiscoveryModule = EFLDiscoveryModule;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	var MODULE_EVENTS = {
	    INITIALIZE_MODULE: 'initializeModule',
	    PRESSED_NAVIGATION_BUTTON: 'pressedNavigationButton',
	    LOADED_MODULE: 'loadedModule',
	    LOADED_SCREEN: 'loadedScreen',
	    FINISHED_SCREEN: 'finishedScreen',
	    FINISHED_MODULE: 'finishedModule',
	    CAUGHT_EXCEPTION: 'caughtException',
	    CHANGED_LANGUAGE: 'changedLanguage'
	};
	exports.MODULE_EVENTS = MODULE_EVENTS;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _discoveryJs = __webpack_require__(1);

	window.EFLDiscoveryModule = new _discoveryJs.EFLDiscoveryModule(window);

/***/ }
/******/ ]);