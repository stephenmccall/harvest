var http = require('http');
var phantom = require('node-phantom');
var node_redis = require('redis');

var ipaddress = "127.0.0.1";
var port = "8123";

var redis = node_redis.createClient();

redis.on("error", function(err) {
    console.log("Redis Error: " + err);
});

var server = http.createServer(function(req, res) {

    var Harvest = {

        data: "",
        url: "",
        selector: "",
        delay: 0,
        result: "",
        callback: "callBack",
        error: "",
        exit: 0,
        redisKey: "",
        jQuery: "jquery.min.js",
        harvestAssist: "harvest-assist.js",

        isEmpty: function(object) {
            for (var i in object) {
                return false;
            }
            return true;
        },

        onExit: function() {

            if (Harvest.error) {

                console.log("The following error occurred: " + Harvest.error);

            } else {
                //Set redis key - store result for 1 hour
                redis.setex(Harvest.redisKey, 3600, Harvest.result);

                console.log("Selections retuned: " + Harvest.result);

                var start = Harvest.callback + '({"harvest":';
                start += '[';
                var end = ']})';

                res.write(start + Harvest.result + end);

                this.exit = 1;

                res.end();

            }

        }
    };


    res.writeHead(200, {
        'Content-Type': 'text/javascript;charset=UTF-8;charset=iso-8859-1'
    });

    var parts = require('url')
        .parse(req.url, true);


    if (!(Harvest.isEmpty(parts.query))) {

        console.log("Parameters supplied in request: ");

        for (var key in parts.query) {

            console.log("Parameter: " + key + ", value: " + parts.query[key]);

            try {

                if (key === "data") {

                    Harvest.data = unescape(parts.query[key]);
                    Harvest.data = JSON.parse(Harvest.data);

                    Harvest.url = Harvest.data.url;
                    Harvest.selector = Harvest.data.selector;
                    Harvest.delay = Harvest.data.delay;

                    Harvest.redisKey = Harvest.url + Harvest.selector + Harvest.delay;

                }

                if (key === "callBack") {

                    Harvest.callback = parts.query[key];

                }

            } catch (e) {
                console.log("Error: " + e);
            }

        }
    } else {
        res.write("<p>There were no parameters received in your request or they were not formatted properly.</p>");
    }

    //Get redis key
    redis.get(Harvest.redisKey, function(err, result) {

        if (err || !result) {

            phantom.create(function(err, ph) {

                return ph.createPage(function(err, page) {

                    page.selector = Harvest.selector;
                    page.delay = Harvest.delay;

                    console.log("URL provided in request: " + Harvest.url);

                    return page.open(Harvest.url, function(err, status) {

                        console.log("Did the request for the URL succeed?: ", status);

                        if (status !== 'success') {
                            console.log("The following error occurred: ", err);
                        } else {

                            console.log("URL opened successfully.");

                            console.log("Injecting jQuery and harvest-assist.js");

                            page.injectJs(Harvest.jQuery);
                            page.injectJs(Harvest.harvestAssist);

                            if (typeof page.selector !== "undefined") {

                                console.log("Executing jQuery selection...");

                                eval("var pageEvaluateFunction = function() {return getSelector('" + page.selector + "')}");

                                setTimeout(function() {

                                    return page.evaluate(pageEvaluateFunction,

                                        function(err, result) {

                                            Harvest.error = err;
                                            Harvest.result = result;
                                            Harvest.onExit();

                                            return ph.exit();

                                        });
                                }, page.delay);

                            }

                        }

                    });


                });


            });



        } else {

            Harvest.error = err;
            Harvest.result = result;
            Harvest.onExit();

        }
    });




})
    .listen(port, ipaddress);
