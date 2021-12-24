var TheLessions = [];
var StudentList = [];
var launchURL=qs("launchURL","https://csal.autotutor.org/index.html?pw=1024&ph=76&NS=1&GL=2");

var TheLessonPages = [];
var TheLearnerResponses = [];
var ThestudentID = decodeURIComponent(qs("sid", ""));


function removehtml(str) {
	return str.replace(/<\/?[\w\s]*>|<.+[\W]>/g, '');
}

function OpenPopUpDetails(header, footer, bodytext, targetwin) {
	//   	$("#"+targetwin).show();
	//	    $("#popupWin").html(bodytext);
	//		$("#popupWin").show();
	//		return;
	var html = "";
	html = html + '<div class="modal-content" id="PopupDialog">';
	html = html + '<div class="modal-header">';
	html = html + '<span id="Modalclosebtn" class="close">&times;</span>';
	html = html + '<h2>' + header + '</h2>';
	html = html + '</div>';
	html = html + '<div class="modal-body" id="bodytext">';
	html = html + bodytext;
	html = html + '</div>';
	html = html + '<div class="modal-footer">';
	html = html + '<h3>' + footer + '</h3>';
	html = html + '</div>';
	html = html + '</div>';
	var popup = document.getElementById(targetwin);
	if (popup == null) {
		var popup = document.createElement("div");
		popup.class = "modal";
		popup.id = targetwin;
		$("#editor").append(popup);
		popup.innerHTML = html;
	} else {
		$('#' + targetwin).html(html);
		$('#' + targetwin).show();
	}
	$("#Modalclosebtn").click(function () {
		$('#' + targetwin).hide();
		popup.innerHTML = "";
	});
}



TheLRStheSetting = {
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
	"data": {}
}

var TheScore = {
	"Hard": {
		"success": 0,
		"failure": 0
	},
	"Medium": {
		"success": 0,
		"failure": 0
	},
	"Easy": {
		"success": 0,
		"failure": 0
	}
}


function studentsReport(student, verb) {
	var thesetting = TheLRStheSetting;
	var match = {
		"statement.actor.mbox": +student,
		"statement.verb.id": "https://app.skoonline.org/ITSProfile/" + verb
	};
	var group = {
		"_id": "$statement.id",
		"Sum": {
			"$sum": 1
		}
	};
	var data = [{
			"$match": match
		},
		{
			"$group": group
		}
	];
	thesetting.data = JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {

	})
}


function GetStudents(classID, student) {
	var thesetting = TheLRStheSetting;
	var match;
	if (student != "") {
		match = {
			"statement.result.response": classID,
			"statement.actor.mbox": "mailto:" + student
		};
	} else {
		match = {
			"statement.result.response": classID,
			"statement.verb.id": "https://app.skoonline.org/ITSProfile/start"
		};
	}
	var group = {
		"_id": "$statement.actor",
		"Sum": {
			"$sum": 1
		}
	};
	var data = [{
			"$match": match
		},
		{
			"$group": group
		}
	];
	thesetting.data = JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length == 0) {
			$("#WaitBtn").html("No data yet");
			return
		} else {
			for (var i = 0; i < response.length; i++) {
				var studentID = response[i]._id;
				if (studentID.name.indexOf("github") == -1) {
					StudentList.push(studentID);
				}
			}
			//			console.log(StudentList);
			TheLessions = TheLessions.filter((item) => {
				return item.Section != "Section";
			})
			//	TheLessions.sort(SortLesson);
			CreateTable(TheLessions, StudentList)
		}
	});
}

function SortLesson(a, b) {
	if (a.Section < b.Section) {
		return -1;
	}
	if (a.Section > b.Section) {
		return 1;
	}
	return 0;
}


function DetailsForStudentandLesson(student, lesson) {
	var thesetting = TheLRStheSetting;
	var match = {
		"statement.actor.mbox": student,
		"statement.object.mbox": "mailto:" + lesson + "@csal.autotutor.org",
		"statement.verb.id": "https://app.skoonline.org/ITSProfile/action"
	};
	var group = {
		"_id": "$statement.verb.id",
		"firstTime": {
			"$min": "$statement.timestamp"
		},
		"LastTime": {
			"$max": "$statement.timestamp"
		}
	}
	var data = [{
			"$match": match
		},
		{
			"$group": group
		}
	];
	thesetting.data = JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length == 0) {
			return;
		} else {
			$("#LastTimeLesson").html(ReturnDate(response[0].LastTime));
			$("#FirstTimeLesson").html(ReturnDate(response[0].firstTime));
		}
	});
}

function LessonQuestionSummary(LessonID) {
	var thesetting = TheLRStheSetting;
	var match
	if (LessonID.indexOf("___") == -1) {
		match = {
			"statement.verb.id": "https://app.skoonline.org/ITSProfile/action",
			"statement.object.mbox": "mailto:" + LessonID + "@csal.autotutor.org"
		};
	} else {
		var newLessonID = LessonID.split("___")[1];
		var student = LessonID.split("___")[2];
		match = {
			"statement.verb.id": "https://app.skoonline.org/ITSProfile/action",
			"statement.object.mbox": "mailto:" + newLessonID + "@csal.autotutor.org",
			"statement.actor.mbox": student
		};
	}
	var data = [{
			"$match": match
		},
		{
			"$sort": {
				"statement.timestamp": -1
			}
		},
		{
			"$project": {
				"Ext": "$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result",
				"Result": "$statement.result.success",
				"LessonID": "$statement.object.mbox"
			}
		},
		{
			"$project": {
				"MediaUrl": "$Ext.MediaUrl",
				"questionLevel": "$Ext.questionLevel",
				"questionID": "$Ext.questionID",
				"QuestionType": "$Ext.Type",
				"userSelectedItem": "$Ext.userSelectedItem",
				"success": "$Result",
				"TheLesson": "$LessonID"
			}
		}
	]
	thesetting.data = JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		TheLessonPages = [];
		if (response.length == 0) {
			return;
		} else {
			// list of pages
			var ListOfLessonObj = [];
			for (var i = 0; i < response.length; i++) {
				if (response[i].QuestionType == "QuestionPage") {
					var choiceObj = "(<span class='numbers'>" + response[i].success + "</span>) " + response[i].userSelectedItem;
					var index = TheLessonPages.indexOf(response[i].questionID);
					if (index > -1) {
						ListOfLessonObj[index].Choices.push(choiceObj);
					} else {
						var LessonObj = {
							"Page": response[i].MediaUrl.split("ActivityMedia/media/")[1].split("?")[0],
							"ID": response[i].questionID,
							"Choices": [choiceObj]
						}
						ListOfLessonObj.push(LessonObj);
						TheLessonPages.push(response[i].questionID);
					}
				}
			}
			console.log(TheLessonPages);
			console.log(ListOfLessonObj);
			// Construct report
			var html = "<ul>";
			for (i = 0; i < ListOfLessonObj.length; i++) {
				html = html + "<li>";;
				html = html + ListOfLessonObj[i].Page;
				html = html + "<ul>";
				html = html + GetCount(ListOfLessonObj[i].Choices);
				html = html + "</ul>";
				html = html + "</li>";
			}
			html = html + "</ul>";
			$("#MoreDetails").html(html);
		}
	});
}

