
var TheLessions=[];
var StudentList=[];

var TheLRSURL=qs("lrs","https://record.x-in-y.com/csaldata2021/xapi/");
var TheLRSLogin=qs("lrslogin","CSALData");
var theLRSPassword=qs("lrspassword","CSALData");
var AggregateURLData=TheLRSURL+"/statements/aggregate";
var TheDataAuthory=btoa(TheLRSLogin+":"+theLRSPassword);
var classID=qs("classID","CSALUSNW01");
var StudentEmailPhrase = "student";

var TheLessonPages=[];
var TheLearnerResponses=[];
var ThestudentID=qs("sid","");

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

var TheScore={
	          "Hard":{"success":0,"failure":0},
              "Medium":{"success":0,"failure":0},
			  "Easy":{"success":0,"failure":0}
			}


function GetLessons(json){
	var spData = json.feed.entry;
	var i;
	for (i=0;4*i<spData.length;i++){
		var line=i*4;
		var row=[spData[line].content["$t"],
					spData[line+1].content["$t"],
					spData[line+2].content["$t"],
					spData[line+3].content["$t"]
				];
		console.log(row)
		TheLessions.push(row);
	}
	GetStudents(classID,ThestudentID);
}

function studentsReport(student,verb){
	var thesetting=TheLRStheSetting;
	var match={"statement.actor.mbox":+student,"statement.verb.id":"https://app.skoonline.org/ITSProfile/"+verb};
	var group={"_id":"$statement.id",
	           "Sum":{"$sum":1}};
	var data=[
	{"$match":match},
	{"$group":group}
	];
	thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		
	})
}

function GetStudents(classID,student){
    var thesetting=TheLRStheSetting;
	var match;
	if (student!=""){
	  	match={"statement.result.response":classID,"statement.actor.mbox":"mailto:"+student};
	}else{
		match={"statement.result.response":classID};
	}
	var group={"_id":"$statement.actor",
	           "Sum":{"$sum":1}};
	var data=[
	{"$match":match},
	{"$group":group}
	];
    thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length==0){ 
			return
		}else{
			for (var i=0;i<response.length;i++){
				if (response[i]._id.mbox.indexOf(StudentEmailPhrase)!=-1){
					var studentID=response[i]._id;
//					studentID=studentID.split("@")[0].split(":")[1].split("tudent")[1];
				StudentList.push(studentID);
				}
			}
			console.log(StudentList);
			CreateTable(TheLessions,StudentList)
		}
	});
}
function DetailsForStudentandLesson(student,lesson){
	var thesetting=TheLRStheSetting;
	var match={"statement.actor.mbox":student,
	           "statement.object.mbox":"mailto:"+lesson+"@csal.autotutor.org",
			   "statement.verb.id":"https://app.skoonline.org/ITSProfile/action"
			};
	var group= {"_id":"$statement.verb.id",
		        "firstTime":{"$min":"$statement.timestamp"},
				"LastTime":{"$max":"$statement.timestamp"}}
	var data=[
		{"$match":match},
		{"$group":group}
	];
    thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length==0){ 
			return;
		}else{
			$("#LastTimeLesson").html(ReturnDate(response[0].LastTime));
			$("#FirstTimeLesson").html(ReturnDate(response[0].firstTime));
		}
	});
}

