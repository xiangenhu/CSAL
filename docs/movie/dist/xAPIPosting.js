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
var wrapper;

var TheLRSURL=qs("lrs","https://xapilrs.x-in-y.com/arcfinaldebugging/xapi/");
var TheLRSLogin=qs("lrslogin","mihamo");
var theLRSPassword=qs("lrspassword","zutivv");

var SKOSchool="AutoTutor.org";
var sessionID="http://"+qs("ssid","anAICC_sid");
var guid=qs("guid","");
var theverb=qs("verb","SelfReflection");
var ITSRoot=qs("ITSRoot","https://www.autotutor.org/");
var SceneTitle=decodeURI(qs("SceneTitle","The Slide"));
var SlideNumer="@Scene"+qs("SlideNumber","0"); 

 ADL.launch(function(err, launchdata, xAPIWrapper) {
		if (!err) {
			wrapper = ADL.XAPIWrapper = xAPIWrapper;
			console.log("--- content launched via xAPI Launch ---\n", wrapper.lrs, "\n", launchdata);
		} else {
			wrapper = ADL.XAPIWrapper;
			wrapper.changeConfig({
				endpoint: TheLRSURL,
				user: TheLRSLogin,
				password: theLRSPassword
			});
			console.log("--- content statically configured ---\n", wrapper.lrs);
		}
	}, true);


function Compose(
	    AnActor,
		verbObj,
		ResultObj,
		activityObj){
		var parts = {
			actor: AnActor,
			verb: verbObj,
			object: activityObj,
			result: ResultObj
		};
		return parts;
	}

function OpenMovie(){
	var MVL=qs("MVL","");
	if (MVL!=""){
	var movieLink="https://www.youtube.com/embed/"+MVL;
	window.open(movieLink);
	}
}

function xAPIPost(time,action,Type,LCCData){
	
	var AnActor={mbox:"mailto:"+qs("email","xhu@memphis.edu"),
				 name:decodeURI(qs("fullname","xhu")),
				 objectType:"Agent"
				};
				
	var verb=action;			
	var verbObj={
			id:ITSRoot+"ITSProfile/"+verb,
			display:{
				 "en":verb 
			}
		};
	
	var SKOGuid=qs("guid","");	
	var activityObj={id:ITSRoot+SKOGuid,
				 definition:{type:ITSRoot+ "ITSProfile/"+verb,
				             name:{"en-US":SceneTitle+SlideNumer}
				}
			};
	// Activity
	var extensionObj={};
	var Thedata={"type":Type,"data":LCCData}
	extensionObj[ITSRoot+"ITSProfile/"+verb]=Thedata;
	var ResultObj={"extensions":extensionObj};
	var statements=Compose(AnActor,
							verbObj,
							ResultObj,
							activityObj);
	console.log(JSON.stringify(statements))
	ADL.XAPIWrapper.sendStatement(statements);
}
