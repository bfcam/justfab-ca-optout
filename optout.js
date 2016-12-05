var driver = require('driver');
var casper = driver.casper;

var WAIT_TIME = 15000;
var EMAIL = 'your@email.com';
var PASSWORD = 'yourpassword';

casper.start('https://www.justfab.ca/index.cfm?action=account.login', function () {
    var THIS = this;

    THIS.waitForSelector('form#loginForm', function () {
        this.fill('form#loginForm', {
            'reference_data': EMAIL,
            'verification_data': PASSWORD
        }, false);

        if (!THIS.exists('form#loginForm button[type="submit"]')) {
            return driver.exit(false, 'Could not find login form submit button');
        }

        this.mouseEvent('click', 'form#loginForm button[type="submit"]');
    }, function() {
        driver.error('Could not find login form');
    }, WAIT_TIME);
});

casper.then(function() {
    this.waitForSelector('header.logged-in', function () {
    }, function() {
        driver.error('Could not login');
    }, WAIT_TIME);
});

casper.then(function() {
    this.waitForSelector('#my_boutique_nav > .link', function () {
        this.mouseEvent('click', '#my_boutique_nav > .link');
    }, function() {
        driver.error('Could not find my boutique link');
    }, WAIT_TIME);
});

casper.then(function() {
    this.waitForSelector('#hero .popup_skip', function () {
        this.mouseEvent('click', '#hero .popup_skip');
    }, function() {
        driver.error('Could not find skip this month');
    }, WAIT_TIME);
});

casper.then(function() {
    this.waitForSelector('#popup_skip_intro .skip_proceed', function () {
        this.mouseEvent('click', '#popup_skip_intro .skip_proceed');
    }, function() {
        driver.error('Could not find skip proceed button');
    }, WAIT_TIME);
});

casper.thenOpen('http://justfab.ca', function() {
    this.waitForSelector('#hero .popup_skip', function () {
        driver.error('Skip this month did not succeed!');
    }, function() {
    }, WAIT_TIME);
});

casper.run(function() {
    driver.exit(true);
});
