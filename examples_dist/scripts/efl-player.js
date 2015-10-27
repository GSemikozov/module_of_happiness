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
	__webpack_require__(2);
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _moduleEventsJs = __webpack_require__(1);

	var EFLPlayer = (function () {
	    function EFLPlayer(context) {
	        var _this = this;

	        _classCallCheck(this, EFLPlayer);

	        this.context = context;

	        context.handleMessageProxy = function (event) {
	            _this.handleMessage(event);
	        };

	        this.context.addEventListener('message', this.context.handleMessageProxy, false);
	        this.moduleLoadedHandler = undefined;
	        this.moduleFinishedHandler = undefined;
	        this.screenLoadedHandler = undefined;
	        this.screenFinishedHandler = undefined;
	        this.moduleExceptionHandler = undefined;
	    }

	    _createClass(EFLPlayer, [{
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
	            var navigation;
	            var progress;
	            var stepName;
	            var observations;
	            var category;
	            var message;
	            switch (eventData.type) {
	                case _moduleEventsJs.MODULE_EVENTS.LOADED_MODULE:
	                    if (eventData.data) {
	                        stepName = eventData.data.stepName;
	                    }
	                    this.loadedModule(stepName);
	                    break;
	                case _moduleEventsJs.MODULE_EVENTS.LOADED_SCREEN:
	                    if (eventData.data) {
	                        navigation = eventData.data.navigation;
	                    }
	                    this.loadedScreen(navigation);
	                    break;
	                case _moduleEventsJs.MODULE_EVENTS.FINISHED_SCREEN:
	                    if (eventData.data) {
	                        progress = eventData.data.progress;
	                    }
	                    this.finishedScreen(progress);
	                    break;
	                case _moduleEventsJs.MODULE_EVENTS.FINISHED_MODULE:
	                    if (eventData.data) {
	                        stepName = eventData.data.stepName;
	                        observations = eventData.data.observations;
	                    }
	                    this.finishedModule(stepName, observations);
	                    break;
	                case _moduleEventsJs.MODULE_EVENTS.CAUGHT_EXCEPTION:
	                    if (eventData.data) {
	                        category = eventData.data.category;
	                        message = eventData.data.message;
	                    }
	                    this.moduleException(category, message);
	                    break;
	                default:
	                    break;
	            }
	        }
	    }, {
	        key: 'sendPostMessage',
	        value: function sendPostMessage(type, data) {
	            if (this.moduleWindow !== undefined && type !== undefined) {
	                var eventData = {
	                    type: type
	                };
	                if (data !== undefined) {
	                    eventData.data = data;
	                }
	                this.moduleWindow.postMessage(JSON.stringify(eventData), document.location.origin);
	            }
	        }
	    }, {
	        key: 'init',
	        value: function init(config) {
	            var options = {};
	            if (config.width) {
	                options.width = config.width;
	            }
	            if (config.height) {
	                options.height = config.height;
	            }
	            if (config.target) {
	                this.target = config.target;
	            }
	            this.rendererOptions = options;
	        }
	    }, {
	        key: 'loadModule',
	        value: function loadModule(stepName, url, config) {
	            var self = this;
	            this.moduleName = name;
	            this.moduleInitilized = false;

	            if (this.renderer) {
	                this.renderer.destroy();
	            }

	            this.renderer = ePub(url, this.rendererOptions);

	            var bookReadyHandler = function bookReadyHandler() {
	                var iframe = document.getElementById(self.target).getElementsByTagName('iframe');
	                if (iframe.length > 0) {
	                    self.moduleWindow = iframe[0].contentWindow;
	                }
	                self.renderer.off('book:ready', bookReadyHandler);
	            };

	            var chapterDisplayedHandler = function chapterDisplayedHandler() {
	                if (!self.moduleInitilized) {
	                    self.sendPostMessage(_moduleEventsJs.MODULE_EVENTS.INITIALIZE_MODULE, { stepName: stepName, config: config });
	                    self.moduleInitilized = true;
	                }
	                self.renderer.off('renderer:chapterDisplayed', chapterDisplayedHandler);
	            };

	            this.renderer.on('book:ready', bookReadyHandler);
	            this.renderer.on('renderer:chapterDisplayed', chapterDisplayedHandler);

	            this.renderer.renderTo(this.target);
	        }
	    }, {
	        key: 'loadedModule',
	        value: function loadedModule(stepName) {
	            if (this.moduleLoadedHandler) {
	                this.moduleLoadedHandler(stepName);
	            }
	        }
	    }, {
	        key: 'loadedScreen',
	        value: function loadedScreen(navigation) {
	            if (this.screenLoadedHandler) {
	                this.screenLoadedHandler(navigation);
	            }
	        }
	    }, {
	        key: 'finishedScreen',
	        value: function finishedScreen(progress) {
	            if (this.screenFinishedHandler) {
	                this.screenFinishedHandler(progress);
	            }
	        }
	    }, {
	        key: 'finishedModule',
	        value: function finishedModule(stepName, observations) {
	            if (this.moduleFinishedHandler) {
	                this.moduleFinishedHandler(stepName, observations);
	            }
	        }
	    }, {
	        key: 'moduleException',
	        value: function moduleException(category, message) {
	            if (this.moduleExceptionHandler) {
	                this.moduleExceptionHandler(category, message);
	            }
	        }
	    }, {
	        key: 'nextButtonTapped',
	        value: function nextButtonTapped() {
	            this.sendPostMessage(_moduleEventsJs.MODULE_EVENTS.PRESSED_NAVIGATION_BUTTON, { button: 'next' });
	        }
	    }, {
	        key: 'backButtonTapped',
	        value: function backButtonTapped() {
	            this.sendPostMessage(_moduleEventsJs.MODULE_EVENTS.PRESSED_NAVIGATION_BUTTON, { button: 'back' });
	        }
	    }, {
	        key: 'languageChanged',
	        value: function languageChanged(language) {
	            this.sendPostMessage(_moduleEventsJs.MODULE_EVENTS.CHANGED_LANGUAGE, { language: language });
	        }
	    }, {
	        key: 'closeModule',
	        value: function closeModule() {
	            if (this.renderer) {
	                this.renderer.destroy();
	                this.renderer = undefined;
	            }
	        }
	    }]);

	    return EFLPlayer;
	})();

	exports.EFLPlayer = EFLPlayer;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _playerJs = __webpack_require__(2);

	window.EFLPlayer = new _playerJs.EFLPlayer(window);

/***/ }
/******/ ]);