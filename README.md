Harvest
=======

Super simple cross domain DOM querying

Harvest is a super simplified Node-based web scraping service enabling client side JavaScript to retrieve elements within the DOM of documents hosted at any other publicly accessible address.


Requirements
------------
You will need to have Node [http://nodejs.org/] & Grunt [http://gruntjs.com/] & PhantomJS installed [http://phantomjs.org/download.html].

Harvest makes use of the node-phantom [https://github.com/alexscheelmeyer/node-phantom] bridge which also has a dependency on [socket.io](http://socket.io/).

Harvest also assumes use of the jQuery library [http://jquery.com/download/].

Installing
----------

Download the contents of this repo and place all files in the same directory on your web server.

Then run:

    npm install
    grunt

Due to a backwards compatibiity issue with the recent 1.0 release of socket.io you will need to manually revert the version of this library declared in the node-phantom package.json file.

To accomplish this do the following:

    cd node_modules/node-phantom
    edit package.json
    remove ">=" from the following line:
    "dependencies": {
    "socket.io": ">=0.9.6"
    }
    save edits
    npm install


Usage
------------

Harvest consists of 4 primary JS files.

  - harvest.js: a Node web server leveraging the node-phantom bridge
  - harvest-assist.js: contains a utility function used to execute jQuery DOM selection on the pages loaded in to the PhantomJS browser by harvest.js
  - harvest-client.js: a utility libary to simplify working with the responses provided by the harvest.js server
  - jquery.min.js: a version of the jQuery 1.x library

By default harvest.js will try to load the "jquery.min.js" library and "harvest-assist.js" files from the same directory in which it is run.  The path to and names of these files can be changed by editing the "jQuery" and "harvestAssist" properties in the harvest.js file.

The default address of this server will be:  http://localhost:8123.  This can be changed by editing the "server" and "port" variables in the harvest.js file.  The address of this server should be publicly accessible.

To start the Harvest server, from the /src directory run:

    node harvest

With the server running you can now submit requests.

Harvest expects two parameters to be passed with each request:

  - A "data" parameter in JSON format and a "callBack" parameter as a string.
  - A "callBack" parameter as a string

The JSON object passed in the "data" parameter should contain the following properties:

  - url (string) = Fully qualified URL of the page containing the desired element(s)
  - selector (string) = jQuery style CSS selector statement to be used to match element(s) on the page at the requested URL
  - delay (int) = number of milliseconds to wait before querying the DOM after the page at the requested URL has completed loading in the PhantomJS browser

Harvest makes use of the JSONP communication technique.  The "callBack" parameter is the name of the function to which the object in the return value of the harvest server will be passed.

Both the "data" and "callBack" parameters should be URL encoded prior to the request being sent.  The harvest-client.js file contains utility functions to simplify this.

Example request URL:

    http://localhost:8123/?data={"url":"http://www.example.com","selector":"h1","delay":"0"}&callBack=myCallBack

Escaped equivalent:

    http://localhost:8123/harvest?data={%22url%22:%22http%3A//www.example.com%22,%22selector%22:%22h1%22,%22delay%22:%220%22}&callBack=myCallBack

Example response format:

    myCallBack({"harvest":["selection","selection","selection"]})

It is important to note that the selections in the response from the harvest.js server will be URL encoded and the string will need to be unescaped in order to be useful.  The harvest-client.js file contains utility functions to simplify this.

```Example usage with the harvest-client.js utility file

var harvest = new HARVESTJS.Harvest('#container', {
    server: "http://localhost:8123/",
    url: "https://www.example.com/",
    selector: "h1",
    delay: 0,
    callBack: {
        callBackName: "harvest.callback"
         //Example of how to chain synchronous calls to the Harvest service
        next: {
            functionName: "nextFunction",
            scope: myObj,
            arguments: ["argument1", "argument2", ["argument3"]]
        }
    }
});

var myObj = {};

myObj.nextFunction = function (arg1, arg2, arg3) {

    this.harvest2 = new HARVESTJS.Harvest('#container', {
        server: "http://localhost:8123/",
        url: "https://www.example.com/",
        selector: "p",
        delay: 0,
        callBack: {
            callBackName: "myObj.harvest2.callback"
        }
    });

}

Please see the /docs directory for more information on how to leverage the methods available in harvest-client.js to make working with responses from the harvest.js server easier.

Other
------------
An example version of the Harvest service is available at:

http://www.stephenmccall.com/harvest

A socket based version of the harvest.js script leveraging the socket.io library (http://socket.io/) on both client and server will be available soon.
