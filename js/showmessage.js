var showMessage = function (message, action) {
    if (message == null || message.length < 1) {
        return;
    }
    if ($(".errorAlert").length == 0){
        var errorAlert = "<div class='flexOneLineCenter errorAlert' style='display: none'><div class='errorAlertBox flexOneLineCenter'><div class='errorAlertBoxBox_error'><p id='message'></p></div></div></div>";
        $("body").append(errorAlert);
    }

    $(".errorAlert").fadeIn(300, function () {
        $("#message").html(message);
    }).delay(1000).fadeOut(300, function () {
        if (typeof action == "function") {
            action();
        }
        $("#message").html("");
    });
};
