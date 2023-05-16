$(document).ready(function(){
    $("#login-button").click(function(){
        $("#login-form").show();
        $("#signup-form").hide();
    });
    $("#signup-button").click(function(){
        $("#signup-form").show();
        $("#login-form").hide();
    });
});

