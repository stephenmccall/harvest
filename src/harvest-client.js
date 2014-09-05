(function($) {
    "use strict";
    var HARVESTJS = window.HARVESTJS = window.HARVESTJS || {};

    /**
     * Harvest constructor
     *
     * @class Harvest
     * @constructor
     * @param {string} $el The element to which the elements returned from the Harvest server will be appended
     * @param {Object} options Options for configuring the Harvest request
     * @return {Object} The instance of the Harvest object
     */
    HARVESTJS.Harvest = {};

    HARVESTJS.Harvest = function($el, options) {
        this.$el = $el || "body";
        var defaults = {
            server: "",
            url: "",
            selector: "",
            delay: 0,
            callBack: {
                callBackName: "callback"
            }
        };
        this.settings = $.extend({}, defaults, options);
        this.init(this);
        return this;
    };

    /**
     * Formats string to be used in the request to the Harvest server
     *
     * @method init
     * @private
     * @param {Object} harvest The server location and data to be passed to the Harvest server
     * @return {boolean} success or failure
     */
    HARVESTJS.Harvest.prototype.init = function(harvest) {

        var url = harvest.settings.server + '?data={"url":"' + escape(harvest.settings.url) + '","selector":"' + escape(harvest.settings.selector) + '","delay":"' + escape(harvest.settings.delay) + '"}&callBack=' + escape(harvest.settings.callBack.callBackName);

        $.getScript(url).done(function(script, textStatus) {

            return true;

        }).fail(function(jqxhr, settings, exception) {

            return false;

        });

    };

    /**
     * Defines the callback method the Harvest server will return the data to and Appends all data returned to the specified element
     *
     * @method callback
     * @private
     * @param {Object} data The data returned from the Harvest server
     * @return {boolean} success or failure
     */
    HARVESTJS.Harvest.prototype.callback = function(data) {

        if (data) {

            var selections = data.harvest;

            for (var i = 0; i < selections.length; i++) {

                $(this.$el).append(unescape(selections[i]));

            }

            /**
             * Call next function if provided
             */

            if (this.settings.callBack.next) {

                var fn = this.executeFunctionByName(this.settings.callBack.next.functionName, this.settings.callBack.next.scope, this.settings.callBack.next.arguments);


            }
            return true;

        } else {

            return false;

        }

    };

    /**
     * Helper function to assist in chaining of function calls
     *
     * @method executeFunctionByName
     * @private
     * @param functionName {string} the name of the function to be called
     * @param scope {object} scope of the function to be called
     * @param args {array} arguments to be passed to the function to be called
     * @return {function} invocation of function to be called
     */
    HARVESTJS.Harvest.prototype.executeFunctionByName = function(functionName, scope, args) {

        scope = scope === undefined ? window : scope;

        var argsLocal = Array.prototype.slice.call(arguments, 2);
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            scope = scope[namespaces[i]];
        }
        return scope[func].apply(scope, argsLocal);
    };


    return HARVESTJS.Harvest;

})(jQuery);
