window.addEventListener('load', function () {
    $("#client_toolbar_ongoing").click(function (event) {
        toggleSelected($("#client_toolbar_ongoing"))
        sendAjaxRequest("ongoing","GET",{},load_ongoing_page)

    });
})

var load_ongoing_page = function(response){
    console.log(response)
    //$("#client_ongoing_container").html(response)
    //$("#client_ongoing_container").show()
}