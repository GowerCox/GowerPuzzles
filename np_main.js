var loggerOn;
var onASmartPhone;
var seaLevelReferences;
var LFLevelReferences;
var airLevelReferences;
var seaEmojiList;
var LFEmojiList;
var airEmojiList;
var secretEmojiList;
var currentScore;
var possibleThrowAwayScore;
var gameState;
var stateTransitionMap;
var trayEmojiCount;
var fullETSequence;
var currentTurnPointValue;
var currentLevel;
var matchesToGoForCurrentLevel;
var levelTriesRemaining;


/* **************************************** */
document.addEventListener("DOMContentLoaded", (event) => {
	loggerOn = true;
	beginning();
});
	
/* **************************************** */
function logger( m ) {
	if ( loggerOn ) { console.log(m); }
}

/* **************************************** */
function beginning() {
	whatAmIRunningOn();
	initialiseVariables();
	displayWelcomeScreen();
	welcomeMessage()
}

/* **************************************** */
function whatAmIRunningOn() {
	
	let OSPQuery = window.matchMedia("(pointer: coarse)");
	onASmartPhone = OSPQuery.matches;
	
	/*  This does not work on Safari
	OSPQuery.addEventListener("change", (e) => {
		onASmartPhone = e.matches;
	});
	*/
}

/* **************************************** */
function initialiseVariables() {
	
	seaLevelReferences 	= ["pl3_1", "pl3_2", "pl3_3"];
	LFLevelReferences 	= ["pl2_1", "pl2_2"];
	airLevelReferences 	= ["pl1_1"];
	
	seaEmojiList = 
		[ "&#128051", "&#128056", "&#128044", "&#128032","&#128031", "&#129416", "&#128025", "&#128026"];
	LFEmojiList = 
		[ "&#128024", "&#128043", "&#128063", "&#128014","&#128021", "&#128007", "&#128005", "&#129426" ];
	airEmojiList = 
		[ "&#129413", "&#128330", "&#129414", "&#129417", "&#129419", "&#128029", "&#128030", "&#129415" ];

	initialiseSMMap();
	
	fullETSequence = [
		    [ -1, function() { move2(); } ],
		    [ -1, function() { move3(); } ],
		    [ -1, function() { move4(); } ],
		    [ -1, function() { move5(); } ],
		    [ -1, function() { move6(); } ],
		    [ -1, function() { move7(); } ],
		    [ -1, function() { move8(); } ]
	];
	

	forReinitialisationToo();
}


/* **************************************** */
function forReinitialisationToo() {
	
	currentScore = 0;
	possibleThrowAwayScore = 0;
	let RBElement = document.getElementById("reButton");
	RBElement.disabled = true;
	RBElement.innerHTML = "Reset";
	gameState = "settingUpBoard";
	trayEmojiCount = 8;
	currentTurnPointValue = 1;
	currentLevel = "pl3";
	levelTriesRemaining = 4;
	document.getElementById("retriesField").innerHTML = levelTriesRemaining;
	document.getElementById("ETLabel").innerHTML = "Select from these emojis";
	
}

/* **************************************** */
function move2() { moveEmoji( document.getElementById( "emojiTraySlot1" ), "ETAnimate2" );}
function move3() { moveEmoji( document.getElementById( "emojiTraySlot2" ), "ETAnimate3" );}
function move4() { moveEmoji( document.getElementById( "emojiTraySlot3" ), "ETAnimate4" );}
function move5() { moveEmoji( document.getElementById( "emojiTraySlot4" ), "ETAnimate5" );}
function move6() { moveEmoji( document.getElementById( "emojiTraySlot5" ), "ETAnimate6" );}
function move7() { moveEmoji( document.getElementById( "emojiTraySlot6" ), "ETAnimate7" );}
function move8() { moveEmoji( document.getElementById( "emojiTraySlot7" ), "ETAnimate8" );}
function specialCaseOfLast(trayEmojiID) { document.getElementById( trayEmojiID ).innerHTML = ""; }

