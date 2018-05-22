
var questionNum=-1;

var ItemList= [["Which part of this advertisement uses nonliteral language?","A","Take one at night; be out like a light!","Perkytown Pharmaceuticals","Limited Time Offer!"],["Is there a comparison being made in the slogan: 'Take one at night; be out like a light!'?","A","Yes","No","I'm not sure."],["Why is the writer comparing the reader and a light?","C","To describe the color of the pill to the reader.","To describe the price of the pill to the reader.","To describe the effects of the pill to the reader."],["What is the intended meaning of 'Out like a light'?","A","To fall asleep quickly.","To turn the light off.","To go outside."],["Which of these is a good replacement for the nonliteral language?","B","Take one at night and fall asleep with the light on!","Take one at night to fall asleep quickly!","Take one at night and you will sleep forever!"]]

	function Start()
	{	
		Lock();
		$("#details").css("display","none");

		document.getElementById('mainImg').src="AdPerky0.png"
		
		//ShowItem();
		parent.GetWorldEvent("MediaLoaded");
	}

	function fromMainPage()
	{
		questionNum++;
		
		ShowItem();
		Lock();
		parent.GetWorldEvent("LeaveMainPage");
	}
	
	//this method likes HasMore
	function GetItem()
	{

		questionNum++;

		if(questionNum<ItemList.length)
		{
			parent.GetWorldEvent("Continue");
		}
		else
		{
			parent.GetWorldEvent("Stop");
		}
	}

	var question="";
	var answerA="";
	var answerB="";
	var answerC="";
	var correctAnswer="";
	
	
//this method = RestQ
	function ShowItem()
	{
		$("#details").css("display","block");
		
		$("#mainImg").css("display","none");
		$('.but').css({"background-color":"#cee2ee"});

		$("#answer1").hover(function(){
		  $("#answer1").css("background-color","#ffff3a");
		  },function(){
		  $("#answer1").css("background-color","#cee2ee");
		});
		$("#answer2").hover(function(){
		  $("#answer2").css("background-color","#ffff3a");
		  },function(){
		  $("#answer2").css("background-color","#cee2ee");
		});
		$("#answer3").hover(function(){
		  $("#answer3").css("background-color","#ffff3a");
		  },function(){
		  $("#answer3").css("background-color","#cee2ee");
		});
		
		if(questionNum<ItemList.length)
		{
			var getLength=ItemList[questionNum].length;
			if (getLength==5)
			{
				question=ItemList[questionNum][0];
				correctAnswer=ItemList[questionNum][1];
				answerA=ItemList[questionNum][2];
				answerB=ItemList[questionNum][3];
				answerC=ItemList[questionNum][4];

				document.getElementById('question').innerHTML=question;
				document.getElementById('answer1').innerHTML=answerA;
				document.getElementById('answer2').innerHTML=answerB;
				document.getElementById('answer3').innerHTML=answerC;
				$("#answer3").css("display","block");
			}else if(getLength==4)
			{
				question=ItemList[questionNum][0];
				correctAnswer=ItemList[questionNum][1];
				answerA=ItemList[questionNum][2];
				answerB=ItemList[questionNum][3];
			  
				document.getElementById('question').innerHTML=question;
				document.getElementById('answer1').innerHTML=answerA;
				document.getElementById('answer2').innerHTML=answerB;
				
				$("#answer3").css({"background-color":"#DDDDDD"});
				$("#answer3").css("display","none");
			}
		}
	}
	
	
	//this is important part, after user click button, button should be lock
	function submit(userAnswer)
	{
		if(userAnswer==correctAnswer)
		{
			parent.PlaySound('clicked0.wav');
			parent.GetWorldEvent("Correct");
		}
		else{
		parent.PlaySound('incorrect0.wav');
		parent.GetWorldEvent("Incorrect");
		}
		Lock();
		//$('.but').attr("disabled", true);
		
		 if(userAnswer=="A")
		 {
			$("#answer1").css({ "background-color":"#ffff3a"});
			$("#answer1").css({ "color":"black"});
		 }else if(userAnswer=="B")
		 {
			$("#answer2").css({"background-color":"#ffff3a"});
			$("#answer1").css({ "color":"black"});
		 }else if(userAnswer=="C")
		 {
			$("#answer3").css({ "background-color":"#ffff3a"});
			$("#answer1").css({ "color":"black"});
		 }
	}
	function Unlock()
	{
		//i think this line makes the button color behave funny
		 //$('.but').css({"background-color":"#F0F0F0"}); 
		 $('.but').attr("disabled", false);
		 $('.but').css({"background-color":"#cee2ee"});
	}

	function Lock()
	{
		$('.but').attr("disabled", true);
		$('.but').css({"background-color": "#DDDDDD"});
		$('.but:hover').css({"background-color": "#7b7b7b"});
	}

function ShowMediaAnswer()
	{
		if(correctAnswer=="A")
		 {
			$("#answer1").css({"color":"black"});
			$("#answer1").css({"background-color":"#55f055"});
		 }else if(correctAnswer=="B")
		 {
			$("#answer2").css({"color":"black"});
			$("#answer2").css({"background-color":"#55f055"});
		 }
		 else if(correctAnswer=="C")
		 {
			$("#answer3").css({"color":"black"});
			$("#answer3").css({"background-color":"#55f055"});
		 }
	}