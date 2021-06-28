
var TheClasses=[];
var StudentList=[];
var ClassIDSpreadsheet="1TW6MmY59UQlybW7-m2bzUtMp1eBZtLJhRFFWUtIKOHU"

var TheLRSURL=qs("lrs","https://record.x-in-y.com/arcfinaldebugging/xapi/");
var TheLRSLogin=qs("lrslogin","mihamo");
var theLRSPassword=qs("lrspassword","zutivv");
var TheVerb="Assigned";
var AggregateURLData=TheLRSURL+"/statements/aggregate";
var TheDataAuthory=btoa(TheLRSLogin+":"+theLRSPassword);
var classID=qs("classID","CSALUSNW01");

var ITSRoot=qs("ITSRoot","https://www.autotutor.org/");
var ignoredResearchEmails=["mailto:xiangenhu@gmail.com",
                           "mailto:esmith42@memphis.edu",
						   "mailto:keithshubeck@gmail.com",
						   "mailto:genghushi@hotmail.com",
						   "mailto:jodycockroft@gmail.com","mailto:zhiqiang.cai.2016@gmail.com","mailto:genghushi@foxmail.com"];
var TheLessonPages=[];
var TheLearnerResponses=[];
var ThestudentID=decodeURIComponent(qs("sid",""));
var TheEmailMessage;

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


function loadjscssfile(filename, filetype){
	if (filetype=="js"){ //if filename is a external JavaScript file
	var fileref=document.createElement('script')
	fileref.setAttribute("type","text/javascript")
	fileref.setAttribute("src", filename)
	}
	else if (filetype=="css"){ //if filename is an external CSS file
	var fileref=document.createElement("link")
	fileref.setAttribute("rel", "stylesheet")
	fileref.setAttribute("type", "text/css")
	fileref.setAttribute("href", filename)
	}
	if (typeof fileref!="undefined")
	document.getElementsByTagName("head")[0].appendChild(fileref)
}

TheLRStheSetting={
    "async": true,
    "crossDomain": true,
    "url": AggregateURLData,
    "method": "POST",
    "headers": {
    "authorization": "Basic " + TheDataAuthory,
    "content-type": "application/json",
    "cache-control": "no-cache",
    "x-experience-api-version": "1.0.3",
    "postman-token": "f2acffd3-e37a-3578-cea0-995aa07124a8"
    },
    "processData": false,
    "data":{}
}
var TheEmail=qs("TheEmail","xhu@memphis.edu");
var TheFullName=qs("TheFullName","Xiangen Hu")

var TheScore={
	          "Hard":{"success":0,"failure":0},
              "Medium":{"success":0,"failure":0},
			  "Easy":{"success":0,"failure":0}
			}


function GetClass(json){
	var spData = json.feed.entry;
	var i;
	for (i=1;5*i<spData.length;i++){
		var line=i*5;
		var row=[spData[line].content["$t"],
					spData[line+1].content["$t"],
					spData[line+2].content["$t"],
					spData[line+3].content["$t"],
					spData[line+4].content["$t"]
				];
		TheClasses.push(row);
	}
	console.log(TheClasses);
//	FindTeacher("mailto:"+TheEmail,TheFullName)
}