function GetCount(ArrayStr) {
	var html = "";
	var newArray = [];
	var TheCount = [];
	var i;
	for (i = 0; i < ArrayStr.length; i++) {
		var Index = newArray.indexOf(ArrayStr[i]);
		if (Index == -1) {
			newArray.push(ArrayStr[i]);
			TheCount.push(1)
		} else {
			TheCount[Index] = TheCount[Index] + 1;
		}
	}
	for (i = 0; i < newArray.length; i++) {
		html = html + "<li> <span class='numbers'>[" + TheCount[i].toString() + "]</span> " + newArray[i] + "</li>"
	}
	return html;
}

function StartS_L(Lesson_and_Student){
	var thePassedObj = JSON.parse(decodeURI(Lesson_and_Student))
	console.log(thePassedObj);
	console.log(document.location.search);
	var LessonID = "&LN=Lesson"+thePassedObj.Lesson.LessonID;
	var guid = "&guid="+thePassedObj.Lesson.GUID;
	var lessonTitle="&lessonTitle="+encodeURIComponent(thePassedObj.Lesson.ALessonTitle);
	var URL=launchURL+"&"+document.location.search.split("?")[1]+LessonID+guid+lessonTitle;
	console.log(launchURL+"&"+document.location.search.split("?")[1]+LessonID+guid+lessonTitle);
	window.open(URL,"LaunchARC");
}

function DetailsS_L(Lesson_and_Student) {
	var thePassedObj = JSON.parse(decodeURI(Lesson_and_Student))
	var LessonName = thePassedObj.Lesson.ALessonTitle;
	var LessonID = thePassedObj.Lesson.GUID;
	var Student = thePassedObj.Student;
	var Name = thePassedObj.Name.split(" ")[0];

	var htmlbody = "Detailed Interaction of  " + Name + " with " + LessonName;
	htmlbody = htmlbody + "<div id='MoreDetails'>";
	htmlbody = htmlbody + "<ul>";
	htmlbody = htmlbody + "<li>First time " + Name + " start the lesson: <span class='numbers' id='FirstTimeLesson'></span></li>";
	htmlbody = htmlbody + "<li>Last time  " + Name + " was on the lessons: <span class='numbers' id='LastTimeLesson'></span></li>";
	htmlbody = htmlbody + "<li>Number Questions Answered: <span class='numbers' id='LSAnswerDetails'></span></li>";
	//	htmlbody=htmlbody+"<li>Average time spend on each answer: <span class='numbers' id='TimeOnAnswer'></span></li>";
	//	htmlbody=htmlbody+"<li>How the answers of question in this lesson compared with others: <span class='numbers' id='AnswersCompared'></span></li>";
	//	htmlbody=htmlbody+"<li>Answers to all the questions: <span class='numbers' id='AnswersCompared'></span></li>";
	htmlbody = htmlbody + "</ul>";
	//	htmlbody=htmlbody+"<button onclick='LessonQuestionSummary(\""+Lesson_and_Student+"\")'>More details</button> </div>";
	htmlbody = htmlbody + "</div>"
	htmlbody = "<span id='SLDetails'></span>"
	OpenPopUpDetails(LessonName + " and " + Name, "details ...", htmlbody, "popupWin");
	LessonStudentDetailsNew(LessonID, Lesson_and_Student, "SLDetails")
	//	DetailsForStudentandLesson(Student,LessonID);
	//	TheScore={
	//		"Hard":{"success":0,"failure":0},
	//		"Medium":{"success":0,"failure":0},
	//		"Easy":{"success":0,"failure":0}
	//	  }
	//	var TheStudent="mailto:student"+Student+"@csal.autotutor.org";
	//	StudentAnswerQuestions_Lesson(Student,LessonID);
}



function GetPassFailInProgress(Lesson, Student, Name, i, j) {
	var thesetting = TheLRStheSetting;
	var match = {
		"statement.actor.mbox": Student,
		"statement.object.mbox": "mailto:" + Lesson.GUID + "@csal.autotutor.org"
	};
	var data = [{
			"$match": match
		},
		{
			"$sort": {
				"statement.timestamp": -1
			}
		},
		{
			"$group": {
				"_id": "$statement.verb.id",
				"TotalScore": {
					"$sum": 1, 
				},
				"time":{"$max":"$statement.timestamp"}
			}
		}
	];
	thesetting.data = JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		var TheObj = {
			Lesson: Lesson,
			Student: Student,
			Name: Name
		}
		var LessonPassVar = encodeURI(JSON.stringify(TheObj))
		var detailInformationLink = "<button class='btn' style='background-color: grey' onclick='DetailsS_L(\"" + LessonPassVar + "\")'>&#63;</button>";
		var failedBtn = "<button class='btn' class='btn' style='background-color: red' onclick='DetailsS_L(\"" + LessonPassVar + "\")'>&#63;</button>";
		var startBtn = "<button class='btn' class='btn' style='background-color: green' onclick='StartS_L(\"" + LessonPassVar + "\")'>➤</button>";
		var StopIcon = "<button class='btn' class='btn' style='background-color: grey'>&#10499;</button>";

		var StatusFiled = "Sscore_" + i.toString() + "_0";
		var ActionFiled = "Ascore_" + i.toString() + "_0";
		var LogFiled = "Lscore_" + i.toString() + "_0";

		var StatusField = "Sscore_" + i.toString() + "_0";
			var ActionField = "Ascore_" + i.toString() + "_0";
			var LogField = "Lscore_" + i.toString() + "_0";
			var TimeField = "Tscore_" + i.toString() + "_0";

		var TheLessonRowID = "Row_" + i.toString();
		if (response.length == 0) {


			var html = "Not Assigned";
			
			$("#" + ActionFiled).html(StopIcon);

			var TheAssigned=TheAssignmentStatus.filter((item)=>{
				return (item.Lesson.mbox.indexOf(Lesson.GUID)>-1);
			});
			if (TheAssigned.length>0){
				if (TheAssigned[0].result){
					html = "Assigned";
				    $("#" + ActionFiled).html(startBtn);
					var AssignedDate = " Assigned at";
					$("#" + LogFiled).html(AssignedDate);
					$("#" + TimeField).html( ReturnDate(TheAssigned[0].Time) );
				}
			}
			$("#" + StatusFiled).html(html);
			return;
		} else {
			var timeStamp=response[0].time;
			var AllVerbs = [];
			for (var k = 0; k < response.length; k++) {
				var verb = response[k]._id;
				AllVerbs.push(verb.split("https://app.skoonline.org/ITSProfile/")[1]);
			}
			//			console.log(AllVerbs);
			$("#" + TheLessonRowID).show();
			if (AllVerbs.includes("completed")) {
				var BtnStr = "<span class='btn' style='background-color: green' >&#10003;</span>"
				$("#" + ActionFiled).html(BtnStr);
				$("#" + StatusFiled).html("Passed");
			//	$("#" + TimeField).html( ReturnDate(timeStamp));
				return;
			}
			if (AllVerbs.includes("failed")) {
				$("#" + ActionFiled).html(failedBtn);
				$("#" + StatusFiled).html("failed");
			//	$("#" + TimeField).html( ReturnDate(timeStamp));
				return;
			}

			if (AllVerbs.includes("action")) {
				$("#" + ActionFiled).html(startBtn);
				$("#" + StatusFiled).html("in progress "+detailInformationLink);
			//	$("#" + TimeField).html( ReturnDate(timeStamp));
				return;
			}
			if (AllVerbs.includes("start")) {
				$("#" + ActionFiled).html(startBtn);
				$("#" + StatusFiled).html("started ");
			//	$("#" + TimeField).html( ReturnDate(timeStamp));
				return;
			}
		}
	});
}