function moveEmoji( previousEmoji, animateClass ) {

	let currentEmoji = previousEmoji.nextElementSibling;
	currentEmoji.classList.add( animateClass );
	
	currentEmoji.addEventListener("animationend", 
		function currentAnimator(e) {
			previousEmoji.innerHTML = currentEmoji.innerHTML;
			this.innerHTML = "";
			this.classList.remove( animateClass );
			this.getAnimations().forEach((anim) => { anim.cancel(); });	
			this.removeEventListener('animationend', currentAnimator);
			}
	 	);
}


/* **************************************** */
function displayWelcomeScreen() {
	document.getElementById( "welcomeScreen" ).classList.remove( "renderInvisible");
}

/* **************************************** */
function welcomeMessage() {
	sloganList = 
	  [ "Be kind to animals", 
	    "Save the whales", 
	    "Protect all animal species",
	    "Animals are our friends",
	    "Love all creatures big and small",
	    "Earth belongs to animals too",
	    "Don't abuse animals",
	    "Love your dog, cat, coelacanth, and dodo"];
	    
		let outOf = sloganList.length;
		let randomIndex = Math.floor(Math.random() * outOf);
		document.getElementById("sloganSpan").innerHTML = sloganList[randomIndex];
	    
}

/* **************************************** */
function displayInstructionsMC() {
	
	if ( !onASmartPhone ) {
		displayInstructions();
	}
}
function displayInstructionsT() {
	
	if ( onASmartPhone ) {
		displayInstructions();
	}
}
function displayInstructions() {
	
	var userAction = "click ";
	var ua2 = "Click";
	if ( onASmartPhone ) { 
		userAction = "touch "; 
		ua2 = "Touch";
	}
	
	let instructionText = "<br>HELLO.<br>" +
	"This game has three of Nature's Levels.<br>" +
	"Sea Level, Land/Forest Level, and Air Level.<br>" +
	"The game starts at Sea Level and " +
	"progresses upward through Nature's Pyramid. " +
	"In the emoji tray at the bottom, " + userAction +
	" an emoji.  You will hopefully match one of the " +
	"secret emojis on the active level.  If you do, you " +
	"will acquire the match point value for the current level. " +
	"If you don't match, you lose a point.  The " +
	"point values are: 1 point for Sea Level, 2 points for " +
	"Land/Forest Level, and 3 points for Air Level. " +
	"You are allowed 4 level retries: that's for when a level is " +
	"complete, you can take a chance to 'leave it' and play that " + 
	"same level again." +
	"<br>GOOD LUCK!!!<br>" +
	"(" + ua2 + " anywhere to dismiss this message.)";
	
	document.getElementById("instructionDescriptionSpan").innerHTML = instructionText;
	document.getElementById( "instructionOverlay" ).classList.remove( "renderInvisible");
}


/* **************************************** */
function closeInstructionOverlayMC() {
	
	if ( !onASmartPhone ) {
		closeInstructionOverlay();
	}
}
function closeInstructionOverlayT() {
	
	if ( onASmartPhone ) {
		closeInstructionOverlay();
	}
}
function closeInstructionOverlay() {
	
	document.getElementById( "instructionOverlay" ).classList.add( "renderInvisible");
}

/* **************************************** */
function enactPlayMC() {
	
	if ( !onASmartPhone ) {
		enactPlay();
	}
}
function enactPlayT() {
	
	if ( onASmartPhone ) {
		enactPlay();
	}
}

function enactPlay() {
	
	document.getElementById( "welcomeScreen" ).classList.add( "renderInvisible");
	document.getElementById( "titleContainer" ).classList.remove( "renderInvisible");
	document.getElementById( "mainPyramid" ).classList.remove( "renderInvisible");
	initialisePyramid();
}

/* **************************************** */
function initialisePyramid() {
	
	let sequence = [
		[ 250, function() { 
			createSecretEmojiList( "Sea" );
			setUpLevel( "Sea" );
			}],
		[ 700, function() { setUpBottomBoard( "Sea" ); }]

	 ];
  
    scheduleUtilities.runSequence( sequence );	
	
}

