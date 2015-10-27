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
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var JOURNEY_STATE = {
	    LIBRARY_NOT_INITIALIZED: 0,
	    LIBRARY_INITIALIZED: 1,
	    STEP_LOADING: 2,
	    STEP_STARTED: 3,
	    SCREENS_COMPLETED: 4,
	    STEP_SEND_RESULTS: 5,
	    STEP_FINISHED: 6,
	    APPLICATION_FINISHED: 7
	};

	exports.JOURNEY_STATE = JOURNEY_STATE;

	var EFLJourney = (function () {
	    function EFLJourney(context) {
	        _classCallCheck(this, EFLJourney);

	        this.context = context;
	        this.moduleState = JOURNEY_STATE.LIBRARY_NOT_INITIALIZED;
	        this.styleConfig = {
	            fontFamily: 'serif',
	            fontSize: 'medium',
	            backgroundColor: '#2399CC',
	            primaryColor: '#FFFFFF'
	        };
	        this.locales = {
	            'en': {
	                name: 'English'
	            },
	            'es': {
	                name: 'Spanish'
	            }
	        };
	    }

	    /*
	    config = {
	        player: object, // player object - required
	        target: string, // target div id - required
	        encryptorEndpoint: url, // url to encryptor endpoint
	        autoStart: true, // start first module automatically - default true
	        navigation: {
	            display: true, // show navigation bar - default true
	            logo: true, // show logo - default true
	            logoSrc: url, // url to logo file - default efl logo
	            title: true, // show title - default true
	            progressBar: true, // show progress bar - default true
	            localization: true, // show localization picker - default true
	            buttons: true, // show next/back buttons - default true
	        },
	        style: {
	            primaryColor: "#00AFF0", // default #00AFF0
	            secondaryColor: "#9196A0", // default #9196A0
	            fontFamily: "proxima-nova,sans-serif!important", // default "proxima-nova,sans-serif!important"
	            fontSize: 20px, // default 20px
	            buttonsColor: ??
	        },
	        locales: [ // list of supported locales - default English and Spanish
	            {
	                locale: "en_US",
	                name: "English"
	            },
	            {
	                locale: "es_ES",
	                name: "Spanish"
	            }
	        ],
	         }
	    }
	     */

	    _createClass(EFLJourney, [{
	        key: 'init',
	        value: function init(player, target, loginEndpoint, applicantData, styleConfig) {
	            var _this = this;

	            var self = this;
	            this.player = player;
	            this.player.moduleFinishedHandler = function (stepName, observations) {
	                _this.handleObservations(stepName, observations);
	            };
	            this.player.screenFinishedHandler = function (progress) {
	                _this.finishedScreen(progress);
	            };
	            this.player.screenLoadedHandler = function (navigation) {
	                _this.showBackButton = navigation.showBackButton === true;
	                _this.showNextButton = navigation.showNextButton === true;
	                _this.stepHideTitle = navigation.hideTitle === true;
	                _this.stepHideProgress = navigation.hideProgress === true;
	                _this.updateUIState();
	            };
	            this.target = target;
	            this.loginEndpoint = loginEndpoint;
	            this.applicantData = applicantData;
	            this.completedStep = 0;
	            if (styleConfig) {
	                this.setupStyleConfig(styleConfig);
	            }
	            this.setupPlayer(player);
	            this.showTitle = true;
	            this.showProgress = true;

	            var createNavigationPromise = this.createNavigation(this.target);
	            var getModulesPromise = this.getModules(this.loginEndpoint, this.applicantData);
	            Promise.all([createNavigationPromise, getModulesPromise]).then(function (results) {
	                self.modules = results[1].modules;
	                self.steps = results[1].steps;
	                self.firstStep = results[1].firstStep;
	                self.moduleState = JOURNEY_STATE.LIBRARY_INITIALIZED;
	                self.updateUIState();
	            })['catch'](function (error) {
	                console.error('Error: ' + error);
	            });
	        }
	    }, {
	        key: 'createNavigation',
	        value: function createNavigation(target) {
	            var self = this;
	            return new Promise(function (resolve, reject) {
	                var navigation = document.getElementById(target);
	                if (!navigation) {
	                    reject('No element with ' + target + ' id.');
	                }
	                var backButtom = document.createElement('button');
	                backButtom.id = 'efl-back-button';
	                backButtom.onclick = function () {
	                    self.backButtonTapped();
	                };
	                backButtom.innerHTML = 'Back';
	                navigation.appendChild(backButtom);

	                var nextButton = document.createElement('button');
	                nextButton.id = 'efl-next-button';
	                nextButton.onclick = function () {
	                    self.nextButtonTapped();
	                };
	                nextButton.innerHTML = 'Next';
	                navigation.appendChild(nextButton);

	                var progress = document.createElement('div');
	                progress.id = 'efl-progress';
	                progress.style.height = '10px';
	                progress.style.width = '500px';
	                progress.style.backgroundColor = '#DDDDDD';
	                navigation.appendChild(progress);

	                var bar = document.createElement('div');
	                bar.style.height = '100%';
	                bar.style.width = '0';
	                bar.style.backgroundColor = self.styleConfig.backgroundColor;
	                progress.appendChild(bar);

	                var loading = document.createElement('div');
	                loading.id = 'efl-loading';
	                loading.innerHTML = 'Loading...';
	                navigation.appendChild(loading);

	                var locale = document.createElement('select');
	                locale.id = 'efl-locale-select';
	                navigation.appendChild(locale);

	                var keys = self.getSortedLocalesKeys();
	                for (var i = 0; i < keys.length; i++) {
	                    var key = keys[i];
	                    if (self.locales.hasOwnProperty(key)) {
	                        var option = document.createElement('option');
	                        option.value = key;
	                        option.text = self.locales[key].name;
	                        locale.add(option);
	                    }
	                }
	                self.setDefaultLocale();
	                locale.onchange = function () {
	                    self.localePickerChanged();
	                };

	                var title = document.createElement('div');
	                title.id = 'efl-title';
	                navigation.appendChild(title);

	                var playerDiv = document.createElement('div');
	                playerDiv.id = 'efl-player';
	                navigation.appendChild(playerDiv);
	                self.player.target = 'efl-player';

	                self.updateUIState();
	                resolve();
	            });
	        }
	    }, {
	        key: 'getModules',
	        value: function getModules(loginEndpoint, applicantData) {
	            var self = this;
	            return new Promise(function (resolve, reject) {
	                try {
	                    var data = self.fetchModulesData(loginEndpoint, applicantData);
	                    var parsedData = self.parseModulesData(data);
	                    resolve(parsedData);
	                } catch (error) {
	                    reject(error);
	                }
	            });
	        }
	    }, {
	        key: 'backButtonTapped',
	        value: function backButtonTapped() {
	            if (this.moduleState === JOURNEY_STATE.STEP_STARTED) {
	                this.player.backButtonTapped();
	            }
	        }
	    }, {
	        key: 'nextButtonTapped',
	        value: function nextButtonTapped() {
	            if (this.moduleState === JOURNEY_STATE.STEP_STARTED) {
	                this.player.nextButtonTapped();
	            } else if (this.moduleState == JOURNEY_STATE.LIBRARY_INITIALIZED) {
	                this.startNextStep();
	            }
	        }
	    }, {
	        key: 'startNextStep',
	        value: function startNextStep() {
	            var _this2 = this;

	            if (!this.currentStep) {
	                this.currentStep = this.firstStep;
	            } else if (this.steps[this.currentStep].nextStep) {
	                this.currentStep = this.steps[this.currentStep].nextStep;
	            } else {
	                console.warn('No next step');
	                return;
	            }

	            var step = this.steps[this.currentStep];
	            var module = this.modules[step.module];
	            this.moduleState = JOURNEY_STATE.STEP_LOADING;
	            this.setTitle(step.title);
	            this.updateUIState();

	            this.player.moduleLoadedHandler = function () {
	                _this2.player.moduleLoadedHandler = undefined;
	                _this2.moduleState = JOURNEY_STATE.STEP_STARTED;
	                _this2.updateUIState();
	            };

	            this.stepTimer = Date.now();
	            this.player.loadModule(this.currentStep, module.uri, module.config);
	        }
	    }, {
	        key: 'finishedScreen',
	        value: function finishedScreen(progress) {
	            if (progress < 0) {
	                progress = 0;
	            }
	            if (progress > 100) {
	                progress = 100;
	            }
	            var stepPart = 100.0 / Object.keys(this.steps).length;
	            var bar = document.getElementById('efl-progress').firstElementChild;
	            bar.style.width = stepPart * (this.completedStep + progress / 100.0) + '%';

	            if (progress === 100) {
	                if (this.moduleState === JOURNEY_STATE.STEP_SEND_RESULTS) {
	                    this.finishedModule();
	                } else {
	                    this.moduleState = JOURNEY_STATE.SCREENS_COMPLETED;
	                    this.updateUIState();
	                }
	            }
	        }
	    }, {
	        key: 'handleObservations',
	        value: function handleObservations(stepName, observations) {
	            var timeElapsed = Math.floor((Date.now() - this.stepTimer) / 1000);
	            this.sendObservations(stepName, this.completedStep, observations, { timeElapsed: timeElapsed });
	            this.completedStep++;

	            if (this.moduleState === JOURNEY_STATE.SCREENS_COMPLETED) {
	                this.finishedModule();
	            } else {
	                this.moduleState = JOURNEY_STATE.STEP_SEND_RESULTS;
	            }
	        }
	    }, {
	        key: 'finishedModule',
	        value: function finishedModule() {
	            if (this.steps[this.currentStep].nextStep) {
	                this.moduleState = JOURNEY_STATE.STEP_FINISHED;
	                this.startNextStep();
	            } else {
	                this.player.closeModule();
	                this.moduleState = JOURNEY_STATE.APPLICATION_FINISHED;
	                this.sendFinishedApplication();
	                var container = document.getElementById(this.target);
	                var div = document.createElement('div');
	                div.innerHTML = 'Finished application';
	                container.appendChild(div);
	                this.updateUIState();
	            }
	        }
	    }, {
	        key: 'moduleException',
	        value: function moduleException(category, message) {
	            console.error(category + ' error: ' + message);
	        }
	    }, {
	        key: 'setupPlayer',
	        value: function setupPlayer(player) {
	            player.moduleExceptionHandler = this.moduleException;
	        }
	    }, {
	        key: 'updateUIState',
	        value: function updateUIState() {
	            var state = this.moduleState;
	            var isloading = state === JOURNEY_STATE.LIBRARY_NOT_INITIALIZED || state === JOURNEY_STATE.STEP_LOADING || state === JOURNEY_STATE.SCREENS_COMPLETED;
	            var nextButtonVisible = state === JOURNEY_STATE.LIBRARY_INITIALIZED || state == JOURNEY_STATE.STEP_STARTED && this.showNextButton;
	            var backButtonVisible = state == JOURNEY_STATE.STEP_STARTED && this.showBackButton;
	            var titleVisible = (state === JOURNEY_STATE.STEP_STARTED || state === JOURNEY_STATE.SCREENS_COMPLETED || state === JOURNEY_STATE.STEP_SEND_RESULTS) && this.showTitle && !this.stepHideTitle;
	            var progressVisible = this.showProgress && !this.stepHideProgress;

	            var loading = document.getElementById('efl-loading');
	            loading.style.display = isloading ? 'block' : 'none';
	            var nextButton = document.getElementById('efl-next-button');
	            nextButton.style.display = nextButtonVisible ? 'block' : 'none';
	            var backButton = document.getElementById('efl-back-button');
	            backButton.style.display = backButtonVisible ? 'block' : 'none';
	            var title = document.getElementById('efl-title');
	            title.style.display = titleVisible ? 'block' : 'none';
	            var progress = document.getElementById('efl-progress');
	            progress.style.display = progressVisible ? 'block' : 'none';
	        }
	    }, {
	        key: 'setupStyleConfig',
	        value: function setupStyleConfig(styleConfig) {
	            if (styleConfig.fontFamily) {
	                // TODO Validate font family
	                this.styleConfig.fontFamily = styleConfig.fontFamily;
	            }

	            if (styleConfig.fontSize) {
	                if (styleConfig.fontSize === 'small' || styleConfig.fontSize === 'medium' || styleConfig.fontSize === 'large') {
	                    this.styleConfig.fontSize = styleConfig.fontSize;
	                } else {
	                    console.warn('Font size must have value: small, medium or large.');
	                }
	            }

	            if (styleConfig.backgroundColor) {
	                this.styleConfig.backgroundColor = styleConfig.backgroundColor;
	            }

	            if (styleConfig.primaryColor) {
	                this.styleConfig.primaryColor = styleConfig.primaryColor;
	            }
	        }
	    }, {
	        key: 'fetchModulesData',
	        value: function fetchModulesData(loginEndpoint, applicantData) {
	            //TODO: Implement
	            return {
	                modules: {
	                    module1: {
	                        type: 'web',
	                        uri: 'epub/test_epub.epub',
	                        config: { lang: 'en' }
	                    },
	                    module2: {
	                        type: 'web',
	                        uri: 'epub/test_epub_2.epub',
	                        config: { lang: 'de' }
	                    }
	                },
	                steps: {
	                    step1: {
	                        title: 'Introduction',
	                        image: '',
	                        module: 'module1',
	                        isRoot: true,
	                        links: [{
	                            type: 'next',
	                            target: 'step2',
	                            params: {}
	                        }]
	                    },
	                    step2: {
	                        title: 'Last step',
	                        image: '',
	                        module: 'module2',
	                        isRoot: false,
	                        links: []
	                    }
	                }
	            };
	        }
	    }, {
	        key: 'sendObservations',
	        value: function sendObservations(stepName, sequence, observations, metas) {
	            //TODO: Implement
	        }
	    }, {
	        key: 'sendFinishedApplication',
	        value: function sendFinishedApplication() {
	            //TODO: Implement
	        }
	    }, {
	        key: 'parseModulesData',
	        value: function parseModulesData(data) {
	            var modules = data.modules;
	            var steps = {};
	            var firstStep;

	            for (var stepName in data.steps) {
	                if (data.steps.hasOwnProperty(stepName)) {
	                    var step = {
	                        title: data.steps[stepName].title,
	                        module: data.steps[stepName].module
	                    };
	                    var links = data.steps[stepName].links;
	                    for (var i = 0; i < links.length; i++) {
	                        var link = links[i];
	                        if (link.type === 'next') {
	                            step.nextStep = link.target;
	                        }
	                    }
	                    steps[stepName] = step;

	                    if (data.steps[stepName].isRoot === true) {
	                        firstStep = stepName;
	                    }
	                }
	            }

	            return { modules: modules, steps: steps, firstStep: firstStep };
	        }
	    }, {
	        key: 'setDefaultLocale',
	        value: function setDefaultLocale() {
	            this.currentLocale = 'en';

	            var keys = this.getSortedLocalesKeys();
	            for (var i = 0; i < keys.length; i++) {
	                if (this.currentLocale === keys[i]) {
	                    document.getElementById('efl-locale-select').value = this.currentLocale;
	                    break;
	                }
	            }
	        }
	    }, {
	        key: 'getSortedLocalesKeys',
	        value: function getSortedLocalesKeys() {
	            var self = this;
	            var keys = Object.keys(this.locales);
	            keys.sort(function (a, b) {
	                if (self.locales.hasOwnProperty(a) && self.locales.hasOwnProperty(b)) {
	                    var nameA = self.locales[a].name;
	                    var nameB = self.locales[b].name;
	                    if (nameA < nameB) {
	                        return -1;
	                    } else if (nameA > nameB) {
	                        return 1;
	                    }
	                }
	                return 0;
	            });
	            return keys;
	        }
	    }, {
	        key: 'localePickerChanged',
	        value: function localePickerChanged() {
	            var selectedValue = document.getElementById('efl-locale-select').value;
	            this.player.languageChanged(selectedValue);
	        }
	    }, {
	        key: 'setTitle',
	        value: function setTitle(title) {
	            document.getElementById('efl-title').innerHTML = title;
	        }
	    }]);

	    return EFLJourney;
	})();

	exports.EFLJourney = EFLJourney;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _journeyJs = __webpack_require__(1);

	window.EFLJourney = new _journeyJs.EFLJourney(window);

/***/ }
/******/ ]);