function ReturnDate(Thedate) {
	d = new Date(Thedate);
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var weekday = new Array(7);
	weekday[0] = "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
	var say = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " on " + weekday[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
	return say;
}


function GetScoreThe(Lesson, Student, i, j) {
	var thesetting = TheLRStheSetting;
	var match = {
		"statement.actor.mbox": "mailto:student" + Student + "@csal.autotutor.org",
		"statement.verb.id": "https://app.skoonline.org/ITSProfile/action",
		"statement.object.mbox": "mailto:" + Lesson[1] + "@csal.autotutor.org"
	};
	var data = [{
			"$match": match
		},
		{
			"$sort": {
				"statement.timestamp": -1
			}
		},
		{
			"$project": {
				"ResultExt": "$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"
			}
		},
		{
			"$project": {
				"Statement": "$ResultExt.Score.this"
			}
		}
	];
	thesetting.data = JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		var scoreFiled = "score_" + i.toString() + "_" + j.toString();
		if (response.length == 0) {
			$("#" + scoreFiled).html("");
			return;
		} else {
			$("#" + scoreFiled).html("tried");
		}
	});
}

function GetLTRecentLast(LessonID) {
	var thesetting = TheLRStheSetting;
	var match;
	if (ThestudentID != "") {
		match = {
			"statement.actor.mbox": "mailto:" + LessonID + "@csal.autotutor.org",
			"statement.result.response": classID,
			"statement.object.mbox": "mailto:" + ThestudentID
		};
	} else {
		match = {
			"statement.actor.mbox": "mailto:" + LessonID + "@csal.autotutor.org",
			"statement.result.response": classID
		};
	}

	var Group = {
		"_id": "$statement.verb.id",
		"firstTime": {
			"$min": "$statement.timestamp"
		},
		"LastTime": {
			"$max": "$statement.timestamp"
		}
	}
	var data = [{
			"$match": match
		},
		{
			"$group": Group
		}
	]
	thesetting.data = JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length == 0) {} else {
			$("#LTRecent").html(ReturnDate(response[0].LastTime));
			$("#LTFirst").html(ReturnDate(response[0].firstTime));
			for (var i = 0; i < response.length; i++) {
				console.log(response[i]);
			}
		}
	});
};

function Getmean(numberArray) {
	var sum = 0;
	if (numberArray.length == 0) {
		return sum;
	}
	var i;
	for (i = 0; i < numberArray.length; i++) {
		sum = sum + numberArray[i];
	}
	return sum / numberArray.length;
}

function GetAverageTime(LessonID) {
	var thesetting = TheLRStheSetting;
	var match;
	if (ThestudentID != "") {
		match = {
			"statement.actor.mbox": "mailto:" + LessonID + "@csal.autotutor.org",
			"statement.verb.id": "https://app.skoonline.org/ITSProfile/interaction",
			"statement.result.response": classID,
			"statement.object.mbox": "mailto:" + ThestudentID
		};
	} else {
		match = {
			"statement.actor.mbox": "mailto:" + LessonID + "@csal.autotutor.org",
			"statement.verb.id": "https://app.skoonline.org/ITSProfile/interaction",
			"statement.result.response": classID
		};
	}
	var Group = {
		"_id": "$statement.object.mbox",
		"sum": {
			"$sum": 1
		},
		"firstTime": {
			"$min": "$statement.timestamp"
		},
		"LastTime": {
			"$max": "$statement.timestamp"
		}
	}
	var data = [{
			"$match": match
		},
		{
			"$group": Group
		}
	]
	thesetting.data = JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length == 0) {} else {
			var numberArray = [];
			for (var i = 0; i < response.length; i++) {
				var FirstTime = new Date(response[i].firstTime).getTime();
				var LastTime = new Date(response[i].LastTime).getTime();
				var timediff = (LastTime - FirstTime) / response[i].sum;
				numberArray.push(timediff);
			}
			var averageDiff = Getmean(numberArray);
			$("#AVTime").html((averageDiff / 1000).toFixed(1) + " seconds");
		}
	});
};



function StudentAnswerQuestions_Lesson(student, LessonID) {
	var thesetting = TheLRStheSetting;
	var match = {
		"statement.actor.mbox": student,
		"statement.verb.id": "https://app.skoonline.org/ITSProfile/action",
		"statement.object.mbox": "mailto:" + LessonID + "@csal.autotutor.org"
	};

	var data = [{
			"$match": match
		},
		{
			"$sort": {
				"statement.timestamp": -1
			}
		},
		{
			"$limit": 1
		},
		{
			"$project": {
				"EXt": "$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"
			}
		},
		{
			"$project": {
				"Score": "$EXt.Score.this"
			}
		}
	]
	thesetting.data = JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length == 0) {} else {

			var theScore = response[0].Score;
			TheScore.Hard.success = TheScore.Hard.success + theScore.Hard.success;
			TheScore.Hard.failure = TheScore.Hard.failure + theScore.Hard.failure;

			TheScore.Medium.success = TheScore.Medium.success + theScore.Medium.success;
			TheScore.Medium.failure = TheScore.Medium.failure + theScore.Medium.failure;

			TheScore.Easy.success = TheScore.Easy.success + theScore.Easy.success;
			TheScore.Easy.failure = TheScore.Easy.failure + theScore.Easy.failure;

			var html = "<ul>";
			html = html + "<li>Hard Questions " + TheScore.Hard.success.toString() + " correct, " + TheScore.Hard.failure.toString() + " wrong. </li>";
			html = html + "<li>Medium Questions " + TheScore.Medium.success.toString() + " correct, " + TheScore.Medium.failure.toString() + " wrong. </li>";
			html = html + "<li>Easy Questions " + TheScore.Easy.success.toString() + " correct, " + TheScore.Easy.failure.toString() + " wrong. </li>";
			html = html + "</ul>";
			$("#LSAnswerDetails").html(html);
		}
	});
}



function GetTheLessonQuestion(LessonID) {
	TheScore = {
		"Hard": {
			"success": 0,
			"failure": 0
		},
		"Medium": {
			"success": 0,
			"failure": 0
		},
		"Easy": {
			"success": 0,
			"failure": 0
		}
	}
	var html = "<ul>";
	html = html + "<li>Hard Questions " + TheScore.Hard.success.toString() + " correct, " + TheScore.Hard.failure.toString() + " wrong. </li>";
	html = html + "<li>Medium Questions " + TheScore.Medium.success.toString() + " correct, " + TheScore.Medium.failure.toString() + " wrong. </li>";
	html = html + "<li>Easy Questions " + TheScore.Easy.success.toString() + " correct, " + TheScore.Easy.failure.toString() + " wrong. </li>";
	html = html + "</ul>";
	$("#LSAnswerDetails").html(html);
	var thesetting = TheLRStheSetting;
	var match;
	if (ThestudentID != "") {
		match = {
			"statement.object.mbox": "mailto:" + LessonID + "@csal.autotutor.org",
			"statement.verb.id": "https://app.skoonline.org/ITSProfile/action",
			"statement.actor.mbox": "mailto:" + ThestudentID
		};
	} else {
		match = {
			"statement.object.mbox": "mailto:" + LessonID + "@csal.autotutor.org",
			"statement.verb.id": "https://app.skoonline.org/ITSProfile/action"
		};
	}
	var group = {
		"_id": "$statement.actor.mbox",
		"sum": {
			"$sum": 1
		}
	};
	var data = [{
			"$match": match
		},
		{
			"$group": group
		}
	]
	thesetting.data = JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length == 0) {} else {
			var i;
			for (i = 0; i < response.length; i++) {
				StudentAnswerQuestions_Lesson(response[0]._id, LessonID)
			}
		}
	});
}

