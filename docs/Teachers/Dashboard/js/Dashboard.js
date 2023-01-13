var ClassIDSpreadsheet = "2PACX-1vTq9p6YFnK5zyOKl6I72PSkt5hs3bCzJLq07TLle9SfQ4RzvU5ZxPvakH41Dzq5JDlBe-R4dtf-8XUq";
var studentDatainGS = "2PACX-1vQhXuVJqyd7MSnlkYYYeG1f5jovoubip6VnfrCKJ-QCpYkZV48pq0a6JchcL6BVm6nSmH14TfrGs9S8"
var Theclass;

var LearnerPrefix="student";

var TheUniqPointer = qs(
  "TheDashPointer",
  "https://xapilrs.x-in-y.com/integrations/embedableDashboards/"
);
var DashboardAgentLink = qs(
  "DashAgentLink",
  "07288904-ab64-4562-87ea-821880887e14"
);
var DashboardActivityLink = qs(
  "DashActivityLink",
  "52f9d198-442a-4d96-b33d-c83baae136d2"
);
var DashboardLRSLink = qs(
  "DashLRSLink",
  "2a82bdc3-10ff-4a9c-beb9-a6dad906a26f"
);



ADL.launch(function (err, launchdata, xAPIWrapper) {
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
    //  console.log("--- content statically configured ---\n", wrapper.lrs);
  }
}, true);


function DisplayStudentLog(StudentID, name) {
  var TheDate = Date.now();
  var last24hurs = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

  var DashConfig = {
    name: "agent",
    params: {
      agentId: {
        value: StudentID,
        display: name,
      },
    },
  };
  return (
    TheUniqPointer + DashboardAgentLink + "/#" + JSON.stringify(DashConfig)
  );
}

function DisplayStudentActivity(StudentID, name) {
  var TheDate = new Date();
  var last24hurs = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

  var DashConfig = {
    name: "activity",
    params: {
      activityId: {
        value: StudentID,
        display: name,
        range: {
          from: last24hurs,
          to: TheDate,
        },
      },
    },
  };
  return (
    TheUniqPointer + DashboardActivityLink + "/#" + JSON.stringify(DashConfig)
  );
}

function DisplayLRSLog() {
  return TheUniqPointer + DashboardLRSLink + "/";
}

function GetLessonInformation(LessonID) {
  var LessonIfo = {};
  for (var i = 0; i < TheLessionsInfo.length; i++) {
    if (LessonID.indexOf(TheLessionsInfo[i].GUID) > 0) {
      LessonIfo.total = parseInt(TheLessionsInfo[i].ETotalNumber);
      LessonIfo.passing = parseFloat(TheLessionsInfo[i].FCriteria);
      LessonIfo.lessonTitle = TheLessionsInfo[i].ALessonTitle;
      return LessonIfo;
    }
  }
}

