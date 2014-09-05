jQueryHarvest = jQuery.noConflict(true);

/**
 * Peforms jQuery selection and returns the URL encoded result
 *
 * @method getSelector
 * @param {string} selector The jQuery selector to be executed
 * @return {string} Comma separated string of DOM selections
 */

function getSelector(selector) {

    var html = jQueryHarvest(selector);
    var result = "";
    var len = html.length;

    html.each(function(index, element) {

        if (jQueryHarvest(this).html()) {

            if (result !== "undefined") {

                var selection = escape(jQueryHarvest(this).html());

                if (index !== len - 1) {

                    result += '"' + selection + '",';

                } else {

                    result += '"' + selection + '"';

                }

            }

        }

    });

    return result;

}
