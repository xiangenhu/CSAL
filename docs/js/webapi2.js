//var aceurl = "https://ace.autotutor.org/ACEAPICORS6/api/aceaction";
var aceurl = "https://ace.autotutor.org/ACEAPI2017/api/aceaction";
var actions;
var PutStatus=false;

function Post(acePostjson) {
    var content = acePostjson;
    var method = "POST";
    webAPImethod = method;
    var getUrl = $.ajax({
        type: method,
        url: aceurl,
        data: content,
        success: function(data) {


        }
    }).done(function(data) {
        var errorInfo = GetRuleError(data);
        if (errorInfo == false) {
            Put(acePostjson);

        } else {

            alert("Post Error");
			return;
        }

    });


}

function Put(acePutjson) {

   
    var content = acePutjson;
    var method = "PUT";
    webAPImethod = method;
    var getUrl = $.ajax({
        type: method,
        url: aceurl,
        data: content,
        success: function(data) {
			
        },
        error: function(xhr, textStatus, errorThrown) {
            errorMessage = xhr + "\n" + textStatus + "\n" + errorThrown;
            alert(errorMessage);
            repeatTime = 0;

        }
    }).done(function(data) {
        var errorInfo = GetRuleError(data);
        var actionsError = GetActions(data);
		console.log(actions);
		PutStatus=false;
        if (errorInfo == false && actionsError == false) {
           
			StartTimer();
        } else {

            alert("Put Error");
			return;
        }

    });

}

	
function GetRuleError(obj) {
    for (var key in obj) {
        if (key == "Error") {
            var getPostError = obj[key];
            if (getPostError != "") {
                console.log(getPostError)
                return true;

            } else {

                return false;
            }
        }

    }
}

function GetActions(obj) {
    for (var key in obj) {

        if (key == "ACEActions") {
            var getActions = obj[key];
            if (getActions == null) {
                console.log("actions Error!")

                return true;;
            } else {
                actions = getActions;
                return false;

            }

        }
    }
}