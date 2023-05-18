window.addEventListener('load', function () {

    //Toaster
    toastr.options = {
        timeOut: 500
    };

    // Tool bar section
    $("#client_toolbar_request").click(function (event) {
        toggleSelected($("#client_toolbar_request"))


    });

    $("#client_toolbar_ongoing").click(function (event) {
        toggleSelected($("#client_toolbar_ongoing"))
        //sendAjaxRequest("ongoing","GET",{},load_ongoing_page)

    });

    $("#client_toolbar_history").click(function (event) {
        toggleSelected($("#client_toolbar_history"))
    });



})



// Functions
var toggleSelected = function (to) {
    $(".toolbar .selected").removeClass("selected")
    $(to).addClass("selected")

    // var firstVisibleChild = $("#home_body > :visible").first();
    // firstVisibleChild.hide()
}