function LessonQuestionSummary(LessonID){
	var thesetting=TheLRStheSetting;
	var match
	if (LessonID.indexOf("___")==-1){
	    match={"statement.verb.id":"https://app.skoonline.org/ITSProfile/action",
	           "statement.object.mbox":"mailto:"+LessonID+"@csal.autotutor.org"
			};
		}else{
			var newLessonID=LessonID.split("___")[1];
			var student=LessonID.split("___")[2];
			match={"statement.verb.id":"https://app.skoonline.org/ITSProfile/action",
			"statement.object.mbox":"mailto:"+newLessonID+"@csal.autotutor.org",
			"statement.actor.mbox":student
		 };
		}
    var data=[{"$match":match},
		{"$sort":{"statement.timestamp":-1}},
		{"$project":
			{"Ext":"$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result",
				"Result":"$statement.result.success",
				"LessonID":"$statement.object.mbox"}},
		{"$project":
			{"MediaUrl":"$Ext.MediaUrl",
				"questionLevel":"$Ext.questionLevel",
				"questionID":"$Ext.questionID",
				"QuestionType":"$Ext.Type",
				"userSelectedItem":"$Ext.userSelectedItem",
				"success":"$Result",
				"TheLesson":"$LessonID"
				}
		}
	]
	thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		TheLessonPages=[];
		if (response.length==0){ 
			return;
		}else{
			// list of pages
			var ListOfLessonObj=[];
			for (var i=0; i<response.length;i++){
				if (response[i].QuestionType=="QuestionPage"){
					var choiceObj="(<span class='numbers'>"+response[i].success+"</span>) "+response[i].userSelectedItem;
					var index=TheLessonPages.indexOf(response[i].questionID);
					if (index>-1){
						ListOfLessonObj[index].Choices.push(choiceObj);
					}else{
						var LessonObj={"Page":response[i].MediaUrl.split("ActivityMedia/media/")[1].split("?")[0],
						             "ID":response[i].questionID,
									 "Choices":[choiceObj]}
						ListOfLessonObj.push(LessonObj);
						TheLessonPages.push(response[i].questionID);
						}
					}
				}
			console.log(TheLessonPages);
			console.log(ListOfLessonObj);
			// Construct report
			var html="<ul>";
			for (i=0;i<ListOfLessonObj.length;i++){
				html=html+"<li>";;
				html=html+ListOfLessonObj[i].Page;
				html=html+"<ul>";
				html=html+GetCount(ListOfLessonObj[i].Choices);
				html=html+"</ul>";
				html=html+"</li>";
			}
			html=html+"</ul>";
			$("#MoreDetails").html(html);
		}
	});
}

function GetCount(ArrayStr){
	var html="";
	var newArray=[];
	var TheCount=[];
	var i;
	for (i=0; i<ArrayStr.length;i++){
		var Index=newArray.indexOf(ArrayStr[i]);
		if (Index==-1){
			newArray.push(ArrayStr[i]);
			TheCount.push(1)
		}else{
			TheCount[Index]=TheCount[Index]+1;
		}
	}
	for (i=0;i<newArray.length;i++){
		html=html+"<li> <span class='numbers'>["+TheCount[i].toString()+"]</span> "+newArray[i]+"</li>"
	}
	return html;
}

function DetailsS_L(Lesson_and_Student){
	var LessonName=Lesson_and_Student.split("___")[0];
	var LessonID=Lesson_and_Student.split("___")[1];
	var Student=Lesson_and_Student.split("___")[2];
	var Name=Lesson_and_Student.split("___")[3];

	var htmlbody="Detailed Interaction of  "+ Name+ " with "+LessonName ;
	htmlbody=htmlbody+"<div id='MoreDetails'>";
	htmlbody=htmlbody+"<ul>";
	htmlbody=htmlbody+"<li>First time "+Name+" start the lesson: <span class='numbers' id='FirstTimeLesson'></span></li>";
	htmlbody=htmlbody+"<li>Last time  "+Name+" was on the lessons: <span class='numbers' id='LastTimeLesson'></span></li>";
	htmlbody=htmlbody+"<li>Number Questions Answered: <span class='numbers' id='LSAnswerDetails'></span></li>";
//	htmlbody=htmlbody+"<li>Average time spend on each answer: <span class='numbers' id='TimeOnAnswer'></span></li>";
//	htmlbody=htmlbody+"<li>How the answers of question in this lesson compared with others: <span class='numbers' id='AnswersCompared'></span></li>";
//	htmlbody=htmlbody+"<li>Answers to all the questions: <span class='numbers' id='AnswersCompared'></span></li>";
	htmlbody=htmlbody+"</ul>";
//	htmlbody=htmlbody+"<button onclick='LessonQuestionSummary(\""+Lesson_and_Student+"\")'>More details</button> </div>";
	htmlbody=htmlbody+"</div>"
	OpenPopUp(LessonName+" and "+Name,"details ...",htmlbody,"popupWin");
	DetailsForStudentandLesson(Student,LessonID);
	TheScore={
		"Hard":{"success":0,"failure":0},
		"Medium":{"success":0,"failure":0},
		"Easy":{"success":0,"failure":0}
	  }
//	var TheStudent="mailto:student"+Student+"@csal.autotutor.org";
	StudentAnswerQuestions_Lesson(Student,LessonID);
}



