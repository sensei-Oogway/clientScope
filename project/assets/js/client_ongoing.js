window.addEventListener('load', function () {
    $("#client_toolbar_ongoing").click(function (event) {
        toggleSelected($("#client_toolbar_ongoing"))
        sendAjaxRequest("ongoing","GET",{},load_ongoing_page)

    });
})

var load_ongoing_page = function(response){
    //console.log(response)
    $("#client_ongoing_container").html(response)
    $("#client_ongoing_container").show()

    load_ongoing_listeners()
}

var load_ongoing_listeners = function(){
    $('button[data-offer-id]').click(function(event) {
        // Get the offer ID from the data attribute
        var offerId = $(this).data('offer-id');
        //var requestId = $(event.target).closest('[data-request-id]').data('request-id');

        sendAjaxRequest("acceptoffer","POST",{"offerId":offerId},(response)=>{
            if(response == "success"){
                $("#client_toolbar_ongoing").trigger("click")
            }
        })
        
        //console.log('Clicked button with offer ID:', offerId + " "+ requestId);
      });
}