function LessonDetails(LessonID) {
	var LessonName = "lesson: " + LessonID.split("__")[0]
	var htmlbody = "<div id='MoreDetails'>Information about this lesson</span>";
	htmlbody = htmlbody + "<ul>";
	htmlbody = htmlbody + "<li>Last time student intearcted with this lesson: <span class='numbers' id='LTRecent'></span></li>";
	htmlbody = htmlbody + "<li>First time student intearcted with this lesson: <span class='numbers' id='LTFirst'></span></li>";
	htmlbody = htmlbody + "<li>Average Time between Interactions: <span class='numbers' id='AVTime'></span></li>";
	htmlbody = htmlbody + "<li>The questions answered by students: <span class='numbers' id='LSAnswerDetails'></span></li>";
	htmlbody = htmlbody + "</ul>";
	htmlbody = "<span id='TheLessonDetails'></span>"
	//	htmlbody=htmlbody+"<button onclick='LessonQuestionSummary(\""+LessonID.split("__")[1]+"\")'>More details</button> </div>";
	OpenPopUpDetails(LessonName, "details of " + LessonName, htmlbody, "popupWin");
	LessonDetailsNew(LessonID.split("__")[1], "TheLessonDetails")
	//	GetLTRecentLast(LessonID.split("__")[1]);
	//	GetAverageTime(LessonID.split("__")[1]);
	//	GetTheLessonQuestion(LessonID.split("__")[1]);
}

function StudentDetails(student) {
	var TheStudent = student.split("_&_");
	var htmlbody = "Information about this student ";
	htmlbody = htmlbody + "<ul>";
	htmlbody = htmlbody + "<li>Most recent time took any lessons: <span class='numbers' id='RecentTime'></span></li>";
	htmlbody = htmlbody + "<li>First time started any lessons: <span class='numbers' id='FirstTime'></span></li>";
	htmlbody = htmlbody + "<li>Number of lessons started: <span class='numbers' id='NLStarted'></span></li>";
	htmlbody = htmlbody + "<li>Number of lessons completed: <span class='numbers' id='NLCompeted'></span></li>";
	htmlbody = htmlbody + "<li>Number of lessons failed: <span class='numbers' id='NLFailed'></span></li>";
	//	htmlbody=htmlbody+"<li>Number of lessons repeated: <span class='numbers' id='NLRepeated'></span></li>";
	htmlbody = htmlbody + "<li>Average time spent on each lesson: <span class='numbers' id='AverageTimeOnLesson'></span></li>";
	htmlbody = htmlbody + "<li>Total Number of questions answered: <span class='numbers' id='NumberQ'></span></li>";
	htmlbody = htmlbody + "</ul>";
	htmlbody = "<span id='TheDeatisl'></span>";
	OpenPopUpDetails(TheStudent[0], "details of student " + TheStudent[0], htmlbody, "popupWin");
	StudentDetailsNew(TheStudent[1], "TheDeatisl")
	//	StdudentFirstLast(TheStudent[1]);
	//	StudentsStartedLesson(TheStudent[1]);
	//	averageTimeOnLesson(TheStudent[1]);
	//	StudentAnswerQuestions(TheStudent[1]);
}



function StudentAnswerQuestions(student) {
	var thesetting = TheLRStheSetting;
	var match = {
		"statement.actor.mbox": student,
		"statement.verb.id": "https://app.skoonline.org/ITSProfile/action"
	};

	var data = [{
			"$match": match
		},
		{
			"$sort": {
				"statement.timestamp": -1
			}
		},
		{
			"$limit": 1
		},
		{
			"$project": {
				"EXt": "$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"
			}
		},
		{
			"$project": {
				"Score": "$EXt.Score.total"
			}
		}
	]
	thesetting.data = JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length == 0) {} else {
			var theScore = response[0].Score;
			var html = "<ul>";
			html = html + "<li>Hard Questions " + theScore.Hard.success.toString() + " correct, " + theScore.Hard.failure.toString() + " wrong. </li>";
			html = html + "<li>Medium Questions " + theScore.Medium.success.toString() + " correct, " + theScore.Medium.failure.toString() + " wrong. </li>";
			html = html + "<li>Easy Questions " + theScore.Easy.success.toString() + " correct, " + theScore.Easy.failure.toString() + " wrong. </li>";
			html = html + "</ul>";
			$("#NumberQ").html(html);
		}
	});
}

function averageTimeOnLesson(student) {
	var thesetting = TheLRStheSetting;
	var match = {
		"statement.actor.mbox": student,
		"statement.result.response": classID
	};
	var Group = {
		"_id": "$statement.object.mbox",
		"sum": {
			"$sum": 1
		},
		"firstTime": {
			"$min": "$statement.timestamp"
		},
		"LastTime": {
			"$max": "$statement.timestamp"
		}
	}
	var data = [{
			"$match": match
		},
		{
			"$group": Group
		}
	]
	thesetting.data = JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length == 0) {} else {
			var numberArray = [];
			for (var i = 0; i < response.length; i++) {
				var FirstTime = new Date(response[i].firstTime).getTime();
				var LastTime = new Date(response[i].LastTime).getTime();
				var timediff = (LastTime - FirstTime) / response[i].sum;
				numberArray.push(timediff);
			}
			var averageDiff = Getmean(numberArray);
			$("#AverageTimeOnLesson").html((averageDiff / (1000 * 60)).toFixed(1) + " minutes");
		}
	});

}

function StudentsStartedLesson(student) {
	var thesetting = TheLRStheSetting;
	var match = {
		"statement.actor.mbox": student,
		"statement.result.response": classID
	};
	var Group = {
		"_id": "$statement.verb.id",
		"sum": {
			"$sum": 1
		},
	}
	var data = [{
			"$match": match
		},
		{
			"$group": Group
		}
	]
	thesetting.data = JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length == 0) {} else {
			for (var i = 0; i < response.length; i++) {
				var theverb = response[i]._id;
				if (theverb.indexOf("start") > -1) {
					$("#NLStarted").html(response[i].sum);
				}
				if (theverb.indexOf("failed") > -1) {
					$("#NLFailed").html(response[i].sum);
				}
				if (theverb.indexOf("completed") > -1) {
					$("#NLCompeted").html(response[i].sum);
				}
			}
		}
	});

}

function StdudentFirstLast(student) {
	var thesetting = TheLRStheSetting;
	var match = {
		"statement.object.mbox": student,
		"statement.result.response": classID,
		"statement.verb.id": "https://app.skoonline.org/ITSProfile/interaction"
	};
	var Group = {
		"_id": "$statement.verb.id",
		"sum": {
			"$sum": 1
		},
		"firstTime": {
			"$min": "$statement.timestamp"
		},
		"LastTime": {
			"$max": "$statement.timestamp"
		}
	}
	var data = [{
			"$match": match
		},
		{
			"$group": Group
		}
	]
	thesetting.data = JSON.stringify(data);
	$.ajax(thesetting).done(function (response) {
		if (response.length == 0) {} else {
			$("#RecentTime").html(ReturnDate(response[0].LastTime));
			$("#FirstTime").html(ReturnDate(response[0].firstTime));
		}
	});

}