function CreateLessonByStudentMatrix() {
  var settings = TheLRStheSetting;
  // create matrix
  var lessonID = 0;
  var studentID = 0;
  //  create matrix
  var match = {
    "statement.verb.id": "https://app.skoonline.org/ITSProfile/action",
    $or: [{
        "statement.result.score.raw": 1,
      },
      {
        "statement.result.score.raw": 0,
      },
    ],
  };
  if (qs("classID", "0000") != "Master") {
    var theStr = "^.*" + qs("classID", "0000") + ".*$";
    match = {
      "statement.verb.id": "https://app.skoonline.org/ITSProfile/action",
      "statement.object.name": {
        $parseRegex: {
          regex: theStr,
        },
      },
      $or: [{
          "statement.result.score.raw": 1,
        },
        {
          "statement.result.score.raw": 0,
        },
      ],
    };
  }
  var data = [{
      $match: match,
    },
    {
      $sort: {
        "statement.timestamp": -1,
      },
    },
    {
      $group: {
        _id: "$statement.result.response",
        sum: {
          $sum: 1,
        },
        Start: {
          $min: "$statement.timestamp",
        },
        End: {
          $max: "$statement.timestamp",
        },
        MaxScore: {
          $max: "$statement.result.score.raw",
        },
        MinScore: {
          $min: "$statement.result.score.raw",
        },
        Average: {
          $avg: "$statement.result.score.raw",
        },
      },
    },
  ];
  settings.data = JSON.stringify(data);
  $.ajax(settings).done(function (response) {
    if (response.length == 0) {
      return;
    } else {
      var TheRealResponse = [];
      for (var i = 0; i < response.length; i++) {
        var details = response[i]._id;
        if (details.indexOf("mailto:") != -1) {
          TheRealResponse.push(response[i]);
        }
      }
      var Lessons = [];
      var Learners = [];

      for (i = 0; i < TheRealResponse.length; i++) {
        var details = TheRealResponse[i]._id;
        var DetailObj = JSON.parse(details);
        var lessoninfor = {
          guid: DetailObj.lesson,
          title: DetailObj.lessonTitle,
        };
        var learnerinfo = {
          email: DetailObj.learner,
          name: DetailObj.learnerName,
        };

        if (Lessons.includes(JSON.stringify(lessoninfor))) {} else {
          Lessons.push(JSON.stringify(lessoninfor));
        }
        if (Learners.includes(JSON.stringify(learnerinfo))) {} else {
          Learners.push(JSON.stringify(learnerinfo));
        }
      }

      //     console.log(Lessons);


      //     console.log(TheLessionsInfo);
      Lessons = [];
      //     TheLessionsInfo.sort(SortLesson);
      for (var i = 0; i < TheLessionsInfo.length; i++) {
        var Leeson = {
          guid: "mailto:" + TheLessionsInfo[i].GUID + "@csal.autotutor.org",
          title: TheLessionsInfo[i].ALessonTitle,
          Section: TheLessionsInfo[i].Category,
          SectionOrder: TheLessionsInfo[i].Section
        };
        Lessons.push(JSON.stringify(Leeson));
      }



      //      console.log(Learners);
      //      console.log(Theclass);
      if (classID != "Master") {
        Learners = []
        for (var j = 0; j < Theclass.length; j++) {
          var LearnerObj = {
            email: "mailto:" + Theclass[j].email,
            name: Theclass[j].firstname + " " + Theclass[j].lastname
          };
          Learners.push(JSON.stringify(LearnerObj));
        }
        //      console.log(Learners);
      }
      // filterLearner
      var TheRealLearner = [];

      for (var j = 0; j < Learners.length; j++) {
        var LearnerEmail = JSON.parse(Learners[j]).email;
        if (LearnerEmail.indexOf(LearnerPrefix) > -1) {
          TheRealLearner.push(Learners[j]);
        }
      }

      Learners = TheRealLearner;
      // Add Lessons


      // Add Learners


      // create table
      var html = "<table align='center' class='ReportTable'>";
      html = html + "<tr><td colspan='3'><p align='center'><button class='btn' onclick='OpenHelpForReprt()'>Understand students' Report</button></p></td>";

      for (var j = 0; j < Learners.length; j++) {
        html =
          html +
          "<th width='30' align='center'>" +
          JSON.parse(Learners[j]).email.split(LearnerPrefix)[1].split("@")[0].split("").join("<br/>");
        //        JSON.parse(Learners[j]).name.split(" ")[0] +
        "</p></th>";
      }
      html = html + "</tr>";
      var TheCheckboxID = {}
      for (var i = 0; i < Lessons.length; i++) {
        html = html + "<tr>";

        var Therow = "";

        html = html + "<th nowrap>" + JSON.parse(Lessons[i]).SectionOrder + "</th>";
        html = html + "<th nowrap>" + JSON.parse(Lessons[i]).title + "</th>";


        for (var k = 0; k < TheRealResponse.length; k++) {
          var Thedetails = JSON.parse(TheRealResponse[k]._id);
          if (Therow == "") {
            if (Thedetails.lesson == JSON.parse(Lessons[i]).guid) {
              var LessonInfor = GetLessonInformation(Thedetails.lesson);
              Therow = LessonInfor.ALessonTitle;
            }
          } else {}
        }

        var the0CheckID = "cell_" + i.toString() + "_-1";

        TheCheckboxID = {
          Lesson: JSON.parse(Lessons[i]),
          Learner: null,
          LessonID: i,
          AllLessons: Lessons,
          AllLearners: Learners,
          LessonsCount: Lessons.length,
          LearnersCount: Learners.length,
        }
        TheCheckboxID.cellID = the0CheckID;
        var Check0boxIDStr = encodeURI(JSON.stringify(TheCheckboxID));

        var The0Check = "<input id='" + the0CheckID + "' type = 'checkbox' onchange='AssignLesson(\"" + Check0boxIDStr + "\")'> </input>";
        if (the0CheckID == "cell_0_-1") {
          html = html + "<th></th>";
        } else {
          html = html + "<th>" + The0Check + "</th>";
        }

        for (var j = 0; j < Learners.length; j++) {

          var theValue = "";
          TheCheckboxID = {
            Lesson: JSON.parse(Lessons[i]),
            Learner: JSON.parse(Learners[j]),
            AllLessons: Lessons,
            AllLearners: Learners,
            LearnerID: j,
            LessonsCount: Lessons.length,
            LearnersCount: Learners.length,
          }

          var AgentLink = DisplayStudentLog(
            JSON.parse(Learners[j]).email,
            JSON.parse(Learners[j]).name
          );
          var activityLink = DisplayStudentActivity(
            JSON.parse(Learners[j]).email,
            JSON.parse(Learners[j]).name
          );
          var Links =
            "<li><a href='" +
            AgentLink +
            "' target='alllogs'><button>Activity Log</button></a> </li>";

          var WithAnswer = false;
          for (var k = 0; k < TheRealResponse.length; k++) {
            var Thedetails = JSON.parse(TheRealResponse[k]._id);

            if (
              Thedetails.lesson == JSON.parse(Lessons[i]).guid &&
              Thedetails.learner == JSON.parse(Learners[j]).email
            ) {
              Thedetails.learnerName = JSON.parse(Learners[j]).name;
              Thedetails.LessonTitle = Therow;
              var LastPerformance =
                "<li><button onclick='GetLastperformance(\"" +
                encodeURI(JSON.stringify(Thedetails)) +
                "\")'>Last Performance</button></li>";
              //   console.log(LastPerformance)
              WithAnswer = true;
              var cellID;

              var performanceInfo = {
                Learner: Thedetails.learner,
                Lesson: JSON.parse(Lessons[i]).title,
                ThePerformance: TheRealResponse[k],
                LRSInfor: Thedetails
              }

              var EncodedStr = encodeURI(JSON.stringify(performanceInfo));
              cellID = EncodedStr;
              if (TheRealResponse[k].sum >= LessonInfor.total) {
                if (TheRealResponse[k].Average >= LessonInfor.passing) {
                  theValue = "<button onclick='togglebtn(\"" + cellID + "\");' class='btn' style='background-color: green' >&#10003;</button>";
                } else {
                  theValue = "<button onclick='togglebtn(\"" + cellID + "\");' class='btn' style='background-color: red' >&#10008;</button>";
                }
              } else {
                theValue = "<button onclick='togglebtn(\"" + cellID + "\");' class='btn' style='background-color: grey' >&#x27A4;</button>";
              }
            } else {}
          }
          if (WithAnswer) {
            html = html + "<td>" + theValue + "</td>";
            //           console.log(theValue)
          } else {
            var cellCheckBoxID = "cell_" + i.toString() + "_" + j.toString();
            TheCheckboxID.cellID = cellCheckBoxID;
            var CheckboxIDStr = encodeURI(JSON.stringify(TheCheckboxID));

            var TheEntry = TheAssignmentStatus.filter((item) => {
              return ((item.Lesson.mbox == TheCheckboxID.Lesson.guid) && (item.Learner.mbox == TheCheckboxID.Learner.email))
            })


            theValue = "<input id='" + cellCheckBoxID + "' type = 'checkbox' onchange='AssignLesson(\"" + CheckboxIDStr + "\")'> </input>";
            if (TheEntry.length > 0) {
              if (TheEntry[0].result) {
                theValue = "<input checked id='" + cellCheckBoxID + "' type = 'checkbox' onchange='AssignLesson(\"" + CheckboxIDStr + "\")'> </input>";
              }
            }
            if (i == 0) {
              html = html + "<th align='center'> " + theValue + "</th>";
            } else {
              html = html + "<td align='center'> " + theValue + "</td>";
            }
          }
          theValue = "";

        }

        html = html + "</tr>";
      }
    }
    html = html + "</table>";
    //   console.log(html);

    $("#WaitBtn").hide();
    $("#TheStatusOfStudents").html(html);
    // create table
  });
}

