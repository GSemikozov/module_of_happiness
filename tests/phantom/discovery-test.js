describe('discovery module tests:', function () {
    before(function () {
        loadDiscoveryModule(window);
    });

    after(function () {
        unloadDiscoveryModule(window);
    });

    beforeEach(function() {
        var iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
    });

    afterEach(function() {
        var iframe = document.getElementsByTagName('iframe')[0];
        document.body.removeChild(iframe);
        window.EFLDiscoveryModule.eventsDestination = undefined;
        window.EFLDiscoveryModule.pendingEvents = [];
        window.EFLDiscoveryModule.initModuleHandler = undefined;
        window.EFLDiscoveryModule.nextButtonHandler = undefined;
        window.EFLDiscoveryModule.backButtonHandler = undefined;
        window.EFLDiscoveryModule.stepName = undefined;
    });

    it('module loaded', function () {
        expect(window.EFLDiscoveryModule).to.exist;
    });

    describe('init', function () {
        it('has init method', function () {
            expect(window.EFLDiscoveryModule).to.respondTo('init');
        });

        it('can setup handlers', function () {
            var initModuleHandler = function () {};
            var nextModuleHandler = function () {};
            var backModuleHandler = function () {};
            var changedLanguageHandler = function () {};

            window.EFLDiscoveryModule.init({
                'initModuleHandler': initModuleHandler,
                'nextButtonHandler': nextModuleHandler,
                'backButtonHandler': backModuleHandler,
                'changedLanguageHandler': changedLanguageHandler
            });
            expect(window.EFLDiscoveryModule.initModuleHandler).to.be.equal(initModuleHandler);
            expect(window.EFLDiscoveryModule.nextButtonHandler).to.be.equal(nextModuleHandler);
            expect(window.EFLDiscoveryModule.backButtonHandler).to.be.equal(backModuleHandler);
            expect(window.EFLDiscoveryModule.changedLanguageHandler).to.be.equal(changedLanguageHandler);
        });
    });

    describe('initializing module:', function () {
        it('has initializeModule method', function () {
            expect(window.EFLDiscoveryModule).to.respondTo('initializeModule');
        });

        it('call initialize module method after initialize module event', function (done) {
            var discoveryModule = window.EFLDiscoveryModule;
            var origMethod = discoveryModule.initializeModule;
            discoveryModule.initializeModule = chai.spy(discoveryModule.initializeModule);
            var initHandlerSpy = chai.spy();
            window.EFLDiscoveryModule.init({
                'initModuleHandler': initHandlerSpy
            });

            var eventData = {
                type: MODULE_EVENTS.INITIALIZE_MODULE,
                data: {
                    stepName: 'test',
                    config: {
                        key: 'value'
                    }
                }
            };
            window.postMessage(JSON.stringify(eventData), document.location.origin);

            setTimeout(function () {
                var spy = discoveryModule.initializeModule;
                discoveryModule.initializeModule = origMethod;

                expect(spy).to.have.been.called();
                expect(initHandlerSpy).to.have.been.called.with(eventData.data.stepName, eventData.data.config);
                expect(discoveryModule.stepName).to.be.equal('test');
                expect(discoveryModule.eventsDestination).to.be.equal(window);
                done();
            }, 10);
        });
    });

    describe('loaded module:', function () {
        it('has loadedModule method', function () {
            expect(window.EFLDiscoveryModule).to.respondTo('loadedModule');
        });

        it('send post message after loadedModule call', function (done) {
            var eventData;
            var messageHandler = function (event) {
                eventData = JSON.parse(event.data);
            };
            var spy = chai.spy(messageHandler);

            var iframe = document.getElementsByTagName('iframe')[0];
            iframe.contentWindow.addEventListener('message', spy);

            window.EFLDiscoveryModule.stepName = 'step';
            window.EFLDiscoveryModule.eventsDestination = iframe.contentWindow;
            window.EFLDiscoveryModule.loadedModule();

            setTimeout(function () {
                expect(spy).to.have.been.called();
                expect(eventData.type).to.be.equal(MODULE_EVENTS.LOADED_MODULE);
                expect(eventData.data.stepName).to.be.equal('step');
                iframe.contentWindow.removeEventListener('message', spy);
                done();
            }, 10);
        });
    });

    describe('finished module:', function () {
        it('has finishedModule method', function () {
            expect(window.EFLDiscoveryModule).to.respondTo('finishedModule');
        });

        it('send post message after finishedModule call', function (done) {
            var observations = {
                'key': 'value'
            };
            var eventData;

            var messageHandler = function (event) {
                eventData = JSON.parse(event.data);
            };
            var spy = chai.spy(messageHandler);

            var iframe = document.getElementsByTagName('iframe')[0];
            iframe.contentWindow.addEventListener('message', spy);

            window.EFLDiscoveryModule.eventsDestination = iframe.contentWindow;
            window.EFLDiscoveryModule.stepName = 'stepName';
            window.EFLDiscoveryModule.finishedModule(observations);

            setTimeout(function () {
                expect(spy).to.have.been.called();
                expect(eventData.type).to.be.equal(MODULE_EVENTS.FINISHED_MODULE);
                expect(eventData.data.observations.key).to.be.equal(observations.key);
                expect(eventData.data.stepName).to.be.equal('stepName');
                iframe.contentWindow.removeEventListener('message', spy);
                done();
            }, 10);
        });
    });

    describe('loaded screen:', function () {
        it('has loadedScreen method', function () {
            expect(window.EFLDiscoveryModule).to.respondTo('loadedScreen');
        });

        it('send post message after loadedScreen call with next and back buttons', function (done) {
            var eventData;
            var messageHandler = function (event) {
                eventData = JSON.parse(event.data);
            };
            var spy = chai.spy(messageHandler);

            var iframe = document.getElementsByTagName('iframe')[0];
            iframe.contentWindow.addEventListener('message', spy);

            window.EFLDiscoveryModule.eventsDestination = iframe.contentWindow;
            window.EFLDiscoveryModule.loadedScreen({showNextButton: true, showBackButton: true});

            setTimeout(function () {
                expect(spy).to.have.been.called();
                expect(eventData.type).to.be.equal(MODULE_EVENTS.LOADED_SCREEN);
                expect(eventData.data.navigation.showNextButton).to.be.equal(true);
                expect(eventData.data.navigation.showBackButton).to.be.equal(true);
                iframe.contentWindow.removeEventListener('message', spy);
                done();
            }, 10);
        });

        it('send post message after loadedScreen call only with next button', function (done) {
            var eventData;
            var messageHandler = function (event) {
                eventData = JSON.parse(event.data);
            };
            var spy = chai.spy(messageHandler);

            var iframe = document.getElementsByTagName('iframe')[0];
            iframe.contentWindow.addEventListener('message', spy);

            window.EFLDiscoveryModule.eventsDestination = iframe.contentWindow;
            window.EFLDiscoveryModule.loadedScreen({showNextButton: true});

            setTimeout(function () {
                expect(spy).to.have.been.called();
                expect(eventData.type).to.be.equal(MODULE_EVENTS.LOADED_SCREEN);
                expect(eventData.data.navigation.showNextButton).to.be.equal(true);
                expect(eventData.data.navigation.showBackButton).to.not.be.ok;
                iframe.contentWindow.removeEventListener('message', spy);
                done();
            }, 10);
        });

        it('send post message after loadedScreen call only without buttons', function (done) {
            var eventData;
            var messageHandler = function (event) {
                eventData = JSON.parse(event.data);
            };
            var spy = chai.spy(messageHandler);

            var iframe = document.getElementsByTagName('iframe')[0];
            iframe.contentWindow.addEventListener('message', spy);

            window.EFLDiscoveryModule.eventsDestination = iframe.contentWindow;
            window.EFLDiscoveryModule.loadedScreen({});

            setTimeout(function () {
                expect(spy).to.have.been.called();
                expect(eventData.type).to.be.equal(MODULE_EVENTS.LOADED_SCREEN);
                expect(eventData.data.navigation.showNextButton).to.not.be.ok;
                expect(eventData.data.navigation.showBackButton).to.not.be.ok;
                iframe.contentWindow.removeEventListener('message', spy);
                done();
            }, 10);
        });
    });

    describe('finished screen:', function () {
        it('has finishedScreen method', function () {
            expect(window.EFLDiscoveryModule).to.respondTo('finishedScreen');
        });

        it('send post message after finishedScreen call', function (done) {
            var eventData;
            var messageHandler = function (event) {
                eventData = JSON.parse(event.data);
            };
            var spy = chai.spy(messageHandler);

            var iframe = document.getElementsByTagName('iframe')[0];
            iframe.contentWindow.addEventListener('message', spy);

            window.EFLDiscoveryModule.eventsDestination = iframe.contentWindow;
            window.EFLDiscoveryModule.finishedScreen(30);

            setTimeout(function () {
                expect(spy).to.have.been.called();
                expect(eventData.type).to.be.equal(MODULE_EVENTS.FINISHED_SCREEN);
                expect(eventData.data.progress).to.be.equal(30);
                iframe.contentWindow.removeEventListener('message', spy);
                done();
            }, 10);
        });
    });

    describe('exception:', function () {
        it('has exception method', function () {
            expect(window.EFLDiscoveryModule).to.respondTo('caughtException');
        });

        it('send post message after exception call', function (done) {
            var eventData;
            var messageHandler = function (event) {
                eventData = JSON.parse(event.data);
            };
            var spy = chai.spy(messageHandler);

            var iframe = document.getElementsByTagName('iframe')[0];
            iframe.contentWindow.addEventListener('message', spy);

            window.EFLDiscoveryModule.eventsDestination = iframe.contentWindow;
            window.EFLDiscoveryModule.caughtException('category', 'message');

            setTimeout(function () {
                expect(spy).to.have.been.called();
                expect(eventData.type).to.be.equal(MODULE_EVENTS.CAUGHT_EXCEPTION);
                expect(eventData.data.category).to.be.equal('category');
                expect(eventData.data.message).to.be.equal('message');
                iframe.contentWindow.removeEventListener('message', spy);
                done();
            }, 10);
        });
    });

    describe('navigation events', function () {
        it('call next button handler after next button event', function (done) {
            var discoveryModule = window.EFLDiscoveryModule;
            discoveryModule.nextButtonHandler = chai.spy();

            var eventData = {
                type: MODULE_EVENTS.PRESSED_NAVIGATION_BUTTON,
                data: {
                    button: 'next'
                }
            };
            window.postMessage(JSON.stringify(eventData), document.location.origin);

            setTimeout(function () {
                expect(discoveryModule.nextButtonHandler).to.have.been.called();
                done();
            }, 10);
        });

        it('call back button handler after back button event', function (done) {
            var discoveryModule = window.EFLDiscoveryModule;
            discoveryModule.backButtonHandler = chai.spy();

            var eventData = {
                type: MODULE_EVENTS.PRESSED_NAVIGATION_BUTTON,
                data: {
                    button: 'back'
                }
            };
            window.postMessage(JSON.stringify(eventData), document.location.origin);

            setTimeout(function () {
                expect(discoveryModule.backButtonHandler).to.have.been.called();
                done();
            }, 10);
        });
    });

    describe('changed language event', function () {
        it('call changed language handler after changed language event', function (done) {
            var discoveryModule = window.EFLDiscoveryModule;
            discoveryModule.changedLanguageHandler = chai.spy();

            var eventData = {
                type: MODULE_EVENTS.CHANGED_LANGUAGE,
                data: {
                    language: 'en'
                }
            };
            window.postMessage(JSON.stringify(eventData), document.location.origin);

            setTimeout(function () {
                expect(discoveryModule.changedLanguageHandler).to.have.been.called.with('en');
                done();
            }, 10);
        });
    });
});