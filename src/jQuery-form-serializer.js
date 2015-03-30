(function (root, $) {
    if (typeof $ === "undefined") {
        throw new Error("jQuery is not loaded.");
    }

    // Utils
    // https://github.com/jillix/utils
    var Utils = {};

    /**
     * findValue
     * Finds a value in parent (object) using the dot notation passed in dotNot.
     *
     * @name findValue
     * @function
     * @param {Object} parent The object containing the searched value
     * @param {String} dotNot Path to the value
     * @return {Anything} Found value or undefined
     */
    Utils.findValue = function(parent, dotNot) {

        if (!dotNot || !dotNot) return undefined;

        var splits = dotNot.split(".");
        var value;

        for (var i = 0; i < splits.length; ++i) {
            value = parent[splits[i]];
            if (value === undefined) return undefined;
            if (typeof value === "object") parent = value;
        }

        return value;
    };

    /**
     * findFunction
     * Finds a function in parent (object) using the dot notation passed in dotNot.
     *
     * @name findFunction
     * @function
     * @param {Object} parent The object containing the searched function
     * @param {String} dotNot Path to the function value
     * @return {Function} Function that was found in the parent object
     */
    Utils.findFunction = function(parent, dotNot) {

        var func = Utils.findValue(parent, dotNot);

        if (typeof func !== "function") {
            return undefined;
        }

        return func;
    };

    /**
     * flattenObject
     * Converts an object to a flat one
     *
     * @name flattenObject
     * @function
     * @param {Object} obj The object that should be converted
     * @return {Object} Flatten object
     */
    Utils.flattenObject = function(obj) {

        var result = {};

        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) continue;

            if (typeof obj[key] === 'object' && obj[key].constructor === Object) {

                var flat = Utils.flattenObject(obj[key]);
                for (var x in flat) {
                    if (!flat.hasOwnProperty(x)) {
                        continue;
                    }

                    result[key + '.' + x] = flat[x];
                }
            } else {
                result[key] = obj[key];
            }
        }
        return result;
    };

    /**
     * unflattenObject
     * Converts a flat object to an unflatten one
     *
     * @name unflattenObject
     * @function
     * @param {Object} flat The flat object that should be converted
     * @return {Object} Unflatten object
     */
    Utils.unflattenObject = function(flat) {

        var result = {};
        var parentObj = result;

        var keys = Object.keys(flat);
        for (var i = 0; i < keys.length; ++i) {

            var key = keys[i];
            var subkeys = key.split('.');
            var last = subkeys.pop();

            for (var ii = 0; ii < subkeys.length; ++ii) {
                var subkey = subkeys[ii];
                parentObj[subkey] = typeof parentObj[subkey] === 'undefined' ? {} : parentObj[subkey];
                parentObj = parentObj[subkey];
            }

            parentObj[last] = flat[key];
            parentObj = result;
        }

        return result;
    };


    // Converters
    var Converters = {
        string: function (value) {
            return String(value);
        },
        number: function (value) {
            return Number(value);
        },
        "boolean": function (value) {
            return (value === true || value === "true" || value === "on" || typeof value == "number" && value > 0 || value === "1");
        },
        "json": function (value) {
            if (!value) { return null; }
            return JSON.parse(value);
        }
    };

    $.fn.serializer = function (options) {

        if (typeof options === "") {

        }

        var settings = $.extend({

        }, options);

        var $self = this;

        // Multiple elements
        if ($self.length > 1) {
            $self.each(function () {
                $(this).serializer(options);
            });
            return $self;
        }

        // Handlers
        var handlers = {
            serialize: function (e) {
                var $form = $(this);
                var serializedForm = {};

                // Collect information from all [data-field] elements
                $form.find("[data-field]").each(function () {

                    // Get the current element
                    var $element = $(this)

                    // How to get the value?
                    var how = $element.attr("data-value") || "val";

                    // Get params
                    var params = $element.attr("data-params");

                    // Get field name
                    var field = $element.attr("data-field");

                    // Convert to
                    var convertTo = $element.attr("data-convert-to");

                    // Delete if
                    var deleteIfValue = $element.attr("data-delete-if");

                    // Arguments that are passed to how function
                    var howArguments = params ? [params] : [];

                    // Create the value
                    var value = $element[how].apply($element, howArguments);

                    // Convert to a valid value
                    if (convertTo && Converters[convertTo]) {
                        value = Converters[convertTo](value);
                        deleteIfValue = Converters[convertTo](deleteIfValue);
                    }

                    // Verify if value can be added
                    if (value === deleteIfValue) {
                        return;
                    }

                    // Set the value in the serialized form object using the field
                    serializedForm[field] = value;
                });

                // The final object should be unflatten
                serializedForm = Utils.unflattenObject(serializedForm);

                // emit an eventName or "serializedForm" event
                $self.trigger("serializer:data", [serializedForm]);
            },
            fill: function (e, data) {
                var flattenForm = Utils.flattenObject(data);
                var fields = Object.keys(flattenForm);

                fields.forEach(function (c) {
                    var $field = $("[data-field='" + c + "']", e.target);
                    var dataParams = $field.attr("data-params");
                    var dataValue = $field.attr("data-value");
                    var args = dataParams ? [dataParams] : [];

                    args.push(flattenForm[c]);
                    dataValue = dataValue || "val";

                    $field[dataValue].apply($field, args);
                });
                return;
            }
        };

        $self.on("serializer:submit", function () {
            handlers.serialize.apply(this, arguments);
        });

        $self.on("serializer:fill", function () {
            handlers.fill.apply(this, arguments);
        });

        function submit(e) {
            $(this).trigger("serializer:submit", e);
            e.preventDefault();
            return false;
        }

        $self.on("submit", "form", submit);
        $self.on("submit", submit);

        return $self;
    };
})(this, this.$ || this.jQuery);
