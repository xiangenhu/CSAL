var AllScoreJSON=[
			{"$match": {
				"$and":[
							{"statement.verb.id":"https://app.skoonline.org/ITSProfile/action"}
						]
						}
				},					
				{"$sort":{"statement.timestamp":-1
						}
					},            
				{"$project":{
					 "agent":"$statement.actor.mbox",
					 "Ext":"$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"
				}},
				{"$project":{
					"agent":"$agent",
					 "Score":"$Ext.Score.total"
				}},
			   {"$group":{
				   "_id":"$agent",
				   "lastScore":{"$first":"$Score"}
			   }}    

		];

function GetLastActionJSON(learnermbox,lessonmbox){
	var returnJSON=[
    {"$match": {
        "$and":[
                    {"statement.verb.id":"https://app.skoonline.org/ITSProfile/interaction"},
						{"statement.actor.mbox":learnermbox},
						{"statement.object.mbox":lessonmbox}

                ]
                }
        },					
        {"$sort":{"statement.timestamp":-1
                }
            }, 
        {"$limit":1},
        {"$project":{
                "time":"$statement.timestamp"
        }}
]
return returnJSON;
}

function GetLastStartingTime(learnermbox,lessonmbox){
	var returnJSON=[
    {"$match": {
        "$and":[
                    {"statement.verb.id":"https://app.skoonline.org/ITSProfile/start"},
						{"statement.actor.mbox":learnermbox},
						{"statement.object.mbox":lessonmbox}

                ]
                }
        },					
        {"$sort":{"statement.timestamp":-1
                }
            }, 
        {"$limit":1},
        {"$project":{
                "time":"$statement.timestamp"
        }}
]
return returnJSON;
}



function GetInteractionHistorxAPIJSON(learnermbox,lessonmbox,atimestamp){
	var returnJSON=[
    {"$match": {
        "$and":[
                    {"statement.verb.id":"https://app.skoonline.org/ITSProfile/interaction"},
					{"statement.actor.mbox":lessonmbox},
					{"statement.object.mbox":learnermbox},
					{"statement.timestamp": {"$gt": {"$parseDate":{"date":atimestamp}}}}
                ]
                }
        },					
        {"$sort":{"statement.timestamp":1
                }
            },
        {"$project":
            {"contextExt":"$statement.context.extensions.https://app.skoonline.org/ITSProfile/CSAL/Data",
			"time":"$statement.timestamp"}
        },
         {"$project":
            {
				"time":"$time",
                "data":"$contextExt.data",
                "msg":"$contextExt.msg",
				"CurrentMedia":"$contextExt.CurrentMedia"
            }
         }
]
return returnJSON;
}
			
function GetlastActionxAPIJSON(learnermbox,lessonmbox,Limit){
	returnJSON=[
		{"$match": {
			"$and":[
						{"statement.verb.id":"https://app.skoonline.org/ITSProfile/action"},
						{"statement.actor.mbox":learnermbox},
						{"statement.object.mbox":lessonmbox}

					]
					}
			},					
			{"$sort":{"statement.timestamp":-1
					}
				}, 
			{"$limit":Limit},
			{"$project":{
					"agent":"$statement.actor.mbox",                     
					"lesson":"$statement.object.mbox",
					"Ext":"$statement.result.extensions.https://app.skoonline.org/ITSProfile/CSAL/Result"
			}},
			{"$project":{
					"agent":"$statement.actor.mbox",                     
					"lesson":"$statement.object.mbox",
					"MediaUrl":"$Ext.MediaUrl",
					 "input":{
						"repeatTimes":"$Ext.repeatTimes",
						"userAnswerSpendTime":"$Ext.userAnswerSpendTime",
						"MediaUrl":"$Ext.MediaUrl",
						"userSelectedItem":"$Ext.userSelectedItem",
						"userInput":"$Ext.userInput",
						"replayVideoTimes":"$Ext.replayVideoTimes",
						"pageStartTimestamp":"$Ext.pageStartTimestamp",
						"Type":"$Ext.Type",
						"questionID":"$Ext.questionID",
						"questionLevel":"$Ext.questionLevel",
						"progressBarValue":"$Ext.progressBarValue",
						"notCountedItem":"$Ext.notCountedItem"
					}
					}
			},
			{"$group":{
					   "_id":"$MediaUrl",
					   "lastEntry":{"$first":"$input"}
				 }
			}    
	]
	return returnJSON;
}


