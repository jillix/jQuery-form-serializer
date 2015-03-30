$(document).ready(function () {
    $("form")
        .serializer()
        .on("serializer:data", function (data) {
            alert(JSON.stringify(data));
        })
        ;
});