/* **************************************** */
function setUpLevel( whichLevel ) {
	
	let toUse;
	
	if ( whichLevel == "Sea") {
		toUse = seaLevelReferences;
		matchesToGoForCurrentLevel = 3;
		document.getElementById( "pl3LevelLabel" ).classList.remove("renderInvisible");
	}
	else if ( whichLevel == "LF") {
		toUse = LFLevelReferences;
		matchesToGoForCurrentLevel = 2;
		document.getElementById( "pl2LevelLabel" ).classList.remove("renderInvisible");
	}
	else if ( whichLevel == "Air") {
		toUse = airLevelReferences;
		matchesToGoForCurrentLevel = 1;
		document.getElementById( "pl1LevelLabel" ).classList.remove("renderInvisible");
	}
	
	let fullSequence = [];
	var t = 80;
	
	toUse.forEach( ( emojiID ) => {
		let f = function() {
			let emoji = document.getElementById( emojiID );
			emoji.innerHTML = "";
			emoji.classList.add( "emojiSlot" );
			emoji.classList.remove("renderInvisible");
		};
		let sequenceItem = [ t, f ];
		fullSequence.push( sequenceItem );
		t += 100;
	});
	
	t+=10;
	
	let completionAnnouncementFunction = function() { updateMapTrigger( "settingUpBoard", "levelSetupComplete", true ); };
	let completionAnnouncement = [ t, completionAnnouncementFunction ];
	fullSequence.push( completionAnnouncement );

	scheduleUtilities.runSequence( fullSequence );
}

/* **************************************** */
function createSecretEmojiList( whichLevel ) {
	
	let toUse;
	let count;
	
	if ( whichLevel == "Sea") {
		toUse = seaEmojiList;
		count = 3;
	}
	else if ( whichLevel == "LF") {
		toUse = LFEmojiList;
		count = 2;
	}
	else if ( whichLevel == "Air") {
		toUse = airEmojiList;
		count = 1;
	}
	
	let ELCopy = toUse.slice();
	let newList = [];
		
	for (let i = 0; i < count; i++) {
		let outOf = ELCopy.length;
		let randomSelection = Math.floor(Math.random() * outOf);
		newList.push( ELCopy[randomSelection] );
		  
		const temp = ELCopy[randomSelection];
		ELCopy[randomSelection] = ELCopy[ELCopy.length-1];
		ELCopy[ELCopy.length-1] = temp;
		ELCopy.pop();
	}	
		
	/* Save the set */
	secretEmojiList = newList.slice();	
	
}
/* **************************************** */
function setUpBottomBoard( whichLevel ) {
	
	document.getElementById("bottomBoard").classList.remove( "renderInvisible");
	populateEmojiTray( whichLevel );
}

/* **************************************** */
function populateEmojiTray( whichLevel ) {
	
	let toUse;
	
	if ( whichLevel == "Sea") {
		toUse = seaEmojiList;
	}
	else if ( whichLevel == "LF") {
		toUse = LFEmojiList;
	}
	else if ( whichLevel == "Air") {
		toUse = airEmojiList;
	}
	
	let ETPrefix = "emojiTray";
	
	
	var emojiSetupSequence = [
	    [ 150, function() { document.getElementById(ETPrefix + "Slot1").innerHTML = toUse[0] }  ],
	    [ 300, function() { document.getElementById(ETPrefix + "Slot2").innerHTML = toUse[1] }  ],
	    [ 450, function() { document.getElementById(ETPrefix + "Slot3").innerHTML = toUse[2] }  ],
	    [ 600, function() { document.getElementById(ETPrefix + "Slot4").innerHTML = toUse[3] }  ],
	    [ 750, function() { document.getElementById(ETPrefix + "Slot5").innerHTML = toUse[4] }  ],
	    [ 900, function() { document.getElementById(ETPrefix + "Slot6").innerHTML = toUse[5] }  ],
	    [ 1050, function() { document.getElementById(ETPrefix + "Slot7").innerHTML = toUse[6] }  ],
	    [ 1200, function() { document.getElementById(ETPrefix + "Slot8").innerHTML = toUse[7] }  ],
	    [ 1210, function() { 
			updateMapTrigger( "settingUpBoard", "emojiTraySetupComplete", true );
			}]
	];
	
	scheduleUtilities.runSequence( emojiSetupSequence );	
}