function GetPassFailInProgress(Lesson,Student,Name,i,j){
	var thesetting=TheLRStheSetting;
	var match={"statement.actor.mbox":Student,
	           "statement.object.mbox":"mailto:"+Lesson[1]+"@csal.autotutor.org"
			};
	var data=[
		{"$match":match},
		{"$sort":{"statement.timestamp":-1}},
		{"$group":{"_id":"$statement.verb.id","TotalScore":{"$sum":1}}}
	];
    thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		var detailInformationLink="<button onclick='DetailsS_L(\""+Lesson[0]+"___"+Lesson[1]+"___"+Student+"___"+Name+"\")'>?</button>"
		var scoreFiled="score_"+i.toString()+"_"+j.toString();
		if (response.length==0){ 
			$("#"+scoreFiled).html("");
			return;
		}else{
			for (var k=1;k<response.length;k++){
				if (response[k]._id.indexOf("completed")>-1){
				$("#"+scoreFiled).html("P "+detailInformationLink);
				return;
				}
				if (response[k]._id.indexOf("failed")>-1){
					$("#"+scoreFiled).html("F "+detailInformationLink);
					return;
				}
			}
			$("#"+scoreFiled).html("IP ");
		}
	});
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


function GetScoreThe(Lesson,Student,i,j){
	var thesetting=TheLRStheSetting;
	var match={"statement.actor.mbox":"mailto:student"+Student+"@csal.autotutor.org",
	           "statement.verb.id":"https://app.skoonline.org/ITSProfile/action",
	           "statement.object.mbox":"mailto:"+Lesson[1]+"@csal.autotutor.org"
			};
	var data=[
	{"$match":match},
		{"$sort":{"statement.timestamp":-1}},
		{"$project":{"ResultExt":"$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"}},
		{"$project":{"Statement":"$ResultExt.Score.this"}}
	];
    thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		var scoreFiled="score_"+i.toString()+"_"+j.toString();
		if (response.length==0){ 
			$("#"+scoreFiled).html("");
			return;
		}else{
			$("#"+scoreFiled).html("tried");
		}
	});
}

function GetLTRecentLast(LessonID){
	var thesetting=TheLRStheSetting;
	var match;
	if (ThestudentID!=""){
	    match={"statement.actor.mbox":"mailto:"+LessonID+"@csal.autotutor.org",
	           "statement.result.response":classID,
			   "statement.object.mbox":"mailto:"+ThestudentID};
	}else{
		match={"statement.actor.mbox":"mailto:"+LessonID+"@csal.autotutor.org",
	           "statement.result.response":classID};
	}

	var Group={"_id":"$statement.verb.id",
	           "firstTime":{"$min":"$statement.timestamp"},
			   "LastTime":{"$max":"$statement.timestamp"}
			}
	var data=[{"$match":match}, 
              {"$group":Group}]
	thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length==0){ 
		}else{
			$("#LTRecent").html(ReturnDate(response[0].LastTime));
			$("#LTFirst").html(ReturnDate(response[0].firstTime));
			for (var i=0; i<response.length;i++){
				console.log(response[i]);
			}
		}
	});
};

function Getmean(numberArray){
	var sum=0;
	if (numberArray.length==0){
		return sum;
	}
	var i;
	for (i=0;i<numberArray.length;i++){
		sum=sum+numberArray[i];
	}
	return sum/numberArray.length;
}

