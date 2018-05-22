
var questionNum=-1;

var ItemList=[["What part of this advertisement does not make sense? Click the correct answer.","A","Take one at night; be out like a light!","Perkytown Pharmaceuticals","Limited Time Offer!"],["Is there a comparison being made? Click yes or no.","A","Yes","No"],["What two things are being compared? Please click the correct response.","B","Night and Light","Reader and Light","Out and Night"],["Why is the writer making this comparison? Please click the cor-rect answer.","C","To describe the color of the pill to the reader","To describe the price of the pill to the reader","To describe the effects of the pill to the reader"]]

function Start()
{	
$("#details").css("display","none");

	document.getElementById('mainImg').src="AdGlasses0.png"
		//ShowItem();
		window.external.GetWorldEvent("MediaLoaded");
	
		}
		
function fromMainPage()
{
	questionNum++;
	ShowItem();
	window.external.GetWorldEvent("LeaveMainPage");
}
//this method likes HasMore
function GetItem()
{
questionNum++;
	 if(questionNum<ItemList.length)
	 {
		
		window.external.GetWorldEvent("Continue");
	 
	 }
	else
	{
		window.external.GetWorldEvent("Stop");
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
		
		 window.external.GetWorldEvent("Correct");
		}
		else
		{
		window.external.GetWorldEvent("Incorrect");
		
		}
		$('.but').attr("disabled", true);
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