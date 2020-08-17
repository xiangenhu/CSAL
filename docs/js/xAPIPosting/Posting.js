function qs(search_for,defaultstr) {
	var query = window.location.search.substring(1);
	var parms = query.split('&');
	
	for (var i = 0; i<parms.length; i++) {
		var pos = parms[i].indexOf('=');
		if (pos > 0  && search_for == parms[i].substring(0,pos)) {
			return parms[i].substring(pos+1);
			}
		}
		return defaultstr;
}
var LRSURL=qs("lrs","https://record.x-in-y.com/myclass/xapi/");
var LRSLogin=qs("lrslogin","fuficp");
var LRSPassword=qs("lrspassword","jihlur");
var wrapper;
var SKOSchool="AutoTutorARC:"+qs("client","ProLiteracy");
var sessionID="http://"+qs("ssid","anAICC_sid");

 ADL.launch(function(err, launchdata, xAPIWrapper) {
		if (!err) {
			wrapper = ADL.XAPIWrapper = xAPIWrapper;
			console.log("--- content launched via xAPI Launch ---\n", wrapper.lrs, "\n", launchdata);
		} else {
			wrapper = ADL.XAPIWrapper;
			wrapper.changeConfig({
				endpoint: LRSURL,
				user: LRSLogin,
				password: LRSPassword
			});
			console.log("--- content statically configured ---\n", wrapper.lrs);
		}
	}, true);



function Compose(AnActor,
                verbObj,
				ResultObj,
				activityObj,
				Extdata){
	var contextActivities={grouping:[{id:SKOSchool},{id:sessionID}]}
	var parts = {
		actor: AnActor,
		verb: verbObj,
		object: activityObj,
		result: ResultObj,
		context:{"contextActivities":contextActivities,"extensions":Extdata.extensions}
		};
		timestamp:(new Date()).toISOString();
	console.log(JSON.stringify(parts));
	return parts;
	}


function init() {   
    // when actor is student
	var user=qs("user","xhu@memphis.edu");
	var fullname=qs("fullname","Xiangen Hu");
	 // when actor is student
	var AnActor={mbox:"mailto:"+user,
				 name:fullname,
				 objectType:"Agent"
				};
				
	var verb="Anything";			
	var verbObj={
			id:"https://app.skoonline.org/ITSProfile/"+verb,
			display:{
				 "en":verb 
			}
		};
	   /*  "verb": {
        "id": "http://verb.com/id",
        "display": {
            "en": "verbed"
        } */
	
	// Activity
	var SKOTitle="Test CSAL Module";
	var SKOGuid="AnIDBeingUsed";
	var activityObj={id:SKOSchool+"/skoid/"+SKOGuid,
				 definition:{type: "https://app.skoonline.org/ITSProfile/"+verb,
				             name:{"en-US":SKOTitle}
							 }
			};
	// Activity
	var data={anything:"value"};
	var ResultObj={};
		
	 /* "result": {
        "score": {
            "scaled": 0.95,
            "raw": 95,
            "min": 0,
            "max": 100
        },
        "success": true,
        "completion": true,
        "response": "this is the response",
        "duration": "PT5H4M",
        "extensions": {
            "http://ext.com/key": "value"
        }
    }, */
	var Extdata={
			extensions: {
				"https://app.skoonline.org/ITSProfile/CSAL/Data": data
			}
	}
	
	var statements=Compose(AnActor,
							verbObj,
							ResultObj,
							activityObj,
							Extdata);
	ADL.XAPIWrapper.sendStatement(statements);
}


