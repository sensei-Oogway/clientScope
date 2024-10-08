window.addEventListener('load', function () {

    //Toaster
    toastr.options = {
        timeOut: 500
    };

    // Tool bar section
    $("#client_toolbar_request").click(function (event) {
        toggleSelected($("#client_toolbar_request"))
        sendAjaxRequest("jobs","GET",{},load_home_page)


    });

    $("#client_toolbar_request").trigger("click")

    $("#client_toolbar_ongoing").click(function (event) {
        toggleSelected($("#client_toolbar_ongoing"))
        sendAjaxRequest("ongoing","GET",{},load_ongoing_page)

    });

    $("#client_toolbar_history").click(function (event) {
        toggleSelected($("#client_toolbar_history"))
        load_history()
    });

    var overlay1 = document.getElementById("job-details");

    document.addEventListener("focusout", function (event) {
        if (!overlay1.contains(event.relatedTarget)) {
            overlay1.style.display = "none"; 
            $('#job-details').removeAttr('req-id')
        }
    });

    var overlay2 = document.getElementById("ongoing-details");

    document.addEventListener("focusout", function (event) {
        if (!overlay2.contains(event.relatedTarget)) {
            overlay2.style.display = "none"; 
        }
    });



})



// Functions
var toggleSelected = function (to) {
    $(".toolbar .selected").removeClass("selected")
    $(to).addClass("selected")

    var firstVisibleChild = $("#home_body > :visible").first();
    firstVisibleChild.hide()
}

var sendAjaxRequest = function(url,method,data,success){
    $.ajax({
        url: url,
        type: method,
        data: data,
        success: function (response) {
            success(response)
            //return response
        },
        error: function () {
            console.log('AJAX error');
        }
    });
}

var load_home_page = function(response){
    if(response == "empty"){
        $("#nothing_here").show()
    }else{
        if($("#nothing_here").is(':visible')){
            $("#nothing_here").hide()
        }
        $("#professional_requests_container").html(response)
        $("#professional_requests_container").show()
    
        addEventListeners_homePage()
    }
}

var addEventListeners_homePage = function(){

    $(".job-details").click(function (event) {
        var triggerElement = event.target;
        data = jQuery(triggerElement).data('content')
        service_name = jQuery(triggerElement).data('nmcontent')
        var requestId = $(triggerElement).closest('[data-request-id]').data('request-id');


        var entries = data.split("$$");
        var detailsList = $('.details-list');
        detailsList.html("")

        $.each(entries, function(index, entry) {
            var listItem = $('<li>').text(entry);
            detailsList.append(listItem);
        });

        $("#details-title").html(service_name)

        $('#job-details').attr('req-id', requestId);
        $('.job-details-reject').prop('disabled', false);
        $('#job-details').show()
    });

    $(".job-details-accept").click(function(){
        requestId = $('#job-details').attr('req-id')
        sendAjaxRequest("accept","POST",{"offer_id":requestId},(response)=>{
            if(response == "success"){
                $('#job-details').hide()
                $("#client_toolbar_request").trigger("click")

            }
        })
    })

    $(".job-details-reject").click(function(){
        //$('.job-details-reject').prop('disabled', true);
        requestId = $('#job-details').attr('req-id')
        sendAjaxRequest("reject","POST",{"offer_id":requestId},(response)=>{
            if(response == "success"){
                $('#job-details').hide()
                $("#client_toolbar_request").trigger("click")

            }
        })
    })




    
}

var load_ongoing_page = function(response){
    if(response == "empty"){
        $("#nothing_here").show()
    }else{
        if($("#nothing_here").is(':visible')){
            $("#nothing_here").hide()
        }
        $("#professional_requests_container").html(response)
        $("#professional_requests_container").show()
    
        addEventListeners_ongoing()
    }
    //console.log(response)
}

var addEventListeners_ongoing = function(){
    $(".ongoing-details").click(function (event) {
        var triggerElement = event.target;
        data = jQuery(triggerElement).data('content')
        service_name = jQuery(triggerElement).data('nmcontent')

        var entries = data.split("$$");
        var detailsList = $('.ongoing-list');
        detailsList.html("")

        $.each(entries, function(index, entry) {
            var listItem = $('<li>').text(entry);
            detailsList.append(listItem);
        });

        $("#details-title").html(service_name)
        $('#ongoing-details').show()
    });
}

var load_history = function(){
    sendAjaxRequest("history", "GET", {}, (response) => {
        if (response == "empty") {
            $("#nothing_here").show()
        } else {
            if ($("#nothing_here").is(':visible')) {
                $("#nothing_here").hide()
            }
            $("#professional_requests_container").html(response)
            $("#professional_requests_container").show()
        }
    })
}