/* **************************************** */
function initialiseSMMap() {
	
	let tsm1 = {
		"triggers" : [
			{ "trigger" : "levelSetupComplete", "value" : false },
			{ "trigger" : "emojiTraySetupComplete", "value" : false }
		],
		"todo": function() {
			gameState = "readyForUserClick";
			document.getElementById("reButton").disabled = false;
			document.getElementById("scoreField").innerHTML = currentScore;
		}
	};
	
	let tsm2 = {
		"triggers" : [
			{ "trigger" : "emojiSpinComplete", "value" : false },
			{ "trigger" : "endOfmojiAdvancement", "value" : false }
		],
		"todo": function() {
			gameState = "checkingEndOfLevelLogic";
			checkEndLevelLogic();
		}
	};
	
	stateTransitionMap = new Map();
	stateTransitionMap.set("settingUpBoard", tsm1 );
	stateTransitionMap.set("processingMatch", tsm2 );
	
}

function updateMapTrigger( state, trigger, value ) {
	
	logger(`updateMapTrigger ${state}  ${trigger}  ${value}`);
	
	let tItem = stateTransitionMap.get( state )["triggers"];
	let updateMe = tItem.find(u => u.trigger === trigger);
	updateMe.value = value;
	checkStateMap(state);
}
function checkStateMap(state) {
	
	let triggers = stateTransitionMap.get( state )["triggers"];
	let assumedAllTrue = true;
	triggers.forEach( trigger => {
  		if ( trigger.value == false ) {
			assumedAllTrue = false;
			// break; is not allowed in a foreach.  Ok to leave out.
		}
	});
	
	if ( assumedAllTrue ) {
		let f = stateTransitionMap.get( state )["todo"];
		
		triggers.forEach( trigger => {
	  		trigger.value = false;
			});
			
		f();
	}
	
}

/* **************************************** */
function emojiClickMC( whichEmoji ) {
	
	if ( !onASmartPhone ) {
		emojiClick( whichEmoji );
	}
}
function emojiClickT( whichEmoji ) {
	
	if ( onASmartPhone ) {
		emojiClick( whichEmoji );
	}
}

function emojiClick( whichEmoji ) {
	
	let regexp = /\d/;
	let eliminateTrayPosition = parseInt( whichEmoji.id.match(regexp)[0] );
	
	if ( eliminateTrayPosition > trayEmojiCount || gameState != "readyForUserClick" ) {
		return;
	}
	
	document.getElementById("reButton").disabled = true;

	if ( gameState == "readyForUserClick" ) {
		
		gameState = "processingUserClick";
		
		clickGraphic( whichEmoji );
		
		let hexEmoji = document.getElementById( whichEmoji.id ).innerHTML.codePointAt(0).toString(16);
		let UCEmojiString = "&#" + parseInt(hexEmoji, 16);
		
		let assumedMatch = false;
		
		for (let i = 0; i < secretEmojiList.length; i++) {
			if ( UCEmojiString == secretEmojiList[i] )  {
				assumedMatch = true;
				
				gameState = "processingMatch";
				gotAMatchSequence( (i+1), UCEmojiString );
				break;
			}
		
		}
		if ( !assumedMatch ) {
			gameState = "processingNoMatch";
			dontGotAMatchSequence();
		}
	}
}


/* **************************************** */
function clickGraphic( clickedEmoji ) {
	
	let regexp = /\d/;
	let eliminateTrayPosition = parseInt( clickedEmoji.id.match(regexp)[0] );
	
  	let emojiEnhanceSequence = [
		[ 150, function() { expandEmoji( clickedEmoji ); }  ],
		[ 300, function() { unexpandEmoji( clickedEmoji ); }  ],
		[ 450, function() { expandEmoji( clickedEmoji ); } ],
		[ 600, function() { unexpandEmoji( clickedEmoji ); } ],
		[ 750, function() { expandEmoji( clickedEmoji ); } ],
		[ 900, function() { unexpandEmoji( clickedEmoji ); }  ],
		[ 930, function() { advanceEmojis( eliminateTrayPosition ); }  ]
	];

 	scheduleUtilities.runSequence( emojiEnhanceSequence );
}

