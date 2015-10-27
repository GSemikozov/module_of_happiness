var assert = require('assert');
var request = require('supertest');

var ENCRYPTER_URL = 'http://178.62.255.6:8080/';


describe('API', function () {
    describe('encrypter', function () {
        it('should 200 respond to correct request', function (done) {
            request(ENCRYPTER_URL)
                .post('')
                .send({
                    authorizationToken: 'ZDr+ZDdTYBuXlR89E/pWHA==\n',
                    requestToken: 'p8arNDlHWOEjHBVkRoLOwgno7Y+asJsfmu+Xvzq1mA4ypXM7h7nwq4vnVz92FkkEwQefv3OGiAXv\nrqyaRWT+0Pvy/0tCA/Omh2GSdkqZChQ=\n'
                })
                .expect('Content-Type', 'application/json')
                .expect(200, done);
        });
    });
});