describe('player module tests:', function () {

    before(function () {
        loadPlayer(window);
    });

    after(function () {
        unloadPlayer(window);
    });

    it('module loaded', function () {
        expect(window.EFLPlayer).to.exist;
    });

    describe('with creating player:', function () {
        beforeEach(function () {
            var div = document.createElement('div');
            div.id = 'epub';
            document.body.appendChild(div);
        });

        afterEach(function () {
            var div = document.getElementById('epub');
            document.body.removeChild(div);
            window.EFLPlayer.target = undefined;
            window.EFLPlayer.renderer = undefined;
            window.EFLPlayer.moduleInitilized = false;
        });

        describe('init:', function () {
            it('has init method', function () {
                expect(window.EFLPlayer).to.respondTo('init');
            });

            it('set properties', function () {
                window.EFLPlayer.init({
                    width: 600,
                    height: 500,
                    target: 'epub'
                });
                expect(window.EFLPlayer.rendererOptions.width).to.be.equal(600);
                expect(window.EFLPlayer.rendererOptions.height).to.be.equal(500);
                expect(window.EFLPlayer.target).to.be.equal('epub');
            });
        });

        describe('load module:', function () {
            beforeEach(function () {
                window.EFLPlayer.init({
                    width: 600,
                    height: 500,
                    target: 'epub'
                });
            });

            it('has loadModule method', function () {
                expect(window.EFLPlayer).to.respondTo('loadModule');
            });

            it('create iframe after load module', function (done) {
                window.EFLPlayer.loadModule('test_step', '../epub_samples/test_epub/', {lang: 'en'});
                setTimeout(function () {
                    expect(window.EFLPlayer.renderer).to.exist;
                    var iframe = document.getElementById('epub').getElementsByTagName('iframe')[0];
                    expect(iframe).to.exist;
                    expect(iframe.width).to.be.equal('600');
                    expect(iframe.height).to.be.equal('500');
                    done();
                }, 50);
            });

            it.skip('send initialize module event after epub loaded', function (done) {
                var config;
                var stepName;
                var type;
                var handler = function (event, data) {
                    type = event;
                    stepName = data.stepName;
                    config = data.config;
                };
                var origMethod = window.EFLPlayer.sendPostMessage;
                window.EFLPlayer.sendPostMessage = chai.spy(handler);
                window.EFLPlayer.loadModule('test_step', '../epub_samples/test_epub/', {lang: 'en'});

                setTimeout(function () {
                    var spy = window.EFLPlayer.sendPostMessage;
                    window.EFLPlayer.sendPostMessage = origMethod;
                    expect(spy).to.have.been.called();
                    expect(type).to.be.equal(MODULE_EVENTS.INITIALIZE_MODULE);
                    expect(config.lang).to.be.equal('en');
                    expect(stepName).to.be.equal('test_step');
                    done();
                }, 200);
            });
        });
    });

    describe('without creating player:', function () {
        beforeEach(function () {
            var iframe = document.createElement('iframe');
            iframe.id = 'module';
            document.body.appendChild(iframe);
            window.EFLPlayer.moduleWindow = iframe.contentWindow;
        });

        afterEach(function () {
            var iframe = document.getElementById('module');
            if (iframe) {
                document.body.removeChild(iframe);
                window.EFLPlayer.moduleWindow = undefined;
            }
        });

        describe('loadedModule event:', function () {
            it('has loadedModule method', function () {
                expect(window.EFLPlayer).to.respondTo('loadedModule');
            });

            it('call loadedModule method after loaded module event', function (done) {
                var player = window.EFLPlayer;
                var origMethod = player.loadedModule;
                player.loadedModule = chai.spy(player.loadedModule);
                var eventData = {
                    type: MODULE_EVENTS.LOADED_MODULE,
                    data: { stepName: 'step' }
                };
                window.postMessage(JSON.stringify(eventData), document.location.origin);

                setTimeout(function () {
                    expect(player.loadedModule).to.have.been.called.with('step');
                    player.loadedModule = origMethod;
                    done();
                }, 10);
            });

            it('call moduleLoadedHandler method after loaded module event', function (done) {
                var player = window.EFLPlayer;
                player.moduleLoadedHandler = chai.spy();
                var eventData = {
                    type: MODULE_EVENTS.LOADED_MODULE,
                    data: { stepName: 'step' }
                };
                window.postMessage(JSON.stringify(eventData), document.location.origin);

                setTimeout(function () {
                    expect(player.moduleLoadedHandler).to.have.been.called.with('step');
                    player.moduleLoadedHandler = undefined;
                    done();
                }, 10);
            });
        });

        describe('loaded screen:', function () {
            it('has loadedScreen method', function () {
                expect(window.EFLPlayer).to.respondTo('loadedScreen');
            });

            it('call loadedScreen method after loaded screen event', function (done) {
                var player = window.EFLPlayer;
                var origMethod = player.loadedScreen;
                var next;
                var back;
                var handler = function (navigation) {
                    next = navigation.next;
                    back = navigation.back;
                };
                player.loadedScreen = chai.spy(handler);
                var eventData = {
                    type: MODULE_EVENTS.LOADED_SCREEN,
                    data: { navigation: {next: true, back: true} }
                };
                window.postMessage(JSON.stringify(eventData), document.location.origin);

                setTimeout(function () {
                    expect(player.loadedScreen).to.have.been.called();
                    expect(next).to.be.equal(true);
                    expect(back).to.be.equal(true);
                    player.loadedScreen = origMethod;
                    done();
                }, 10);
            });

            it('call screenLoadedHandler method after loaded screen event', function (done) {
                var player = window.EFLPlayer;
                var next;
                var back;
                var handler = function (navigation) {
                    next = navigation.next;
                    back = navigation.back;
                };
                player.screenLoadedHandler = chai.spy(handler);
                var eventData = {
                    type: MODULE_EVENTS.LOADED_SCREEN,
                    data: { navigation: {next: true, back: true} }
                };
                window.postMessage(JSON.stringify(eventData), document.location.origin);

                setTimeout(function () {
                    expect(player.screenLoadedHandler).to.have.been.called();
                    expect(next).to.be.equal(true);
                    expect(back).to.be.equal(true);
                    player.screenLoadedHandler = undefined;
                    done();
                }, 10);
            });
        });

        describe('finished screen:', function () {
            it('has finishedScreen method', function () {
                expect(window.EFLPlayer).to.respondTo('finishedScreen');
            });

            it('call finishedScreen method after loaded screen event', function (done) {
                var player = window.EFLPlayer;
                var origMethod = player.finishedScreen;
                player.finishedScreen = chai.spy(player.finishedScreen);
                var eventData = {
                    type: MODULE_EVENTS.FINISHED_SCREEN,
                    data: { progress: 20 }
                };
                window.postMessage(JSON.stringify(eventData), document.location.origin);

                setTimeout(function () {
                    expect(player.finishedScreen).to.have.been.called.with(20);
                    player.finishedScreen = origMethod;
                    done();
                }, 10);
            });

            it('call finishedScreenHandler method after loaded screen event', function (done) {
                var player = window.EFLPlayer;
                player.screenFinishedHandler = chai.spy();
                var eventData = {
                    type: MODULE_EVENTS.FINISHED_SCREEN,
                    data: { progress: 20 }
                };
                window.postMessage(JSON.stringify(eventData), document.location.origin);

                setTimeout(function () {
                    expect(player.screenFinishedHandler).to.have.been.called.with(20);
                    player.screenFinishedHandler  = undefined;
                    done();
                }, 10);
            });
        });

        describe('finished module:', function () {
            it('has finishedModule method', function () {
                expect(window.EFLPlayer).to.respondTo('finishedModule');
            });

            it('call finishedModule method after finished module event', function (done) {
                var player = window.EFLPlayer;
                var origMethod = player.finishedModule;
                player.finishedModule = chai.spy(player.finishedModule);

                var observations = {
                    observation1: 'value',
                        observation2: 'value2'
                };
                var eventData = {
                    type: MODULE_EVENTS.FINISHED_MODULE,
                    data: {
                        stepName: 'step',
                        observations: observations
                    }
                };
                window.postMessage(JSON.stringify(eventData), document.location.origin);

                setTimeout(function () {
                    expect(player.finishedModule).to.have.been.called.with('step', observations);
                    player.finishedModule = origMethod;
                    done();
                }, 10);
            });

            it('call finishedModuleHandler method after finished step event', function (done) {
                var player = window.EFLPlayer;
                player.moduleFinishedHandler = chai.spy();

                var observations = {
                    observation1: 'value',
                    observation2: 'value2'
                };
                var eventData = {
                    type: MODULE_EVENTS.FINISHED_MODULE,
                    data: {
                        stepName: 'step',
                        observations: observations
                    }
                };
                window.postMessage(JSON.stringify(eventData), document.location.origin);

                setTimeout(function () {
                    expect(player.moduleFinishedHandler).to.have.been.called.with('step', observations);
                    player.moduleFinishedHandler  = undefined;
                    done();
                }, 10);
            });
        });

        describe('exception:', function () {
            it('has moduleException method', function () {
                expect(window.EFLPlayer).to.respondTo('moduleException');
            });

            it('call moduleException method after exception event', function (done) {
                var player = window.EFLPlayer;
                var origMethod = player.moduleException;
                player.moduleException = chai.spy(player.moduleException);
                var eventData = {
                    type: MODULE_EVENTS.CAUGHT_EXCEPTION,
                    data: { category: 'test', message: 'message' }
                };
                window.postMessage(JSON.stringify(eventData), document.location.origin);

                setTimeout(function () {
                    expect(player.moduleException).to.have.been.called.with('test', 'message');
                    player.moduleException = origMethod;
                    done();
                }, 10);
            });

            it('call moduleExceptionHandler method after exception event', function (done) {
                var player = window.EFLPlayer;
                player.moduleExceptionHandler = chai.spy();
                var eventData = {
                    type: MODULE_EVENTS.CAUGHT_EXCEPTION,
                    data: { category: 'test', message: 'message' }
                };
                window.postMessage(JSON.stringify(eventData), document.location.origin);

                setTimeout(function () {
                    expect(player.moduleExceptionHandler).to.have.been.called.with('test', 'message');
                    player.moduleExceptionHandler = undefined;
                    done();
                }, 10);
            });
        });

        describe('navigation buttons methods', function () {
            it('has nextButtonTapped method', function () {
                expect(window.EFLPlayer).to.respondTo('nextButtonTapped');
            });

            it ('send event after nextButtonTapped call', function (done) {
                var button;
                var type;
                var handler = function (event, data) {
                    type = event;
                    button = data.button
                };
                var origMethod = window.EFLPlayer.sendPostMessage;
                window.EFLPlayer.sendPostMessage = chai.spy(handler);
                window.EFLPlayer.nextButtonTapped();

                setTimeout(function () {
                    var spy = window.EFLPlayer.sendPostMessage;
                    window.EFLPlayer.sendPostMessage = origMethod;
                    expect(spy).to.have.been.called();
                    expect(type).to.be.equal(MODULE_EVENTS.PRESSED_NAVIGATION_BUTTON);
                    expect(button).to.be.equal('next');
                    done();
                }, 10);
            });

            it('has backButtonTapped method', function () {
                expect(window.EFLPlayer).to.respondTo('backButtonTapped');
            });

            it ('send event after backButtonTapped call', function (done) {
                var button;
                var type;
                var handler = function (event, data) {
                    type = event;
                    button = data.button
                };
                var origMethod = window.EFLPlayer.sendPostMessage;
                window.EFLPlayer.sendPostMessage = chai.spy(handler);
                window.EFLPlayer.backButtonTapped();

                setTimeout(function () {
                    var spy = window.EFLPlayer.sendPostMessage;
                    window.EFLPlayer.sendPostMessage = origMethod;
                    expect(spy).to.have.been.called();
                    expect(type).to.be.equal(MODULE_EVENTS.PRESSED_NAVIGATION_BUTTON);
                    expect(button).to.be.equal('back');
                    done();
                }, 10);
            });
        });

        describe('changed language', function () {
            it ('has languageChanged method', function () {
                expect(window.EFLPlayer).to.respondTo('languageChanged');
            });

            it ('send event after languageChanged call', function (done) {
                var type;
                var language;
                var handler = function (event, data) {
                    type = event;
                    language = data.language;
                };
                var origMethod = window.EFLPlayer.sendPostMessage;
                window.EFLPlayer.sendPostMessage = chai.spy(handler);
                window.EFLPlayer.languageChanged('en');

                setTimeout(function () {
                    var spy = window.EFLPlayer.sendPostMessage;
                    window.EFLPlayer.sendPostMessage = origMethod;
                    expect(spy).to.have.been.called();
                    expect(type).to.be.equal(MODULE_EVENTS.CHANGED_LANGUAGE);
                    expect(language).to.be.equal('en');
                    done();
                }, 10);
            });
        });
    });
});