function CreateTable(LessonList, StudentList) {
	var j;
	var i;
	var html = "";
	html = html + "<table width='80%' align='center' id='TheScoreTable'>";
	html = html + "<thead class='TheHeader'>"
	html = html + "<tr><th>Section </th>";
	html = html + "<th>The Lessons </th>";
	html = html + "<th>Action</th>";
	html = html + "<th>Status</th>";
	html = html + "<th>Note </th>";
	html = html + "<th>Time </th>";

	html = html + "</tr>";
	html = html + "</thead>";
	html = html + '<tbody style="height: 10px !important; overflow: scroll; ">';
	for (i = 2; i < LessonList.length; i++) {
		var PassingVariable = LessonList[i].ALessonTitle + "__" + LessonList[i].GUID;
		var TheLessonRowID = "Row_" + i.toString();
		if (ThestudentID == "") {
			html = html + "<tr id='" + TheLessonRowID + "'> <td>" + LessonList[i].ALessonTitle;
			html = html + " <button onclick='LessonDetails(\"" + PassingVariable + "\")'>?</button>";
		} else {
			html = html + "<tr id='" + TheLessonRowID + "'>";
			html = html + "<th>" + LessonList[i].Section + "</span></th>";
			html = html + "<th nowrap>" + LessonList[i].ALessonTitle + "</th>";
			var StatusField = "Sscore_" + i.toString() + "_0";
			var ActionField = "Ascore_" + i.toString() + "_0";
			var LogField = "Lscore_" + i.toString() + "_0";
			var TimeField = "Tscore_" + i.toString() + "_0";
			html = html + "<td><span id='" + ActionField + "'>" + "" + "</span></td>";
			html = html + "<td><span id='" + StatusField + "'>" + "" + "</span></td>";
			html = html + "<td><span id='" + LogField + "'>" + "" + "</span></td>";
			html = html + "<td><span id='" + TimeField + "'>" + "" + "</span></td>";
		}
		html = html + "</tr>";
	}
	html = html + '</tbody>'
	html = html + "</table>";
	$("#TheGrades").html(html);
	$("#WaitBtn").hide();
	$("#TheGrades").show();
	setTimeout(function () {
		for (i = 1; i < LessonList.length; i++) {
			for (j = 0; j < StudentList.length; j++) {
				var StatusFiled = "Sscore_" + i.toString() + "_0";
				var ActionFiled = "Ascore_" + i.toString() + "_0";
				var LogFiled = "Lscore_" + i.toString() + "_0";
				var TimeField = "Tscore_" + i.toString() + "_0";


				if (ThestudentID != "") {
					GetPassFailInProgress(LessonList[i], StudentList[j].mbox, StudentList[j].name, i, j);
					GetStudentRecord(StudentList[j].mbox, LessonList[i].GUID, LogFiled,TimeField);
				} else {
					GetPassFailInProgress(LessonList[i], StudentList[j].mbox, StudentList[j].name, i, j);
				}
			}
		}
	}, 10);

}

function GetGradesFor(User, Test, ObjID, n, i, j, link) {
	var settings = TheLRStheSetting;
	var Target = {};
	Target = {
		"statement.actor.mbox": User,
		"statement.verb.id": "https://www.autotutor.org/ITSProfile/Answer",
		"statement.object.id": ObjID
	}
	var GroupIng = {};
	GroupIng = {
		"_id": "$statement.actor.name",
		"Sum": {
			"$sum": 1
		},
		"AverageConfidence": {
			"$avg": "$statement.result.score.raw"
		},
		"AverageScore": {
			"$avg": "$statement.result.score.scaled"
		},
		"AverageTime": {
			"$avg": "$statement.result.score.max"
		}
	}

	var data = [{
			"$match": Target
		},
		{
			"$sort": {
				"statement.timestamp": -1
			}
		},
		{
			"$limit": parseInt(n)
		},
		{
			"$group": GroupIng
		}
	];
	settings.data = JSON.stringify(data);
	$.ajax(settings).done(function (response) {
		if (response.length == 0) {
			return
		}
		$("#email" + i.toString()).html(response[0]._id);
		html = "";
		if (response[0].AverageScore < 0.999) {
			html = html = "<a href='" + link + "' targt='Test'>" + response[0].AverageScore.toFixed(2) + "</a>";
		} else {
			html = response[0].AverageScore.toFixed(2);
		}
		$("#test" + j.toString() + i.toString()).html(html);
		console.log(Test, response[0]._id, response[0].AverageScore);
	});

}

function GetScore(email) {
	var html = "";
	html = html + "<table align='center' id='TheScoreTable'>"
	html = html + "<tr>";
	var j;
	for (j = 0; j < TestList.length; j++) {
		html = html + "<th>" + TestList[j][0] + "</th>";
	}
	html = html + "</tr>";
	html = html + "<tr>";
	for (j = 0; j < TestList.length; j++) {
		html = html + "<td><span id='TheTest" + j.toString() + "'></span></td>";
	}
	html = html + "</tr>";
	html = html + "</table>";
	html = html + "<ul>";
	html = html + "<span id='additionalNotes'></span>";
	html = html + "</ul>";
	$("#TheYourScore").html(html);
	for (j = 0; j < TestList.length; j++) {
		getTest(email, TestList[j][1], TestList[j][2], "TheTest" + j.toString(), TestList[j][3], TestList[j][0]);
	}
}

function getTest(email, testID, n, target, link, Title) {
	var settings = TheLRStheSetting;
	var Target = {};
	Target = {
		"statement.actor.mbox": "mailto:" + email,
		"statement.verb.id": "https://www.autotutor.org/ITSProfile/Answer",
		"statement.object.id": testID
	}
	var GroupIng = {};
	GroupIng = {
		"_id": "$statement.actor.mbox",
		"Sum": {
			"$sum": 1
		},
		"AverageConfidence": {
			"$avg": "$statement.result.score.raw"
		},
		"AverageScore": {
			"$avg": "$statement.result.score.scaled"
		},
		"AverageTime": {
			"$avg": "$statement.result.score.max"
		}
	}

	var data = [{
			"$match": Target
		},
		{
			"$sort": {
				"statement.timestamp": -1
			}
		},
		{
			"$limit": parseInt(n)
		},
		{
			"$group": GroupIng
		}
	];
	settings.data = JSON.stringify(data);
	$.ajax(settings).done(function (response) {
		html = "";
		if (response.length == 0) {
			$("#" + target).html("0");
			return;
		}
		var difference = parseInt(n) - response[0].Sum;
		if (response[0].AverageScore < 0.999) {
			if (difference == 0) {
				html = html = "<a href='" + link + "' target='Test'>" + response[0].AverageScore.toFixed(2) + "*</a>";
				var varNotes = $("#additionalNotes").html();
				$("#additionalNotes").html(varNotes + " <li>*You can improve your score for <span class='numbers'>" + Title + " </span><br/>");

			} else {
				html = html = "<a href='" + link + "' target='Test'>" + response[0].AverageScore.toFixed(2) + "**</a>";
				var varNotes = $("#additionalNotes").html();
				$("#additionalNotes").html(varNotes + " <li>**You need to answer additional <span class='numbers'>" + difference.toString() + " </span> problems for <span class='numbers'>" + Title + " </span><br/>");
			}
		} else {
			if (difference == 0) {
				html = response[0].AverageScore.toFixed(2);
			} else {
				html = html = "<a href='" + link + "' target='Test'>" + response[0].AverageScore.toFixed(2) + "**</a>";
				var varNotes = $("#additionalNotes").html();
				$("#additionalNotes").html(varNotes + " <li>**You need to answer additional <span class='numbers'>" + difference.toString() + " </span> problems for <span class='numbers'>" + Title + " </span><br/>");
			}
		}
		$("#" + target).html(html);
	});


}

