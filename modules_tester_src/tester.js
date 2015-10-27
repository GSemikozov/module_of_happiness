import {MODULE_EVENTS} from '../es5/module-events.js'

var enableUI = function(enable) {
    document.getElementById('init-name').disabled = !enable;
    document.getElementById('init-config').disabled = !enable;
    document.getElementById('init-button').disabled = !enable;
    document.getElementById('next-button').disabled = !enable;
    document.getElementById('back-button').disabled = !enable;
    document.getElementById('lang-code').disabled = !enable;
    document.getElementById('lang-button').disabled = !enable;
};

var addLog = function(eventType, params) {
    var logs = document.getElementById('logs');
    var el = document.createElement('li');
    el.innerHTML = 'Get <strong>' + eventType + '</strong>: ';
    if (params) {
        var paramList = document.createElement('ul');
        for (var key in params) {
            var p = document.createElement('li');
            p.innerHTML = key + ': ' + params[key];
            paramList.appendChild(p);
        }
        el.appendChild(paramList);
    }
    logs.appendChild(el);
    var div = document.getElementById('logs-div')
    div.scrollTop = div.scrollHeight;
};

enableUI(false);

EFLPlayer.loadModule = function (stepName, url, config) {
    document.getElementById('loading').style.display = 'block';
    EFLPlayer.moduleName = name;

    EFLPlayer.renderer = ePub(url, EFLPlayer.rendererOptions);

    var bookReadyHandler = function () {
        var iframe = document.getElementById(EFLPlayer.target).getElementsByTagName('iframe');
        if (iframe.length > 0) {
            EFLPlayer.moduleWindow = iframe[0].contentWindow;
        }
        enableUI(true);
        document.getElementById('loading').style.display = 'none';
        EFLPlayer.renderer.off('book:ready', bookReadyHandler);
    };

    EFLPlayer.renderer.on('book:ready', bookReadyHandler);

    EFLPlayer.renderer.renderTo(this.target);
};

EFLPlayer.moduleLoadedHandler = function (stepName) {
    addLog(MODULE_EVENTS.LOADED_MODULE, {stepName: stepName});
};

EFLPlayer.screenLoadedHandler = function (navigation) {
    addLog(MODULE_EVENTS.LOADED_SCREEN, {
        'show next button': navigation.showNextButton ? 'yes' : 'no',
        'show back button': navigation.showBackButton ? 'yes' : 'no',
        'hide title': navigation.hideTitle ? 'yes' : 'no',
        'hide progress': navigation.hideProgress ? 'yes' : 'no'
    });
};

EFLPlayer.screenFinishedHandler = function (progress) {
    addLog(MODULE_EVENTS.FINISHED_SCREEN, {
        progress: progress
    });
};

EFLPlayer.moduleFinishedHandler = function (stepName, observations) {
    addLog(MODULE_EVENTS.FINISHED_MODULE, {
        stepName: stepName,
        observations: JSON.stringify(observations)
    });
};

EFLPlayer.moduleExceptionHandler = function (category, message) {
    addLog(MODULE_EVENTS.CAUGHT_EXCEPTION, {
        category: category,
        message: message
    });
};

EFLPlayer.init({
    target: 'player',
    width: '100%',
    height: '100%'
});

var openEpub = function() {
    var path = document.getElementById('file-input').value;
    if (path) {
        if (EFLPlayer.renderer) {
            try {
                EFLPlayer.renderer.destroy();
            } catch (e) {}
        }
        EFLPlayer.loadModule('step', path, {});
    }
};

document.getElementById('open-button').onclick = openEpub;
document.getElementById('file-input').onkeydown = function(event) {
    var keyCode = event.keyCode || event.which;
    if ( keyCode === 13 ) {
        openEpub();
    }
};

document.getElementById('init-button').onclick = function () {
    var stepName = document.getElementById('init-name').value;
    var configString = document.getElementById('init-config').value;
    var config = {};
    if (configString) {
        try {
            config = JSON.parse(configString);
        } catch (error) {
            alert("Wrong JSON format");
            return;
        }
    }
    EFLPlayer.sendPostMessage("initializeModule", {stepName: stepName, config: config});
};

document.getElementById('next-button').onclick = function () {
    EFLPlayer.nextButtonTapped();
};

document.getElementById('back-button').onclick = function () {
    EFLPlayer.backButtonTapped();
};

document.getElementById('lang-button').onclick = function () {
    var lang = document.getElementById('lang-code').value;
    EFLPlayer.languageChanged(lang);
};