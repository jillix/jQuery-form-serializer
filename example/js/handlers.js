$(document).ready(function () {
    $("form")
        .serializer()
        .on("serializer:data", function (e, data) {
            alert(JSON.stringify(data, null, 4));
        })
        ;
});