function expandEmoji( who ) {
		who.classList.remove( "emojiTrayDesc" );
		who.classList.add( "emojiTrayDescExpanded" );
}
function unexpandEmoji( who ) {
		who.classList.remove( "emojiTrayDescExpanded" );
		who.classList.add( "emojiTrayDesc" );
}

function advanceEmojis( eliminateTrayPosition ) {
		
	let ETAnimationSequence = [];
	
	let currentDelta;
	let deltaIncrement;
		
	if ( eliminateTrayPosition < trayEmojiCount ) {
		
		let sliceStart = (eliminateTrayPosition-1);
		let sliceEnd = (trayEmojiCount-1);
		currentDelta = 300;
		deltaIncrement = 300;
			
		ETAnimationSequence = fullETSequence.slice( sliceStart, sliceEnd );
		
		for (let i = 0; i < (sliceEnd-sliceStart); i++) {
				ETAnimationSequence[i][0] = currentDelta;
				currentDelta += deltaIncrement;
			}
	
		let endOfEmojiAdvancement = function() {
			logger( "DONE with advanceEmojis");
			updateMapTrigger( "processingMatch", "endOfmojiAdvancement", true );
			};
		let EOEEntry = [ currentDelta, endOfEmojiAdvancement ];
		ETAnimationSequence.push( EOEEntry );
		
		}
	else if ( eliminateTrayPosition == trayEmojiCount ) {
	
		let trayEmojiID = "emojiTraySlot" + trayEmojiCount;
		let f1 = function() { specialCaseOfLast( trayEmojiID ) };
	    let entry1 = [ deltaIncrement, f1 ];
		ETAnimationSequence.push( entry1 );
		
		let endOfEmojiAdvancement = function() {
			logger( "DONE with advanceEmojis");
			updateMapTrigger( "processingMatch", "endOfmojiAdvancement", true );
			};
		let EOEEntry = [ currentDelta, endOfEmojiAdvancement ];
		ETAnimationSequence.push( EOEEntry );
	}
			
	scheduleUtilities.runSequence( ETAnimationSequence );
	trayEmojiCount--;		
}

/* **************************************** */
function gotAMatchSequence( slotSuffix, emoji ) {
	logger("gotAMatchSequence");
	
	currentScore += currentTurnPointValue;
	possibleThrowAwayScore += currentTurnPointValue;
	matchesToGoForCurrentLevel--;
	
	let msgContainer = document.getElementById("pointsFlasher");
	
	let msgElement = document.getElementById("PFMessage");
	msgElement.classList.add( "match" );
	
	msgElement.innerHTML = `You have a match!!!<br>Gain ${currentTurnPointValue} points!!!`;
	if ( currentTurnPointValue == 1 ) { 
		msgElement.innerHTML = `You have a match!!!<br>Gain ${currentTurnPointValue} point!!!`;
	}
	
	let emojiId = currentLevel + "_" + slotSuffix;
	let levelEmojiItself = document.getElementById(emojiId);
	
	let messageSequence = [
		[ 500, function() { msgContainer.classList.remove( "renderInvisible" ); }  ],
		[ 1700, function() { 
			msgContainer.classList.add( "renderInvisible" );
			msgElement.classList.remove( "match" );
			updateScore();
			}],
	    [ 1710, function() {
			  levelEmojiItself.classList.add("emojiSlotSpin");
			  levelEmojiItself.addEventListener("animationend", 
				function currentAnimator() {
					this.classList.remove( "emojiSlot" );
					this.innerHTML = emoji;
					this.classList.remove( "emojiSlotSpin" );
					this.getAnimations().forEach((anim) => { anim.cancel(); });	
					this.removeEventListener('animationend', currentAnimator);
					updateMapTrigger( "processingMatch", "emojiSpinComplete", true );
				}
	 		);
		}],
	];

 	scheduleUtilities.runSequence( messageSequence );
	
}

