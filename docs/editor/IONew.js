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

var xmlArray=[];
var asatLRSExists=qs("asatDirect","1");
var ASATLocation="asat.autotutor.org";

var savescriptsverbid="http://asat.autotutor.org/saved";

var theSchool=qs("school","https://class.x-in-y.com");

var theGUID=qs("guid","f86b9c25-859e-4f1a-9371-4890457707b1");

var Theauthorname=qs("fullname","");
var exportTag=qs("ETag","AutoTutorScript");
var theType=qs("type","ASAT");

var theTagName=qs("tag","SKOSCRIPTS");
var userEmail=qs("email","");
var jsonData = null;

var loadedSKOReadonly=false;
var ScriptsRetrivedToXML;
var AutoTutorScript="";
var theXML="";
var thepermission;
var NewGUID="";
var authorImgurl;
var inforPanel=["#XMLtree","#Outline","#About","#tree","#CommitChanges"];

var outputXML=document.implementation.createDocument(null, "root");
var outputXMLstr="";

 function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }


function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  Theauthorname=profile.getName();
  authorImgurl=profile.getImageUrl();
  userEmail= profile.getEmail();
  AuserxAPI="mailto:"+profile.getEmail();
  $("#GoogleLoginBtn").hide();
  onLoad1();
}

var RetriveSKOObj={
		guid:theGUID,
		source:"ScriptOnly",
		return:"scriptContent",
		authorname:"xiangenhu"
	};

var typeDef={
    "root" : {
      "icon" : "img/tree_icon.png",
      "valid_children" : ["default"]
    },
    "default" : {
      "valid_children" : ["default","file"]
    },
    "file" : {
      "icon" : "glyphicon glyphicon-file",
      "valid_children" : []
    }
  };
  
var Plugins= [
    "contextmenu", "dnd", "search",
    "state", "types", "wholerow"
  ];
  

var asatWrapper; 
var Datawrapper;
// Data LRS 
var LRSURL=qs("lrs","https://record.x-in-y.com/csalexclusive/xapi/");
var LRSLogin=qs("lrslogin","asaiga");
var LRSPassword=qs("lrspassword","padkep");
// Data LRS 
// ScriptLRS LRS 
var asatlrs=qs("asatlrs","https://record.x-in-y.com/scripts/xapi/");
var asatlrslogin=qs("asatlrslogin",'asatScripts');
var asatlrspassword=qs("asatlrspassword",'asatScripts');
// ScriptLRS LRS 

function DataLRS(){  // data LRS
    ADL.launch(function(err, launchdata, xAPIWrapper) {
	Datawrapper = ADL.XAPIWrapper;
	Datawrapper.changeConfig({
			endpoint: LRSURL,
			user: LRSLogin,
			password:LRSPassword
		})
	console.log("--- content statically configured ---\n", Datawrapper.lrs);
}, true)
}

function ScriptLRS(){ //Script storage
  ADL.launch(function(err, launchdata, xAPIWrapper) {
	asatWrapper = ADL.XAPIWrapper;
	asatWrapper.changeConfig({
			endpoint: asatlrs,
			user: asatlrslogin,
			password:asatlrspassword
		})
	console.log("--- content statically configured ---\n", asatWrapper.lrs);
}, true)
}

  
 
 function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
 function GetGUID(){
	 var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
     return guid;
 }