var TheAssignmentStatus = [];


function getAssignmentStatus() {
  var settings = TheLRStheSetting;
  var data = [{
      "$match": {
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
    } else {
      response.sort(sortGroupingTime)
      for (var i = 0; i < response.length; i++) {
        if (response[i]._id.response != null) {
          var TheAssignemt = JSON.parse(response[i]._id.response);
          var theAssunmentObj = {
            result: response[i]._id.success,
            Lesson: TheAssignemt.actor,
            Learner: TheAssignemt.object,
            Time: response[i].lastTime
          }
          if (theAssunmentObj.Lesson != null) {
            TheAssignmentStatus.push(theAssunmentObj);
          }
        }
      }
    }
    GetGoogleSheetData(LessonInforPointer, "GetLessonsInfo", "7");
    if (teacherID != "1" && classID != "1") {
      $("#studentsInfor").show();
      GetGoogleSheetData(studentDatainGS, "GetStudents", "1");
    }
  });
}

function sortGroupingTime(a, b) {
  if (a.lastTime > b.lastTime) {
    return -1;
  }
  if (a.lastTime < b.lastTime) {
    return 1;
  }
  return 0;
}

function getAssignmentStatusOld() {
  var settings = TheLRStheSetting;
  var data = [{
      "$match": {
        "statement.verb.id": "https://app.skoonline.org/ITSProfile/AssignLesson"
      }
    },
    {
      "$sort": {
        "statement.timestamp": -1
      }
    },
    {
      "$project": {
        "result": "$statement.result.success",
        "Lesson": "$statement.actor",
        "Learner": "$statement.object"
      }
    }
  ]
  settings.data = JSON.stringify(data);
  $.ajax(settings).done(function (response) {
    if (response.length == 0) {
      //  console.log(CellID,"false")
    } else {
      for (var i = 0; i < response.length; i++) {
        TheAssignmentStatus.push(response[i]);
        console.log(response[i])
      }
    }
    GetGoogleSheetData(LessonInforPointer, "GetLessonsInfo", "7");
    if (teacherID != "1" && classID != "1") {
      $("#studentsInfor").show();
      GetGoogleSheetData(studentDatainGS, "GetStudents", "1");
    }
  });
}



