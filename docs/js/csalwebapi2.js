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
var lastAceAction={};



function showwarnings(){
	  if (latency.duration>parseInt(qs("latencyThreshold","1000"))){
		  $("#runningstatus").show();
	  }else{
		  $("#runningstatus").hide();
	  }
}

function LastAction(data){
	lastAceAction={};
	var askWait=false;
	if (data.ACEActions==null){
		return;
	}
	var waitType="";
	if (data.ACEActions.length>0){
		var i;
		for (i=0; i<data.ACEActions.length;i++){
			var theaction=data.ACEActions[i];
			if ((theaction.Agent=="System")&&(theaction.Act=="Display")){
				lastAceAction=theaction;
			}
			if ((theaction.Agent=="System")&&((theaction.Act=="Wait")||(theaction.Act=="WaitForEvent"))){
				askWait=true;
				waitType=theaction.Act;
				
			}
		}
	}
	lastAceAction.msg=TheMsg;
	if (askWait){
		lastAceAction.waitType=waitType;
		return;
	}else{
		lastAceAction={};
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
			showwarnings();
			var Data={"latency":latency,"data":{"input":"","response":data}};
		
			if (InteractionHistory.length==0){
				xAPIPostStart(Data,"start");
			}			
			LastData=data;
			LastAction(data);
        }
    }).done(function(data) {
		latency.finish=new Date();
		latency.duration=latency.finish-latency.start;
		showwarnings();
		insertMdeda(CurrentMedia,data.ACEActions);
		
		var Data={"latency":latency,"data":{"input":"","response":data}};
		LastData=data;
		LastAction(data);
		if (InteractionHistory.length==0){
			AceResponse(Data,"response");
		}
		
        var errorInfo = GetRuleError(data);
        if (errorInfo == false) {
		//	acePostjson.ScriptXML=""
		//	acePostjson.ScriptURL=currentScripturl;
            Put(acePostjson);
        } else {
            alert("Post Error");
			return;
        }

    });


}

function Put(acePutjson) { 
  //  acePutjson.ScriptXML="";
	var content = acePutjson;
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
			showwarnings();
			insertMdeda(CurrentMedia,data.ACEActions);
			var Data={"latency":latency,"data":{"input":acePutjson,"response":data}};
			if (InteractionHistory.length==0){
				xAPIPostOther(Data,"action"); 
			}
	/* 	if (InteractionHistory.length==0){
				var pairData={"data":lastAceAction,"input":acePutjson};
				AceResponse(pairData,"interaction");
			} */
			LastData=data;
			LastAction(data);
        },
        error: function(xhr, textStatus, errorThrown) {
            errorMessage = xhr + "\n" + textStatus + "\n" + errorThrown;
            alert(errorMessage);
            repeatTime = 0;

        }
    }).done(function(data) {
        var errorInfo = GetRuleError(data);
        var actionsError = GetActions(data);
//		console.log(actions);
//		console.log("=============");
		
		if (lastACEResponse!=null){
			actions=lastACEResponse.ACEActions;
			lastACEResponse=null;
		}
		LastData=data;
		LastAction(data);
		latency.finish=new Date();
		latency.duration=latency.finish-latency.start;
		showwarnings();
		
	    insertMdeda(CurrentMedia,data.ACEActions);
		if (InteractionHistory.length==0){
			var Data={"latency":latency,"data":{"input":acePutjson,"response":data}}
			AceResponse(Data,"response");
		}
		
		
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