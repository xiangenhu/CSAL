		var TotalScoreArr = [];
		var lesson18score=0;
		var lesson18CountTotalAnswerTimes=0;
		function CountTotalScore(pagePath, userAnswer, TextLevel, userSelectedItem, questionID, pageStartTimestamp, talkingHeadSpeechEndTimestamp, userAnswerTimestamp, userAnswerSpendTime, progressBarValue) {
		    var lessonID = sessionStorage.getItem("LessonID");
		    var TotalScoreObj = {};
		    if (lessonID == "Lesson1" ||lessonID == "Lesson2" || lessonID == "Lesson6" || lessonID == "Lesson29" || lessonID == "Lesson7" || lessonID == "Lesson4" || lessonID == "Lesson25" || lessonID == "Lesson20" || lessonID == "Lesson22"|| lessonID == "Lesson24"|| lessonID == "Lesson34" || lessonID == "Lesson16" || lessonID == "Lesson31" || lessonID == "Lesson33" || lessonID == "Lesson12" || lessonID == "Lesson17" || lessonID == "Lesson30") {
		        var countAnswerTime = 1;
		        if (TotalScoreArr.length > 0) {

		            for (var i in TotalScoreArr) {
		                var path = TotalScoreArr[i].pagePath;

		                if (pagePath == path) {

		                    countAnswerTime++;

		                }

		            }

		            TotalScoreObj.lessonID = lessonID;
		            TotalScoreObj.pagePath = pagePath;
		            TotalScoreObj.userAnswer = userAnswer;
		            TotalScoreObj.TextLevel = TextLevel;
		            TotalScoreObj.AnswerTime = countAnswerTime;

		            TotalScoreObj.userSelectedItem = userSelectedItem;
		            TotalScoreObj.questionID = questionID;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.talkingHeadSpeechEndTimestamp = talkingHeadSpeechEndTimestamp;
		            TotalScoreObj.userAnswerTimestamp = userAnswerTimestamp;
		            TotalScoreObj.userAnswerSpendTime = userAnswerSpendTime;
		            TotalScoreArr.push(TotalScoreObj);


		        } else if (TotalScoreArr.length == 0) {
		            TotalScoreObj.lessonID = lessonID;
		            TotalScoreObj.pagePath = pagePath;
		            TotalScoreObj.userAnswer = userAnswer;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.AnswerTime = countAnswerTime;

		            TotalScoreObj.userSelectedItem = userSelectedItem;
		            TotalScoreObj.questionID = questionID;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.talkingHeadSpeechEndTimestamp = talkingHeadSpeechEndTimestamp;
		            TotalScoreObj.userAnswerTimestamp = userAnswerTimestamp;
		            TotalScoreObj.userAnswerSpendTime = userAnswerSpendTime;
		            TotalScoreArr.push(TotalScoreObj);

		        }

		    }  else if (lessonID == "Lesson18") {
		        var countAnswerTime = 1;
				lesson18CountTotalAnswerTimes++;
		        if (TotalScoreArr.length > 0) {

		            for (var i in TotalScoreArr) {
		                var path = TotalScoreArr[i].pagePath;

		                if (pagePath == path) {

		                    countAnswerTime++;

		                }

		            }

		            TotalScoreObj.lessonID = lessonID;
		            TotalScoreObj.pagePath = pagePath;
		            TotalScoreObj.userAnswer = userAnswer;
		            TotalScoreObj.TextLevel = TextLevel;
		            TotalScoreObj.AnswerTime = countAnswerTime;

		            TotalScoreObj.userSelectedItem = userSelectedItem;
		            TotalScoreObj.questionID = questionID;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.talkingHeadSpeechEndTimestamp = talkingHeadSpeechEndTimestamp;
		            TotalScoreObj.userAnswerTimestamp = userAnswerTimestamp;
		            TotalScoreObj.userAnswerSpendTime = userAnswerSpendTime;
					if(userAnswer=="Correct")
					{
						lesson18score=lesson18score+progressBarValue;
												
					}
					
		            TotalScoreArr.push(TotalScoreObj);


		        } else if (TotalScoreArr.length == 0) {
		            TotalScoreObj.lessonID = lessonID;
		            TotalScoreObj.pagePath = pagePath;
		            TotalScoreObj.userAnswer = userAnswer;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.AnswerTime = countAnswerTime;

		            TotalScoreObj.userSelectedItem = userSelectedItem;
		            TotalScoreObj.questionID = questionID;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.talkingHeadSpeechEndTimestamp = talkingHeadSpeechEndTimestamp;
		            TotalScoreObj.userAnswerTimestamp = userAnswerTimestamp;
		            TotalScoreObj.userAnswerSpendTime = userAnswerSpendTime;
					TotalScoreObj.score =lesson18score;
					if(userAnswer=="Correct")
					{
						lesson18score=lesson18score+progressBarValue;
												
					}
		            TotalScoreArr.push(TotalScoreObj);

		        }

		    } else if ( lessonID == "Lesson27" ) {
		        var countAnswerTime = 1;
		        if (TotalScoreArr.length > 0) {

		            for (var i in TotalScoreArr) {
		                 var getQuestionID = TotalScoreArr[i].questionID;

		                if (questionID == getQuestionID) {

		                    countAnswerTime++;

		                }

		            }

		            TotalScoreObj.lessonID = lessonID;
		            TotalScoreObj.pagePath = pagePath;
		            TotalScoreObj.userAnswer = userAnswer;
		            TotalScoreObj.TextLevel = TextLevel;
		            TotalScoreObj.AnswerTime = countAnswerTime;

		            TotalScoreObj.userSelectedItem = userSelectedItem;
		            TotalScoreObj.questionID = questionID;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.talkingHeadSpeechEndTimestamp = talkingHeadSpeechEndTimestamp;
		            TotalScoreObj.userAnswerTimestamp = userAnswerTimestamp;
		            TotalScoreObj.userAnswerSpendTime = userAnswerSpendTime;
		            TotalScoreArr.push(TotalScoreObj);


		        } else if (TotalScoreArr.length == 0) {
		            TotalScoreObj.lessonID = lessonID;
		            TotalScoreObj.pagePath = pagePath;
		            TotalScoreObj.userAnswer = userAnswer;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.AnswerTime = countAnswerTime;

		            TotalScoreObj.userSelectedItem = userSelectedItem;
		            TotalScoreObj.questionID = questionID;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.talkingHeadSpeechEndTimestamp = talkingHeadSpeechEndTimestamp;
		            TotalScoreObj.userAnswerTimestamp = userAnswerTimestamp;
		            TotalScoreObj.userAnswerSpendTime = userAnswerSpendTime;
		            TotalScoreArr.push(TotalScoreObj);

		        }

				setProgress(progressBarValue);

		    } else if (lessonID == "Lesson9") {
		        var countAnswerTime = 1;
		        if (TotalScoreArr.length > 0) {

		            for (var i in TotalScoreArr) {
		                var path = TotalScoreArr[i].pagePath;
		                var getQuestionID = TotalScoreArr[i].questionID;

		                if (pagePath == path && questionID == getQuestionID) {

		                    countAnswerTime++;

		                }

		            }

		            TotalScoreObj.lessonID = lessonID;
		            TotalScoreObj.pagePath = pagePath;
		            TotalScoreObj.userAnswer = userAnswer;
		            TotalScoreObj.TextLevel = TextLevel;
		            TotalScoreObj.AnswerTime = countAnswerTime;

		            TotalScoreObj.userSelectedItem = userSelectedItem;
		            TotalScoreObj.questionID = questionID;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.talkingHeadSpeechEndTimestamp = talkingHeadSpeechEndTimestamp;
		            TotalScoreObj.userAnswerTimestamp = userAnswerTimestamp;
		            TotalScoreObj.userAnswerSpendTime = userAnswerSpendTime;
		            TotalScoreArr.push(TotalScoreObj);


		        } else if (TotalScoreArr.length == 0) {
		            TotalScoreObj.lessonID = lessonID;
		            TotalScoreObj.pagePath = pagePath;
		            TotalScoreObj.userAnswer = userAnswer;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.AnswerTime = countAnswerTime;

		            TotalScoreObj.userSelectedItem = userSelectedItem;
		            TotalScoreObj.questionID = questionID;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.talkingHeadSpeechEndTimestamp = talkingHeadSpeechEndTimestamp;
		            TotalScoreObj.userAnswerTimestamp = userAnswerTimestamp;
		            TotalScoreObj.userAnswerSpendTime = userAnswerSpendTime;
		            TotalScoreArr.push(TotalScoreObj);

		        }
		        setProgress(progressBarValue);



		    } else if (lessonID == "Lesson10") {
		        var countAnswerTime = 1;
		        if (TotalScoreArr.length > 0) {

		            for (var i in TotalScoreArr) {
		                var path = TotalScoreArr[i].pagePath;
		                var getQuestionID = TotalScoreArr[i].questionID;

		                if (pagePath == path && questionID == getQuestionID) {

		                    countAnswerTime++;

		                }

		            }

		            TotalScoreObj.lessonID = lessonID;
		            TotalScoreObj.pagePath = pagePath;
		            TotalScoreObj.userAnswer = userAnswer;
		            TotalScoreObj.TextLevel = TextLevel;
		            TotalScoreObj.AnswerTime = countAnswerTime;

		            TotalScoreObj.userSelectedItem = userSelectedItem;
		            TotalScoreObj.questionID = questionID;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.talkingHeadSpeechEndTimestamp = talkingHeadSpeechEndTimestamp;
		            TotalScoreObj.userAnswerTimestamp = userAnswerTimestamp;
		            TotalScoreObj.userAnswerSpendTime = userAnswerSpendTime;
		            TotalScoreArr.push(TotalScoreObj);


		        } else if (TotalScoreArr.length == 0) {
		            TotalScoreObj.lessonID = lessonID;
		            TotalScoreObj.pagePath = pagePath;
		            TotalScoreObj.userAnswer = userAnswer;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.AnswerTime = countAnswerTime;

		            TotalScoreObj.userSelectedItem = userSelectedItem;
		            TotalScoreObj.questionID = questionID;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.talkingHeadSpeechEndTimestamp = talkingHeadSpeechEndTimestamp;
		            TotalScoreObj.userAnswerTimestamp = userAnswerTimestamp;
		            TotalScoreObj.userAnswerSpendTime = userAnswerSpendTime;
		            TotalScoreArr.push(TotalScoreObj);

		        }
		        setProgress(progressBarValue);



		    } else if (lessonID == "Lesson8") {

		        var n = userAnswer.search(/MCQuizC/i);
		        if (n != -1) {
		            userAnswer = "Correct";
		        } else {
		            userAnswer = "Incorrect";
		        }
		        if (TotalScoreArr.length > 0) {
		            var isHasThisPath = false;
		            for (var i in TotalScoreArr) {
		                var path = TotalScoreArr[i].pagePath;

		                if (pagePath == path) {

		                    isHasThisPath = true;

		                }

		            }
		            if (isHasThisPath == false) {
		                TotalScoreObj.lessonID = lessonID;
		                TotalScoreObj.pagePath = pagePath;
		                TotalScoreObj.userAnswer = userAnswer;
		                TotalScoreObj.TextLevel = TextLevel;
		                TotalScoreArr.push(TotalScoreObj);
		                TotalScoreObj.userSelectedItem = userSelectedItem;
		                TotalScoreObj.questionID = questionID;
		                TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		                TotalScoreObj.talkingHeadSpeechEndTimestamp = talkingHeadSpeechEndTimestamp;
		                TotalScoreObj.userAnswerTimestamp = userAnswerTimestamp;
		                TotalScoreObj.userAnswerSpendTime = userAnswerSpendTime;

		            }

		        } else if (TotalScoreArr.length == 0) {
		            TotalScoreObj.lessonID = lessonID;
		            TotalScoreObj.pagePath = pagePath;
		            TotalScoreObj.userAnswer = userAnswer;
		            TotalScoreObj.TextLevel = TextLevel;
		            TotalScoreObj.userSelectedItem = userSelectedItem;
		            TotalScoreObj.questionID = questionID;
		            TotalScoreObj.pageStartTimestamp = pageStartTimestamp;
		            TotalScoreObj.talkingHeadSpeechEndTimestamp = talkingHeadSpeechEndTimestamp;
		            TotalScoreObj.userAnswerTimestamp = userAnswerTimestamp;
		            TotalScoreObj.userAnswerSpendTime = userAnswerSpendTime;
		            TotalScoreArr.push(TotalScoreObj);

		        }
		        NewSetProgress(TotalScoreArr.length);


		    }

		}

		function showEndingPage() {
		    var lessonID = sessionStorage.getItem("LessonID");
		    //user can answer two times for a question
		    if (lessonID == "Lesson1") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {
		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }

		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (getBranch == "Easy" && Performance >= 0.747) {

		            userPerformancePage("pass");
		        } else if (getBranch == "Hard" && Performance >= 0.733) {
		            //pass
		            userPerformancePage("pass");
		        } else {
		            //no pass
		            userPerformancePage("Failed");

		        }

		    } else if (lessonID == "Lesson2") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {
		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }

		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (countCrrectNum > 18) {

		            userPerformancePage("pass");
		        } else {
		            //no pass
		            userPerformancePage("Failed");

		        }

		    }else if (lessonID == "Lesson4") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {
		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }

		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (countCrrectNum > 21) {

		            userPerformancePage("pass");
		        } else {
		            //no pass
		            userPerformancePage("Failed");

		        }

		    } else if (lessonID == "Lesson6") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {
		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }

		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (Performance >= 0.7) {

		            userPerformancePage("pass");
		        } else {
		            //no pass
		            userPerformancePage("Failed");

		        }

		    } else if (lessonID == "Lesson7") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {
		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }

		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (getBranch == "Hard") {
		            if (countCrrectNum >= 13) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }


		        } else {
		            if (countCrrectNum >= 13) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }


		        }


		    } else if (lessonID == "Lesson9") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {
		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }

		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (countCrrectNum >= 17) {

		            userPerformancePage("pass");
		        } else {
		            //no pass
		            userPerformancePage("Failed");

		        }

		    } else if (lessonID == "Lesson10") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {
		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }

		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (countCrrectNum > 13) {

		            userPerformancePage("pass");
		        } else {
		            //no pass
		            userPerformancePage("Failed");

		        }

		    } else if (lessonID == "Lesson18") {
		       
		        if (lesson18CountTotalAnswerTimes < 23 && lesson18score>=3000) {

		            userPerformancePage("pass");
		        } else {
		            //no pass
		            userPerformancePage("Failed");

		        }
				 lesson18score=0;
				 lesson18CountTotalAnswerTimes=0;

		    } else if (lessonID == "Lesson20") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {
		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }

		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (countCrrectNum > 14) {

		            userPerformancePage("pass");
		        } else {
		            //no pass
		            userPerformancePage("Failed");

		        }

		    } else if (lessonID == "Lesson22") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {

		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }
		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (getBranch == "Hard") {
		            if (countCrrectNum >= 8) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }


		        } else {
		            if (countCrrectNum >= 8) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }


		        }

		    } else if (lessonID == "Lesson24") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {

		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }
		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (getBranch == "Hard") { //medium to hard?
		            if (countCrrectNum >= 12) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }


		        } else { // medium to easy? 
		            if (countCrrectNum >= 15) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }


		        }

		     } else if (lessonID == "Lesson16") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {

		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }
		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (getBranch == "Hard") { //medium to hard?
		            if (countCrrectNum >= 8) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }


		        } else { // medium to easy? 
		            if (countCrrectNum >= 8) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }


		        }

		    }  else if (lessonID == "Lesson25") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {
		            if (TotalScoreArr[i].pagePath != "Lesson25-Main0-1.html" || TotalScoreArr[i].pagePath != "Lesson25-Main1-2.html" || TotalScoreArr[i].pagePath != "Lesson25-Main2-1.html") {
		                if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                    countCrrectNum++;
		                }
		                if (TotalScoreArr[i].AnswerTime == 1) {
		                    countFirstNum++;
		                }

		            }


		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (getBranch == "Hard") {
		            if (countCrrectNum >= 13) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }


		        } else {
		            if (countCrrectNum >= 14) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }


		        }

		    } else if (lessonID == "Lesson27") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {
		         if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }
		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        
		            if (countCrrectNum >= 4) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }

		    } else if (lessonID == "Lesson29") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {
		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }

		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (Performance >= 0.75) {

		            userPerformancePage("pass");
		        } else {
		            //no pass
		            userPerformancePage("Failed");

		        }

		    } else if (lessonID == "Lesson8") {
		        var countPerformance = 0;
		        for (var i in TotalScoreArr) {
		            if (TotalScoreArr[i].userAnswer == "Correct") {
		                countPerformance++;
		            }

		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countPerformance / TotalScoreArr.length;
		        console.log(Performance)
		        if (Performance >= 0.82) {

		            userPerformancePage("pass");
		        } else {
		            //no pass
		            userPerformancePage("Failed");

		        }

		    }
			else if (lessonID == "Lesson34") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {
		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }

		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (countCrrectNum > 8) {

		            userPerformancePage("pass");
		        } else {
		            //no pass
		            userPerformancePage("Failed");

		        }

		    } else if (lessonID == "Lesson31"){
				var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {

		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }
		        }
		         var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
				 if (countCrrectNum > 5) {

		            userPerformancePage("pass");
		        } else {
		            //no pass
		            userPerformancePage("Failed");

		        } 
			} else if (lessonID == "Lesson33"){
				var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {

		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }
		        }
		         var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
				console.log("Correct: " + countCrrectNum); 
				 if (countCrrectNum >= 4) {
		            userPerformancePage("pass");
		        } else {
		            //no pass
		            userPerformancePage("Failed");

		        } 
			} else if (lessonID == "Lesson12"){
				var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {

		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }
		        }
		         var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
				 if (countCrrectNum >= 9) {

		            userPerformancePage("pass");
		        } else {
		            //no pass
		            userPerformancePage("Failed");

		        } 
			} 
			else if (lessonID == "Lesson17") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {
		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }

		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (getBranch == "Hard") {
		            if (countCrrectNum >= 16) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }


		        } else {
		            if (countCrrectNum >= 12) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }


		        }


		    } 	else if (lessonID == "Lesson30") {
		        var countCrrectNum = 0;
		        var countFirstNum = 0;
		        for (var i in TotalScoreArr) {
		            if (TotalScoreArr[i].userAnswer == "Correct" && TotalScoreArr[i].AnswerTime == 1) {
		                countCrrectNum++;
		            }
		            if (TotalScoreArr[i].AnswerTime == 1) {
		                countFirstNum++;
		            }

		        }
		        var getBranch = TotalScoreArr[TotalScoreArr.length - 1].TextLevel;
		        var Performance = countCrrectNum / countFirstNum;
		        console.log(Performance)
		        if (getBranch == "Hard") {
		            if (countCrrectNum >= 14) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }


		        } else {
		            if (countCrrectNum >= 12) {

		                userPerformancePage("pass");
		            } else {
		                //no pass
		                userPerformancePage("Failed");

		            }


		        }


		    } 


		}

		function userPerformancePage(result) {
		    if (result == "pass") {
		        $("#mainFrame").attr("src", "resources/endingpage.html?userPerformance=Passed");

		    } else if (result == "Failed") {
		        $("#mainFrame").attr("src", "resources/endingpage.html?userPerformance=Failed");

		    }


		}

		function NewSetProgress(num) {
		    switch (num) {

		        case 1:
		            value = 10;
		            break;
		        case 2:
		            value = 20;
		            break;
		        case 3:
		            value = 30;
		            break;
		        case 4:
		            value = 40;
		            break;
		        case 5:
		            value = 50;
		            break;
		        case 6:
		            value = 60;
		            break;
		        case 7:
		            value = 70;
		            break;
		        case 8:
		            value = 85;
		            break;
		        case 9:
		            value = 99;
		            break;
		        case 10:
		            value = 100;
		            break;

		    }
		    setProgress(value);
		}