function xmlToJson(xml) {
  // Create the return object
  var obj = {};
  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj["currentAttributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["currentAttributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  } else if (xml.nodeType == 4) { // cdata section
    obj = xml.nodeValue
  }

  // do children
  if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof(obj[nodeName]) == "undefined") {
        var JSONStr = JSON.stringify(xmlToJson(item));
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof(obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
};



function ConnectAndGetScriptsFromSKOServer() {
  RetriveSKOObj.TagName = "SKOSCRIPTS";
  var url = theSchool + "/retrieve?json=" + JSON.stringify(RetriveSKOObj);
  var IDRetrive = new XMLHttpRequest();
  IDRetrive.overrideMimeType('text/xml; charset=utf-8');
  IDRetrive.open('GET', url, true);
  IDRetrive.onload = function() {
  ScriptsRetrivedToXML = "<?xml version='1.0' encoding='utf-8'?> \n" + IDRetrive.responseText;
    SKOScriptsinJSON = xmlToJson($.parseXML(ScriptsRetrivedToXML));
	var TheXML=$.parseXML(ScriptsRetrivedToXML);
	processingTree(TheXML);
	AutoTutorScript=TheXML.getElementsByTagName("AutoTutorScript")[0];
	addMenu();
	
	drawTree("#tree",IDRetrive.responseText);
	$("#editor").show();
  }
  IDRetrive.send(null);
}

function retriveScriptByID(id){
	var jsonforID=[
	{"$match":{"statement.object.mbox":"mailto:"+id+"@asat.autotutor.org"}},{"$sort":{"statement.timestamp":-1}},{"$limit":1}, 
    {"$project":{"ext":"$statement.result.extensions.http://asat.autotutor.org/scripts"}},
    {"$project":{"script":"$ext.script"}}
	]
	var settings = {
		"url": qs("asatlrs","https://record.x-in-y.com/scripts/xapi/")+"/statements/aggregate",
		"method": "POST",
		"timeout": 0,
		"headers": {
			"Authorization": "Basic YXNhdFNjcmlwdHM6YXNhdFNjcmlwdHM=",
			"Content-Type": "application/json"
			},
	  "data": JSON.stringify(jsonforID),
	};
	$.ajax(settings).done(function (response) {
	 if (response.length>0){
		 downloadxml(id+".xml",response[0].script,exportTag);
	 }
	});
}
 
function RetrieveSKOfromLRS(TheEditor){
	var jsonStr;
	if (TheEditor){
		jsonStr=[
					{"$match": {
						"$and":[
									{"statement.verb.id":savescriptsverbid},
									{"statement.object.mbox":"mailto:"+theGUID+"@"+ASATLocation},
									{"statement.actor.mbox":"mailto:"+userEmail}

								]
								}
						},					
						{"$sort":{"statement.timestamp":-1
								}
							}, 
						{"$limit":1}, 
						{"$project":{
								"author":"$statement.actor.mbox",                     
								"Title":"$statement.object.name",
								"Extension":"$statement.result.extensions.http://asat.autotutor.org/scripts"
						}},
						{"$project":{
								"author":"$author",                     
								"Title":"$Title",
								"script":"$Extension.script",
								"permission":"$Extension.permission",
						}}
				];
		}else{
			jsonStr=[
						{"$match": {
							"$and":[
										{"statement.verb.id":savescriptsverbid},
										{"statement.object.mbox":"mailto:"+theGUID+"@"+ASATLocation}

									]
									}
							},					
							{"$sort":{"statement.timestamp":-1
									}
								}, 
							{"$limit":1}, 
							{"$project":{
								"author":"$statement.actor.mbox",                     
								"Title":"$statement.object.name",
								"Extension":"$statement.result.extensions.http://asat.autotutor.org/scripts"
						}},
						{"$project":{
								"author":"$author",                     
								"Title":"$Title",
								"script":"$Extension.script",
								"permission":"$Extension.permission",
						}}
					];
		}
		var settings = {
		"url": qs("asatlrs","https://record.x-in-y.com/scripts/xapi/")+"/statements/aggregate",
		"method": "POST",
		"timeout": 0,
		"headers": {
			"Authorization": "Basic YXNhdFNjcmlwdHM6YXNhdFNjcmlwdHM=",
			"Content-Type": "application/json"
			},
	  "data": JSON.stringify(jsonStr),
	};

	$.ajax(settings).done(function (response) {
	 if (response.length>0){
		 if (response[0].script==null){
			 ConnectAndGetScriptsFromSKOServer();
			 return;
		 }
		 if (response[0].script.indexOf("<?xml")==-1){
			ScriptsRetrivedToXML = "<?xml version='1.0' encoding='utf-8'?> \n" + response[0].script;
		 }else{
			 ScriptsRetrivedToXML = response[0].script;
		 }
		 thepermission=response[0].permission;
		 loadedSKOReadonly=thepermission.readonly;
		 var theXML=$.parseXML(ScriptsRetrivedToXML);
		 SKOScriptsinJSON = xmlToJson($.parseXML(ScriptsRetrivedToXML));
		var TheXML=$.parseXML(ScriptsRetrivedToXML);
		processingTree(TheXML);
		AutoTutorScript=TheXML.getElementsByTagName("AutoTutorScript")[0];
		addMenu();
		drawTree("#tree",response[0].script);
		$("#editor").show();
	 }else{
		  ConnectAndGetScriptsFromSKOServer();
	 }
	});
}



function downloadxml(theguid,thexml,tagname){ 
	if (tagname=="SKOSCRIPTS"){
		var Theelement = document.createElement('a');
		  Theelement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(thexml));
		  Theelement.setAttribute('download', theguid);
		  Theelement.style.display = 'none';
		  document.body.appendChild(Theelement);
		  Theelement.click();
		  document.body.removeChild(Theelement);
	}else{
		var Theelement = document.createElement('a');
		
	      var theText=jQuery.parseXML(thexml);
		  var Thenewcomponent=theText.getElementsByTagName(tagname)[0];
		  var thexml=new XMLSerializer().serializeToString(Thenewcomponent);
		  
		  Theelement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(thexml));
		  Theelement.setAttribute('download', theguid);
		  Theelement.style.display = 'none';
		  document.body.appendChild(Theelement);
		  Theelement.click();
		  document.body.removeChild(Theelement);
	}
}
function onloadaction(){
	return;
	if (qs("fetch","0")=="1"){
		retriveScriptByID(theGUID);
	}
}
 
 function addMenu(){
		 var editMenuhtml="<button class='btn' id='viewAboutbtn' onclick='about()'>About</button>";
	     editMenuhtml=editMenuhtml+"  <button class='btn' id='editorUpdatebtn' onclick='UpdateEdited()'>Update</button>";
		 editMenuhtml=editMenuhtml+"  <button class='btn' id='viewTreebtn' onclick='viewTree()'>View Tree</button>";
		 editMenuhtml=editMenuhtml+"  <button class='btn' id='viewXMLbtn' onclick='viewxml()'>View XML</button>";
		 editMenuhtml=editMenuhtml+"  <button class='btn' id='viewOutline' onclick='viewOutline()'>View Outline</button>";
		 editMenuhtml=editMenuhtml+"  <button class='btn' id='editorTestbtn' onclick='TestEdited()'>Test SKO</button>";
		 editMenuhtml=editMenuhtml+"  <button class='btn' id='editorSavebtn' onclick='CommitToScriptLRS()'>Commit Changes</button>";
		 editMenuhtml=editMenuhtml+"  <input id='editorSearchInput' value=''></input>";
		 editMenuhtml=editMenuhtml+"  <button class='btn' id='editorSearchbtn' onclick='SearchStr()'>Search</button>";
		$("#editorMenu").html("<center>"+editMenuhtml+"</center>");
 }
 
 
 function showInfor(index){
	var i;
	for (i=0;i<inforPanel.length;i++){
		if (i==index){
			$(inforPanel[i]).show();
		}else{
			$(inforPanel[i]).hide();
		}
	}
 }
 
