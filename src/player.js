import {MODULE_EVENTS} from './module-events.js'

export class EFLPlayer {
    constructor(context){
        this.context = context;

        context.handleMessageProxy = (event) => {
            this.handleMessage(event);
        };

        this.context.addEventListener('message', this.context.handleMessageProxy, false);
        this.moduleLoadedHandler = undefined;
        this.moduleFinishedHandler = undefined;
        this.screenLoadedHandler = undefined;
        this.screenFinishedHandler = undefined;
        this.moduleExceptionHandler = undefined;
    }

    removeListener() {
        this.context.removeEventListener('message', this.context.handleMessageProxy);
    }

    handleMessage(event) {
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
            case MODULE_EVENTS.LOADED_MODULE:
                if (eventData.data) {
                    stepName = eventData.data.stepName;
                }
                this.loadedModule(stepName);
                break;
            case MODULE_EVENTS.LOADED_SCREEN:
                if (eventData.data) {
                    navigation = eventData.data.navigation;
                }
                this.loadedScreen(navigation);
                break;
            case MODULE_EVENTS.FINISHED_SCREEN:
                if (eventData.data) {
                    progress = eventData.data.progress;
                }
                this.finishedScreen(progress);
                break;
            case MODULE_EVENTS.FINISHED_MODULE:
                if (eventData.data) {
                    stepName = eventData.data.stepName;
                    observations = eventData.data.observations;
                }
                this.finishedModule(stepName, observations);
                break;
            case MODULE_EVENTS.CAUGHT_EXCEPTION:
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

    sendPostMessage(type, data) {
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

    init(config) {
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

    loadModule(stepName, url, config) {
        var self = this;
        this.moduleName = name;
        this.moduleInitilized = false;

        if (this.renderer) {
            this.renderer.destroy();
        }

        this.renderer = ePub(url, this.rendererOptions);

        var bookReadyHandler = function () {
            var iframe = document.getElementById(self.target).getElementsByTagName('iframe');
            if (iframe.length > 0) {
                self.moduleWindow = iframe[0].contentWindow;
            }
            self.renderer.off('book:ready', bookReadyHandler);
        };

        var chapterDisplayedHandler = function () {
            if (!self.moduleInitilized) {
                self.sendPostMessage(MODULE_EVENTS.INITIALIZE_MODULE, {stepName: stepName, config: config});
                self.moduleInitilized = true;
            }
            self.renderer.off('renderer:chapterDisplayed', chapterDisplayedHandler);
        };

        this.renderer.on('book:ready', bookReadyHandler);
        this.renderer.on('renderer:chapterDisplayed', chapterDisplayedHandler);

        this.renderer.renderTo(this.target);
    }

    loadedModule(stepName) {
        if (this.moduleLoadedHandler) {
            this.moduleLoadedHandler(stepName);
        }
    }

    loadedScreen(navigation) {
        if (this.screenLoadedHandler) {
            this.screenLoadedHandler(navigation);
        }
    }

    finishedScreen(progress) {
        if (this.screenFinishedHandler) {
            this.screenFinishedHandler(progress);
        }
    }

    finishedModule(stepName, observations) {
        if (this.moduleFinishedHandler) {
            this.moduleFinishedHandler(stepName, observations);
        }
    }

    moduleException(category, message) {
        if (this.moduleExceptionHandler) {
            this.moduleExceptionHandler(category, message);
        }
    }

    nextButtonTapped() {
        this.sendPostMessage(MODULE_EVENTS.PRESSED_NAVIGATION_BUTTON, {button: 'next'})
    }

    backButtonTapped() {
        this.sendPostMessage(MODULE_EVENTS.PRESSED_NAVIGATION_BUTTON, {button: 'back'})
    }

    languageChanged(language) {
        this.sendPostMessage(MODULE_EVENTS.CHANGED_LANGUAGE, {language: language});
    }

    closeModule() {
        if (this.renderer) {
            this.renderer.destroy();
            this.renderer = undefined;
        }
    }
}
