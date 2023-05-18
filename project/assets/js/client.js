window.addEventListener('load', function () {

    //Toaster
    toastr.options = {
        timeOut: 500
    };

    // Tool bar section
    $("#client_toolbar_request").click(function (event) {
        toggleSelected($("#client_toolbar_request"))
        $("#client_request_menu").show()

    });

    $("#client_toolbar_ongoing").click(function (event) {
        toggleSelected($("#client_toolbar_ongoing"))
        

    });

    $("#client_toolbar_history").click(function (event) {
        toggleSelected($("#client_toolbar_history"))
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
    $("#client_request_menu").show()
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
    console.log(formData_clean)

    var success = function(response){
        if(response == "success"){
            toastr.success('Form submitted successfully');
        }
    }

    response = sendAjaxRequest("home/submitForm","POST",formData_clean,success)
    closeRequestForm()
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