function GetAverageTime(LessonID){	
	var thesetting=TheLRStheSetting;
	var match;
	if (ThestudentID!=""){
	match={"statement.actor.mbox":"mailto:"+LessonID+"@csal.autotutor.org",
	           "statement.verb.id":"https://app.skoonline.org/ITSProfile/interaction",
				"statement.result.response":classID,
				"statement.object.mbox":"mailto:"+ThestudentID
			};
	}else{
		match={"statement.actor.mbox":"mailto:"+LessonID+"@csal.autotutor.org",
	           "statement.verb.id":"https://app.skoonline.org/ITSProfile/interaction",
				"statement.result.response":classID
			};
	}
	var Group={"_id":"$statement.object.mbox",
			   "sum":{"$sum":1},
	           "firstTime":{"$min":"$statement.timestamp"},
			   "LastTime":{"$max":"$statement.timestamp"}
			}
	var data=[{"$match":match}, 
              {"$group":Group}]
	thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length==0){ 
		}else{
			var numberArray=[];
			for (var i=0; i<response.length;i++){
				var FirstTime = new Date(response[i].firstTime).getTime();
				var LastTime = new Date(response[i].LastTime).getTime();
				var timediff=(LastTime-FirstTime)/response[i].sum;
				numberArray.push(timediff);
			}
			var averageDiff=Getmean(numberArray);
			$("#AVTime").html((averageDiff/1000).toFixed(1)+ " seconds");
		}
	});
};



function StudentAnswerQuestions_Lesson(student,LessonID){
	var thesetting=TheLRStheSetting;
	var match={"statement.actor.mbox":student,
				"statement.verb.id":"https://app.skoonline.org/ITSProfile/action",
				"statement.object.mbox":"mailto:"+LessonID+"@csal.autotutor.org"
			};

	var data=[{"$match":match}, 
		{"$sort":{"statement.timestamp":-1}},
		{"$limit":1},
		{"$project":{"EXt":"$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"}},
		{"$project":{"Score":"$EXt.Score.this"}}
	]
	thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length==0){ 
		}else{

			var theScore= response[0].Score;
			TheScore.Hard.success=TheScore.Hard.success+theScore.Hard.success;
			TheScore.Hard.failure=TheScore.Hard.failure+theScore.Hard.failure;

			TheScore.Medium.success=TheScore.Medium.success+theScore.Medium.success;
			TheScore.Medium.failure=TheScore.Medium.failure+theScore.Medium.failure;
			
			TheScore.Easy.success=TheScore.Easy.success+theScore.Easy.success;
			TheScore.Easy.failure=TheScore.Easy.failure+theScore.Easy.failure;

			var html="<ul>";
			html=html+"<li>Hard Questions "+ TheScore.Hard.success.toString() +" correct, "+TheScore.Hard.failure.toString() +" wrong. </li>";
			html=html+"<li>Medium Questions "+ TheScore.Medium.success.toString() +" correct, "+TheScore.Medium.failure.toString() +" wrong. </li>";
			html=html+"<li>Easy Questions "+ TheScore.Easy.success.toString() +" correct, "+ TheScore.Easy.failure.toString() +" wrong. </li>";
			html=html+"</ul>";
			$("#LSAnswerDetails").html(html);
		}
	});
}