function getAllAssignments(lesson, Student, CellID) {
  var settings = TheLRStheSetting;
  var data = [{
      "$match": {
        "statement.actor.mbox": lesson,
        "statement.verb.id": "https://app.skoonline.org/ITSProfile/AssignLesson",
        "statement.object.mbox": Student
      }
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
        "result": "$statement.result.success"
      }
    }
  ]
  settings.data = JSON.stringify(data);
  $.ajax(settings).done(function (response) {
    if (response.length == 0) {
      //  console.log(CellID,"false")
    } else {
      if (response[0].result) {
        console.log(CellID, response[0].result);
        $("#" + CellID).prop('checked', true);
      }
    }
  });

}

function AssignLesson(PerformanceInfo) {

  var ThePerformanceInfo = JSON.parse(decodeURI(PerformanceInfo));
  var TempPerformanceInfo = ThePerformanceInfo;
  if (ThePerformanceInfo.cellID == "cell_0_-1") {
    return;
  }
  var BoxChecked = $("#" + ThePerformanceInfo.cellID).prop('checked');


  $("#" + ThePerformanceInfo.cellID).attr("disabled", true);
  if (ThePerformanceInfo.Lesson.SectionOrder == "") {
    for (var i = 1; i < ThePerformanceInfo.LessonsCount; i++) {
      var CellID = "cell_" + i.toString() + "_" + ThePerformanceInfo.LearnerID.toString();
      TempPerformanceInfo.Lesson = JSON.parse(ThePerformanceInfo.AllLessons[i]);
      try {
        var isChecked = $("#" + CellID).prop('checked');
        if (isChecked != BoxChecked) {
          TempPerformanceInfo.CellID = CellID;
          AssignLesson(encodeURI(JSON.stringify(TempPerformanceInfo)));
          $("#" + CellID).prop('checked', BoxChecked);
          $("#" + CellID).attr("disabled", true);
        }
      } catch (error) {

      }
    }
    return;
  }

  if (ThePerformanceInfo.Learner == null) {
    for (var j = 0; j < ThePerformanceInfo.LearnersCount; j++) {
      var CellID = "cell_" + ThePerformanceInfo.LessonID.toString() + "_" + j.toString();
      try {
        var isChecked = $("#" + CellID).prop('checked');
        TempPerformanceInfo.Learner = JSON.parse(ThePerformanceInfo.AllLearners[j]);
        if (isChecked != BoxChecked) {
          TempPerformanceInfo.CellID = CellID;
          AssignLesson(encodeURI(JSON.stringify(TempPerformanceInfo)));
          $("#" + CellID).prop('checked', BoxChecked);
          $("#" + CellID).attr("disabled", true);
        }

      } catch (error) {

      }
    }
    return
  }
  var lessonID = ThePerformanceInfo.Lesson;
  var StudentID = ThePerformanceInfo.Learner;

  var Assigned = $("#" + ThePerformanceInfo.cellID).prop('checked');
  var ResponseUniqueStr = JSON.stringify({
    lesson: lessonID.guid,
    learner: StudentID.email,
    Assigned: Assigned
  });

  PostAssignment(lessonID, StudentID, Assigned, ResponseUniqueStr);

}