function onLoad1(){
	RetrieveSKOfromLRS();
//	RetriveSKO();
	addMenu()
	$("#editor").show();
} 



function TestEdited(){
	GetStarted();
	$("#editor").hide();
//	Create a link so it can be used to download the script.
}

function about(){
//	["#XMLtree","#Outline","#About","#tree"]
    var html="<ul>";
	html=html+"<li> Author: "+Theauthorname;
	html=html+"<li> Unique Indentification for current SKO (GUID): "+ theGUID;
	html=html+"<li> Original localtion: "+theSchool;
	html=html+"<li> Current location: "+asatlrs;
	html=html+"</ul>";
	html=html+"<hr/>";
	html=html+"<div id='YourSKOs'> </div>";
	html=html+"<img id='authorPic' src='"+authorImgurl+"'</img>"
	$("#About").html(html);
	showInfor(2);
}

var ignoredList=["UID","playaction",
				 "Student1Pub","Student2Pub","Student3Pub","TeacherPub",
				 "S1X","S1Y",
				 "S2X","S2Y",
				 "S3X","S3Y",
				 "TX","TY","xmlns","LRSAdmin","LRSMacro","LRSPassword","LRSURL"];


var ignoredTags=["SKOMsg","POPChoice","NOTES","YOUTUBE","iDSSPP","UseAIML","EnableBigImage","PnQs","LCCFeedBack","Latency"];
ignoredTags=["SKOMsg","YOUTUBE","iDSSPP","UseAIML","EnableBigImage","PnQs","LCCFeedBack","Latency"];


