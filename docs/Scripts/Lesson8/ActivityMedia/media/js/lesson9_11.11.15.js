
// Instruction + Sentence + Answer A + Answer B + Image A + Image B + TAGoodAnswer + Underlined Word
//initialize optionVerbals
var OptionRandom=new Array();
var OptionVerbal=new Array();
var QArray=new Array();
var userScore=0;
var JordanScore=0;
var itemCount=0;
var retEvent="";
var qa2;
var qa3;
var qa7;
var qa0;
var level1=[["_user_, what does the word tie mean? Please click the correct meaning below.","Whenever my friends compete in a bicycle race, they always end in a tie.","an accessory worn around the neck","finishing a race at the same time","B","01-a.png","01-b.png","The correct meaning of tie in this sentence is finishing a race at the same time.", "tie"], ["_user_, what does the author mean by class? Click the correct meaning of class, please.","The teacher is always patient with her class.","stylish elegance","a body of students meeting to learn a subject","B","02-a.png","02-b.png","The appropriate meaning of class here means a body of students meeting to learn a subject.", "class"], ["_user_, which meaning of bank is correct in this sentence?","Ira goes to the bank to pay bills.","a place where money is held","the edge of a river or body of water","A","03-a.png","03-b.png","Ira goes to the place where he could use money to pay bills. So, the correct answer here is a place where money is held.", "bank"], ["_user_, what does left mean here?","Elvis turned right when he left the building.","the opposite of right","the act of departing or leaving","B","04-a.png","04-b.png","Elvis turned right when he departed the building. Thus, the appropriate meaning of left in this sentence is the act of departing or leaving.", "left"], ["_user_, what is this author's meaning of tracks in this sentence?","The lion tracks the zebra.","to follow or pursue a series of marks","parallel lines of rail for a train","A","05-a.png","05-b.png","The lion follows the zebra because it wants to eat the zebra. The correct meaning of track is to follow or pursue a series of marks.", "tracks"], ["_user_, what is the meaning of type here?","Because of his new job Harold learned to type quickly using his computer.","to write using a keyboard","a sort or kind","A","06-a.png","06-b.png","The correct answer of type is to write using a keyboard. Harold can write quickly when using a keyboard.", "type"], ["_user_,what does light mean in this sentence?","Please turn on the light; it is too dark in the room.","something that makes things visible","having little weight, easy to carry","A","07-a.png","07-b.png","The correct answer is something that makes things visible. The speaker needs something that makes things in the room visible", "light"], ["_user_, what is a check?","Yesterday I wrote a check for my new car.","paper indicating payment made","to inspect and examine","A","08-a.png","08-b.png","I wrote a check for my car means I wrote a piece of paper indicating payment was made for my car. The correct answer is paper indicating payment made.", "check"], ["_user_, what does missed mean in this sentence?","I went home very late yesterday, so I missed my favorite TV show.","to fail to do something","to feel the absence of something or someone","A","09-a.png","09-b.png","The correct answer is A, to fail to do something. In this sentence, I failed to watch my favorite TV show.", "missed"], ["_user_, what does the author mean by bear here?","I couldn't bear having to give up my dog for adoption.","to hold up under or be capable of","a large animal with coarse fur","A","10-a.png","10-b.png","The correct answer is to hold up or support.", "bear"]]