function CreateCourseLoginForTeacher(TheOriginalList,RemoveList,TeacherEmail,TeacherName){
	var i;
	var remainList=[];
	for (i=TheOriginalList.length-1;i>0;i--){
		if (RemoveList.includes(TheOriginalList[i][1])){
			console.log(TheOriginalList[i][1]);
		}else{
			remainList.push(TheOriginalList[i]);
		}
	}
	console.log(remainList);
	var TheIndex=Math.random()*remainList.length;
	var randomindex=Math.floor(TheIndex);
	var html="Hello "+TeacherName.split(" ")[0]+",<br/><br/>";
	html=html+"Welcome to to the AutoTutor Adult Reading Comprehension (ARC) website! <br/><br> You have been approved to be a teacher. "
	html=html+"We have created a class for you. ";
	html=html+"Please click the <b>[Move Forward] </b> button below to receive detailed class information in your email: ("+TeacherEmail.split(":")[1]+"). Please check an email sent from <b>read.autotutor@gmail.com.</b><br/><br/>";
    var TheMessage="Hello "+TeacherName.split(" ")[0]+",<br/><br/>";
	TheMessage=TheMessage+"Please use the following login information to login:<ul>";
	TheMessage=TheMessage+"<li>Login: <b>"+remainList[randomindex][1]+"</b>";
	TheMessage=TheMessage+"<li>Password: <b>"+remainList[randomindex][2]+"</b>";
	TheMessage=TheMessage+"<li>Instruction to teacher: <a href='"+remainList[randomindex][3]+"' target='new'></a><b>"+remainList[randomindex][3]+"</b></a>";
	TheMessage=TheMessage+"<li>List of your students: <a href='"+remainList[randomindex][4]+"' target='new'> <b>"+remainList[randomindex][4]+"</b> </a>"
	TheMessage=TheMessage+"<li>URL to Login: <b><a  target='_top' href='https://arcweb.us/login/'>https://arcweb.us/login/</a> </b></ul>"; 	
	
	var TeacherCourseObj={"TeacherEmail":TeacherEmail,
		"TeacherName":TeacherName,
		"Course":remainList[randomindex][0],
		"login":remainList[randomindex][1],
		"password":remainList[randomindex][2],
		"instruction":remainList[randomindex][3],
		"students":remainList[randomindex][4]
	}

	

	
	var TheLink=encodeURI(JSON.stringify(TeacherCourseObj));
	html=html+"<p align='right'><button class='btn1' onclick='TakeTeacher(\""+TheLink+"\")'>Move Forward</button></p>"; 
	TheEmailMessage=TheMessage;
//      	sendEmail(TheEmail,"Welcome to ARC!",TheEmailMessage);
	return html;
}

function FindTeacher(TeacherEmail,TeacherName){
	var thesetting=TheLRStheSetting;
	var match={"statement.verb.id":ITSRoot+"ITSProfile/"+TheVerb};
	var project1={"teacherEmail":"$statement.actor.mbox",
	             "teacherName":"$statement.actor.name",
				 "course":"$statement.result.response",
				 "loginpassword":"$statement.result.extensions.https://www.autotutor.org/ITSProfile/Assigned"};
	var project={"teacherEmail":"$teacherEmail",
				"teacherName":"$teacherName",
				"course":"$course",
				"login":"$loginpassword.login",
				"password":"$loginpassword.password",
				"instruction":"$loginpassword.instruction",
				"students":"$loginpassword.students"
			};			 
	var data=[
		{"$match":match},
		{"$project":project1},
		{"$project":project}
		];
	thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length==0){
			$("#ClassInfor").html(CreateCourseLoginForTeacher(TheClasses,null,TeacherEmail,TeacherName))
		}else{
			var listofCourses=[];
			for (var i=0; i<response.length;i++){
				if (listofCourses.includes(response[i].login)){
				}else{
					if (!ignoredResearchEmails.includes(response[i].teacherEmail)) {
						listofCourses.push(response[i].login);
						console.log(response[i].login+" "+response[i].teacherEmail);
					}else{
					//	console.log(response[i].login+" "+response[i].teacherEmail);
					}
				}
				if (response[i].teacherEmail==TeacherEmail){
					var html="";
					html=html+"Hello <b>"+response[i].teacherName+"</b>: <br/>";
					html=html+"You already have assigned a class for you. It is <b>"+response[i].course+"</b>.";
					html=html+"<ul>";
					html=html+"<li>Login: <b>"+response[i].login+"</b>";
					html=html+"<li>password: <b>"+response[i].password+"</b>";
					html=html+"<li>Instruction to teacher: <a href='"+response[i].instruction+"' target='new'><b>"+response[i].instruction+"</b></a>";
					html=html+"<li>List of your student: <a href='"+response[i].students+"' target='new'> <b>"+response[i].students+"</b> </a>"
					html=html+"<li>URL: <b><a target='_top' href='https://arcweb.us/login/'>https://arcweb.us/login/</a> </b></ul>"; 

					$("#ClassInfor").html(html);
					TheEmailMessage=html;
					sendEmail(TheEmail,"Welcome to ARC!",TheEmailMessage);
					return
				}
			}
			if (listofCourses.length==0){
				$("#ClassInfor").html(CreateCourseLoginForTeacher(TheClasses,null,TeacherEmail,TeacherName))
			}else{
				$("#ClassInfor").html(CreateCourseLoginForTeacher(TheClasses,listofCourses,TeacherEmail,TeacherName))
			}
		}
	})
}
function TakeTeacher(TeacherEmail_Course_Infor){
	var TeacherObj=JSON.parse(decodeURI(TeacherEmail_Course_Infor));
	xAPIPost(TeacherObj);
}