function GetStudentRecord(student, CourseGUID, target,TimeField) {
	var setting = TheLRStheSetting;
	var QueryObj = [{
			"$match": {
				"statement.actor.mbox": student,
				"statement.object.mbox": "mailto:" + CourseGUID + "@csal.autotutor.org"
			}
		},

		{
			"$sort": {
				"statement.timestamp": -1
			}
		},
		{
			"$group": {
				"_id": "$statement.verb.id",
				"sum": {
					"$sum": 1
				},
				"LastTime": {
					"$max": "$statement.timestamp"
				},
				"FirstTime": {
					"$min": "$statement.timestamp"
				}
			}
		}
	]
	setting.data = JSON.stringify(QueryObj);
	$.ajax(setting).done(function (response) {
		if (response.length == 0) {
			var LinkObj = {
				"student": student,
				"guid": CourseGUID
			}
			var html = "<p align='right'>Not Assigned</p>";

			var TheAssigned=TheAssignmentStatus.filter((item)=>{
				return (item.Lesson.mbox.indexOf(CourseGUID)>-1);
			});
			if (TheAssigned.length>0){
				if (TheAssigned[0].result){
				    console.log(TheAssigned[0]);
					html = "<p align='right'>Assigned</p>";
				}
			}

            console.log(target, CourseGUID)
			$("#A" + target).html(html);
			return;
		} else {
			var last;
			var first;
			var buttonface = "Continue";
			var successTime;
			var failTime;
			for (var i = 0; i < response.length; i++) {
				var theverb = response[i]._id;
				//				console.log(theverb);
				if (theverb.indexOf("start") >= 1) {
					first = response[i].FirstTime;
					last = response[i].LastTime;
				}
				if (theverb.indexOf("action") >= 1) {
					last = response[i].LastTime;
				}
				if (theverb.indexOf("completed") >= 1) {
					successTime = new Date(response[i].LastTime);
				}
				if (theverb.indexOf("failed") >= 1) {
					failTime = new Date(response[i].LastTime);
				}
			}
			if ((successTime != null) && (failTime != null)) {
				if (successTime > failTime) {
					buttonface = "Well done, enjoy it again?";
				} else {
					buttonface = "You did not do well. Try it again.";
				}
			} else if (successTime != null) {
				buttonface = "Well done!";
			} else if (failTime != null) {
				buttonface = "Try it again.";
			}
			var html = "";
			html = html + "Last time on this lesson: <span class='numbers'>" + ReturnDate(last) + "</span>";
			
			$("#" + target).html("Last time on this lesson");
			
			$("#" + TimeField).html( ReturnDate(last));
			var LinkObj = {
				"student": student,
				"guid": CourseGUID
			}
			var Link = "<p align='right'><button class='btn1' onclick='GetLessonPopup(\"" + encodeURI(JSON.stringify(LinkObj)) + "\")'>" + buttonface + "</button></p>";
			//	$("#A"+target).html(Link)
		}
	});
}

function GetLessonPopup(LinkObj) {
	var TheObj = JSON.parse(decodeURI(LinkObj));
	var setting = TheLRStheSetting;
	var Match = {
		"statement.actor.mbox": TheObj.student,
		"statement.object.mbox": "mailto:" + TheObj.guid + "@csal.autotutor.org",
		"statement.verb.id": "https://app.skoonline.org/ITSProfile/start"
	};
	var sort = {
		"statement.timestamp": -1
	};
	var limit = 1;
	var project1 = {
		"ResultExt": "$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/LMS"
	};
	var project2 = {
		"url": "$ResultExt.url"
	}

	var QueryObj = [{
			"$match": Match
		}, {
			"$sort": sort
		}, {
			"$limit": limit
		},
		{
			"$project": project1
		},
		{
			"$project": project2
		}
	];
	setting.data = JSON.stringify(QueryObj);
	$.ajax(setting).done(function (response) {
		if (response.length == 0) {
			return;
		} else {
			var theURL = response[0].url;
			if (theURL != null) {
				window.open(theURL, "player")
			}
		}
	});
}


function GetRealScore(student, CourseGUID, target) {
	var setting = TheLRStheSetting;
	var QueryObj = [{
			"$match": {
				"statement.actor.mbox": student,
				"statement.object.mbox": "mailto:" + CourseGUID + "@csal.autotutor.org",
				"statement.verb.id": "https://app.skoonline.org/ITSProfile/action"
			}
		},
		{
			"$sort": {
				"statement.timestamp": -1
			}
		},
		{
			"$project": {
				"thetime": "$statement.timestamp",
				"Result": "$statement.result",
				"ResultExt": "$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"
			}
		},
		{
			"$project": {
				"time": "$thetime",
				"Success": "$Result.success",
				"QuestLevelExt": "$ResultExt.questionLevel",
				"TheLink": "$ResultExt.OtherInfor.url"
			}
		}
	]
	setting.data = JSON.stringify(QueryObj);
	$.ajax(setting).done(function (response) {
		if (response.length == 0) {
			$("#" + target).html("")
			return;
		} else {
			var theModuleLink = response[0].TheLink;
			console.log(theModuleLink);
			var Levels = [];
			// get The question levels
			for (var i = 0; i < response.length; i++) {
				if (response[i].QuestLevelExt == null) {
					response[i].QuestLevelExt = "Other"
				}
				if (response[i].QuestLevelExt == "") {
					response[i].QuestLevelExt = "Not Rated"
				}
				if (response[i].QuestLevelExt != null) {
					if (Levels.includes(response[i].QuestLevelExt)) {} else {
						Levels.push(response[i].QuestLevelExt)
					}
				}
			}
			// Get the performace Obj
			var PerformaceObj = {};
			var PerfomaceScore = {
				"correct": 0,
				"incorrect": 0
			};
			for (var i = 0; i < Levels.length; i++) {
				var PerfomaceScore = {
					"correct": 0,
					"incorrect": 0
				};
				PerformaceObj[Levels[i]] = PerfomaceScore;
			}
			for (var i = 0; i < response.length; i++) {
				if (response[i].QuestLevelExt != null) {
					if (response[i].Success) {
						PerformaceObj[response[i].QuestLevelExt].correct = PerformaceObj[response[i].QuestLevelExt].correct + 1;
					} else {
						PerformaceObj[response[i].QuestLevelExt].incorrect = PerformaceObj[response[i].QuestLevelExt].incorrect + 1;
					}
				}
			}
			var html = "<ul>";
			html = html + "<li>Last time on this lesson: <span class='numbers'>" + ReturnDate(response[0].time) + "</span>";
			html = html + "<li>First time on this lesson : <span class='numbers'>" + ReturnDate(response[response.length - 1].time) + "</span>";
			//			html="<li>The time of your recent access to this lesson: "+ReturnDate(response[0].time);
			//			html=html+"<li>The first time you started this lesson : "+ReturnDate(response[response.length-1].time);
			//			html=html+"<li>How did you answer questions in this lesson?<ul>";
			//			for (i=0;i<Levels.length;i++){
			//				html=html+"<li>"+Levels[i]+" question: "+JSON.stringify(PerformaceObj[Levels[i]])+"</li>"
			//			}
			//			html=html+"</ul>";
			html = html + "</ul>";
			if (theModuleLink != null) {
				html = html + "<a href='" + theModuleLink + "' target='Player'>Continue The Lesson</a>";
			}
			$("#" + target).html(html)
			console.log(PerformaceObj);
		}
	});
}