function GetTheLessonQuestion(LessonID){
	TheScore={
		"Hard":{"success":0,"failure":0},
		"Medium":{"success":0,"failure":0},
		"Easy":{"success":0,"failure":0}
	  }
	  var html="<ul>";
	  html=html+"<li>Hard Questions "+ TheScore.Hard.success.toString() +" correct, "+TheScore.Hard.failure.toString() +" wrong. </li>";
	  html=html+"<li>Medium Questions "+ TheScore.Medium.success.toString() +" correct, "+TheScore.Medium.failure.toString() +" wrong. </li>";
	  html=html+"<li>Easy Questions "+ TheScore.Easy.success.toString() +" correct, "+ TheScore.Easy.failure.toString() +" wrong. </li>";
	  html=html+"</ul>";
	  $("#LSAnswerDetails").html(html);
	var thesetting=TheLRStheSetting;
	var match;
	if (ThestudentID!=""){
		match={"statement.object.mbox":"mailto:"+LessonID+"@csal.autotutor.org",
				"statement.verb.id":"https://app.skoonline.org/ITSProfile/action",
				"statement.actor.mbox":"mailto:"+ThestudentID};
	}else{
		match={"statement.object.mbox":"mailto:"+LessonID+"@csal.autotutor.org",
				"statement.verb.id":"https://app.skoonline.org/ITSProfile/action"};
	}
	var group={"_id":"$statement.actor.mbox","sum":{"$sum":1}};
	var data=[{"$match":match},
	          {"$group":group}]
	thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length==0){ 
		}else{
			var i;
			for (i=0;i<response.length;i++){
			StudentAnswerQuestions_Lesson(response[0]._id,LessonID)
			}
		}
	});
}
function LessonDetails(LessonID){
	var LessonName="lesson: "+LessonID.split("__")[0]
	var htmlbody="<div id='MoreDetails'>Information about this lesson</span>";
	htmlbody=htmlbody+"<ul>";
	htmlbody=htmlbody+"<li>Last time student intearcted with this lesson: <span class='numbers' id='LTRecent'></span></li>";
	htmlbody=htmlbody+"<li>First time student intearcted with this lesson: <span class='numbers' id='LTFirst'></span></li>";
	htmlbody=htmlbody+"<li>Average Time between Interactions: <span class='numbers' id='AVTime'></span></li>";
	htmlbody=htmlbody+"<li>The questions answered by students: <span class='numbers' id='LSAnswerDetails'></span></li>";
	htmlbody=htmlbody+"</ul>";
	
//	htmlbody=htmlbody+"<button onclick='LessonQuestionSummary(\""+LessonID.split("__")[1]+"\")'>More details</button> </div>";
	OpenPopUp(LessonName,"details of "+LessonName,htmlbody,"popupWin");
	GetLTRecentLast(LessonID.split("__")[1]);
	GetAverageTime(LessonID.split("__")[1]);
	GetTheLessonQuestion(LessonID.split("__")[1]);
}
function StudentDetails(student){
	var TheStudent=student.split("_&_");
	var htmlbody="Information about this student ";
	htmlbody=htmlbody+"<ul>";
	htmlbody=htmlbody+"<li>Most recent time took any lessons: <span class='numbers' id='RecentTime'></span></li>";
	htmlbody=htmlbody+"<li>First time started any lessons: <span class='numbers' id='FirstTime'></span></li>";
	htmlbody=htmlbody+"<li>Number of lessons started: <span class='numbers' id='NLStarted'></span></li>";
	htmlbody=htmlbody+"<li>Number of lessons completed: <span class='numbers' id='NLCompeted'></span></li>";
	htmlbody=htmlbody+"<li>Number of lessons failed: <span class='numbers' id='NLFailed'></span></li>";
//	htmlbody=htmlbody+"<li>Number of lessons repeated: <span class='numbers' id='NLRepeated'></span></li>";
	htmlbody=htmlbody+"<li>Average time spent on each lesson: <span class='numbers' id='AverageTimeOnLesson'></span></li>";
	htmlbody=htmlbody+"<li>Total Number of questions answered: <span class='numbers' id='NumberQ'></span></li>";
	htmlbody=htmlbody+"</ul>";
	OpenPopUp(TheStudent[0],"details of student "+TheStudent[0],htmlbody,"popupWin");
	StdudentFirstLast(TheStudent[1]);
	StudentsStartedLesson(TheStudent[1]);
	averageTimeOnLesson(TheStudent[1]);
	StudentAnswerQuestions(TheStudent[1]);
}



