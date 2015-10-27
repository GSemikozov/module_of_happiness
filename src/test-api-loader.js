import {EFLDiscoveryModule} from './discovery';
import {EFLPlayer} from './player.js';
import {JOURNEY_STATE, EFLJourney} from './journey.js';
import {MODULE_EVENTS} from './module-events.js'

(function initializeLoader() {
    window.loadDiscoveryModule = function (context) {
        if (!context.EFLDiscoveryModule) {
            context.EFLDiscoveryModule = new EFLDiscoveryModule(context);
        }
    };

    window.unloadDiscoveryModule = function (context) {
        if (context.EFLDiscoveryModule) {
            context.EFLDiscoveryModule.removeListener();
            delete context.EFLDiscoveryModule;
        }
    };

    window.loadPlayer = function (context) {
        if (!context.EFLPlayer) {
            context.EFLPlayer = new EFLPlayer(context);
        }
    };

    window.unloadPlayer = function (context) {
        if (context.EFLPlayer) {
            context.EFLPlayer.removeListener();
            delete context.EFLPlayer;
        }
    };

    window.loadJourney = function (context) {
        if (!context.EFLJourney) {
            context.EFLJourney = new EFLJourney(context);
        }
    };

    window.unloadJourney = function (context) {
        if (context.EFLJourney) {
            delete context.EFLJourney;
        }
    };

    window.JOURNEY_STATE = JOURNEY_STATE;
    window.MODULE_EVENTS = MODULE_EVENTS;
})();