// Instruction + Sentence + Answer A + Answer B + Correct Answer + ImageA + ImageB + TAGoodAnswer + Underlined Word
var level2=[["_user_, what is the meaning of tongue?","What has a tongue but cannot talk? A shoe!","the flap under the lacing or buckles of a shoe","the movable organ on the floor of the mouth","A","11-a.png","11-b.png","The correct answer is the flap under the lacing or buckles of a shoe, because it tells us this tongue can't talk like the organ in our mouth. In fact, it is the tongue of our shoe.", "tongue"], ["_user_, what does point mean in this sentence?","What did the pen say to the pencil? So what is your point?","a sharp end","a particular point or spot","A","12-a.png","12-b.png","The pencil has a sharp end. So the correct answer is a sharp end", "point"], ["_user_, what is meant by ruler in this joke?","Which object is the king of the classroom? A Ruler.","a tool used for measuring","person that governs and controls","A","13-a.png","13-b.png","The correct answer is a tool used for measuring. In the classroom, ruler this object is often used in math class.", "Ruler"], ["_user_, what are fans?","Why are movie stars so cool? Because they have so many fans.","enthusiastic followers","an instrument for producing a current of air","A","14-a.png","14-b.png","Fans of movie starts means Enthusiastic followers. So the correct answer is enthusiastic followers", "fans"], ["_user_, what does this joke mean by bright?","Why did the teacher wear sunglasses. Her students were too bright.","radiating or reflecting light","smart","B","15-a.png","15-b.png","When do we wear sunglasses? When the sunlight is so strong. But in this joke, the joke says students are so bright or smart that the teacher must wear sunglasses in case their brightness is too strong. So the correct answer is smart.", "bright"], ["_user_, what does croak mean in this sentence?","A local laboratory has found a way to make frogs live longer by removing their vocal cords. The frogs can never croak.","to make a deep harsh sound","slang for die","A","16-a.png","16-b.png","The correct answer is to make a deep harsh sound.", "croak"], ["_user_, what does the author mean by trip?","Watch your step on the way out the door. Wouldn't want you to trip and break your nose.","to catch the foot against something, so as to stumble","a journey for some purpose","A","17-a.png","17-b.png","The correct answer is catch the foot against something, so as to stumble.", "trip"], ["_user_, what does crane mean here?","There were two tall men sitting in front of her, so she had to crane her neck to see.","to stretch toward an object of attention","a family of wading birds","A","18-a.png","18-b.png","The correct answer is to stretch toward an object of attention.", "crane"], ["_user_, what does engaged mean here?","When the teacher said that 80% of the test would be reviewed, all of the students became very engaged.","occupied the attention or efforts of a person","pledged to be married","A","19-a.png","19-b.png","The correct answer is occupied the attention or efforts of a person.", "engaged"], ["_user_, what does buffet mean in this sentence?","As 250 mph winds buffet the probe, its descent will then be slowed by a parachute.","to force, move, or attack by repeated blows","a meal set out on a table for ready access","A","20-a.png","20-b.png","The correct answer is to force, move, or attack by repeated blows.", "buffet"]]


var level3=[["_user_, in the following sentence, what does the underlined word of pale mean?","Carrying a heavy pail for hours, she started trembling and her face turned pale.","a  round container","light in color","B","21-a.png","21-b.png","_user_ and Jordan, the appropriate meaning of pale is light in color, Light in color is the meaning of p a l e", "pale"], ["_user_, could you please tell me what the underlined bored means?","Animal protection organizations published an announcement to blame hunters who bored on boars' skin.","a kind of male hog","to pierce with a tool","B","22-a.png","22-b.png","_user_ and Jordan, when we replace these two definitions in the sentence, that hunters used the tool to pierce on boars' skin makes sense. So the correct answer is to pierce with a turning or twisting movement of a tool.", "bored"], ["_user_, could you tell me what meaning of the underlined canons is?","In the war, he quoted many canons to justify using a cannon against the enemy.","general rules","large heavy guns on the carriage","A","23-a.png","23-b.png","_user_ and Jordan, he quoted many rules to justify his opinion, not using guns. In fact, large heavy guns on the carriage refers to the same pronounced word c a n n o n. So the correct answer is general rules.", "canon"], ["_user_, what is a course underlined in this sentence?","The reading materials for this course are quite cheap, because they all are printed with coarse papers.","harsh or grating","class, or progression in a particular direction","B","24-a.png","24-b.png","The correct answer is answer class", "course"], ["_user_, what is the meaning of the underlined maze?","Whenever he visited the farm, the fields of maize, cotton, rice, and wheat were a maze to him.","another word for corn","a confusing network of passages","B","25-a.png","25-b.png","The correct answer is a confusing network of passages.", "maze"], ["_user_, what is my-nyoot?","Do check every step please. Keep in mind, minute problems cause serious damage.","a short space of time; a moment","very small","B","26-a.png","26-b.png","The correct answer is very small.", "minute"], ["_user_, what does the author mean by learned?","He is a very learned individual, because he spends all his spare time reading.","having much knowledge, well informed","the act of studying","A","27-a.png","27-b.png","The correct answer is having much knowledge, well informed.", "learned"], ["_user_, what is meant by compact here?","Boston is a compact city, which make it easier to travel by foot than by car.","arranged within a small space","an agreement between two or more parties","A","28-a.png","28-b.png","The correct answer is arranged within a small space.", "compact"], ["_user_, what does this author mean by wound?","Amanda was paid a large amount of money because she received a head wound while working.","an injury to the body","to turn, twist, or bend something","A","29-a.png","29-b.png","The correct answer is an injury to the body.", "wound"], ["_user_, what is meant by whined in this sentence?","Wind the clock up before you go to bed, or you may get up late for the first day of school.","to move in a circular direction","a natural movement of air","A","30-a.png","30-b.png","The correct answer is to move in a circular direction.", "Wind"]]
QArray[0]=ArrayRandom(level1);
QArray[1]=ArrayRandom(level2);
QArray[2]=ArrayRandom(level3);