function dontGotAMatchSequence() {
	
	currentScore -= 1;
	possibleThrowAwayScore -= 1;
	
	let msgContainer = document.getElementById("pointsFlasher");
	
	let msgElement = document.getElementById("PFMessage");
	msgElement.classList.add( "noMatch" );
	
	msgElement.innerHTML = "Sorry, no match.<br>Lose 1 point";
	
	let messageSequence = [
		[ 500, function() { msgContainer.classList.remove( "renderInvisible" ); }  ],
		[ 1700, function() { 
			msgContainer.classList.add( "renderInvisible" );
			msgElement.classList.remove( "noMatch" );
			updateScore();
			gameState = "readyForUserClick";
			document.getElementById("reButton").disabled = false;
			}]
	];

 	scheduleUtilities.runSequence( messageSequence );
}

/* **************************************** */
function updateScore() {
	
	let scoreElement = document.getElementById("scoreField");
	scoreElement.innerHTML = currentScore;
	
	if ( currentScore < 0 ) {
		scoreElement.classList.remove( "scoreFieldWhite" );
		scoreElement.classList.add( "scoreFieldRed" );
	}
	else {
		scoreElement.classList.remove( "scoreFieldRed" );
		scoreElement.classList.add( "scoreFieldWhite" );
	}
	
}

/* **************************************** */
function checkEndLevelLogic() {
	
	if ( matchesToGoForCurrentLevel > 0 ) {
		/* Allow for next turn at same level */
		gameState = "readyForUserClick";
		document.getElementById("reButton").disabled = false;
	}
	else if ( (matchesToGoForCurrentLevel == 0) && (levelTriesRemaining > 0) ) {
		/* Popup and allow either level's takeit or leaveit */
		let waitForPopupSequence = [
			[ 650, function() { enactOptionPopup(); }  ]
		];

 		scheduleUtilities.runSequence( waitForPopupSequence );
		
	}
	else if ( (matchesToGoForCurrentLevel == 0) && (levelTriesRemaining == 0) && (currentLevel == "pl1") ) {
		/* Game over */
		gameOver();
	}
	else if ( (matchesToGoForCurrentLevel == 0) && (levelTriesRemaining == 0) && (currentLevel != "pl1") ) {
		
		mandatoryLevelAdvancement();
	}
}

function gameOver() {
	
	gameState = "gameOver";
	
	/* Reuse same popup */
	let GOMsg = `GAME OVER!!!<br>Your score is ${currentScore}`;
	document.getElementById("ALMsg").innerHTML = GOMsg
		
	let gameOverSequence = [
		[ 150, function() {
			document.getElementById("TLOption").classList.add( "renderInvisible" );
			document.getElementById("advanceLevelPopup").classList.remove( "renderInvisible" );
			}],
		[ 1800, function() { document.getElementById("advanceLevelPopup").classList.add( "renderInvisible" ); }  ],
		[ 1850, function() {
			document.getElementById("reButton").innerHTML = "Replay";
			document.getElementById("ETLabel").innerHTML = "Game Over";
			document.getElementById("reButton").disabled = false;
			}]
	];

 	scheduleUtilities.runSequence( gameOverSequence );
	
}


function mandatoryLevelAdvancement() {
	
	document.getElementById("ALMsg").innerHTML = 
		"No more retries.<br>Advancing to next level.";
		
	if ( currentLevel == "pl3" ) {
		currentLevel = "pl2";
	}
	else if ( currentLevel == "pl2" ) {
		currentLevel = "pl1";
	}
	
	let advanceAnywaySequence = [
		[ 150, function() {
			document.getElementById("advanceLevelPopup").classList.remove( "renderInvisible" );
			}],
		[ 1600, function() { document.getElementById("advanceLevelPopup").classList.add( "renderInvisible" ); }  ],
		[ 1700, function() { advanceToNextLevel(); }  ]
	];

 	scheduleUtilities.runSequence( advanceAnywaySequence );
	
}