function EditNode(node){
	return;
	var nodeName=String(node.text); //decide if it is possible to edit
	var nodeParentID=String(node.parent); //decide if it is possible to insert (what), after finding parent by id
	if (nodeName.indexOf("_")>-1){
		$("#currentValue").val("");
		return;
	}
	if (nodeName.split("<b>").length>0){
		nodeName=nodeName.split("<b>")[1].split("</b>")[0];
		$("#currentValue").val(nodeName);

	}else{
		$("#currentValue").val("");
	}
}


function Update() {
   var ref = $('#tree').jstree(true),
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		sel = sel[0];
		ref.edit(sel);
	};
	
var to = false;
function SearchStr(){
	 if(to) { clearTimeout(to);}
    to = setTimeout(function () {
      var v = $('#editorSearchInput').val();
      $('#tree').jstree(true).search(v);
    }, 250);
}

function drawTree(target,data){
	var jsonData = (new DOMParser()).parseFromString(data,'text/xml');
	var  theJSON=xml22Json(jsonData.documentElement);
	theJSON.data= function (node) {
		return { 'id' : node.id };
	}
	
	 $(target).on("changed.jstree", function (e, data) {
		if(data.selected.length) {
			var node=data.instance.get_node(data.selected[0]);
			thenode=node;
			var parentNodeId= data.instance.get_parent(node);
			var parentNode = $('#tree').jstree(true).get_node(parentNodeId);
			var ParenttagName="";
			if (parentNode.text!=null){
				ParenttagName=parentNode.text;
				if(ParenttagName.indexOf("_")==3){
					if (node.children.length==0){
						Update();
					}
				}
			}
		}
	})
	$(target).jstree({
		'core': {
			"data": theJSON,
			"themes" : { "stripes" : true },	
			"animation" : 0,
			"types":typeDef,
			"check_callback":true
		},
		"plugins":Plugins,
		 "contextmenu":{
				 "items": Editing(thenode)
				 }
			 })
}

	
var thenode=null;
function Retrieve(guid,school,type,anauthorname) {
	var retriveObj={
		guid:guid,
		source:"ScriptOnly",
		return:"scriptContent",
		authorname:anauthorname,
		TagName:theTagName}
	var aurl=school+"/retrieve";
	var ISLink=aurl+"?json="+JSON.stringify(retriveObj);
	 $.get(ISLink, function(data, status){
		 ScriptsRetrivedToXML="<?xml version='1.0' encoding='utf-8'?> \n" + data;
		 processingTree(ScriptsRetrivedToXML);
		 drawTree("#tree",data);
		});
		}


function Editing(node){
	if (node==null) {
	return
	}
	var name = String(node.text);
	returnobj={
		"Edit":{
			"separator_before": false,
			"separator_after": true,
			"label":"Edit",
			"action": function(){
				var tree = $('#tree').jstree(true),
					node = tree.get_selected()[0];
				if(node) {
				tree.edit(node);
				}
			},
		},
		"Insert":{
			"separator_before": false,
			"separator_after": true,
			"label":"Insert",
			"action": function(){
				var tree = $('#tree').jstree(true),
				node = tree.get_selected(node)[0];
				node = tree.create_node(node);
				if(node) {
					tree.edit(node);
				 }
			},
		},
	}
	return returnobj;
}

var Thetree;


function processingTree(node){
	return; // do not process
	if (ignoredTags.includes(node.tagName)) {
		alert(node.tagName);
	}else{
		if (node.childNodes.length>0){
			for (var i=node.childNodes.length-1;i>-1;i--){
				var thenode=node.childNodes[i];
				if (ignoredTags.includes(thenode.nodeName)){
					node.removeChild(thenode);
				}else {
					processingTree(thenode);
				}
			}
		}
	}
}





