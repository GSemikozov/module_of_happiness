import {MODULE_EVENTS} from './module-events.js'

export class EFLDiscoveryModule {
    constructor(context) {
        this.context = context;

        context.handleMessageProxy = (event) => {
            this.handleMessage(event);
        };

        this.context.addEventListener('message', this.context.handleMessageProxy, false);
        this.pendingEvents = [];
    }

    removeListener() {
        this.context.removeEventListener('message', this.context.handleMessageProxy);
    }

    handleMessage(event) {
        if (event.origin !== document.location.origin) {
            return;
        }
        var eventData = JSON.parse(event.data);
        var stepName;
        var config;
        var lang;
        switch (eventData.type) {
            case MODULE_EVENTS.INITIALIZE_MODULE:
                if (eventData.data) {
                    stepName = eventData.data.stepName;
                    config = eventData.data.config;
                }
                this.initializeModule(event.source, stepName, config);
                break;
            case MODULE_EVENTS.PRESSED_NAVIGATION_BUTTON:
                if (eventData.data.button === 'back' && this.backButtonHandler) {
                    this.backButtonHandler();
                }
                else if (eventData.data.button === 'next' && this.nextButtonHandler) {
                    this.nextButtonHandler();
                }
                break;
            case MODULE_EVENTS.CHANGED_LANGUAGE:
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

	init(config) {
        if (config instanceof Object) {
            this.initModuleHandler = config.initModuleHandler;
            this.backButtonHandler = config.backButtonHandler;
            this.nextButtonHandler = config.nextButtonHandler;
            this.changedLanguageHandler = config.changedLanguageHandler;
        }
    }

    initializeModule(eventSource, stepName, config) {
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

    sendPostMessage(type, data) {
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
        }
        else {
            this.pendingEvents.push(eventData);
        }
    }

    loadedModule() {
        this.sendPostMessage(MODULE_EVENTS.LOADED_MODULE, { stepName: this.stepName });
    }

    finishedModule(observations) {
        var data = {
            'stepName': this.stepName
        };
        if (observations) {
            data.observations = observations;
        }
        this.sendPostMessage(MODULE_EVENTS.FINISHED_MODULE, data);
    }

    loadedScreen(navigation) {
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
        this.sendPostMessage(MODULE_EVENTS.LOADED_SCREEN, {'navigation': value});
    }

    finishedScreen(progress) {
        this.sendPostMessage(MODULE_EVENTS.FINISHED_SCREEN, {'progress': progress});
    }

    caughtException(category, message) {
        var data = {};
        if (category) {
            data.category = category;
        }
        if (message) {
            data.message = message;
        }
        this.sendPostMessage(MODULE_EVENTS.CAUGHT_EXCEPTION, data);
    }
}