function enactOptionPopup() {
	
	document.getElementById("TLOption").classList.remove( "renderInvisible" );
	
	/* Take it message */
	let phrase1;
	if ( possibleThrowAwayScore > 1 ) {
		phrase1 = `keep the ${possibleThrowAwayScore} points`;
	}
	else if ( possibleThrowAwayScore == 1 ) {
		phrase1 = `keep the ${possibleThrowAwayScore} point`;
	}
	else if ( possibleThrowAwayScore == 0 ) {
		phrase1 = `gain/lose no points`;
	}
	else if ( possibleThrowAwayScore == -1 ) {
		phrase1 = `keep the loss of ${(-1*possibleThrowAwayScore)} point`;
	}
	else if ( possibleThrowAwayScore < -1 ) {
		phrase1 = `keep the loss of ${(-1*possibleThrowAwayScore)} points`;
	}
	
	let fullTIPhrase = `&bull;  Take it and ${phrase1}`;
	document.getElementById("TIMsg").innerHTML = fullTIPhrase;
	
	/* Leave it message */
	let levelOriginalScore = currentScore - possibleThrowAwayScore;
	let fullLIPhrase;
	let phrase2;
	if ( levelTriesRemaining > 2 ) {
		fullLIPhrase = `&bull;  If you leave it, you'll revert to score ${levelOriginalScore}. ` +
		`And you will have ${(levelTriesRemaining-1)} retries remaining`;
	}
	else if ( levelTriesRemaining == 2 ) {
		fullLIPhrase = `&bull;  If you leave it, you'll revert to score ${levelOriginalScore}. ` +
		`And you will have 1 retry remaining`;
	}
	else if ( levelTriesRemaining == 1 ) {
		fullLIPhrase = `&bull;  If you leave it, you'll revert to score ${levelOriginalScore}. ` +
		`And you will have no retries remaining`;
	}
	
	document.getElementById("LIMsg").innerHTML = fullLIPhrase;
	
}

/* **************************************** */
function takeItMC() {
	
	if ( !onASmartPhone ) {
		takeIt();
	}
}
function takeItT() {
	
	if ( onASmartPhone ) {
		takeIt();
	}
}
function takeIt() {
	
	if ( currentLevel == "pl1" ) {
		gameOver();
	}
    else {
		let nextLevelWord;
		let nextLevelSetup;
		if ( currentLevel == "pl3" ) {
			currentLevel = "pl2";
			nextLevelWord = "Land/Forest";
		}
		else if ( currentLevel == "pl2" ) {
			currentLevel = "pl1";
			nextLevelWord = "Air";
		}
		
		let welcomePhrase = `Advancing to ${nextLevelWord} Level`;
		document.getElementById("ALMsg").innerHTML = welcomePhrase;
		
		let takeItSequence = [
			[ 150, function() { 
				document.getElementById("TLOption").classList.add( "renderInvisible" );
				document.getElementById("advanceLevelPopup").classList.remove( "renderInvisible" );
				}],
			[ 1600, function() { document.getElementById("advanceLevelPopup").classList.add( "renderInvisible" ); }  ],
			[ 1700, function() { advanceToNextLevel(); }  ]
		];
	
	 	scheduleUtilities.runSequence( takeItSequence );
 	}
}

function advanceToNextLevel() {
	
	possibleThrowAwayScore = 0;
	trayEmojiCount = 8;
	
	let toUse;
	if ( currentLevel == "pl2") {
		toUse = "LF";
		currentTurnPointValue = 2;
	}
	else if ( currentLevel == "pl1") {
		toUse = "Air";
		currentTurnPointValue = 3;
	}
	
	let setupSequence = [
		[ 150, function() { unsetEmojiTray(); }],
		[ 200, function() { 
			setUpLevel( toUse );
			populateEmojiTray( toUse );
			createSecretEmojiList( toUse );
			}]
	];

 	scheduleUtilities.runSequence( setupSequence );
	
}
function unsetEmojiTray() {
	
	for ( let i=1; i<=8; i++) {
		document.getElementById( "emojiTraySlot" + i ).innerHTML = "";
	}	
}	