function AceResponse(Data,averb){
	
	var AnActor={mbox:"mailto:"+qs("LessonName","Lesson")+"@csal.memphis.edu",
				 name:qs("LessonName","Lesson"),
				 objectType:"Agent"
				};
				
	var verb=averb;			
	var verbObj={
			id:"https://app.skoonline.org/ITSProfile/"+verb,
			display:{
				 "en":verb 
			}
		};
	var SKOTitle=qs("LessonName","alesson");
	var SKOGuid="AnIDBeingUsed";
	var activityObj={objectType:"Agent",
					mbox:"mailto:"+Data.Id,
					name:qs("SName","David")}
	// Activity
	var data=Data;
	var ResultObj={};
		
	 /* "result": {
        "score": {
            "scaled": 0.95,
            "raw": 95,
            "min": 0,
            "max": 100
        },
        "success": true,
        "completion": true,
        "response": "this is the response",
        "duration": "PT5H4M",
        "extensions": {
            "http://ext.com/key": "value"
        }
    }, */
	var Extdata={
			extensions: {
				"https://app.skoonline.org/ITSProfile/CSAL/Data": data
			}
	}
	console.log("===");
	console.log(JSON.stringify(data));
		var statements=Compose(AnActor,
								verbObj,
								ResultObj,
								activityObj,
								Extdata);
								
		ADL.XAPIWrapper.sendStatement(statements);
}



function xAPIPostOther(acePostjson,averb){
	
	var AnActor={mbox:"mailto:"+qs("UID","xhu@memphis.edu"),
				 name:qs("SName","David"),
				 objectType:"Agent"
				};
				
	var verb=averb;			
	var verbObj={
			id:"https://app.skoonline.org/ITSProfile/"+verb,
			display:{
				 "en":verb 
			}
		};
		
	var SKOTitle=qs("LessonName","alesson");
	var SKOGuid="AnIDBeingUsed";
	var activityObj={id:JSON.parse(acePostjson.PresentationID).scriptPath,
				 definition:{type: "https://app.skoonline.org/ITSProfile/"+verb,
				             name:{"en-US":SKOTitle}
							 }
			};
	// Activity
	var data=JSON.parse(acePostjson.PresentationHistory);
	var ResultObj={};
	 /* "result": {
        "score": {
            "scaled": 0.95,
            "raw": 95,
            "min": 0,
            "max": 100
        },
        "success": true,
        "completion": true,
        "response": "this is the response",
        "duration": "PT5H4M",
        "extensions": {
            "http://ext.com/key": "value"
        }
    }, */
	if ((data.userAnswer=="Incorrect")||(data.userAnswer=="Correct")){
		if (data.userAnswer=="Incorrect"){
			ResultObj={success:false,
			response:data.userSelectedItem,
			extensions:{"https://app.skoonline.org/ITSProfile/CSAL/ResultExt":data}
			}
		}else{
			ResultObj={success:true,
			response:data.userSelectedItem,
		     extensions:{"https://app.skoonline.org/ITSProfile/CSAL/ResultExt":data}
		}
		var Extdata={}
		}
	}
	var Extdata={
		extensions: {
			"https://app.skoonline.org/ITSProfile/CSAL/Data": data
		}
	}	
	var statements=Compose(AnActor,
							verbObj,
							ResultObj,
							activityObj,
							Extdata);
	ADL.XAPIWrapper.sendStatement(statements);
}

function xAPIPostStart(acePostjson,averb){
	
	var AnActor={mbox:"mailto:"+acePostjson.User,
				 name:qs("SName","David"),
				 objectType:"Agent"
				};
				
	var verb=averb;			
	var verbObj={
			id:"https://app.skoonline.org/ITSProfile/"+verb,
			display:{
				 "en":verb 
			}
		};
	var SKOTitle=qs("LessonName","alesson");
	var SKOGuid="AnIDBeingUsed";
	var activityObj={id:acePostjson.ScriptURL,
				 definition:{type: "https://app.skoonline.org/ITSProfile/"+verb,
				             name:{"en-US":SKOTitle}
							 }
			};
	// Activity
	var data=acePostjson;
	var ResultObj={};
		
	 /* "result": {
        "score": {
            "scaled": 0.95,
            "raw": 95,
            "min": 0,
            "max": 100
        },
        "success": true,
        "completion": true,
        "response": "this is the response",
        "duration": "PT5H4M",
        "extensions": {
            "http://ext.com/key": "value"
        }
    }, */
	var Extdata={
			extensions: {
				"https://app.skoonline.org/ITSProfile/CSAL/Data": data
			}
	}
	
	var statements=Compose(AnActor,
							verbObj,
							ResultObj,
							activityObj,
							Extdata);
	ADL.XAPIWrapper.sendStatement(statements);
}


