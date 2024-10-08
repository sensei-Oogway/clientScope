window.addEventListener('load', function () {
    // To login page
    $("#login-button").click(function () {
        $(".index_page").hide();
        $(".login_form").show();
    });

    // Back to index
    $(".to_index").click(function () {
        $(".login_form").hide();
        $(".index_page").show();
    });

    //Basic registration
    $("#signup-button").click(function () {
        $(".index_page").hide();
        $(".registration_form").show();
        $(".registration_form_basic").show();
    });

    // Back to index from registration
    $(".to_index_basic").click(function () {
        $(".registration_form").hide();
        $(".registration_form_basic").hide();
        $(".index_page").show();
    });

    //For professionals
    $("#professionalRadio").click(function () {
        $(".services-select").show();
        $(".client-subscription").hide();
    })

    $("#clientRadio").click(function () {
        $(".services-select").hide();
        $(".client-subscription").show();
    })

    //Proceed to account registration
    $(".to_account").click(function () {
        var formValid = true;

        $('.basic_details_form input').each(function () {
            if ($(this).val() === '') {
                formValid = false;
                return false;
            }
        });
        formValid = true; // TO BE REMOVED
        if (formValid) {
            $(".registration_form_basic").hide();
            $(".registration_form_account").show();
        } else {
            alert("Not all fields are filled")
        }
    });

    //Back to basic details
    $(".to_account_basic").click(function () {
        $(".registration_form_account").hide();
        $(".registration_form_basic").show();
    });

    //Get all data from all the forms and register the user
    $("#register_user").click(function () {
        var combinedForm = $('<form>').attr({
            method: 'POST',
            action: '/register'
        });

        var formData1 = $('.basic_details_form').serialize();
        var formData2 = $('.account_details_form').serialize();

        // Combine form data
        var combinedFormData = formData1 + '&' + formData2;

        var form1Data = $('.basic_details_form').serializeArray();
        $.each(form1Data, function (index, field) {
            $('<input>').attr({
                type: 'hidden',
                name: field.name,
                value: field.value
            }).appendTo(combinedForm);
        });

        var form2Data = $('.account_details_form').serializeArray();
        $.each(form2Data, function (index, field) {
            $('<input>').attr({
                type: 'hidden',
                name: field.name,
                value: field.value
            }).appendTo(combinedForm);
        });

        combinedForm.appendTo('body').submit();
    })


    //Login ajax call
    $('#app-login').submit(function (event) {
        event.preventDefault();

        var formData = $(this).serialize();
        $.ajax({
            url: '/login',
            type: 'POST',
            data: formData,
            success: function (response) {
                console.log(response)
                if (response == "client") {
                    var combinedForm = $('<form>').attr({
                        method: 'POST',
                        action: '/client/home',
                        style: 'display: none;'
                    });
                    combinedForm.appendTo('body').submit();

                } else if(response == "professional"){
                    var combinedForm = $('<form>').attr({
                        method: 'POST',
                        action: '/professional/home',
                        style: 'display: none;'
                    });
                    combinedForm.appendTo('body').submit();
                }
            },
            error: function () {
                // Handle AJAX error
                console.log('AJAX error');
            }
        });
    });













    //Account details form date picker
    $('#datepicker').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true,
        todayHighlight: true,
    });
});

// Pop up Overlay after registration over
var summary = function () {
    //Check for form completion
    var formValid = true;
    $('.account_details_form input').each(function () {
        if ($(this).val() === '') {
            formValid = false;
            return false;
        }
    });
    formValid = true; // TO BE REMOVED
    if (!formValid) {
        alert("Not all fields are filled");
        return;
    }

    // Check for pay on demand
    if ($("#clientRadio").is(":checked") && $("#demandRadio").is(":checked")) {
        var content = '<div class="text-center" style="margin-bottom:15px"><p>Pay on Demand selected</p> <p> The amount will be deducted after every service completion </p> </div>';
        $("#overlay-message .content").html(content)
    } else {

        var content = '<h3>Subscription Summary</h3>' +
            '<p>Subscription Type: Annual</p>' +
            '<p>Start Date: <span id="strt_date">01/01/2023</span></p>' +
            '<p>End Date: <span id="end_date">01/01/2023</span></p>' +
            '<p>Price: $99.99</p>';

        $("#overlay-message .content").html(content)

        var currentDate = new Date();
        $('#strt_date').text(currentDate.toLocaleDateString());
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        $('#end_date').text(currentDate.toLocaleDateString());
    }



    var overlay = document.getElementById("overlay");

    document.addEventListener("focusout", function (event) {
        if (!overlay.contains(event.relatedTarget)) {
            overlay.style.display = "none"; // Hide the overlay
        }
    });

    $('#overlay').show()
}