/* **************************************** */
function leaveItMC() {
	
	if ( !onASmartPhone ) {
		leaveIt();
	}
}
function leaveItT() {
	
	if ( onASmartPhone ) {
		leaveIt();
	}
}
function leaveIt() {
	
	levelTriesRemaining--;
	document.getElementById("retriesField").innerHTML = levelTriesRemaining;
	
	let message2;
	if ( levelTriesRemaining == 0 ) {
		message2 = "You have no more retries remaining";
	}
	else if ( levelTriesRemaining == 1 ) {
		message2 = "You have 1 retry remaining";
	}
	else if ( levelTriesRemaining > 1 ) {
		message2 = `You have ${levelTriesRemaining} retries remaining`;
	}
	
	let levelStartScore = currentScore - possibleThrowAwayScore;
	let LIMsg = `Reverting back to score ${levelStartScore}<br>${message2}`;
	
	let LIPopupElement = document.getElementById( "leaveItPopup" );
	document.getElementById( "LIPMsg" ).innerHTML = LIMsg;
	
	
	let toUse;
	if ( currentLevel == "pl2") {
		toUse = "LF";
	}
	else if ( currentLevel == "pl1") {
		toUse = "Air";
	}
	else if ( currentLevel == "pl3") {
		toUse = "Sea";
	}
	
	currentScore -= possibleThrowAwayScore;
	possibleThrowAwayScore = 0;
	 
	let leaveItSequence = [
		[ 150, function() { 
			document.getElementById( "TLOption" ).classList.add( "renderInvisible" );
			LIPopupElement.classList.remove( "renderInvisible" );
			 }],
		[ 1950, function() { LIPopupElement.classList.add( "renderInvisible" ); }],
		[ 2250, function() {
			unsetLevel( toUse );
			unsetEmojiTray();
			updateScore();
			trayEmojiCount = 8;
			}],
		[ 2500, function() {
			setUpLevel( toUse );
			populateEmojiTray( toUse );
			createSecretEmojiList( toUse );
			}]
	];

 	scheduleUtilities.runSequence( leaveItSequence );	

}

function unsetLevel( whichLevel ) {
	
	let toUse;
	
	if ( whichLevel == "Sea") {
		toUse = seaLevelReferences;
	}
	else if ( whichLevel == "LF") {
		toUse = LFLevelReferences;
	}
	else if ( whichLevel == "Air") {
		toUse = airLevelReferences;
	}
	
	toUse.forEach( ( emojiID ) => {
		let emoji = document.getElementById( emojiID );
		emoji.innerHTML = "";
		emoji.classList.remove( "emojiSlot" );
	});
	
}

/* **************************************** */	
function resetMC() {
	
	if ( !onASmartPhone ) {
		reset();
	}
}
function resetT() {
	
	if ( onASmartPhone ) {
		reset();
	}
}
function reset() {
	
	gameState = "resetting"
	
	let resetSequence = [
		[ 10, function() { document.getElementById("ETLabel").innerHTML = "Resetting..."; }],
		[ 210, function() { clearAllLevels(); }],
		[ 400, function() { unsetEmojiTray(); }],
		[ 1200, function() { 
			forReinitialisationToo();
			updateScore();
			}],
		[ 1220, function() { initialisePyramid(); }]
	];

 	scheduleUtilities.runSequence( resetSequence );
	
}
function clearAllLevels() {
	
	let masterClearList = [ seaLevelReferences, LFLevelReferences, airLevelReferences];
	masterClearList.forEach(( eIDs ) => {
  		eIDs.forEach(( eID ) => {
  			let currentElement = document.getElementById( eID );
  			currentElement.innerHTML = "";
  			currentElement.classList.remove( "eCommon2" );
  			currentElement.classList.remove( "eCommon3" );
  			currentElement.classList.add( "renderInvisible" );
  			currentElement.classList.add( "emojiSlot" );
		});
	});
	
	
	let masterLabelList = [ "pl1LevelLabel", "pl2LevelLabel", "pl3LevelLabel" ];
	masterLabelList.forEach(( MLID ) => {
		document.getElementById( MLID ).classList.add( "renderInvisible" );
	});
}



	
	
	