function ReturnDate(Thedate){
	d=new Date(Thedate);
	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var weekday = new Array(7);
	weekday[0] = "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
	var say=d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+" on " +weekday[d.getDay()]+", "+ months[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear();
	return say;
  }

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


function xAPIPost(TeacherObj){
	var AnActor={mbox:TeacherObj.TeacherEmail,
				 name:decodeURI(TeacherObj.TeacherName),
				 objectType:"Agent"};
				
	var verb=TheVerb;			
	var verbObj={
			id:ITSRoot+"ITSProfile/"+verb,
			display:{
				 "en":verb 
			}
		};
	var ResultObj={"login":TeacherObj.login,
	               "password":TeacherObj.password,
				   "instruction":TeacherObj.instruction,
	               "students":TeacherObj.students,
				}
	var extensionObj={};
	var activityObj={"id":ITSRoot+"ITSProfile/"+verb};
	extensionObj[ITSRoot+"ITSProfile/"+verb]=ResultObj;
	var ResultObj={"response":TeacherObj.login,"extensions":extensionObj};
	var statements=Compose(AnActor,
							verbObj,
							ResultObj,
							activityObj);
	console.log(JSON.stringify(statements))
	ADL.XAPIWrapper.sendStatement(statements,ConfirmationFromLRS);
}

function getTeacherInfor(login){	
	var thesetting=TheLRStheSetting;
	var match={"statement.verb.id":"https://www.autotutor.org/ITSProfile/Assigned",
	           "statement.result.response":login};
	var project={"Assigned":"$statement.result.extensions.https://www.autotutor.org/ITSProfile/Assigned"}
	var data=[
			{"$match":match},
			{"$sort":{"statement.timestamp":-1}},
			{"$limit":1},
			{"$project":project}
		];
	thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length==0){
		}else{
			var StudentURL=response[0].Assigned.students;
			window.open(StudentURL,"_self");
			return;
			$("#signupinfor").show();

			var html="";
			html=html+"<a href='"+response[0].Assigned.students+"'>Check your students</a>"
			$("#signupinfor").html(html);
		}
	})
}


var ConfirmationFromLRS = function (resp, thing) {
	var spanclass = "text-info";
	var text = "";
	if (resp.status >= 400) {
		spanclass = "text-danger";
		text = (thing.totalErrors > 1) ? "Errors: " : "Error: ";
		for ( var res in thing.results ) {
			text += "<br>" + ((thing.results[res].instance.id) ? thing.results[res].instance.id : "Statement " + res);
			for ( var err in thing.results[res].errors ) {
				text += "<br>&nbsp;&nbsp;" + thing.results[res].errors[err].trace;
				text += "<br>&nbsp;&nbsp;&nbsp;&nbsp;" + thing.results[res].errors[err].message;
			}
		}
	} else {
		if ( resp.responseText ){
			text = "LRS "+TheLRSURL+ "Successfully sent " + resp.responseText;
			sendEmail(TheEmail,"Welcome to ARC!",TheEmailMessage);
		} else
			text = thing+" "+EXPID;
	}
};

function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

function submitInfo(){
	TheEmail=$("#TheEmail").val();
	TheFullName=$("#TheFullName").val();
	if (validateEmail(TheEmail)){
	FindTeacher("mailto:"+TheEmail,TheFullName);
	$("#AskQuestion").hide();
	$("#ClassInfor").show();	
	}else{
		alert("Need an email");
	}
}

function sendEmail(email,subject,body) {
	Email.send({
	Host: "smtp.gmail.com",
	Username : "read.autotutor@gmail.com",
	Password : "hyhtabqqjlsmbdlh",
	To : email,
	From : "read.autotutor@gmail.com",
	Subject : subject,
	Body : body,
	}).then(
		message => $("#msg").html("    A confirmation email is sent to <b> "+email+" </b>. Should you have any questions, contact <b> read.autotutor@gmail.com </b>")
	);
}