function LessonStudentDetailsNew(TheLessonID, TheLessonandStudent, Target) {


	var setting = TheLRStheSetting;
	var thePassedObj = JSON.parse(decodeURI(TheLessonandStudent))
	var LessonName = thePassedObj.Lesson.ALessonTitle;
	var LessonID = thePassedObj.Lesson.GUID;
	var Name = thePassedObj.Name;
	var TheStudent = thePassedObj.Student;
	var Name = thePassedObj.Name.split(" ")[0];
	var QueryObj = [{
			"$match": {
				"statement.object.mbox": "mailto:" + LessonID + "@csal.autotutor.org",
				"statement.actor.mbox": TheStudent,
				"statement.verb.id": "https://app.skoonline.org/ITSProfile/action"
			}
		},
		{
			"$sort": {
				"statement.timestamp": -1
			}
		},
		{
			"$project": {
				"thetime": "$statement.timestamp",
				"Result": "$statement.result",
				"ResultExt": "$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"
			}
		},
		{
			"$project": {
				"time": "$thetime",
				"Success": "$Result.success",
				"QuestLevelExt": "$ResultExt.questionLevel"
			}
		}
	]
	setting.data = JSON.stringify(QueryObj);
	$.ajax(setting).done(function (response) {
		if (response.length == 0) {
			$("#" + Target).html("")
			return;
		} else {
			var Levels = [];
			// get The question levels
			for (var i = 0; i < response.length; i++) {
				if (response[i].QuestLevelExt == null) {
					response[i].QuestLevelExt = "Other"
				}
				if (response[i].QuestLevelExt == "") {
					response[i].QuestLevelExt = "Not Rated"
				}
				if (response[i].QuestLevelExt != null) {
					if (Levels.includes(response[i].QuestLevelExt)) {} else {
						Levels.push(response[i].QuestLevelExt)
					}
				}
			}
			// Get the performace Obj
			var PerformaceObj = {};
			var PerfomaceScore = {
				"correct": 0,
				"incorrect": 0
			};
			for (var i = 0; i < Levels.length; i++) {
				var PerfomaceScore = {
					"correct": 0,
					"incorrect": 0
				};
				PerformaceObj[Levels[i]] = PerfomaceScore;
			}
			for (var i = 0; i < response.length; i++) {
				if (response[i].QuestLevelExt != null) {
					if (response[i].Success) {
						PerformaceObj[response[i].QuestLevelExt].correct = PerformaceObj[response[i].QuestLevelExt].correct + 1;
					} else {
						PerformaceObj[response[i].QuestLevelExt].incorrect = PerformaceObj[response[i].QuestLevelExt].incorrect + 1;
					}
				}
			}
			var html = "<ul>";
			html = "<li>" + Name + " accessed this lesson between: " + ReturnDate(response[response.length - 1].time) + " and " + ReturnDate(response[0].time);
			html = html + "<li>Questions in this lesson answered by " + Name + ":<ul>";
			for (i = 0; i < Levels.length; i++) {
				var totalNumber = (PerformaceObj[Levels[i]].correct + PerformaceObj[Levels[i]].incorrect);
				var htmlStr = PerformaceObj[Levels[i]].correct + " out of " + totalNumber + " correct.";
				html = html + "<li>" + Levels[i] + " question: " + htmlStr + "</li>";
				//	html=html+"<li>"+Levels[i]+" question: "+JSON.stringify(PerformaceObj[Levels[i]])+"</li>"
			}
			html = html + "</ul>";
			html = html + "</ul>";
			$("#" + Target).html(html)
			console.log(PerformaceObj);
		}
	});
}

function LessonDetailsNew(TheLessonID, Target) {
	var setting = TheLRStheSetting;
	var QueryObj = [{
			"$match": {
				"statement.object.mbox": "mailto:" + TheLessonID + "@csal.autotutor.org",
				"statement.verb.id": "https://app.skoonline.org/ITSProfile/action"
			}
		},
		{
			"$sort": {
				"statement.timestamp": -1
			}
		},
		{
			"$project": {
				"thetime": "$statement.timestamp",
				"Result": "$statement.result",
				"ResultExt": "$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"
			}
		},
		{
			"$project": {
				"time": "$thetime",
				"Success": "$Result.success",
				"QuestLevelExt": "$ResultExt.questionLevel"
			}
		}
	]
	setting.data = JSON.stringify(QueryObj);
	$.ajax(setting).done(function (response) {
		if (response.length == 0) {
			$("#" + Target).html("")
			return;
		} else {
			var Levels = [];
			// get The question levels
			for (var i = 0; i < response.length; i++) {
				if (response[i].QuestLevelExt == null) {
					response[i].QuestLevelExt = "Other"
				}
				if (response[i].QuestLevelExt == "") {
					response[i].QuestLevelExt = "Not Rated"
				}
				if (response[i].QuestLevelExt != null) {
					if (Levels.includes(response[i].QuestLevelExt)) {} else {
						Levels.push(response[i].QuestLevelExt)
					}
				}
			}
			// Get the performace Obj
			var PerformaceObj = {};
			var PerfomaceScore = {
				"correct": 0,
				"incorrect": 0
			};
			for (var i = 0; i < Levels.length; i++) {
				var PerfomaceScore = {
					"correct": 0,
					"incorrect": 0
				};
				PerformaceObj[Levels[i]] = PerfomaceScore;
			}
			for (var i = 0; i < response.length; i++) {
				if (response[i].QuestLevelExt != null) {
					if (response[i].Success) {
						PerformaceObj[response[i].QuestLevelExt].correct = PerformaceObj[response[i].QuestLevelExt].correct + 1;
					} else {
						PerformaceObj[response[i].QuestLevelExt].incorrect = PerformaceObj[response[i].QuestLevelExt].incorrect + 1;
					}
				}
			}
			var html = "<ul>";
			html = "<li>The lesson was accessed between: " + ReturnDate(response[response.length - 1].time) + " and " + ReturnDate(response[0].time);
			html = html + "<li>Questions answered by students:<ul>";
			for (i = 0; i < Levels.length; i++) {
				html = html + "<li>" + Levels[i] + " question: " + JSON.stringify(PerformaceObj[Levels[i]]) + "</li>"
			}
			html = html + "</ul>";
			html = html + "</ul>";
			$("#" + Target).html(html)
			console.log(PerformaceObj);
		}
	});
}