function StudentAnswerQuestions(student){
	var thesetting=TheLRStheSetting;
	var match={"statement.actor.mbox":student,
				"statement.verb.id":"https://app.skoonline.org/ITSProfile/action"};

	var data=[{"$match":match}, 
		{"$sort":{"statement.timestamp":-1}},
		{"$limit":1},
		{"$project":{"EXt":"$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"}},
		{"$project":{"Score":"$EXt.Score.total"}}
	]
	thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length==0){ 
		}else{
			var theScore= response[0].Score;
			var html="<ul>";
			html=html+"<li>Hard Questions "+ theScore.Hard.success.toString() +" correct, "+theScore.Hard.failure.toString() +" wrong. </li>";
			html=html+"<li>Medium Questions "+ theScore.Medium.success.toString() +" correct, "+theScore.Medium.failure.toString() +" wrong. </li>";
			html=html+"<li>Easy Questions "+ theScore.Easy.success.toString() +" correct, "+ theScore.Easy.failure.toString() +" wrong. </li>";
			html=html+"</ul>";
			$("#NumberQ").html(html);
		}
	});
}
function averageTimeOnLesson(student){
	var thesetting=TheLRStheSetting;
	var match={"statement.actor.mbox":student,
				"statement.result.response":classID};
	var Group={"_id":"$statement.object.mbox",
			   "sum":{"$sum":1},
	           "firstTime":{"$min":"$statement.timestamp"},
			   "LastTime":{"$max":"$statement.timestamp"}
			}
	var data=[{"$match":match}, 
              {"$group":Group}]
	thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length==0){ 
		}else{
			var numberArray=[];
			for (var i=0; i<response.length;i++){
				var FirstTime = new Date(response[i].firstTime).getTime();
				var LastTime = new Date(response[i].LastTime).getTime();
				var timediff=(LastTime-FirstTime)/response[i].sum;
				numberArray.push(timediff);
			}
			var averageDiff=Getmean(numberArray);
			$("#AverageTimeOnLesson").html((averageDiff/(1000*60)).toFixed(1)+ " minutes");
		}
	});

}
function StudentsStartedLesson(student){
	var thesetting=TheLRStheSetting;
	var match={"statement.actor.mbox":student,
				"statement.result.response":classID};
	var Group={"_id":"$statement.verb.id",
			   "sum":{"$sum":1},
			}
	var data=[{"$match":match}, 
              {"$group":Group}]
	thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length==0){ 
		}else{
			for (var i=0;i<response.length;i++){
				var theverb=response[i]._id;
				if (theverb.indexOf("start")>-1){
					$("#NLStarted").html(response[i].sum);
				}
				if (theverb.indexOf("failed")>-1){
					$("#NLFailed").html(response[i].sum);
				}
				if (theverb.indexOf("completed")>-1){
					$("#NLCompeted").html(response[i].sum);
				}
			}
		}
	});

}

function StdudentFirstLast(student){
	var thesetting=TheLRStheSetting;
	var match={"statement.object.mbox":student,
				"statement.result.response":classID,
			    "statement.verb.id":"https://app.skoonline.org/ITSProfile/interaction"};
	var Group={"_id":"$statement.verb.id",
			   "sum":{"$sum":1},
	           "firstTime":{"$min":"$statement.timestamp"},
			   "LastTime":{"$max":"$statement.timestamp"}
			}
	var data=[{"$match":match}, 
              {"$group":Group}]
	thesetting.data=JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length==0){ 
		}else{
			$("#RecentTime").html(ReturnDate(response[0].LastTime));
			$("#FirstTime").html(ReturnDate(response[0].firstTime));
		}
	});

}
function CreateTable(LessonList,StudentList){
	var j;
	var i;
	var html="";
	html=html+"<table width='100%' align='center' id='customers'>";
	html=html+"<thead>"
	html=html+"<tr><th></th>";
	for (j=0;j<StudentList.length;j++){
		var firstname=StudentList[j].name.split(" ")[0];
		var studentjson=JSON.stringify(StudentList[j]);
		html=html+"<th>"+firstname+"<br/><button  onclick='StudentDetails(\""+StudentList[j].name+"_&_"+StudentList[j].mbox+"\")'>?</button></th>";
		console.log(html)
	}
	html=html+"</tr>";
	html=html+"</thead>";
	html=html+'<tbody style="height: 10px !important; overflow: scroll; ">';
	for (i=0;i<LessonList.length;i++){
		var PassingVariable=LessonList[i][0]+"__"+LessonList[i][1];
        if (ThestudentID==""){
			html=html+"<tr> <td>"+LessonList[i][0];
			html=html+" <button onclick='LessonDetails(\""+PassingVariable+"\")'>?</button>";
		}else{
			html=html+"<tr> <td width='300'><span class='LessonTitle'>"+LessonList[i][0]+": <br/></span>";
			html=html+"<span class='lessonDescription'> "+LessonList[i][3]+"</span>";
		}

		html=html+"</td>";
		for (j=0;j<StudentList.length;j++){
			var scoreFiled="score_"+i.toString()+"_"+j.toString();
			html=html+"<td><span id='"+scoreFiled+"'>"+""+"</span></td>";
		}
		html=html+"</tr>";
	}
	html=html+'</tbody>'
	html=html+"</table>";
	$("#TheGrades").html(html);
	$("#TheGrades").show();
	for (i=0;i<LessonList.length;i++){
		for (j=0;j<StudentList.length;j++){
			var scoreFiled="score_"+i.toString()+"_"+j.toString();
			if (ThestudentID!=""){
				GetRealScore(StudentList[j].mbox,LessonList[i][1],scoreFiled);
			}else{
				GetPassFailInProgress(LessonList[i],StudentList[j].mbox,StudentList[j].name,i,j);
			}
		}
	}
}

