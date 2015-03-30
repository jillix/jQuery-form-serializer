$(document).ready(function () {
    $("form")
        .serializer()
        .on("serializer:data", function (e, data) {
            if (e.target.id === "fill-form") {
                return $(".demo-form").trigger("serializer:fill", [data.content]);
            }
            alert(JSON.stringify(data, null, 4));
        })
        ;
});