function StudentDetailsNew(student, target) {
	var TheStudent = student.split("_&_");
	var setting = TheLRStheSetting;
	var QueryObj = [{
			"$match": {
				"statement.actor.mbox": student,
				"statement.verb.id": "https://app.skoonline.org/ITSProfile/action"
			}
		},
		{
			"$sort": {
				"statement.timestamp": -1
			}
		},
		{
			"$project": {
				"thetime": "$statement.timestamp",
				"Result": "$statement.result",
				"ResultExt": "$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"
			}
		},
		{
			"$project": {
				"time": "$thetime",
				"Success": "$Result.success",
				"QuestLevelExt": "$ResultExt.questionLevel"
			}
		}
	]
	setting.data = JSON.stringify(QueryObj);
	$.ajax(setting).done(function (response) {
		if (response.length == 0) {
			$("#" + target).html("")
			return;
		} else {
			var Levels = [];
			// get The question levels
			for (var i = 0; i < response.length; i++) {
				if (response[i].QuestLevelExt == null) {
					response[i].QuestLevelExt = "Other"
				}
				if (response[i].QuestLevelExt == "") {
					response[i].QuestLevelExt = "Not Rated"
				}
				if (response[i].QuestLevelExt != null) {
					if (Levels.includes(response[i].QuestLevelExt)) {} else {
						Levels.push(response[i].QuestLevelExt)
					}
				}
			}
			// Get the performace Obj
			var PerformaceObj = {};
			var PerfomaceScore = {
				"correct": 0,
				"incorrect": 0
			};
			for (var i = 0; i < Levels.length; i++) {
				var PerfomaceScore = {
					"correct": 0,
					"incorrect": 0
				};
				PerformaceObj[Levels[i]] = PerfomaceScore;
			}
			for (var i = 0; i < response.length; i++) {
				if (response[i].QuestLevelExt != null) {
					if (response[i].Success) {
						PerformaceObj[response[i].QuestLevelExt].correct = PerformaceObj[response[i].QuestLevelExt].correct + 1;
					} else {
						PerformaceObj[response[i].QuestLevelExt].incorrect = PerformaceObj[response[i].QuestLevelExt].incorrect + 1;
					}
				}
			}
			var html = "<ul>";
			html = "<li>The time of your recent access to this lesson: " + ReturnDate(response[0].time);
			html = html + "<li>The first time you started this lesson : " + ReturnDate(response[response.length - 1].time);
			html = html + "<li>How did you answer questions in this lesson?<ul>";
			for (i = 0; i < Levels.length; i++) {
				html = html + "<li>" + Levels[i] + " question: " + JSON.stringify(PerformaceObj[Levels[i]]) + "</li>"
			}
			html = html + "</ul>";
			html = html + "</ul>";
			$("#" + target).html(html)
			console.log(PerformaceObj);
		}
	});

}


var ExistingStudents = [];
var MaximumNumberStudent = 999;

function CreateExistingStudents() {
	for (var i = 0; i < MaximumNumberStudent; i++) {
		var StudentMbox = "mailto:student" + (1000 + i).toString() + "@csal.autotutor.org";
		var StudentLogin = "student" + (1000 + i).toString();
		var StudentPassword = "Student#" + (1000 + i).toString();
		StudentObj = {
			"mbx": StudentMbox,
			"login": StudentLogin,
			"password": StudentPassword
		}
		ExistingStudents.push(JSON.stringify(StudentObj));
	}
}

function GetAllStudents() {
	CreateExistingStudents();
	var setting = TheLRStheSetting;
	var QueryObj = [{
			"$match": {
				"statement.verb.id": "http://id.tincanapi.com/verb/viewed"
			}
		},
		{
			"$group": {
				"_id": "$statement.actor.mbox",
				"sum": {
					"$sum": 1
				}
			}
		}
	]
	setting.data = JSON.stringify(QueryObj);
	$.ajax(setting).done(function (response) {
		if (response.length == 0) {
			return;
		} else {
			console.log(ExistingStudents.length)
			for (var i = 1; i < response.length; i++) {
				for (var j = MaximumNumberStudent - 1; j > 0; j--) {
					console.log(ExistingStudents[j], response[i]._id);
					if (ExistingStudents[j].indexOf(response[i]._id) > -1) {
						ExistingStudents.splice(j, 1);
					}
				}
			}
			var randomIndex = Math.floor(Math.random() * ExistingStudents.length);
			var UserObj = JSON.parse(ExistingStudents[randomIndex]);
			var html = "login <b>" + UserObj.login + "</b> password: <b>" + UserObj.password + "</b>"
			$("#AvaiableLogin").html(html);
			console.log(ExistingStudents.length)
		}
	});
}

$(document).ready(function () {
	GL = "0";
	$("#popupWin").hide();
	GetMsg(qs("sid", ""))
	getAssignmentStatus(qs("sid", ""));
//	GetGoogleSheetData(LessonInforPointer, "GetLessons", "7");
});

var ListOfMSG = [];

function GetMsg(email) {
	if (email == "") return;
	TheEmail = decodeURIComponent(email)

	var setting = TheLRStheSetting;
	var QueryObj = [{
			"$match": {
				"statement.object.mbox": "mailto:" + TheEmail,
				"statement.verb.id": "https://app.skoonline.org/ITSProfile/PostMsg"
			}
		},

		{
			"$project": {
				"msg": "$statement.result.response",
				"lesson": "$statement.actor",
				"learner": "$statement.object"
			}
		}
	]
	setting.data = JSON.stringify(QueryObj);
	$.ajax(setting).done(function (response) {
		if (response.length == 0) {
			return;
		} else {
			for (var i = 1; i < response.length; i++) {
				console.log(response[i]);
				ListOfMSG.push(response[i]);
			}
		}
	});
}


var TheAssignmentStatus = [];

function sortGroupingTime(a, b) {
	if (a.lastTime > b.lastTime) {
		return -1;
	}
	if (a.lastTime < b.lastTime) {
		return 1;
	}
	return 0;
}

function getAssignmentStatus(email) {

	if (email == "") return;
	TheEmail = decodeURIComponent(email)

	var settings = TheLRStheSetting;
	var data = [{
			"$match": {
				"statement.object.mbox": "mailto:" + TheEmail,
				"statement.verb.id": "https://app.skoonline.org/ITSProfile/AssignLesson"
			}
		},
		{
			"$group": {
				"_id": "$statement.result",
				"count": {
					"$sum": 1
				},
				"lastTime": {
					"$max": "$statement.timestamp"
				}
			}
		}
	]
	settings.data = JSON.stringify(data);
	$.ajax(settings).done(function (response) {
		if (response.length == 0) {
			//  console.log(CellID,"false")
			GetGoogleSheetData(LessonInforPointer, "GetLessons", "7");
		} else {
			response.sort(sortGroupingTime);
			for (var i = 0; i < response.length; i++) {
				if (response[i]._id.response != null) {
					var TheAssignemt = JSON.parse(response[i]._id.response);
					var theAssunmentObj = {
						result: response[i]._id.success,
						Lesson: TheAssignemt.actor,
						Learner: TheAssignemt.object,
						Time:response[i].lastTime
					}
					if (theAssunmentObj.Lesson != null) {
						TheAssignmentStatus.push(theAssunmentObj);
					}
				}
			}
			console.log(TheAssignmentStatus)
			GetGoogleSheetData(LessonInforPointer, "GetLessons", "7");
		}
	});
}