function UpdateEdited(){
	
	var json =$("#tree").jstree(true).get_json('#', {flat:true});
	JSONtoXML(json);
//	processingTree(outputXML);
	outputXMLstr=(new XMLSerializer()).serializeToString(outputXML);
	outputXMLstr=outputXMLstr.split("&lt;").join("<");
	outputXMLstr=outputXMLstr.split("&gt;").join(">");
	outputXMLstr=outputXMLstr.replace(/xmlns="[^"]*"/g,"");
	
}
	
function JSONtoXML(json) {
  	
	var tree =null;
 	var nodes = {};
 	var isUsed = {};
 	var dict = {};
	
	for(var idx in json){
		var id = json[idx]['id'];
		var parentId = json[idx]['parent'];
		var text = json[idx]['text']
		dict[id] =  {"parentId": parentId, "text": text};
	};

 	for(id in dict){
 		isUsed[id] = false;
 		var text = dict[id]["text"];
 		var parentId = dict[id]['parentId'];
 		

 		if((/<[^>]+>/g).test(text)){
			text = text.replace(/<[^_>]+>/g, "");
		}

 		if(text.length === 0){
 			text = " ";
 		}

 		if(text != "attributes"){
 			if(dict[parentId] && dict[parentId]["text"] === "attributes"){
 				 var branch = text;
 			}else{
	 			if(dict[parentId] && 
	 				(/<[^>]+>/g).test(dict[parentId]["text"])){
	 				if(dict[parentId]["text"].replace(/<[^>]+>/g, "") === "_cdata"){
	 					
	 					var info = "<![CDATA[" + text + "]]>";
	 					var branch = document.createTextNode(info); 
//						var branch  = text;
	 				}
	 				else if(dict[parentId]["text"].replace(/<[^>]+>/g, "") === "_value"){
	 					var branch = document.createTextNode(text);
	 				}
	 				else{
	 					var branch = text;
	 				}
	 			}
	 			else{
	 				var namespace = text;;
	 				var branch= document.createElementNS(namespace, text);
	 			}

 			}
 			nodes[id] = {"branch": branch, "parentId" : parentId, "text": text};
 		}else{
 				var branch = text;
 				nodes[id] = {"branch": branch, "parentId" : parentId, "text": text};
 			}
 	}

 	for(var i = Object.keys(nodes).length - 1; i > -1; i--){
 		var id = Object.keys(nodes)[i];
 		if(isUsed[id] === false){
 			var node = nodes[id]["branch"];
 			var parentId = nodes[id]["parentId"];

 			if(parentId != "#"){
	 			if(nodes[id]["parentId"]){
	 				var ptext = nodes[parentId]["text"];
	 				var pNode = nodes[parentId]["branch"];
	 			}

	 			if(nodes[parentId]["parentId"] && nodes[parentId]["parentId"] != "#") {
	 				var gpId = nodes[parentId]["parentId"];
	 				var gpNode = nodes[gpId]["branch"];
	 				var gptext = nodes[gpId]["text"];
	 			}

	 			if(nodes[gpId]["parentId"]){
	 				var ggpId = nodes[gpId]["parentId"];
	 				if(ggpId != "#"){
	 					var ggpNode = nodes[ggpId]["branch"];
	 				}
	 			}
	 		}

 			if(parentId === "#"){
 				tree = node;
 			}
 			else if(ptext === "_cdata" || ptext === "_value"){
 				gpNode.prepend(node);
 				isUsed[parentId] = true;
 			}
 			else if(gptext === "attributes"){
 			
 				if(/_/g.test(pNode)){
 					var text = nodes[parentId]["text"].replace(/_/g,"");
 					pNode = text;
 				}
 				ggpNode.setAttribute(pNode, node);
 				isUsed[parentId] = true;
 				isUsed[gpId] = true;
 			}
 			else{
 				pNode.prepend(node);
 			}
	 	}
 		isUsed[id] = true;
 		
 	}
 	
 	outputXML = tree;
}
	
		
	
