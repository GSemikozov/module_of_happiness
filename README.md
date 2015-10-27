# Applicant Journey Web Player

## Usage

### Discovery Module API

To use the Discovery Module API you need to include library file:

```
<script src="efl-discovery.min.js"></script>
```

That adds global variable `EFLDiscoveryModule` to the window, which you use to communicate with the library.

#### Initialization

To initialize the library you need to call `EFLDiscoveryModule.init(config)` method, where config is an object in which
you set handlers that will be called on library events. `config` can have properties:

*   `initModuleHandler` - function that is called when module should init its value. It will get two parameters: 
    +   `stepName`
    +   `config`
*   `backButtonHandler` - called when external back button was clicked
*   `nextButtonHandler` - called when external next button was clicked
*   `changedLanguageHandler` - called when language was changed. It gets locale code string as a parameter.

Example:

```
var initHandler = function (stepName, config) {};
var backHandler = function () {};
var nextHandler = function () {};
var langHandler = function (lang) {};

EFLDiscoveryModule.init({
    initModuleHandler: initHandler,
    backButtonHandler: backHandler,
    nextButtonHandler: nextHandler,
    changedLanguageHandler: langHandler
});
```

#### Other methods

*   `EFLDiscoveryModule.loadedModule()` - should be called after loading the module and finishing its configuration;
*   `EFLDiscoveryModule.loadedScreen(navigation)` - called when a new screen is loaded. `navigation` is an object that
    is used to pass the information which external navigation elements should be visible. Example:
    
    ```
    EFLDiscoveryModule.loadedScreen({
        showNextButton: true,     // to show next button
        showBackButton: true,     // to show back button
        hideTitle: true,          // to hide title
        hideProgress: true        // to hide progress bar
    });
    ```
    
*   `EFLDiscoveryModule.finishedScreen(progress)` - called when screen is finished. Progress should be a percentage of 
    completion of the module after that screen (value between 0 and 100);
*   `EFLDiscoveryModule.finishedModule(observations)` - use to pass the observations after finishing the module;
*   `EFLDiscoveryModule.caughtException(category, message)` - called when some error occurred in the module. Both parameters
    should be string.

### Player API

TBD

### Journey API

TBD

## Scripts

### Setup

Before you can start you need to have your [Node.js](https://nodejs.org/) (with [npm](https://www.npmjs.com/)) installed.

To install the project type: `npm install`.

### Building

To build the project type: `node_modules/.bin/gulp build`. That will create libraries files in dist dictionary:
`efl-discovery.js`, `efl-player.js`, `efl-journey.js` and copy necessary third-party libraries.
 
To create minified version of the libraries that are concatenated with external libraries run `node_modules/.bin/gulp release`. 

### Testing

#### All Tests

`npm test` command runs all tests in the project.
 
#### Browser Tests

To run tests in your browser you need to:

1. Run http-server: `node_modules/.bin/http-server`
2. Access test site: [http://127.0.0.1:8080/tests/phantom/test-runner.html](`http://127.0.0.1:8080/tests/phantom/test-runner.html`)

### Demo

To build demo app run `node_modules/.bin/gulp demo` which creates all necessary files in demo folder.
You need to host that folder on some HTTP server to work. You can fo example run `node_modules/.bin/http-server ./demo`
and then open [http://127.0.0.1:8080](`http://127.0.0.1:8080`) in the browser.

### Docker deploy.

You can also run demo app using Docker container.

1. Install Docker with docker-compose.
2. Add file `env`.
3. Fill `env` file with variables:
```
JUST=IGNORE
```
4. Create file `docker-compose.yml`.
5. Fill this file with:
```
server:
    extends:
        file: common-docker-compose.yml
        service: server
    ports:
        - "<your_public_port>:8080"
```
6. Run `docker-compose build`
6. Run `docker-compose up -d`