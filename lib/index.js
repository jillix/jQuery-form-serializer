if (typeof $ === "undefined") {
    throw new Error("jQuery is not loaded.");
}

// Dependencies
var Utils = require("jxutils");

// Converters
var Converters = {
    string: function (value) {
        return String(value);
    },
    number: function (value) {
        return Number(value);
    },
    boolean: function (value) {
        return (value === true || value === "true" || value === "on" || typeof value == "number" && value > 0 || value === "1");
    },
    json: function (value) {
        if (!value) { return null; }
        return JSON.parse(value);
    }
};

/**
 * serializer
 * Create the form serializer.
 *
 * @name serializer
 * @function
 * @return {jQuery} The selected elements.
 */
$.fn.serializer = function () {

    var $self = this;

    // Multiple elements
    if ($self.length > 1) {
        $self.each(function () {
            $(this).serializer();
        });
        return $self;
    }

    // Handlers
    var handlers = {
        serialize: function (e) {
            var $form = $(this)
              , serializedForm = {}
              ;

            // Collect information from all [data-field] elements
            $form.find("[data-field]").each(function () {

                // Get the current element
                var $element = $(this)

                    // How to get the value?
                  , how = $element.attr("data-value") || "val"

                    // Get params
                  , params = $element.attr("data-params")

                    // Get field name
                  , field = $element.attr("data-field")

                    // Convert to
                  , convertTo = $element.attr("data-convert-to")

                    // Delete if
                  , deleteIfValue = $element.attr("data-delete-if")

                    // Arguments that are passed to how function
                  , howArguments = params ? [params] : []

                    // Create the value
                  , value = $element[how].apply($element, howArguments)
                  ;

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

            // "serializer:data" event
            $(this).trigger("serializer:data", [serializedForm]);
        },
        fill: function (e, data) {
            var $fields = $("[data-field]", e.target)

            $fields.each(function () {
                var $field = $(this)
                  , path = $field.attr("data-field")
                  , value = Utils.findValue(data, path)
                  , dataParams = $field.attr("data-params")
                  , dataValue = $field.attr("data-value") || "val"
                  , args = dataParams ? [dataParams] : []
                  , convertTo = $field.attr("data-convert-to")
                  ;

                if (convertTo === "json" && typeof value !== "string") {
                    value = JSON.stringify(value, null, 4);
                }

                args.push(value);

                $field[dataValue].apply($field, args);
            });
            return;
        }
    };

    $self.on("serializer:submit", function (e) {
        handlers.serialize.apply(e.target, arguments);
    });

    $self.on("serializer:fill", function (e) {
        handlers.fill.apply(e.target, arguments);
    });

    function submit(e) {
        $(this).trigger("serializer:submit", [e]);
        e.preventDefault();
        return false;
    }

    $self.on("submit", "form", submit);
    $self.on("submit", submit);

    return $self;
};

$.fn.serializer.converters = Converters;

$.fn.serializer.version = "1.2.0";
