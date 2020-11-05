
var questionNum=-1;

var ItemList=[["What is the nonliteral language being used in this advertisement? Click the correct answer.","C","International Tea Company","Assorted Teas from around the World!","One sip and you're in heaven!"],["Is a comparison being made in the slogan: One sip and you're in heaven?","A","Yes","No"],["What two things are being compared? Click the correct answer.","C","A sip of tea and going to other countries.","Other countries and being in heaven.","A sip of tea and being in heaven."],["Why is the writer making this comparison? Click the correct answer.","B","To describe where the tea was grown.","To describe how the tea makes the reader feel.","To describe how to make tea."],["Is ComputerStudent1 correct? Click yes or no.","B","Yes","No"],["Which of these appropriately replaces the nonliteral language? Click the right response.","B","Drinking this tea makes you want to travel.","This tea makes you feel like you are in an amazing place.","This tea is from all over the world."]]

function Start()
{	

$("#details").css("display","none");

	document.getElementById('mainImg').src="AdTea0.png"
		//ShowItem();
		parent.GetWorldEvent("MediaLoaded");
	
		}
		
function fromMainPage()
{
	questionNum++;
	ShowItem();
	Lock();
	
}

//this method likes HasMore
function GetItem()
{
questionNum++;
	 if(questionNum<ItemList.length)
	 {
		
		parent.GetWorldEvent("Continue")   
	 
	 }
	else
	{
		parent.GetWorldEvent("Stop") 

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
 $('.but').css({"background-color":"#98bf21"});

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
		
		}
				
			
		else if(getLength==4)
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
//this is importence part, after user click button , button should be lock


function submit(data)
{
		userAnswer=data;
		
		if(userAnswer==correctAnswer)
		{
			parent.PlaySound('clicked0.wav');
			parent.GetWorldEvent("Correct");
		}
		else
		{
			parent.PlaySound('incorrect0.wav');
			parent.GetWorldEvent("Incorrect");
		}
		Lock();
		//$('.but').attr("disabled", true);
		 if(userAnswer=="A")
		 {
			
			$("#answer1").css({ "background-color":"#DDDDDD"});
		 
		 }else if(userAnswer=="B")
		 {
			$("#answer2").css({"background-color":"#DDDDDD"});
			
		 }
		 else if(userAnswer=="C")
		 {
			
			$("#answer3").css({ "background-color":"#DDDDDD"});
		 }
		

}
function Unlock()
{

	 $('.but').css({"background-color":"#98bf21"});
	 $('.but').css({"color":"black"});
	 
	 $('.but').attr("disabled", false);
	

	
}

function Lock()
{
	$('.but').attr("disabled", true);
	$('.but').css({"color": "#111111"});
	$('.but').css({"background-color": "#DDDDDD"});
	$('.but:hover').css({"background-color": "#7b7b7b"});

					
}
function ShowMediaAnswer()
{
	correctAnswer
	
	if(correctAnswer=="A")
	 {
		$("#answer1").css({"color":"green"});
		$("#answer1").css({"background-color":"#00EC00"});
	 
	 }else if(userAnswer=="B")
	 {
	 	$("#answer2").css({"color":"green"});
		$("#answer3").css({"background-color":"#00EC00"});
	 }
	 else if(userAnswer=="C")
	 {
	 	$("#answer3").css({"color":"green"});
		$("#answer3").css({"background-color":"#00EC00"});
	 }
	

}