function SortLesson(a, b) {
  if (a.NewOrder < b.NewOrder) {
    return -1;
  }
  if (a.NewOrder > b.NewOrder) {
    return 1;
  }
  return 0;
}



function PostMsg(lesson, Student, Msg) {
  var actor = {
    mbox: lesson.guid,
    name: lesson.title
  };
  var verb = {
    id: "https://app.skoonline.org/ITSProfile/PostMsg",
    "display": {
      "en": "PostMsg"
    }
  }
  var object = {
    objectType: "Agent",
    mbox: Student.email,
    name: Student.name
  };

  var result = {
    response: Msg
  };
  var parts = {
    actor: actor,
    verb: verb,
    object: object,
    result: result
  }
  ADL.XAPIWrapper.sendStatement(parts);
}

function PostAssignment(lesson, Student, Assigned, UniqueStr) {
  var actor = {
    mbox: lesson.guid,
    name: lesson.title
  };
  var verb = {
    id: "https://app.skoonline.org/ITSProfile/AssignLesson",
    "display": {
      "en": "AssignLesson"
    }
  }
  var object = {
    objectType: "Agent",
    mbox: Student.email,
    name: Student.name
  };

  var TheUniqueStr = JSON.stringify({
    actor: actor,
    object: object
  })
  var result = {
    success: Assigned,
    response: TheUniqueStr
  };
  var parts = {
    actor: actor,
    verb: verb,
    object: object,
    result: result
  }
  ADL.XAPIWrapper.sendStatement(parts);
}

function OpenHelpForReprt() {
  window.open("https://docs.google.com/presentation/d/e/2PACX-1vQmiAzgVmYO2jLiaDEmNwxUVHORUaaEhbrilujeY3iIlo0NZ92Cix4HSyOnD4iGtx5RUt-kFwPnYaiW/pub?start=false&loop=false&delayms=3000", "_new")
}

function GetLastperformance(LessonAndUser) {
  var LessonLearner = JSON.parse(decodeURI(LessonAndUser));
  console.log(LessonLearner)
  findLastSession(LessonLearner.lesson, LessonLearner.learner, 1, false, LessonLearner)
}


function DetailsS_L(Lesson_and_Student) {
  var thePassedObj = JSON.parse(decodeURI(Lesson_and_Student))
  var LessonName = thePassedObj.Lesson.ALessonTitle;
  var LessonID = thePassedObj.Lesson.GUID;
  var Name = thePassedObj.Name.split(" ")[0];

  var htmlbody = "Detailed Interaction of  " + Name + " with " + LessonName;
  htmlbody = htmlbody + "<div id='MoreDetails'>";
  htmlbody = htmlbody + "<ul>";
  htmlbody = htmlbody + "<li>First time " + Name + " start the lesson: <span class='numbers' id='FirstTimeLesson'></span></li>";
  htmlbody = htmlbody + "<li>Last time  " + Name + " was on the lessons: <span class='numbers' id='LastTimeLesson'></span></li>";
  htmlbody = htmlbody + "<li>Number Questions Answered: <span class='numbers' id='LSAnswerDetails'></span></li>";
  htmlbody = htmlbody + "</ul>";
  htmlbody = htmlbody + "</div>"
  htmlbody = "<span id='SLDetails'></span>"
  OpenPopUpDetails(LessonName + " and " + Name, "details ...", htmlbody, "popupWin");
  LessonStudentDetailsNew(LessonID, Lesson_and_Student, "SLDetails")
}



function LessonStudentDetailsNew(TheLessonID, TheLessonandStudent, Target) {

  var setting = TheLRStheSetting;
  var thePassedObj = JSON.parse(decodeURI(TheLessonandStudent))
  var LessonName = thePassedObj.Lesson.ALessonTitle;
  var LessonID = thePassedObj.Lesson.GUID;
  var Name = thePassedObj.Name;
  var TheStudent = thePassedObj.Student;
  var Name = thePassedObj.Name.split(" ")[0];
  if (LessonID.indexOf("mailto:") == -1) {
    LessonID = "mailto:" + LessonID + "@csal.autotutor.org";
  }
  var QueryObj = [{
      "$match": {
        "statement.object.mbox": LessonID,
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
        html = html + "<li>" + Levels[i] + " question: " + htmlStr + "</li>"
        //		html=html+"<li>"+Levels[i]+" question: "+JSON.stringify(PerformaceObj[Levels[i]])+"</li>"
      }
      html = html + "</ul>";
      html = html + "</ul>";
      $("#" + Target).html(html)
      console.log(PerformaceObj);
    }
  });
}