function GetGradesFor(User,Test,ObjID,n,i,j,link){
	var settings=TheLRStheSetting;
	var Target={};
	Target={
			"statement.actor.mbox":User,
			"statement.verb.id":"https://www.autotutor.org/ITSProfile/Answer",
			"statement.object.id":ObjID
		}
	var GroupIng={};
	GroupIng={
		"_id":"$statement.actor.name",
		"Sum":{"$sum":1},
		"AverageConfidence":{"$avg":"$statement.result.score.raw"},
		"AverageScore":{"$avg":"$statement.result.score.scaled"},
		"AverageTime":{"$avg":"$statement.result.score.max"}
	}

	var data=[{"$match":Target},
	          {"$sort":{"statement.timestamp":-1}},
			  {"$limit":parseInt(n)},
			  {"$group":GroupIng}
	 ];
	 settings.data=JSON.stringify(data);
	 $.ajax(settings).done(function (response) {
		if (response.length==0){ return}
		$("#email"+i.toString()).html(response[0]._id);
		html="";
		if (response[0].AverageScore<0.999){
			html=html="<a href='"+link+"' targt='Test'>"+response[0].AverageScore.toFixed(2)+"</a>";
		}else{
			html=response[0].AverageScore.toFixed(2);
		}
		$("#test"+j.toString()+i.toString()).html(html);
	     console.log(Test, response[0]._id, response[0].AverageScore);
	  });

}