//get random order

var questionNum1=0;
var questionNum2=0;
var questionNum3=0;

var currentLevel=0;
var correctAnswerNmu=0;
var wrongAnswerNmu=0;
var totalNum=0;

//this method is to Random Question
 function ArrayRandom(arr)
{	
	for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
    return arr;
}

//this method like old start
function Start()
{	

	currentLevel=0;
	ShowItem();
	parent.GetWorldEvent("MediaLoaded");
}

//this method likes HasMore
function GetItem()
{
itemCount++;
 if(totalNum<10)
 {
	if(correctAnswerNmu==3||correctAnswerNmu==6)
	{
		//alert("up")
		if (currentLevel<3)
		{
			currentLevel+=1;
		}
		
		//questionNum1=0;
	}
	else if(wrongAnswerNmu==1)
	{
		//alert("down")
		if(currentLevel>0)
		{
			currentLevel-=0;
		
		}
	}
	//ShowItem();
	 window.external.GetWorldEvent("Continue")   
 }
else
{
window.external.GetWorldEvent("Stop") 
}
	
}

	var question="";
	var answer1="";
	var answer2="";
	var isCorrect="";
	var img1="";
	var img2="";
	var underlineWord="";
	
//this method = RestQ
var newquestion=""
function ShowItem()
{
//alert("show item")
	userAnswer="";
	if (currentLevel=="0" )
	{
		qa0=QArray[currentLevel][questionNum1][0];
				
		 question=QArray[currentLevel][questionNum1][1];
		 answer1=QArray[currentLevel][questionNum1][2];
		 answer2=QArray[currentLevel][questionNum1][3];
		 isCorrect=QArray[currentLevel][questionNum1][4];
		 img1=QArray[currentLevel][questionNum1][5];
		 img2=QArray[currentLevel][questionNum1][6];
		 underlineWord=QArray[currentLevel][questionNum1][8];
		 newquestion=question.replace(underlineWord,"<span ><U><B>"+underlineWord+"</B></U></span>");
		
	}
	
	else if(currentLevel=="1" )
	{
			// alert("Congratulations! Go to Level 2!")
			qa0=QArray[currentLevel][questionNum2][0];
		 question=QArray[currentLevel][questionNum2][1];
		 answer1=QArray[currentLevel][questionNum2][2];
		 answer2=QArray[currentLevel][questionNum2][3];
		 isCorrect=QArray[currentLevel][questionNum2][4];
		 img1=QArray[currentLevel][questionNum2][5];
		 img2=QArray[currentLevel][questionNum2][6];
		 underlineWord=QArray[currentLevel][questionNum2][8];
		 newquestion=question.replace(underlineWord,"<span ><U><B>"+underlineWord+"</B></U></span>");

	}
	else if(currentLevel=="2" )
	{
		// alert("Congratulations! Go to Level 3!")
		qa0=QArray[currentLevel][questionNum3][0];
		 question=QArray[currentLevel][questionNum3][1];
		 answer1=QArray[currentLevel][questionNum3][2];
		 answer2=QArray[currentLevel][questionNum3][3];
		 isCorrect=QArray[currentLevel][questionNum3][4];
		 img1=QArray[currentLevel][questionNum3][5];
		 img2=QArray[currentLevel][questionNum3][6];
		 underlineWord=QArray[currentLevel][questionNum3][8];
		 newquestion=question.replace(underlineWord,"<span ><U><B>"+underlineWord+"</B></U></span>");

	}

	document.getElementById('myQuestion').innerHTML=newquestion;
	document.getElementById('answer1').innerHTML=answer1;
	document.getElementById('answer2').innerHTML=answer2;
	//img1=img1.replace(".png",".jpg");
	//img2=img2.replace(".png",".jpg");
	document.getElementById('img1').src=img1;
	document.getElementById('img2').src=img2;
	//alert(currentLevel+":"+questionNum1);
	 showButton();
	
}
function Lock()
{
	lockButton();
}
function Unlock()
{
	showButton();
}
function UnLock()
{
	showButton();
}

//this is importence part, after user click button , button should be lock
 var correctAnswer="";
 var userAnswer="";

