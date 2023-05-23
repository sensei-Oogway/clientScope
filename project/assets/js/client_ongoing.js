window.addEventListener('load', function () {
    $("#client_toolbar_ongoing").click(function (event) {
        toggleSelected($("#client_toolbar_ongoing"))
        sendAjaxRequest("ongoing", "GET", {}, load_ongoing_page)

    });

    $("#client_toolbar_history").click(function (event) {
        toggleSelected($("#client_toolbar_history"))
        load_history()
    });

    var overlay2 = document.getElementById("review_div");

    document.addEventListener("focusout", function (event) {
        if (!overlay2.contains(event.relatedTarget)) {
            overlay2.style.display = "none";
        }
    });

})

var load_ongoing_page = function (response) {

    if (response == "empty") {
        $("#nothing_here").show()
    } else {
        if ($("#nothing_here").is(':visible')) {
            $("#nothing_here").hide()
        }

        $("#client_ongoing_container").html(response)
        $("#client_ongoing_container").show()

        load_ongoing_listeners()
    }
}

var load_ongoing_listeners = function () {

    $('button[data-offer-id]').click(function(event) {
        var offerId = $(this).data('offer-id');

        sendAjaxRequest("acceptoffer","POST",{"offerId":offerId},(response)=>{
            if(response == "success"){
                $("#client_toolbar_ongoing").trigger("click")
            }
        })
        
      });

    $('button[data-request-id]').click(function (event) {
        var requestId = $(event.target).attr('data-request-id');

        $("#close_request").attr("rqid", requestId)
        $("#review_div").show()
    });

    $("#close_request").click(function () {
        var requestId = $(this).attr('rqid');

        if ($("#rating").val() == '' || $("#comment").val() == '') {
            toastr.warning('Fill all fields');
            return
        }

        var rating = parseInt($("#rating").val())
        var comment = $("#comment").val()

        sendAjaxRequest("close", "POST", { "requestId": requestId, "rating": rating, "comment": comment }, (response) => {
            if (response == "success") {
                $("#review_div").hide()
                $("#client_toolbar_ongoing").trigger("click")
                toastr.success('Job completed successfully!');
            }
        })
    })
}

var load_history = function(){
    sendAjaxRequest("history", "GET", {}, (response) => {
        if (response == "empty") {
            $("#nothing_here").show()
        } else {
            if ($("#nothing_here").is(':visible')) {
                $("#nothing_here").hide()
            }
            $("#client_ongoing_container").html(response)
            $("#client_ongoing_container").show()
        }
    })
}