window.addEventListener('load', function () {

    //Toaster
    toastr.options = {
        timeOut: 750
    };

    //tool tip
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
      });

    // Tool bar section
    $("#client_toolbar_request").click(function (event) {
        toggleSelected($("#client_toolbar_request"))
        $("#client_request_menu").show()

    });


    // Request menu section
    $("#client_request_menu .grid-item").each(function(){
        $(this).on("click", function() {
            var formNum = $(this).attr("class").split("request_menu_")[1];
            openRequestForm(formNum)
        })
    })

    // Request forms
    $(".form-back").each(function(){
        $(this).on("click", function() {
            closeRequestForm()
            $("#client_request_menu").show()
        })
    })

    $(".request_form .btn-primary").each(function(){
        $(this).on("click", function() {
            submitRequestForm()
            
        })
    })


})


// Functions
var toggleSelected = function(to){
    $(".toolbar .selected").removeClass("selected")
    $(to).addClass("selected")

    closeRequestForm()

    var firstVisibleChild = $("#home_body > :visible").first();
    firstVisibleChild.hide()
}

var openRequestForm = function(formNum){
    $("#client_request_menu").hide()
    $("#client_request_forms_container").show()

    var form_id = 'client_request_form_'+formNum
    var formDiv = $("[id^='" + form_id + "']")
    formDiv.addClass("openRequestForm")
    formDiv.show()
}

var closeRequestForm = function(){
    $(".openRequestForm").hide()
    $(".openRequestForm").removeClass("openRequestForm")
    $("#client_request_forms_container").hide()
}

var submitRequestForm = function(){
    request_form = $(".openRequestForm .request_form")

    var formValid = true;
    request_form.find("input").each(function () {
        if ($(this).val() === '') {
            formValid = false;
            return false;
        }
    });
    formValid = true; // TO BE REMOVED
    if (!formValid) {
        toastr.warning('Fill all fields');
        return
    } 
    //SHOW SUMMARY BEFORE SUBMISSION
    //Calculate price
    //Submit
    var formData = request_form.serializeArray();
    var formObject = {};

    for (var entry of formData.entries()) {
        var obj = entry[1];
        formObject[obj.name] = obj.value;
    }

    formData_clean = cleanFormData(formObject)
    //console.log(formData_clean)

    var success = function(response){
        if(response == "success"){
            toastr.success('Form submitted successfully');
        }
    }

    response = sendAjaxRequest("home/submitForm","POST",formData_clean,success)
    closeRequestForm()
    $("#client_request_menu").show()
}

var cleanFormData =  function (formData){
    data = {}
    id = formData.formId

    //location, amount, details, servicetype
    if(id == 1){
        data['serviceType'] = 1
        data['location'] = formData.location
        //Calculate amount
        data['amount'] = 25

        //Build details
        details = "Tree removal$$Count="+formData.count+"$$Moving="+formData.hasOwnProperty("move")
        data['details'] = details
    }
    else if(id == 2){
        data['serviceType'] = 2
        data['location'] = formData.location
        //Calculate amount
        data['amount'] = 100

        //Build details
        details = "Roof cleaning$$Roof type="+formData.roof_type+"$$Area="+formData.roof_area
        data['details'] = details

    }
    else if(id == 3){
        data['serviceType'] = 3
        data['location'] = formData.location
        //Calculate amount
        data['amount'] = 200

        //Build details
        details = "Fence installation$$Area="+formData.fence_area
        data['details'] = details

    }
    else if(id == 4){
        data['serviceType'] = 4
        data['location'] = formData.location
        //Calculate amount
        data['amount'] = 20

        //Build details
        details = "Oven Cleaning$$Oven type="+formData.oven_type
        data['details'] = details
    }
    else if(id == 5){
        data['serviceType'] = 5
        data['location'] = formData.location
        //Calculate amount
        data['amount'] = 30

        //Build details
        details = "AC repair$$Units count="+formData.count
        data['details'] = details
    }
    else if(id == 6){
        data['serviceType'] = 6
        data['location'] = formData.location
        //Calculate amount
        data['amount'] = 100

        //Build details
        details = "Tile cleaning$$Tile type="+formData.tile_type+"$$Area="+formData.tile_area
        data['details'] = details
    }

    return data
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