function submit(data)
{
	totalNum++
	userAnswer=data;
	
	if(userAnswer=="A")
	 {
		$('#answer1').css({"background-color":"#A9F5F2"});
	 }else if(userAnswer=="B")
	 {
		$('#answer2').css({"background-color":"#A9F5F2"});
	 }
	
	 if(currentLevel==0)
	 {
		correctAnswer=QArray[currentLevel][questionNum1][4];
		qa2=QArray[currentLevel][questionNum1][2];
		qa3=QArray[currentLevel][questionNum1][3];
		qa7=QArray[currentLevel][questionNum1][7];
		
		
		questionNum1++;
	 
	 }
	 else if(currentLevel==1)
	 {
		
		 correctAnswer=QArray[currentLevel][questionNum2][4];
		 qa2=QArray[currentLevel][questionNum2][2];
		qa3=QArray[currentLevel][questionNum2][3];
		qa7=QArray[currentLevel][questionNum2][7];
			
		 questionNum2++;
	 
	 }
	 else if(currentLevel==2)
	 {
		
		 correctAnswer=QArray[currentLevel][questionNum3][4];
		 qa2=QArray[currentLevel][questionNum3][2];
		qa3=QArray[currentLevel][questionNum3][3];
		qa7=QArray[currentLevel][questionNum3][7];
	
		 questionNum3++;
	 
	 }
	 //alert(correctAnswer);
	 var userMHL="L";
	 var jordanMHL="L";
	 
	 if(userAnswer==correctAnswer)
	 {
		 correctAnswerNmu++;
		 wrongAnswerNmu=0;
		 //alert("submit");
		 userScore++;
		 retEvent="MCQuizC";
		// window.external.GetWorldEvent("Correct");
	 
	 }
	 else
	 {
		 correctAnswerNmu=0;
		 wrongAnswerNmu++;
		  //alert("No");
		  retEvent="MCQuizW";
	 //window.external.GetWorldEvent("Incorrect");
	 
	 }
	 if(itemCount>3)
	 {
	 var uScore = userScore/itemCount;
	 var jScore = JordanScore/itemCount;
		if(uScore>0.7)userMHL="H";
		else if(uScore>0.3)userMHL="M";
		if(jScore>0.7)jordanMHL = "H";
		else if(jScore>0.3)jordanMHL="M";
	 }
	 retEvent+=userMHL+jordanMHL;
	 //lockButton();
	 //alert(retEvent);
	 window.external.GetWorldEvent(retEvent);
	 
}

function lockButton()
{
	 //$('.but').css({"background-color":"#DDDDDD"});
	 $('.but').attr("disabled", true);
}


function showButton()
{
	$('.but').attr("disabled", false);
	$('.but').css({"color": "#111111"});
	$('.but').css({"background-color": "#DDDDDD"});
}
function ShowMediaAnswer()
{
	
	if (correctAnswer=="A")
	{
		$('#answer1').css({"color":"green"});
		$('#answer1').css({"background-color":"#81F79F"});
	}
	else if (correctAnswer=="B")
	{
		$('#answer2').css({"color":"green" });
		$('#answer2').css({ "background-color":"#81F79F"});
	}
	

}

//this method is for Rule to get feedback based on Random Question
function GetMediaFeedback(getValue) 
{
//alert("Call get mediafeedback:"+getValue);
	if (getValue=="Instruction")
	{
		
		var playSentence="";
		//playSentence=QArray[currentLevel][questionNum1][0];
		playSentence=qa0;
		var Feedback="Cristina:Speak:"+playSentence;
		return Feedback;
			

	}
	else if(getValue=="TAGoodAnswer")
	{
		var TutorGoodAnswer=qa7;
		//alert(currentLevel+":"+questionNum1);
		//TutorGoodAnswer=QArray[currentLevel][questionNum1][7];
		
		var Feedback="Cristina:Speak:"+TutorGoodAnswer;
		return Feedback;
	}
	else if(getValue=="SAGoodAnswer")
	{
	var JordanSentence="";
		if (isCorrect=="B")
		{
			 JordanSentence=qa3;
		//JordanSentence=QArray[currentLevel][questionNum1][3];
		
		}else if(isCorrect=="A")
		{
		JordanSentence=qa2;
		//JordanSentence=QArray[currentLevel][questionNum1][2];
		}
		
		var Feedback="Jordan:Speak:"+JordanSentence;
		JordanScore++;
		return Feedback;
		
	}
	else if(getValue=="SABadAnswer")
	{
	var JordanSentence="";
		if (isCorrect!="B")
		{
			JordanSentence=qa3;
		//JordanSentence=QArray[currentLevel][questionNum1][3];
		
		}else if(isCorrect!="A")
		{
		JordanSentence=qa2;
		//JordanSentence=QArray[currentLevel][questionNum1][2];
		}
		
		var Feedback="Jordan:Speak:"+JordanSentence;
		return Feedback;
	}
	return "";
}



