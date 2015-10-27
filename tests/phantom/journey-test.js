describe('journey module tests:', function () {
    var modulesMockData = {
        modules: {
            module1: {
                type: 'web',
                uri: '../epub_samples/test_epub.epub',
                config: {lang: 'en'}
            },
            module2: {
                type: 'web',
                uri: '../epub_samples/test_epub_2.epub',
                config: {lang: 'de'}
            }
        },
        steps: {
            step1: {
                title: 'Introduction',
                image: '',
                module: 'module1',
                isRoot: true,
                links: [
                    {
                        type: 'next',
                        target: 'step2',
                        params: {}
                    }
                ]
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

    beforeEach(function () {
        loadJourney(window);
        var container = document.createElement('div');
        container.id = 'journey';
        document.body.appendChild(container);
    });

    afterEach(function () {
        unloadJourney(window);
        var container = document.getElementById('journey');
        document.body.removeChild(container);
    });

    it('module loaded', function () {
        expect(window.EFLJourney).to.exist;
    });

    it('module has correct initial values', function () {
        expect(window.EFLJourney.moduleState).to.be.equal(JOURNEY_STATE.LIBRARY_NOT_INITIALIZED);
        expect(window.EFLJourney.styleConfig).to.exist;
        var style = window.EFLJourney.styleConfig;
        expect(style.fontFamily).to.be.equal('serif');
        expect(style.fontSize).to.be.equal('medium');
        expect(style.backgroundColor).to.be.equal('#2399CC');
        expect(style.primaryColor).to.be.equal('#FFFFFF');
    });

    describe('initializing:', function () {
        it('has init method', function () {
            expect(window.EFLJourney).to.respondTo('init');
        });

        describe('after initialization:', function () {
            var playerMock = {name: 'mock'};
            var applicantData = {
                locale: 'en-US',
                firstName: 'John',
                lastName: 'Dow',
                gender: 'm',
                birthday: '1999-02-01',
                email: 'johndoe@test.com',
                idNumbers: {
                    externalKey: 'abc123'
                }
            };
            var styleConfig = {
                fontFamily: 'sans-serif',
                fontSize: 'large',
                backgroundColor: '#000000',
                primaryColor: '#FF0000'
            };

            it('properties set', function () {
                var journey = window.EFLJourney;
                journey.init(playerMock, 'journey', 'endpoint', applicantData, styleConfig);
                expect(journey.target).to.be.equal('journey');
                expect(journey.player).to.be.equal(playerMock);
                expect(journey.loginEndpoint).to.be.equal('endpoint');
                expect(journey.applicantData).to.be.equal(applicantData);
                expect(journey.styleConfig.fontFamily).to.be.equal('sans-serif');
                expect(journey.styleConfig.fontSize).to.be.equal('large');
                expect(journey.styleConfig.backgroundColor).to.be.equal('#000000');
                expect(journey.styleConfig.primaryColor).to.be.equal('#FF0000');
                expect(journey.completedStep).to.be.equal(0);
            });

            it('added handlers to player', function () {
                var journey = window.EFLJourney;
                journey.init(playerMock, 'journey', 'endpoint', applicantData, styleConfig);
                var player = journey.player;
                expect(journey).to.respondTo('moduleException');
                expect(player.moduleExceptionHandler).to.be.equal(journey.moduleException);
                expect(journey).to.respondTo('handleObservations');
                expect(player.moduleFinishedHandler).to.be.a('function');
                expect(journey).to.respondTo('finishedScreen');
                expect(player.screenFinishedHandler).to.be.a('function');
                expect(player.screenLoadedHandler).to.be.a('function');
            });

            it('navigation elements created', function (done) {
                var journey = window.EFLJourney;
                journey.init(playerMock, 'journey', 'endpoint', applicantData, styleConfig);
                setTimeout(function () {
                    var navigation = document.getElementById(window.EFLJourney.target);
                    var nextButton = document.getElementById('efl-next-button');
                    expect(nextButton).to.exist;
                    expect(nextButton.parentNode).to.be.equal(navigation);
                    expect(nextButton.onclick).to.be.a('function');

                    var backButton = document.getElementById('efl-back-button');
                    expect(backButton).to.exist;
                    expect(backButton.parentNode).to.be.equal(navigation);
                    expect(backButton.onclick).to.be.a('function');

                    var progress = document.getElementById('efl-progress');
                    expect(progress).to.exist;
                    expect(progress.childElementCount).to.be.equal(1);
                    expect(progress.parentNode).to.be.equal(navigation);

                    var loading = document.getElementById('efl-loading');
                    expect(loading.parentNode).to.be.equal(navigation);
                    expect(loading).to.exist;

                    var player = document.getElementById('efl-player');
                    expect(player).to.exist;
                    expect(player.parentNode).to.be.equal(navigation);

                    var picker = document.getElementById('efl-locale-select');
                    expect(picker).to.exist;

                    done();
                }, 10);
            });

            it('set values ing language picker', function(done) {
                var journey = window.EFLJourney;
                journey.init(playerMock, 'journey', 'endpoint', applicantData, styleConfig);
                setTimeout(function () {
                    var picker = document.getElementById('efl-locale-select');
                    expect(picker.options.length).to.be.equal(2);
                    var option1 = picker.options[0];
                    var option2 = picker.options[1];
                    expect(option1.value).to.be.equal('en');
                    expect(option1.text).to.be.equal('English');
                    expect(option2.value).to.be.equal('es');
                    expect(option2.text).to.be.equal('Spanish');

                    done();
                }, 10);
            });

            it('set player target', function (done) {
                var journey = window.EFLJourney;
                journey.init(playerMock, 'journey', 'endpoint', applicantData, styleConfig);
                setTimeout(function () {
                    expect(journey.player.target).to.be.equal('efl-player');
                    done();
                }, 10);
            });

            //TODO: it('style applied to navigation elements');

            it('modules list created', function (done) {
                var journey = window.EFLJourney;
                var fetchDataMock = function () {
                    return modulesMockData;
                };
                var origMethod = journey.fetchModulesData;
                journey.fetchModulesData = fetchDataMock;

                journey.init(playerMock, 'journey', 'endpoint', applicantData, styleConfig);
                setTimeout(function () {
                    var modules = journey.modules;
                    expect(Object.keys(modules).length).to.be.equal(2);

                    expect(modules.module1.type).to.be.equal('web');
                    expect(modules.module1.uri).to.be.equal('../epub_samples/test_epub.epub');
                    expect(modules.module1.config.lang).to.be.equal('en');

                    expect(modules.module2.type).to.be.equal('web');
                    expect(modules.module2.uri).to.be.equal('../epub_samples/test_epub_2.epub');
                    expect(modules.module2.config.lang).to.be.equal('de');

                    journey.fetchModulesData = origMethod;
                    done();
                }, 10);
            });

            it('steps list created', function (done) {
                var journey = window.EFLJourney;
                var fetchDataMock = function () {
                    return modulesMockData;
                };
                var origMethod = journey.fetchModulesData;
                journey.fetchModulesData = fetchDataMock;

                journey.init(playerMock, 'journey', 'endpoint', applicantData, styleConfig);
                setTimeout(function () {
                    var steps = journey.steps;
                    expect(Object.keys(steps).length).to.be.equal(2);

                    expect(steps.step1.title).to.be.equal('Introduction');
                    expect(steps.step1.module).to.be.equal('module1');
                    expect(steps.step1.nextStep).to.be.equal('step2');

                    expect(steps.step2.title).to.be.equal('Last step');
                    expect(steps.step2.module).to.be.equal('module2');
                    expect(steps.step2.nextStep).to.not.exist;

                    expect(journey.firstStep).to.be.equal('step1');

                    journey.fetchModulesData = origMethod;
                    done();
                }, 10);
            });

            it('loading progress changes', function (done) {
                var journey = window.EFLJourney;
                journey.init(playerMock, 'journey', 'endpoint', applicantData, styleConfig);
                var loading = document.getElementById('efl-loading');
                expect(loading.style.display).not.to.be.equal('none');
                setTimeout(function () {
                    expect(loading.style.display).to.be.equal('none');
                    done();
                }, 10);
            });

            it('correct initial buttons state', function (done) {
                var journey = window.EFLJourney;
                journey.init(playerMock, 'journey', 'endpoint', applicantData, styleConfig);
                var button = document.getElementById('efl-next-button');
                expect(button.style.display).to.be.equal('none');
                setTimeout(function () {
                    expect(button.style.display).not.to.be.equal('none');
                    done();
                }, 10);
            });

            describe('update buttons state', function () {
                it('both buttons visible', function (done) {
                    var journey = window.EFLJourney;
                    journey.init(playerMock, 'journey', 'endpoint', applicantData, styleConfig);
                    setTimeout(function () {
                        journey.moduleState = JOURNEY_STATE.STEP_STARTED;
                        journey.player.screenLoadedHandler({showNextButton: true, showBackButton: true});
                        expect(document.getElementById('efl-next-button').style.display).not.to.be.equal('none');
                        expect(document.getElementById('efl-back-button').style.display).not.to.be.equal('none');
                        done();
                    }, 10);
                });

                it('only next button visible', function (done) {
                    var journey = window.EFLJourney;
                    journey.init(playerMock, 'journey', 'endpoint', applicantData, styleConfig);
                    setTimeout(function () {
                        journey.moduleState = JOURNEY_STATE.STEP_STARTED;
                        journey.player.screenLoadedHandler({showNextButton: true});
                        expect(document.getElementById('efl-next-button').style.display).not.to.be.equal('none');
                        expect(document.getElementById('efl-back-button').style.display).to.be.equal('none');
                        done();
                    }, 10);
                });

                it('no button visible', function (done) {
                    var journey = window.EFLJourney;
                    journey.init(playerMock, 'journey', 'endpoint', applicantData, styleConfig);
                    setTimeout(function () {
                        journey.moduleState = JOURNEY_STATE.STEP_STARTED;
                        journey.player.screenLoadedHandler({});
                        expect(document.getElementById('efl-next-button').style.display).to.be.equal('none');
                        expect(document.getElementById('efl-back-button').style.display).to.be.equal('none');
                        done();
                    }, 10);
                });
            });
        });
    });

    describe('after library init:', function () {
        beforeEach(function () {
            var journey = window.EFLJourney;
            journey.player = {
                loadModule: function (name) {
                    if (journey.player.moduleLoadedHandler) {
                        journey.player.moduleLoadedHandler(name);
                    }
                }
            };
            journey.applicantData = {};
            journey.target = 'journey';
            var container = document.getElementById('journey');
            var nextButton = document.createElement('button');
            nextButton.id = 'efl-next-button';
            container.appendChild(nextButton);
            var backButton = document.createElement('button');
            backButton.id = 'efl-back-button';
            container.appendChild(backButton);
            var loading = document.createElement('div');
            loading.id = 'efl-loading';
            container.appendChild(loading);
            var progress = document.createElement('div');
            progress.id = 'efl-progress';
            container.appendChild(progress);
            var bar = document.createElement('div');
            progress.appendChild(bar);
            var picker = document.createElement('select');
            picker.id = 'efl-locale-select';
            container.appendChild(picker);
            var title = document.createElement('div');
            title.id = 'efl-title';
            container.appendChild(title);

            journey.completedStep = 0;
            journey.moduleInitialized = true;
            journey.modules = modulesMockData.modules;
            journey.steps = {
                step1: {
                    title: 'Introduction',
                    module: 'module1',
                    nextStep: 'step2'
                },
                step2: {
                    title: 'Last step',
                    module: 'module2'
                }
            };
            journey.firstStep = 'step1';
        });

        describe('starting next step:', function () {
            it('has startTextStep method', function () {
                expect(window.EFLJourney).to.respondTo('startNextStep');
            });

            it('set step timer', function (done) {
                var journey = window.EFLJourney;
                journey.startNextStep();
                setTimeout(function () {
                    var now = Date.now();
                    expect(journey.stepTimer).to.be.within(now - 60000, now);
                    done();
                }, 10);
            });

            it('change library state', function (done) {
                var journey = window.EFLJourney;

                var loading = document.getElementById('efl-loading');
                journey.startNextStep();
                setTimeout(function () {
                    expect(journey.moduleState).to.be.equal(JOURNEY_STATE.STEP_STARTED);
                    expect(loading.style.display).to.be.equal('none');
                    expect(journey.currentStep).to.be.equal('step1');
                    done();
                }, 10);
            });

            it('load first module', function (done) {
                var journey = window.EFLJourney;

                var stepName;
                var moduleURL;
                var moduleConfigLang;
                var handler = function (name, url, config) {
                    stepName = name;
                    moduleURL = url;
                    moduleConfigLang = config.lang;
                };

                journey.player.loadModule = chai.spy(handler);
                journey.startNextStep();
                setTimeout(function () {
                    expect(journey.player.loadModule).to.have.been.called();
                    expect(stepName).to.be.equal("step1");
                    expect(moduleURL).to.be.equal(modulesMockData.modules.module1.uri);
                    expect(moduleConfigLang).to.be.equal(modulesMockData.modules.module1.config.lang);
                    done();
                }, 10);
            });
        });

        describe('finished screen', function () {
            beforeEach(function () {
                var journey = window.EFLJourney;
                journey.moduleState = JOURNEY_STATE.STEP_STARTED;
            });

            it('update progress bar in first step', function (done) {
                var journey = window.EFLJourney;
                journey.completedStep = 0;

                var progressbar = document.getElementById('efl-progress').firstElementChild;
                journey.finishedScreen(20);
                setTimeout(function () {
                    expect(progressbar.style.width).to.be.equal('10%');
                    done();
                }, 10);
            });

            it('update progress bar in second step', function (done) {
                var journey = window.EFLJourney;
                journey.completedStep = 1;

                var progressbar = document.getElementById('efl-progress').firstElementChild;
                journey.finishedScreen('30');
                setTimeout(function () {
                    expect(progressbar.style.width).to.be.equal('65%');
                    done();
                }, 10);
            });

            it('change state when finished with 100 percent', function (done) {
                var journey = window.EFLJourney;
                journey.finishedScreen(100);
                setTimeout(function () {
                    expect(journey.moduleState).to.be.equal(JOURNEY_STATE.SCREENS_COMPLETED);
                    done();
                }, 10);
            });

            it('show loading when finished with 100 percent', function (done) {
                var journey = window.EFLJourney;
                journey.finishedScreen(100);
                setTimeout(function () {
                    expect(document.getElementById('efl-loading').style.display).not.to.be.equal('none');
                    done();
                }, 10);
            });
        });

        describe('handle observations:', function () {
            beforeEach(function () {
                var journey = window.EFLJourney;
                journey.moduleState = JOURNEY_STATE.STEP_STARTED;
                journey.currentStep = 'step1';
                journey.stepTimer = Date.now() - 1000;
            });

            it('module state changed', function (done) {
                var journey = window.EFLJourney;
                journey.handleObservations('step1', {});
                setTimeout(function () {
                    expect(journey.moduleState).to.be.equal(JOURNEY_STATE.STEP_SEND_RESULTS);
                    done();
                }, 10);
            });

            it('send observations', function (done) {
                var journey = window.EFLJourney;

                var stepName;
                var sequence;
                var observations;
                var metas;
                var handler = function(_stepName, _sequence, _observations, _metas) {
                    stepName = _stepName;
                    sequence = _sequence;
                    observations = _observations;
                    metas = _metas;
                };
                journey.sendObservations = chai.spy(handler);

                journey.handleObservations('step1', {key: 'value'});
                setTimeout(function () {
                    expect(journey.sendObservations).to.have.been.called();
                    expect(stepName).to.be.equal('step1');
                    expect(sequence).to.be.equal(0);
                    expect(observations.key).to.be.equal('value');
                    expect(metas.timeElapsed).to.be.within(1, 20);
                    done();
                }, 10);
            });
         });

        describe('changed language', function () {
            it('call player handler', function (done) {
                var journey = window.EFLJourney;

                var picker = document.getElementById('efl-locale-select');
                var option1 = document.createElement('option');
                option1.value = 'en';
                picker.add(option1);
                var option2 = document.createElement('option');
                option2.value = 'es';
                picker.add(option2);
                picker.selectedIndex = 1;

                journey.player.languageChanged = chai.spy();
                journey.localePickerChanged();
                setTimeout(function () {
                    expect(journey.player.languageChanged).to.have.been.called.with('es');
                    done();
                }, 10);
            });
        });

        describe('finished module', function () {
            beforeEach(function () {
                var journey = window.EFLJourney;
                journey.player.closeModule = function () {};
            });

            it('has finishedModule method', function () {
                expect(window.EFLJourney).to.respondTo('finishedModule');
            });

            it('call player closeModule method', function (done) {
                var journey = window.EFLJourney;
                journey.currentStep = 'step2';
                journey.player.closeModule = chai.spy();

                journey.finishedModule();
                setTimeout(function () {
                    expect(journey.player.closeModule).have.been.called();
                    done();
                }, 10);
            });

            it('call finishedModule after completed screen when observations were handled', function (done) {
                var journey = window.EFLJourney;
                var origMethod = journey.finishedModule;
                journey.finishedModule = chai.spy();

                journey.moduleState = JOURNEY_STATE.STEP_SEND_RESULTS;
                journey.finishedScreen(100);
                setTimeout(function () {
                    var spy = journey.finishedModule;
                    journey.finishedModule = origMethod;
                    expect(spy).to.have.been.called();
                    done();
                }, 10);
            });

            it('call finishedModule after handling observations when screen finished', function (done) {
                var journey = window.EFLJourney;
                var origMethod = journey.finishedModule;
                journey.finishedModule = chai.spy();

                journey.moduleState = JOURNEY_STATE.SCREENS_COMPLETED;
                journey.handleObservations('step1', {});
                setTimeout(function () {
                    var spy = journey.finishedModule;
                    journey.finishedModule = origMethod;
                    expect(spy).to.have.been.called();
                    done();
                }, 10);
            });

            it('call startNextStep when more step available', function (done) {
                var journey = window.EFLJourney;
                var origMethod = journey.startNextStep;
                journey.startNextStep = chai.spy(origMethod);
                journey.currentStep = 'step1';
                journey.finishedModule();
                setTimeout(function() {
                    var spy = journey.startNextStep;
                    journey.startNextStep = origMethod;
                    expect(spy).to.have.been.called();
                    expect(journey.currentStep).to.be.equal('step2');
                    expect(journey.moduleState).to.be.equal(JOURNEY_STATE.STEP_STARTED);
                    done();
                }, 10);
            });

            it('call sendFinishedApplication after last step', function (done) {
                var journey = window.EFLJourney;
                var origMethod = journey.sendFinishedApplication;
                journey.sendFinishedApplication = chai.spy();
                journey.currentStep = 'step2';
                journey.finishedModule();
                setTimeout(function() {
                    var spy = journey.sendFinishedApplication;
                    journey.sendFinishedApplication = origMethod;
                    expect(spy).to.have.been.called();
                    expect(journey.moduleState).to.be.equal(JOURNEY_STATE.APPLICATION_FINISHED);
                    done();
                }, 10);
            });
        });

        describe('call player next/back button tapped method', function () {
            it('back button when step started', function (done) {
                var journey = window.EFLJourney;
                journey.player.backButtonTapped = chai.spy();
                journey.moduleState = JOURNEY_STATE.STEP_STARTED;

                journey.backButtonTapped();
                setTimeout(function () {
                    expect(journey.player.backButtonTapped).to.have.been.called();
                    journey.player.backButtonTapped = undefined;
                    done();
                }, 10);
            });

            it('next button when step started', function (done) {
                var journey = window.EFLJourney;
                journey.player.nextButtonTapped = chai.spy();
                journey.moduleState = JOURNEY_STATE.STEP_STARTED;

                journey.nextButtonTapped();
                setTimeout(function () {
                    expect(journey.player.nextButtonTapped).to.have.been.called();
                    journey.player.nextButtonTapped = undefined;
                    done();
                }, 10);
            });
        });
    });
});