function togglebtn(PerformanceInfo) {
  //  console.log(JSON.parse(decodeURI(PerformanceInfo)));
  var ThePerformanceInfo = JSON.parse(decodeURI(PerformanceInfo));
  TheRealResponse = ThePerformanceInfo.ThePerformance;
  var TheObj = {
    Lesson: {
      ALessonTitle: ThePerformanceInfo.Lesson,
      GUID: ThePerformanceInfo.LRSInfor.lesson
    },
    Student: ThePerformanceInfo.Learner,
    Name: ThePerformanceInfo.LRSInfor.learnerName
  }

  var TheObjForMSG = {
    Lesson: {
      title: ThePerformanceInfo.Lesson,
      guid: ThePerformanceInfo.LRSInfor.lesson
    },
    Student: {
      email: ThePerformanceInfo.Learner,
      name: ThePerformanceInfo.LRSInfor.learnerName,
    }
  }
  var LessonPassVar = encodeURI(JSON.stringify(TheObj))
  var detailInformationLink = "<button class='btn' style='background-color: grey' onclick='DetailsS_L(\"" + LessonPassVar + "\")'>here</button>"
  var ThePopupInfor = "";
  var LeanerFirstName = ThePerformanceInfo.Learner.split(":")[1].split("@")[0];
  var header = "Learner: " + LeanerFirstName;

  var TheMessageID = LeanerFirstName + "_" + ThePerformanceInfo.LRSInfor.lesson.split("mailto:")[1].split("@")[0].split("-").join("_");
  TheObjForMSG.TheMessageID = TheMessageID;
  var TheObjStr = encodeURI(JSON.stringify(TheObjForMSG));

  var QuickMsgLink = "Quick message to <b>" + LeanerFirstName + "</b>";
  //  QuickMsgLink=QuickMsgLink+" (this lesson only <input id='Type_"+TheMessageID+"' type='checkbox'></input>)";
  QuickMsgLink = QuickMsgLink + " <button class='btn' style='background-color: grey' onclick='GetMessages(\"" + TheObjStr + "\")'>Previous Message</button>";
  QuickMsgLink = QuickMsgLink + "<br/> <input class='TheQuickMessage' id='" + TheMessageID + "'></input>";
  QuickMsgLink = QuickMsgLink + " <button class='btn' style='background-color: grey' id='btn_" + TheMessageID + "' onclick='SubmitMsg(\"" + TheObjStr + "\")'>Submit</button>";



  ThePopupInfor = ThePopupInfor + "<ul>";
  ThePopupInfor = ThePopupInfor + "<li>Performance Overview</li><ul>";
  ThePopupInfor = ThePopupInfor + "<li>Performance on the Most Recent Attempt: " + ReturnDate(TheRealResponse.End) + " </li>";
  ThePopupInfor = ThePopupInfor + "<li>First  Access: " + ReturnDate(TheRealResponse.Start) + " </li>";
  ThePopupInfor = ThePopupInfor + "<li>Answered: " + TheRealResponse.sum + " Question(s)</li>";
  ThePopupInfor = ThePopupInfor + "<li>Maximum Score " + TheRealResponse.MaxScore.toFixed(2) + " </li>";
  ThePopupInfor = ThePopupInfor + "<li>Minimum Score " + TheRealResponse.MinScore.toFixed(2) + " </li>";
  ThePopupInfor = ThePopupInfor + "<li>Average Score " + TheRealResponse.Average.toFixed(2) + " </li>";
  ThePopupInfor = ThePopupInfor + "</ul>";
  ThePopupInfor = ThePopupInfor + "<li> Click " + detailInformationLink + " for more Details </li>";
//  ThePopupInfor = ThePopupInfor + "<li> " + QuickMsgLink + "</li>";
  ThePopupInfor = ThePopupInfor + "</ul>";
  console.log(ThePopupInfor);

  var bodytext = ThePopupInfor;

  var footer = "Lesson: " + ThePerformanceInfo.Lesson;
  var targetwin = "popupWin";
  OpenPopUpDetails(header, footer, bodytext, targetwin);

  // OpenPopUpReport(header, footer, bodytext, targetwin, data, Verb);
}

function GetMessages(PerformanceInfo) {
  var ThePerformanceInfo = JSON.parse(decodeURI(PerformanceInfo));
  console.log(ThePerformanceInfo);
}

