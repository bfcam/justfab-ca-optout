var require = patchRequire(require);

var WIDTH = 1366;
var HEIGHT = 768;
var UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/600.8.9 (KHTML, like Gecko) Version/8.0.8 Safari/600.8.9';

var casper = require('casper').create({
    viewportSize: { width: WIDTH, height: HEIGHT },
    pageSettings: {
        userAgent: UA
    }
});

exports.casper = casper;

exports.exit = function(success, data) {
    if (!success) {
        casper.echo('ERROR: ' + data);
    }

    casper.exit();
};

exports.takeSnapshot = function() {
    var date = new Date();
    var name = 'snapshot_' + (date.getTime() / 1000) + '.png';
    var fullname = 'snapshots/' + name;

    casper.capture(fullname, {
        top: 0,
        left: 0,
        width: WIDTH,
        height: HEIGHT
    });

    return name;
};

exports.error = function(reason) {
    var name = exports.takeSnapshot();

    exports.exit(false, reason + ' -- See ' + name);
};

casper.baseInjected = false;

casper.openWaitForReady = function(url) {
    casper.open(url).then(function() {
        casper.evaluate(function() {
            var tid = setInterval(function () {
                if (document.readyState !== 'complete') {
                    return;
                }

                clearInterval(tid);
                window.CasperSiteReady = true;
            }, 100);
        });

        casper.waitFor(function() {
            return this.evaluate(function() {
                return window.CasperSiteReady;
            }) === true;
        },
        function() {},
        function() {
            exports.takeSnapshot();
            return exports.exit(false, 'Document was never ready');
        }, 45000);
    });

    return casper;
};

casper.waitAndFollowLink = function(selector, timeout) {
    var THIS = this;

    if (!timeout) {
        timeout = 10000;
    }

    casper.waitFor(function check() {
        return casper.evaluate(function(linkSelector) {
            var $link = jQuery(linkSelector + '[href]');
            return $link.attr('href') ? true : false;
        }, selector) === true;
    }, function() {
        var url = casper.evaluate(function(linkSelector) {
            return jQuery(linkSelector + '[href]').attr('href');
        }, selector);

        if (!url) {
            exports.takeSnapshot();
            return exports.exit(false, 'Could not find valid link url: ' + selector);
        }

        casper.open(url, {
            headers: {
                'Referer': THIS.getCurrentUrl()
            }
        });
    }, function() {
        exports.takeSnapshot();
        return exports.exit(false, 'Could not find link: ' + selector);
    }, timeout);

    return casper;
};

casper.waitAndLoadIframe = function(selector, timeout) {
    if (!timeout) {
        timeout = 20000;
    }

    casper.waitFor(function check() {
        return casper.evaluate(function(frameSelector) {
            var $frame = jQuery(frameSelector + '[src]');
            return $frame.attr('src') ? true : false;
        }, selector) === true;
    }, function() {
        var src = casper.evaluate(function(frameSelector) {
            return jQuery(frameSelector + '[src]').attr('src');
        }, selector);

        if (!src) {
            exports.takeSnapshot();
            return exports.exit(false, 'Could not find valid iframe source: ' + selector);
        }

        casper.open(src);
    }, function() {
        exports.takeSnapshot();
        return exports.exit(false, 'Could not find iframe: ' + selector);
    }, timeout);

    return casper;
};

casper.on('resource.received', function(resource) {
    var THIS = this;

    if (!THIS.baseInjected) {
        THIS.page.injectJs('base.js');
        THIS.baseInjected = true;
    }
});