function formatXml(xml, tab) { // tab = optional indent value, default is tab (\t)
    var formatted = '', indent= '';
    tab = tab || '\t';
    xml.split(/>\s*</).forEach(function(node) {
        if (node.match( /^\/\w/ )) indent = indent.substring(tab.length); // decrease indent by one 'tab'
        formatted += indent + '<' + node + '>\r\n';
        if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += tab;              // increase indent
    });
    return formatted.substring(1, formatted.length-3);
}

function  viewxml(){
	if (outputXMLstr!=""){
		var tab="\t";
		theXML=formatXml(outputXMLstr, tab);
	}else{
		theXML=formatXml(ScriptsRetrivedToXML, tab);
	}
	Theeditor.setReadOnly(true);
	Theeditor.session.setValue(theXML);
	
//	["#XMLtree","#Outline","#About","#tree"]
	showInfor(0);
}

function viewTree(){
//	["#XMLtree","#Outline","#About","#tree"]
	showInfor(3);
}

function viewOutline(){
//	["#XMLtree","#Outline","#About","#tree"]
	showInfor(1);
}

function RetriveSKO(){
	var guid=theGUID;
	var school=theSchool;
	var type="ASAT";
	var anauthorname=Theauthorname;
	Retrieve(guid,school,type,anauthorname);
}

function GetElements(XMLStr,Tag){
	var theXML=(new DOMParser()).parseFromString(XMLStr, "text/xml");
	return theXML.getElementsByTagName(Tag)[0];
}

function GetSaveOptions(){
	var permission={
		"readonly":true,
		"Collaborators":{"originalAuthor":"mailto:"+userEmail,
		                 "coowners":"none",
						 "colaborators":"none",
						 "viewer":"all"
		},
		"descriptions":"write your discriptions here"
	}
	return permission;
}

function savesko(){
	thepermission.Collaborators.coowners=$("#coowners").val();
	thepermission.Collaborators.colaborators=$("#colaborators").val();
	thepermission.Collaborators.viewer=$("#viewer").val();
	thepermission.descriptions=$("#descriptions").val();
	var selected=$("#readonlytrue").is(":checked");
	thepermission.readonly=selected;
	CreateSKO(thepermission,false);
//	CreateSKO(thepermission,loadedSKOReadonly);
}


function CommitToScriptLRS(){
	 ScriptLRS();
	if (thepermission==null){
		thepermission=GetSaveOptions();
	}
	var html="<table width='100%' height='100%'><tr><td align='center'>";
	html=html+"<p/><h2 class='centerText'> Configure your save options </h2><hr/>";
	html=html+"<h3>coowners:</h3> <br/><textarea id='coowners'></textarea>";
	html=html+"<h3>colaborators:</h3><br/><textarea id='colaborators' ></textarea>";
	html=html+"<h3>viewer:</h3><br/> <textarea id='viewer' ></textarea><hr/>";
	html=html+"<h3>Descriptions:</h3><br/><textarea id='descriptions' ></textarea>";
//	html=html+"<h3>Readonly?  <input type='radio' id='readonlytrue' name='readonly'> <label for='readonlytrue'>true</label>  <input type='radio' id='readonlyfalse' name='readonly'> <label for='readonlyfalse'>false</label><br></h3>";
	html=html+"<hr/><button id='commibtn' class='btn' onclick='savesko()'>Save your script</button>";
	html=html+"<hr/><div id='savingmsg'></div>";
	html=html+"</td></tr></table>";
	$("#Options").html(html);
	showInfor(4);
	$("#coowners").val(thepermission.Collaborators.coowners);
	$("#colaborators").val(thepermission.Collaborators.colaborators);
	$("#viewer").val(thepermission.Collaborators.viewer);
	$("#descriptions").val(thepermission.descriptions);
	
	/* if (thepermission.readonly){
		$("#readonlytrue").prop('checked',true);
	}else{
		$("#readonlyfalse").prop('checked',true);
	} */
	// Note!!!! The current version do not save as readonly.
	thepermission.readonly=false;
}


  var SavingResults = function (resp, thing) {
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
		if ( resp.responseText )
			text = "Script localtion "+asatWrapper.lrs.endpoint+ " Successfully saved with entry ID" + resp.responseText;
		else
			text = thing;
	}
	text=text +"<br/>The SKO GUID= "+NewGUID;
	$('#savingmsg').html(text);
};