function GetScore(email){
	var html="";
	html=html+"<table align='center' id='customers'>"
	html=html+"<tr>";
	var j;
	for (j=0;j<TestList.length;j++){
		html=html+"<th>"+TestList[j][0]+"</th>";
	}
	html=html+"</tr>";
	html=html+"<tr>";
	for (j=0;j<TestList.length;j++){
		html=html+"<td><span id='TheTest"+j.toString()+"'></span></td>";
	}
	html=html+"</tr>";
	html=html+"</table>";
	html=html+"<ul>";
	html=html+"<span id='additionalNotes'></span>";
	html=html+"</ul>";
	$("#TheYourScore").html(html);
	for (j=0;j<TestList.length;j++){
		getTest(email,TestList[j][1],TestList[j][2],"TheTest"+j.toString(),TestList[j][3],TestList[j][0]);
	}
}
function getTest(email,testID,n,target,link,Title){
	var settings=TheLRStheSetting;
	var Target={};
	Target={
			"statement.actor.mbox":"mailto:"+email,
			"statement.verb.id":"https://www.autotutor.org/ITSProfile/Answer",
			"statement.object.id":testID
		}
	var GroupIng={};
	GroupIng={
		"_id":"$statement.actor.mbox",
		"Sum":{"$sum":1},
		"AverageConfidence":{"$avg":"$statement.result.score.raw"},
		"AverageScore":{"$avg":"$statement.result.score.scaled"},
		"AverageTime":{"$avg":"$statement.result.score.max"}
	}

	var data=[{"$match":Target},
	          {"$sort":{"statement.timestamp":-1}},
			  {"$limit":parseInt(n)},
			  {"$group":GroupIng}
	 ];
	 settings.data=JSON.stringify(data);
	 $.ajax(settings).done(function (response) {
		html="";
		if (response.length==0){ 
			$("#"+target).html("0");
			return;
		}
		var difference=parseInt(n)-response[0].Sum;
		if (response[0].AverageScore<0.999){
			if (difference==0){
				html=html="<a href='"+link+"' target='Test'>"+response[0].AverageScore.toFixed(2)+"*</a>";
				var varNotes=$("#additionalNotes").html();
				$("#additionalNotes").html(varNotes+ " <li>*You can improve your score for <span class='numbers'>"+Title+" </span><br/>");

			}else{
				html=html="<a href='"+link+"' target='Test'>"+response[0].AverageScore.toFixed(2)+"**</a>";
				var varNotes=$("#additionalNotes").html();
				$("#additionalNotes").html(varNotes+ " <li>**You need to answer additional <span class='numbers'>"+difference.toString()+" </span> problems for <span class='numbers'>"+Title+" </span><br/>");
			}
		}else{
			if (difference==0){
			    html=response[0].AverageScore.toFixed(2);
			}else{
				html=html="<a href='"+link+"' target='Test'>"+response[0].AverageScore.toFixed(2)+"**</a>";
				var varNotes=$("#additionalNotes").html();
				$("#additionalNotes").html(varNotes+ " <li>**You need to answer additional <span class='numbers'>"+difference.toString()+" </span> problems for <span class='numbers'>"+Title+" </span><br/>");
			}
		}
		$("#"+target).html(html);
	  });


}


function GetRealScore(student,CourseGUID,target){
	var setting=TheLRStheSetting;
	var QueryObj=[
					{"$match":{"statement.actor.mbox":student,
							"statement.object.mbox":"mailto:"+CourseGUID+"@csal.autotutor.org",
							"statement.verb.id":"https://app.skoonline.org/ITSProfile/action"}},
					{"$sort":{"statement.timestamp":-1}},
					{"$project":{"thetime":"$statement.timestamp","Result":"$statement.result","ResultExt":"$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"}},
					{"$project":{"time":"$thetime","Success":"$Result.success","QuestLevelExt":"$ResultExt.questionLevel"}}
				]
	setting.data=JSON.stringify(QueryObj);
	$.ajax(setting).success(function (response){
		if (response.length==0){
			$("#"+target).html("")
			return;
		}else{
			var Levels=[];
			// get The question levels
			for (var i=0;i<response.length;i++){
				if (response[i].QuestLevelExt!=null){
				if (Levels.includes(response[i].QuestLevelExt)){
				}else{
					Levels.push(response[i].QuestLevelExt)
				}
			}
			}
			// Get the performace Obj
			var PerformaceObj={};
			var PerfomaceScore={"true":0,"false":0};
			for (var i=0;i<Levels.length;i++){
				var PerfomaceScore={"true":0,"false":0};
				PerformaceObj[Levels[i]]=PerfomaceScore;
			}
            for (var i=0;i<response.length;i++){
				if (response[i].QuestLevelExt!=null){
					if (response[i].Success){
						PerformaceObj[response[i].QuestLevelExt].true=PerformaceObj[response[i].QuestLevelExt].true+1;
					}else{
						PerformaceObj[response[i].QuestLevelExt].false=PerformaceObj[response[i].QuestLevelExt].false+1;
					}
				}
			}
			var html="<ul>";
			html="<li>The time of your recent access to this lesson: "+ReturnDate(response[0].time);
			html=html+"<li>The first time you started this lesson : "+ReturnDate(response[response.length-1].time);
			html=html+"<li>How did you answer questions in this lesson?<ul>";
			for (i=0;i<Levels.length;i++){
				html=html+"<li>"+Levels[i]+" question: "+JSON.stringify(PerformaceObj[Levels[i]])+"</li>"
			}
			html=html+"</ul>";
			html=html+"</ul>";
			$("#"+target).html(html)
			console.log(PerformaceObj);
		}
	});
}
