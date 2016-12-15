"use-strict";

var STORAGE_KEY = "CordovaDroid-pada0008"

var janki = {
    
	pages: [],
    links: [],
    
    // Application Constructor
    initialize: function() {
       // document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this), false);   
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
        
        this.setUpClickEvents();
		
		if (localStorage.getItem(STORAGE_KEY)) {

			janki.setUpHtmlData();
			
        }else{
			
			janki.fetchData();
		}
    },
    
    reload: function(){
        janki.fetchData();
    },
    
    setUpClickEvents: function(){
      
        janki.pages = document.querySelectorAll('[data-role="page"]');
        janki.links =document.querySelectorAll('[data-role="links"]');
        
        janki.pages[0].className = "active";
        janki.links[0].className = "active";
        
         [].forEach.call(janki.links, function(item){
          item.addEventListener("click", janki.navigateTapped);
          console.log(item.href);
        });
    },

    navigateTapped : function(ev){
      
            ev.preventDefault();  //stop the link from doing anything
            console.log("clicked");
            var item = ev.currentTarget;  //the anchor tag
            var href = item.href;  //the href attribute
            var id = href.split("#")[1];  //just the letter to the right of "#"

            [].forEach.call(janki.pages, function(item){
              if( item.id == id){
                item.className = "active";
              }else{
                item.className = "";
              }
            });
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
	
	fetchData : function(){		
		
		"use strict";
		//ev.preventDefault();
	  let req = new Request("https://griffis.edumedia.ca/mad9014/sports/cricket.php");
	  let opts = { method: 'post',
				   mode: 'cors'};

	  fetch(req, opts)
		.then(function(response){
		  //this runs when the response comes from the-data.json
		  //the form data was sent
		  //the request was made with a CORS preflight request
		  console.log("response from server ", response.status);
		  return response.json();
		})
		.then(function(data){
		  //data will be the parsed json data returned from the fetch
		  
		  console.log("data ", data.scores);
		  //Set local storage data
		  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		  
		  janki.setUpHtmlData();
		  
		})
		.catch(function(err){
		  console.log("ERROR: ", err.message );
		});		
	},
	
	reloadPage: function(){
		
		window.location.reload();
		//location.reload();
		
	},
	setUpHtmlData: function(){
		
		var sportsData = JSON.parse(localStorage.getItem(STORAGE_KEY));
		
		var scores = sportsData.scores;
		var teams = sportsData.teams;
		
		//Set up team variable
		for (i = 0; i < teams.length; i++) {
		
			var item = teams[i];
			item.win = 0;
			item.loss = 0;
			item.tie = 0;
			item.point = 0;
		}
		
		var gameSchedule = {};
		var date = [];
				
		//Sort by date
		scores.sort( function(a, b){
		
			"use strict";
			let dateA = new Date(a.date);
			let dateB = new Date(b.date);
			
		  if( dateA < dateB ){
			return 1;
		  }
		  return 0;
		});
		
		var gameScheduleHTML = "";
		
		for (i = 0; i < scores.length; i++) {
		
			var item = scores[i];			
			gameScheduleHTML += '<tr style=\'background-color:darkgrey;\'><th colspan=\'3\'>'+item.date+'</th></tr>';

			gameScheduleHTML += "<tr style=\"width:100px\">";
			
			var tdText = "";
			
			for (j = 0; j < item.games.length; j++) {
		
				var game = item.games[j];
								
				var away = teams.filter(function( obj ) {
				 	return obj.id == game.away;
				});

				var home = teams.filter(function( obj ) {
				 	return obj.id == game.home;
				});
				
				//Scores
				var home_score = game.home_score;
				var away_score = game.away_score;
				
				var home_score_new = home_score.split("-")[0];
				var away_score_new = away_score.split("-")[0];
				
				if(home_score_new > away_score_new){
					
					home[0].win += 1;
					home[0].point += 5;
					
					away[0].loss += 1;
					
				}else if(home_score_new < away_score_new){
					
					away[0].win += 1;
					away[0].point += 5;
					
					home[0].loss += 1;
					
				}else{
					
					home[0].tie += 1;
					away[0].tie += 1;
				}
				
				var home_name = home[0].name;
				var home_icon = "img/"+home_name.replace(" ", "")+".png"
				
				var away_name = away[0].name;
				var away_icon = "img/"+away_name.replace(" ", "")+".png"
				
			tdText = "<td style=\"width:47%\"><div style=\"text-align: center;\"><div style=\"width: 90%; padding:10px; height:75px; margin: 0 auto; color: #000;\"><img src=\""+home_icon+ "\" alt=\"logo\" width=\"35\" height=\"35\"><p style=\"text-align:center;\">"+home_name+"</p></div></div></td><td style=\"width:6%\"><div style=\"text-align: center;\"><div style=\"width: 90%; padding:10px; height:40px; margin: 0 auto; color: #000;\"><p style=\"text-align:center;\"> Vs</p></div></div></td><td style=\"width:47%\"><div style=\"text-align: center;\"><div style=\"width: 90%; padding:10px; height:75px; margin: 0 auto; color: #000;\"><img src=\""+away_icon+ "\" alt=\"logo\" width=\"35\" height=\"35\"><p style=\"text-align:center;\">" +away_name+"</p></div></div></td>";
				
			}
			
			gameScheduleHTML += tdText +"</tr>"
		}
				
		console.log(sportsData);
         //convert from String to Array
		
		document.querySelector("#gameschedule").innerHTML = gameScheduleHTML;
		  //randomly add one of the names from the JSON to the output paragraph
		
		var gameScoreHTML = "<tr style=\"background-color:darkgrey;\"><th style=\"width:60%;color: #fff;\">Team</th><th style=\"width:10%;color: #fff;\">W</th><th style=\"width:10%;color: #fff;\">L</th><th style=\"width:10%;color: #fff;\">T</th><th style=\"width:10%;color: #fff;\">P</th></tr>";
		
		for (i = 0; i < teams.length; i++) {
		
			var item = teams[i];	
			var team_name = item.name;
			//team_name = team_name.replace(" ", "");
			
			var team_icon = "img/"+team_name.replace(" ", "")+".png"
			//var team_icon = "img/KolkataKnightRiders.png"
			
			gameScoreHTML += "<tr><td style=\"width:60%;color: #000;\"><p> <img src=\""+team_icon+"\" width=\"50\" height=\"50\" align=\"middle\"style=\"display: inline-block; margin-right:5px;\">"+team_name+"</p></td><td style=\"width:10%; text-align:center;color: #000;\">"+item.win+"</td><td style=\"width:10%;color: #000;text-align:center;\">"+item.loss+"</td><td style=\"width:10%;color: #000;text-align:center;\">"+item.tie+"</td><td style=\"width:10%;color: #000;text-align:center;\">"+item.point+"</td></tr>";
		}
				
		document.querySelector("#gamescore").innerHTML = gameScoreHTML;
		
		}
};
document.getElementById("Reload-btn").addEventListener("click",janki.reload);


