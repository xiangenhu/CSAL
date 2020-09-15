//var aceurl = "https://ace.autotutor.org/ACEAPICORS6/api/aceaction";
var aceurl = qs("aceurl","https://ace.autotutor.org/ACEAPI2017/api/aceaction");
var actions;
var PutStatus=false;
var LastData;
var latency={};
function insertMdeda(media,list){
	if (qs("startReturn","0")=="0") return;
	if (list==null) return;
	if (list.length<3) return;
	if (media!=null){
		if (list[0]!=media){
			list.splice(0,0,media);
		}
	}
}

function Post(acePostjson) {
    var content = acePostjson;
    var method = "POST";
    webAPImethod = method;
	latency.start=new Date();
    var getUrl = $.ajax({
        type: method,
        url: aceurl,
        data: content,
        success: function(data) {
		 	latency.finish=new Date();
			latency.duration=latency.finish-latency.start;
			var Data={"latency":latency,"data":{"input":acePostjson,"response":data}};
			xAPIPostStart(Data,"start"); 
			LastData=data;
        }
    }).done(function(data) {
		latency.finish=new Date();
		latency.duration=latency.finish-latency.start;
		
		insertMdeda(CurrentMedia,data.ACEActions);
		
		var Data={"latency":latency,"data":{"input":acePostjson,"response":data}}
		AceResponse(Data,"response");
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
	if (qs("startReturn","0")=="1"){
		if (lastACEjson!=null){
			content=lastACEjson;
			lastACEjson=null;
		} 
	}
    var method = "PUT";
    webAPImethod = method;
	latency.start=new Date();
    var getUrl = $.ajax({
        type: method,
        url: aceurl,
        data: content,
        success: function(data) {
			latency.finish=new Date();
			latency.duration=latency.finish-latency.start;
			
			insertMdeda(CurrentMedia,data.ACEActions);
			var Data={"latency":latency,"data":{"input":acePutjson,"response":data}};
			
			xAPIPostOther(Data,"action");
			
			LastData=data;
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
		console.log("=============");
		
		if (lastACEResponse!=null){
			actions=lastACEResponse.ACEActions;
			lastACEResponse=null;
		}
		
		LastData=data;
		latency.finish=new Date();
		latency.duration=latency.finish-latency.start;
		
	    insertMdeda(CurrentMedia,data.ACEActions);
		
		
		var Data={"latency":latency,"data":{"input":acePutjson,"response":data}}
		AceResponse(Data,"response");
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