function CreateSKO(thepermision,newsko){
	if (asatWrapper==null){
		alert("Please update the scripts before committ changes to the server.");
		return;
	}
	var actor={
        "mbox": "mailto:"+userEmail,
		"name": Theauthorname
	}
	var verb={
        "id": "http://asat.autotutor.org/saved",
        "display": {
            "en": "saved"
			}
		};
	var TheXML;
	if (outputXMLstr!=""){
		TheXML=outputXMLstr
	}else{
		TheXML=ScriptsRetrivedToXML;
	}
	
	var theTitle=GetElements(TheXML,"TITLE");
	theTitle=new XMLSerializer().serializeToString(theTitle);
	theTitle=theTitle.split("CDATA[")[1].split("]]")[0]
	
	if (newsko){
		NewGUID= GetGUID();
		theTitle="copy of "+theTitle;
	}else{
		NewGUID=theGUID;
	}
	
	var object={
        "objectType": "Agent",
        "mbox": "mailto:"+NewGUID+"@"+ASATLocation,
		"name":theTitle
    };
	/* var Options={};
	Options=GetSaveOptions(); */
	
	var result={
        "extensions": {
            "http://asat.autotutor.org/scripts": {"permission":thepermision,
			 "script":TheXML}
        }
     }
	var statement={"actor":actor,"verb":verb,"object":object,"result":result};
	asatWrapper.sendStatement(statement, SavingResults);
	
}


		

function xml22Json(xmlNode) {
    var val = "";
	var obj = {};
	var attr="";
	var cdata="";
	var CAchildren=[];
	var i;
	 if (xmlNode.attributes.length > 0) {
		  obj["text"]="attributes";
		  for (var j = 0; j < xmlNode.attributes.length; j++) {
			var attribute = xmlNode.attributes.item(j);
			var attObj={"text":"<b>_"+attribute.nodeName+"</b>","children":[{"text":attribute.nodeValue}]}  
			CAchildren.push(attObj);
		  }
     }
	obj["children"]=CAchildren;
	var avalue="";
	if (xmlNode.children.length>0){
		
	}
    if(xmlNode.firstChild){
	if(xmlNode.firstChild.nodeType === 3){ 
		if(xmlNode.firstChild.nodeValue.trim() === ""){
			val = xmlNode.firstChild.parentNode.tagName;
		}
		else {
			val = xmlNode.firstChild.parentNode.tagName;
			avalue=xmlNode.firstChild.nodeValue;
			}	
		 }
		else if(xmlNode.firstChild.nodeType === 1){
			val = xmlNode.tagName;			
		 }else if (xmlNode.firstChild.nodeType === 4){
			cdata=xmlNode.firstChild.nodeValue;
			val = xmlNode.firstChild.parentNode.tagName; 
		 }
	  }else{
		val = xmlNode.nodeName;
	}
	
	var childrenObj = childrenObj = [...xmlNode.children].map(childNode => xml22Json(childNode))
	
	
	if (CAchildren.length>0){
		childrenObj.push(obj)
	}
	
	if (avalue!=""){
		var valueObj={"text":"<b>_value</b>","children":[{"text":avalue}]};
		childrenObj.push(valueObj);
	}
	if (cdata!=""){
		var valueObj={"text":"<b>_cdata</b>","children":[{"text":cdata}]};
		childrenObj.push(valueObj);
	}
	var returnOBJ={};
	if ((cdata!="")||(avalue!="")){
	   returnOBJ={text: val,
		"state" : { "opened" : true },
        children:childrenObj
	   }
	}else {
		returnOBJ={text: val,
		"state" : { "opened" : false },
        children:childrenObj
	}
	}
    return returnOBJ;
}


//  Get all xml tags
function getallXMLarray(node){
	if (node.children!=[]){
		var xmlString = "<"+node.text+"></"+node.text+">";
		var parser = new DOMParser();
		var xmlElement = parser.parseFromString(xmlString, "text/xml"); 
		xmlArray.push(xmlElement);
		console.log(xmlElement.toString()+"  "+xmlArray.length);
		for (var i=0;i<node.children.length-1;i++){
			var childNode=node.children[i]
			getallXMLarray(childNode);
		}
	}
}
