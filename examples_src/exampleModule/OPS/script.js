console.log('loaded script');

var currentScreen = 1;
var maxScreen = 5;
var name;

function initModule(stepName, config) {
    console.log('init module with language ' + config.lang);
    console.log('init step ' + stepName);

    name = stepName;
    //
    // var el = document.getElementById('content');
    // var stepHeader = document.createElement('h1');
    // stepHeader.id = 'step-header';
    // stepHeader.innerHTML = 'Step ' + stepName;
    // el.appendChild(stepHeader);
    //
    // var screenHeader = document.createElement('h2');
    // screenHeader.id = 'screen-header';
    // el.appendChild(screenHeader);
    //
    // var button = document.createElement('button');
    // button.id = 'screen-button';
    // button.innerHTML = "Next";
    //
    // button.onclick = nextScreen;
    // el.appendChild(button);
    //
    // var errorButton = document.createElement('button');
    // errorButton.id = 'error-button';
    // errorButton.innerHTML = 'Exception';
    // errorButton.onclick = function () {
    //     EFLDiscoveryModule.caughtException('general', 'something went wrong');
    // };
    // el.appendChild(errorButton);
    //
    // var language = document.createElement('div');
    // language.id = 'lang';
    // language.innerHTML = 'Language: <strong>' + config.lang + '</strong>';
    // el.appendChild(language);
    //

    loadScreen(1);

    EFLDiscoveryModule.loadedModule();
}

function loadScreen(screen) {
    console.log('load screen ' + screen);

    currentScreen = screen;
    // document.getElementById('screen-header').innerHTML = 'Screen ' + screen;

    var showNext = currentScreen !== maxScreen - 1;
    var showBack = currentScreen !== 1;
    EFLDiscoveryModule.loadedScreen({
        showNextButton: showNext,
        showBackButton: showBack,
        hideTitle: currentScreen === 2,
        hideProgress: currentScreen === 3
    });

    // document.getElementById('screen-button').style.display = !showNext ? 'block' : 'none';
}

function finishScreen(screen) {
    EFLDiscoveryModule.finishedScreen(100 * screen / maxScreen);
}

function nextScreen() {
    finishScreen(currentScreen);
    if (currentScreen !== maxScreen) {
        loadScreen(currentScreen + 1);
    }
    else {
        EFLDiscoveryModule.finishedModule({key1: "value1", key2: 1});
    }
}

function backScreen() {
    console.log(currentScreen);
    if (currentScreen !== 1) {
        finishScreen(currentScreen - 2);
        loadScreen(currentScreen - 1);
    }
}

function changedLanguage(lang) {
    // var div = document.getElementById('lang');
    // div.innerHTML = 'Language: <strong>' + lang + '</strong>';
}

EFLDiscoveryModule.init({
    initModuleHandler: initModule,
    nextButtonHandler: nextScreen,
    backButtonHandler: backScreen,
    changedLanguageHandler: changedLanguage
});

function setData(){
    var country_family = {
        value: document.getElementById('sliderNum').value,
        timeelapsed: document.getElementById('timer_inp').innerHTML
    };
    localStorage.setItem('country_family', JSON.stringify(country_family));
    stopCountdown();
}
var timerValues = setInterval(function(){ timer() }, 2000);

function timer() {
    var timer_id = document.getElementById("timer_inp");

    timer_id.innerHTML--;

    if (timer_id.innerHTML==0) {
        clearInterval(timerValues);
    }
}

function stopCountdown() {
    clearInterval(timerValues);
}