function SubmitMsg(PerformanceInfo) {
  var ThePerformanceInfo = JSON.parse(decodeURI(PerformanceInfo));
  var msg=$("#" + ThePerformanceInfo.TheMessageID).val();
  if (msg.trim()==""){
    alert("What is the message?");
    return;
  }
  console.log(ThePerformanceInfo);
  var Lesson = ThePerformanceInfo.Lesson;
  var Student = ThePerformanceInfo.Student;
  var MSGObj = {
    msg: $("#" + ThePerformanceInfo.TheMessageID).val(),
    current: $("#Type_" + ThePerformanceInfo.TheMessageID).prop('checked')
  }

//  PostMsg(Lesson, Student, JSON.stringify(MSGObj));
  PostMsg(Lesson, Student, msg);
  $("#btn_" + ThePerformanceInfo.TheMessageID).attr("disabled", true);
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


function DashBoardCheckStudentStatus() {
  CreateLessonByStudentMatrix();
}

function GetLessonName(LessonList, guid) {
  for (var i = 0; i < LessonList.length; i++) {
    if (LessonList[i][2] == guid) {
      return LessonList[i][0] + ": " + LessonList[i][1];
    }
  }
  return "";
}

TheLessionsInfo = [];


function GetTheRow(jsonData) {
  var RowArray = [];
  for (x in jsonData) {
    RowArray.push(jsonData[x].replace(/(<([^>]+)>)/gi, ""))
  }
  return RowArray;

}


function GetLessonsInfo(json) {
  if (json != "") {
    TheLessionsInfo = json;
    TheLessionsInfo = TheLessionsInfo.filter((item) => {
      return item.GUID != "GUID";
    })
    DashBoardCheckStudentStatus();
    return;

    var TheJSONObj = json;
    var i;
    for (i = 1; i < TheJSONObj.length; i++) {
      var TheRowInfo = TheJSONObj[i];
      TheLessionsInfo.push(GetTheRow(TheRowInfo));
    }
    TheLessionsInfo = TheLessionsInfo.filter((item) => {
      return item.GUID != "GUID";
    })
    DashBoardCheckStudentStatus();
  }
}

TheLRStheSetting = {
  async: true,
  crossDomain: true,
  url: AggregateURLData,
  method: "POST",
  headers: {
    authorization: "Basic " + TheDataAuthory,
    "content-type": "application/json",
    "cache-control": "no-cache",
    "x-experience-api-version": "1.0.3",
    "postman-token": "f2acffd3-e37a-3578-cea0-995aa07124a8",
  },
  processData: false,
  data: {},
};

function findLastSession(LessonID, Learnermbox, N, findReport, LessonLearnObj) {
  var thesetting = TheLRStheSetting;
  var match = {
    "statement.actor.mbox": Learnermbox,
    "statement.object.mbox": LessonID,
    "statement.verb.id": "https://app.skoonline.org/ITSProfile/start",
  };
  var data = [{
      $match: match,
    },
    {
      $sort: {
        "statement.timestamp": -1
      }
    },
    {
      $project: {
        statementTime: "$statement.timestamp"
      }
    },
  ];
  thesetting.data = JSON.stringify(data);
  $.ajax(thesetting).done(function (response) {
    if (response.length == 0) {} else {
      getCurrentScore(
        LessonID,
        Learnermbox,
        response[0].statementTime,
        findReport,
        LessonLearnObj,
        response.length
      );
    }
  });
}

function getCurrentScore(LessonID, Learnermbox, startingTime, findReport, LessonLearnObj, total) {
  var thesetting = TheLRStheSetting;
  var match = {
    "statement.actor.mbox": Learnermbox,
    "statement.object.mbox": LessonID,
    "statement.verb.id": "https://app.skoonline.org/ITSProfile/action",
    "statement.timestamp": {
      $gt: {
        $parseDate: {
          date: startingTime
        }
      }
    },
  };
  var group = {
    _id: "$statement.result.response",
    sum: {
      $sum: 1,
    },
    Start: {
      $min: "$statement.timestamp",
    },
    End: {
      $max: "$statement.timestamp",
    },
    MaxScore: {
      $max: "$statement.result.score.raw",
    },
    MinScore: {
      $min: "$statement.result.score.raw",
    },
    Average: {
      $avg: "$statement.result.score.raw",
    },
  };
  var data = [{
      $match: match,
    },
    {
      $group: group,
    },
  ];
  thesetting.data = JSON.stringify(data);
  $.ajax(thesetting).done(function (response) {
    if (response.length == 0) {

      var header, footer, bodytext, targetwin, data, Verb;

      var msg = "<b>LAST RECORD RETRIEVED: </b><ul>"
      if (total > 1) {
        msg = msg + "<li>Started " + total + " times.</li>";
      } else {
        msg = msg + "<li>Started " + total + " time.</li>";
      }
      msg = msg + "<li>most recent attempt:</li><ul>";
      msg = msg + "<li>Started at: " + ReturnDate(startingTime) + "</li>";
      msg = msg + "<li>Did not respond to any questions</li>";
      msg = msg + "</ul>";
      msg = msg + "</ul>";
      header = "Learner: " + LessonLearnObj.learner.split(":")[1].split("@")[0];
      footer = "Lesson: " + LessonLearnObj.LessonTitle;
      bodytext = msg;
      targetwin = "popupWin";
      data = {};
      Verb = "";
      OpenPopUpReport(header, footer, bodytext, targetwin, data, Verb);
    } else {
      for (i = 0; i < TheLessionsInfo.length; i++) {
        if (response[0]._id.indexOf(TheLessionsInfo[i][1]) > -1) {
          if (findReport) {
            if (response[0].Average >= TheLessionsInfo[i][5]) {
              userPerformancePage(
                "pass",
                response[0].Average,
                0,
                response[0].sum,
                "Level"
              );
            } else {
              userPerformancePage(
                "Fail",
                response[0].Average,
                0,
                response[0].sum,
                "Level"
              );
            }
            return;
          } else {
            var header, footer, bodytext, targetwin, data, Verb;

            var msg = "<b>LAST RECORD RETRIEVED: </b><ul>";
            if (total > 1) {
              msg = msg + "<li>Started " + total + " times.</li>";
            } else {
              msg = msg + "<li>Started " + total + " time.</li>";
            }
            msg = msg + "<li>most recent attempt:</li><ul>";
            msg = msg + "<li>Total Number of questions answered: " + response[0].sum + "</li>";
            msg = msg + "<li>Average Score: " + response[0].Average.toFixed(2) + "</li>";
            msg = msg + "<li>Started at: " + ReturnDate(response[0].Start) + "</li>";
            msg = msg + "<li>Finished at: " + ReturnDate(response[0].End) + "</li>";
            msg = msg + "</ul>";
            msg = msg + "</ul>";
            header = "Learner: " + LessonLearnObj.learner.split(":")[1].split("@")[0];
            footer = "Lesson: " + LessonLearnObj.LessonTitle;
            bodytext = msg;
            targetwin = "popupWin";
            data = {};
            Verb = "";
            OpenPopUpReport(header, footer, bodytext, targetwin, data, Verb);
            //  alert(msg);
          }
        }
      }
    }
  });
}


function OpenPopUpReport(header, footer, bodytext, targetwin, data, Verb) {
  var html = "";
  html = html + '<div class="modal-dialog modal-dialog-centered">';

  html = html + '<div class="modal-content" id="PopupDialog">';
  html = html + '<div class="modal-header">';
  html = html + '<button id="Modalclosebtn" class="btn" style="float: right;">&times;</button>';
  html = html + '<h2>' + header + '</h2>';
  html = html + '</div>';
  html = html + '<div class="modal-body" id="bodytextReport">';
  html = html + bodytext;
  html = html + '</div>';
  html = html + '<div class="modal-footer">';
  html = html + '<h3>' + footer + '</h3>';
  html = html + '</div>';
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
  $("#Modalclosebtn").on("click", function () {
    $('#' + targetwin).hide();
    popup.innerHTML = "";
  });
  if (Verb != "") {
    xAPIPostPopup("Popup", Verb, data);
  }
  const iframe = document.createElement('TheIframe')
  iframe.onload = function () {
    try {
      console.log(iframe.src)
    } catch (e) {
      if (e.message.includes('cross-origin')) console.warn(e.message);
      else console.error(e.message);
    }
  }
}


function GetStudents(json) {
  var TheClassID = classID;
  if (classID.indexOf("CSALUSNW") == -1){
    TheClassID = classID.split("CSALUSNW").join("ARCCLASS");
  }

  Theclass = json.filter((item) => {
    return item.course1 == TheClassID
  });
  html = "";
  html = html + "<table width='60%' align='center' id='TheScoreTable'>";
  html = html + "<tr>";
  html = html + "<th >Login username</th>";
  html = html + "<th >login Password</th>";
  html = html + "</tr>";
  for (var i = 0; i < Theclass.length; i++) {
    html = html + "<tr>";
    html = html + "<td>";
    html = html + Theclass[i].username;
    html = html + "</td>";
    html = html + "<td>";
    html = html + Theclass[i].password;
    html = html + "</td>";
    html = html + "</tr>";
  }
  html = html + "</table>";
  $("#studentsInfor").html(html);
}