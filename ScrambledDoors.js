var loggerOn;
var onASmartPhone;
var pairSelectionState;
var firstSelection;
var door1ID;
var door2ID;
var remainingScrambleableDoors;
var clicksTouchesEnabled;
var CSSRowColumnMap;
var positionMap;
var currentRandomPositionToReceive;
var nextRandomPositionToReceive;
var whosInMiddle;
var currentPointValue;
var currentScore;
var alreadyMatchedOnTurn;
var matchesInARow;
var amount;
 
 
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
	oneTimeInitialisation();
	multiTimeInitialisation();
	displayWelcomeScreen();
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
function oneTimeInitialisation() {
	
	/* Set CSS values here */
	CSSRowColumnMap = new Map();
	CSSRowColumnMap.set("--row1Top", "13.8px");
	CSSRowColumnMap.set("--row2Top", "165.6px");
	CSSRowColumnMap.set("--row3Top", "326.6px");
	CSSRowColumnMap.set("--col1Left", "27.6px");
	CSSRowColumnMap.set("--col2Left", "184px");
	CSSRowColumnMap.set("--col3Left", "340.4px");
	
	let rootElement = document.documentElement;
	CSSRowColumnMap.forEach((value, key) => {
		rootElement.style.setProperty( key, value );
	});
	
	positionMap = new Map();
	positionMap.set("position1", `${CSSRowColumnMap.get("--row1Top")},${CSSRowColumnMap.get("--col1Left")}`);
	positionMap.set("position2", `${CSSRowColumnMap.get("--row1Top")},${CSSRowColumnMap.get("--col2Left")}`);
	positionMap.set("position3", `${CSSRowColumnMap.get("--row1Top")},${CSSRowColumnMap.get("--col3Left")}`);
	positionMap.set("position4", `${CSSRowColumnMap.get("--row2Top")},${CSSRowColumnMap.get("--col1Left")}`);
	positionMap.set("position5", `${CSSRowColumnMap.get("--row2Top")},${CSSRowColumnMap.get("--col3Left")}`);
	positionMap.set("position6", `${CSSRowColumnMap.get("--row3Top")},${CSSRowColumnMap.get("--col1Left")}`);
	positionMap.set("position7", `${CSSRowColumnMap.get("--row3Top")},${CSSRowColumnMap.get("--col2Left")}`);
	positionMap.set("position8", `${CSSRowColumnMap.get("--row3Top")},${CSSRowColumnMap.get("--col3Left")}`);
	positionMap.set("positionMiddle", `${CSSRowColumnMap.get("--row2Top")},${CSSRowColumnMap.get("--col2Left")}`);
	

}
function multiTimeInitialisation() {
		
	let secretNumberList = ['1', '1', '2', '2', '3', '3', '4', '4'];
	for ( let i=1; i<=8; i++ ) {
		let currentSNElement = document.getElementById( "doorContainer"+i).querySelector('.secretNumber');
		let outOf = secretNumberList.length;
		let randomSelection = Math.floor(Math.random() * outOf);
		/* Remove the one element */
		let selectedNumber = secretNumberList.splice(randomSelection, 1);
		currentSNElement.innerHTML = selectedNumber;
	}
	
	pairSelectionState = "none";
	
	remainingScrambleableDoors = [ "doorContainer1", "doorContainer2", "doorContainer3", "doorContainer4", "doorContainer5", "doorContainer6", "doorContainer7", "doorContainer8" ];
	
	currentPointValue = 5;
	currentScore = 0;
	document.getElementById( "TBCPVField" ).innerHTML = currentPointValue;
	document.getElementById( "TBSField" ).innerHTML = currentScore;
	alreadyMatchedOnTurn = false;
	
	matchesInARow = 0;
	document.getElementById( "reButton" ).innerHTML = "Reset";
	
}
 
/* **************************************** */
function displayWelcomeScreen() {
	
	document.getElementById( "welcomeScreen" ).classList.remove( "renderInvisible");
	
	let contactType = "click";
	if ( onASmartPhone ) {
		contactType = "touch";
	}
	
	let WSMessage = `WELCOME TO SCRAMBLED DOORS<br><br>` +
	`The object: ${contactType} on a pair ` +
	`of doors.  They will open to reveal hidden ` +
	`numbers.  If you get matching numbers, ` +
	`you score.  You get 5 points for the first ` +
	`matching pair in a row.  10 for the second.  ` +
	`And 20 for the third.  There is no score for ` +
	`the final pair.  If they don't match, you ` +
	`lose 1 point.  And unopen doors will ` +
	`scramble.` +
	`<br><br>HAVE FUN!`;

	
	document.getElementById( "welcomeScreenSpan" ).innerHTML = WSMessage;
}
 

/* **************************************** */
function enactPlayCallbackMC() {
	
	if ( !onASmartPhone ) {
		enactPlay();
	}
}
function enactPlayCallbackT() {
	
	if ( onASmartPhone ) {
		enactPlay();
	}
}
function enactPlay() {
	document.getElementById( "welcomeScreen" ).classList.add( "renderInvisible");
	document.getElementById( "tallyBoard" ).classList.remove( "renderInvisible");
	clicksTouchesEnabled = true;
}

/* **************************************** */
function openDoorMC(e) {
	
	if ( !onASmartPhone ) {
		openDoor(e);
	}
}
function openDoorT(e) {
	
	if ( onASmartPhone ) {
		openDoor(e);
	}
}

function openDoor(e) {
	
	if ( pairSelectionState == "one" && door1ID == e.id) {
		/* If the 2nd door is the same door as first, do nothing */
		return;
	}
	
	if ( document.getElementById( e.id ).classList.contains( "doorContainerDisabled" ) ) {
		/* If the door is disabled from previously, do nothing */
		return;
	}
	
	if ( clicksTouchesEnabled ) {
		let currentHatch = document.getElementById( e.id ).querySelector('.door');
		currentHatch.classList.remove( "open");
		currentHatch.classList.remove( "close");
		currentHatch.classList.add( "open");
		doorCreak();
		
		if (pairSelectionState == "none") {
			document.getElementById("reButton").disabled = true;
			door1ID = e.id;
			firstSelection = document.getElementById( door1ID ).querySelector('.secretNumber').innerHTML;
			pairSelectionState = "one";
		}
		else if (pairSelectionState == "one") {
			door2ID = e.id;
			let secondSelection = document.getElementById( door2ID ).querySelector('.secretNumber').innerHTML;
			comparePair( firstSelection, secondSelection );
			pairSelectionState = "none";
			clicksTouchesEnabled = false;
		}		
		
	}

}

/* **************************************** */
function comparePair( v1, v2 ) {
	
	if ( v1 != v2 ) {
		/* Didn't match */
		didntmatchSequence();
	}
	else {
		matchSequence();
	}
	
}

function matchSequence() {
	
	matchesInARow++;
	
	updateScoreParameters();
	
	let gotMatchSequence = [
    	[ 500, function () {
			document.getElementById( "matchGraphic" ).classList.remove( "renderInvisible");
		}],
    	[ 1400, function () {
			document.getElementById( "matchGraphic" ).classList.add( "renderInvisible");
		}],
    	[ 1600, function () {
			removeFromScrambleList( door1ID );
			removeFromScrambleList( door2ID );
			disableDoor( door1ID );
			disableDoor( door2ID );
		}],
    	[ 2600, function () {
			clicksTouchesEnabled = true;
			updateScore();
			if ( remainingScrambleableDoors.length == 0 ) {
				gameOver();
			}
			else {
				document.getElementById("reButton").disabled = false;
			}
		}]
   	];
		
	scheduleUtilities.runSequence( gotMatchSequence );
}

/* **************************************** */
function didntmatchSequence() {
	
	matchesInARow = 0;
	updateScoreParameters();
	
	let noMatchSequence;
		
	document.getElementById( "NMGMSG2" ).innerHTML = "(Lose 1 point)";
	
	noMatchSequence = [
    	[ 500, function () {
			document.getElementById( "noMatchGraphic" ).classList.remove( "renderInvisible");
		}],
    	[ 1500, function () {
			document.getElementById( "noMatchGraphic" ).classList.add( "renderInvisible");
		}],
    	[ 1700, function () {
			doorCreak();
			closeDoor( door1ID );
			closeDoor( door2ID );
			updateScore();
		}],
    	[ 2800, function () {
			scrambleRemainingDoors();
		}]
   	];
	
	scheduleUtilities.runSequence( noMatchSequence );
}

function updateScoreParameters() {
	
	if ( remainingScrambleableDoors.length <= 0 ) {
		/* Do not update score if last pair was just uncovered */
		return;
	}
	
	if (  matchesInARow == 0 ) {
		amount = -1;
		currentPointValue = 5;
	}
	else if ( matchesInARow == 1 && remainingScrambleableDoors.length > 4 ) {
		amount = 5;
		currentPointValue = 10;
	}
	else if ( matchesInARow == 1 && remainingScrambleableDoors.length <= 4 ) {
		amount = 5;
		currentPointValue = "zilch";
	}
	else if ( matchesInARow == 2 && remainingScrambleableDoors.length > 4 ) {
		amount = 10;
		currentPointValue = 20;
	}
	else if ( matchesInARow == 2 && remainingScrambleableDoors.length <= 4 ) {
		amount = 10;
		currentPointValue = "zilch";
	}
	else if ( matchesInARow == 3 ) {
		amount = 20;
		currentPointValue = "zilch";
	}
	
	let MGMSGElement = document.getElementById( "MGMSG" );
	if ( remainingScrambleableDoors.length > 2 ) {
		MGMSGElement.innerHTML = `YOU MATCHED!<br>Gain ${amount} points`;
	}
	else {
		MGMSGElement.innerHTML = `YOU MATCHED!<br>No points for last pair`;
	}
}

function updateScore() {
	
	if ( remainingScrambleableDoors.length <= 0 ) {
		/* Do not update score if last pair was just uncovered */
		return;
	}
	
	let TBCPVFieldElement = document.getElementById( "TBCPVField" );
	TBCPVFieldElement.innerHTML = currentPointValue;
	
	currentScore += amount;
	let TBSFieldElement = document.getElementById( "TBSField" );
	TBSFieldElement.innerHTML = currentScore;
	
	if ( currentScore < 0 ) {
		TBSFieldElement.classList.remove( "TBSFieldWhite");
		TBSFieldElement.classList.add( "TBSFieldRed");
	}
	else {
		TBSFieldElement.classList.remove( "TBSFieldRed");
		TBSFieldElement.classList.add( "TBSFieldWhite");	
	}
	
}

function closeDoor( whichDoor ) {
	let currentHatch = document.getElementById( whichDoor ).querySelector('.door');
	currentHatch.classList.remove( "open");
	currentHatch.classList.add( "close");
}
/* **************************************** */
function scrambleRemainingDoors() {
	
	currentRandomPositionToReceive = "positionMiddle";
	
	let moveDoorSequence = [
		[ 10, function() { moveADoor(); }],
		[ 510, function() { moveADoor(); }],
		[ 1010, function() { moveADoor(); }],
		[ 1510, function() { moveADoor(); }],
		[ 2010, function() { moveADoor(); }],
		[ 2510, function() { moveADoor(); }],
		[ 3010, function() { moveADoor(); }],
		[ 3510, function() { moveADoor(); }],
		[ 4010, function() { moveADoor(); }],
		[ 4510, function() { lastMoveToVacateMiddle(); }]
	];

 	scheduleUtilities.runSequence( moveDoorSequence );

}

function lastMoveToVacateMiddle() {
	
	/* If middle is already vacant, then cancel */
	if ( nextRandomPositionToReceive == "positionMiddle") {
		clicksTouchesEnabled = true;
		document.getElementById("reButton").disabled = false;
		return;
	}
	
	currentRandomPositionToReceive = nextRandomPositionToReceive;
	nextRandomPositionToReceive = "positionMiddle";
	
	/* Move random remaining door */
	let startTop = positionMap.get( nextRandomPositionToReceive ).split(",")[0];
	let startLeft = positionMap.get( nextRandomPositionToReceive ).split(",")[1];
	
	let endTop = positionMap.get( currentRandomPositionToReceive ).split(",")[0];
	let endLeft = positionMap.get( currentRandomPositionToReceive ).split(",")[1];
	
	let rootElement = document.documentElement;
	rootElement.style.setProperty('--p1Top', startTop);
	rootElement.style.setProperty('--p1Left', startLeft);
	rootElement.style.setProperty('--p2Top', endTop);
	rootElement.style.setProperty('--p2Left', endLeft);
	
	let currentDoor = document.getElementById( whosInMiddle );
	currentDoor.classList.add( "doorMovement");
	
	playSwoosh();
	
	currentDoor.addEventListener("animationend", 
		function currentAnimator() {
			logger( "Animation end for: " + this.id + ", removing: " + nextRandomPositionToReceive + ", adding: " + currentRandomPositionToReceive );
			this.classList.remove( "doorMovement" );
			this.classList.remove( nextRandomPositionToReceive );
			this.classList.add( currentRandomPositionToReceive );
			this.getAnimations().forEach((anim) => { anim.cancel(); });	
			this.removeEventListener('animationend', currentAnimator);
			currentRandomPositionToReceive = nextRandomPositionToReceive;
			clicksTouchesEnabled = true;
			document.getElementById("reButton").disabled = false;
		}
	);
}

function moveADoor() {
	
		/* Pick a random remaining door */
		let outOf = remainingScrambleableDoors.length;
		let randomIndex = Math.floor(Math.random() * outOf);
		let currentDoorID = remainingScrambleableDoors[ randomIndex ];
		
		/* What is the position of that door? */
		let doorToMove = document.getElementById( currentDoorID );
		let regex = /(position)(\d|Middle)/;
		let match = doorToMove.className.match(regex);
		nextRandomPositionToReceive = match[0];
		
		/* Move random remaining door */
		let startTop = positionMap.get( nextRandomPositionToReceive ).split(",")[0];
		let startLeft = positionMap.get( nextRandomPositionToReceive ).split(",")[1];
		
		let endTop = positionMap.get( currentRandomPositionToReceive ).split(",")[0];
		let endLeft = positionMap.get( currentRandomPositionToReceive ).split(",")[1];
		
		let rootElement = document.documentElement;
		rootElement.style.setProperty('--p1Top', startTop);
		rootElement.style.setProperty('--p1Left', startLeft);
		rootElement.style.setProperty('--p2Top', endTop);
		rootElement.style.setProperty('--p2Left', endLeft);
		
		let currentDoor = document.getElementById( currentDoorID );
		currentDoor.classList.add( "doorMovement");
		
		playSwoosh();
		
		currentDoor.addEventListener("animationend", 
			function currentAnimator() {
				if ( currentRandomPositionToReceive == "positionMiddle" ) {
					whosInMiddle = this.id;
				}
				
				this.classList.remove( "doorMovement" );
				this.classList.remove( nextRandomPositionToReceive );
				this.classList.add( currentRandomPositionToReceive );
				this.getAnimations().forEach((anim) => { anim.cancel(); });	
				this.removeEventListener('animationend', currentAnimator);
				currentRandomPositionToReceive = nextRandomPositionToReceive;
			}
		);
}


/* **************************************** */
function removeFromScrambleList( whichDoor ) {
	
	let dIndex = remainingScrambleableDoors.indexOf(whichDoor);
	remainingScrambleableDoors.splice( dIndex, 1);
	
}
function disableDoor( whichDoor ) {
	
	let theDoorContainer = document.getElementById( whichDoor );
	
	theDoorContainer.querySelector('.door').classList.add( "renderInvisible");
	theDoorContainer.classList.remove( "doorContainer");
	theDoorContainer.classList.add( "doorContainerDisabled");
}

/* **************************************** */
function gameOver() {
	
	document.getElementById( "GOMSG" ).innerHTML = `GAME OVER!<br>Your score is ${currentScore}`;
	
	let GOElement = document.getElementById( "gameOver" );
	
	let gameOverSequence = [
		[ 150, function() { GOElement.classList.remove( "renderInvisible"); }],
		[ 1500, function() { 
			GOElement.classList.add( "renderInvisible");
			document.getElementById( "TBGOMSG" ).classList.remove( "renderInvisible");
			document.getElementById( "reButton" ).innerHTML = "Replay";
			document.getElementById("reButton").disabled = false;
			}]
	];

 	scheduleUtilities.runSequence( gameOverSequence );
	
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

	let reGraphicElement = document.getElementById( "resetGraphic" );
	let reButtonElement = document.getElementById("reButton");
	
	let word = "Resetting";
	if ( reButtonElement.innerHTML == "Replay" ) {
		word = "Replaying";
	}
	document.getElementById( "RGMSG" ).innerHTML = word;
	
	let resetSequence = [
		[ 10, function() {
			reGraphicElement.classList.remove( "renderInvisible");
			reButtonElement.disabled = true;
			multiTimeInitialisation();
			putBackDoors();
		 }],
		[ 30, function() {
			let PBElement = document.getElementById("playBoard")
			PBElement.classList.add( "fadeOutThenInPlayBoard");
			
			PBElement.addEventListener("animationend", 
				function currentAnimator() {
					this.classList.remove( "fadeOutThenInPlayBoard" );
					this.getAnimations().forEach((anim) => { anim.cancel(); });	
					this.removeEventListener('animationend', currentAnimator);
				}
			);
			
		 }],
		[ 1400, function() {
			reGraphicElement.classList.add( "renderInvisible");
			let scoreFieldElement = document.getElementById("TBSField");
			scoreFieldElement.classList.remove("TBSFieldRed");
			scoreFieldElement.classList.add("TBSFieldWhite");
			document.getElementById("TBGOMSG").classList.add( "renderInvisible");
			reButtonElement.disabled = false;
		 }]
	];

 	scheduleUtilities.runSequence( resetSequence );
	
	
}


function putBackDoors() {
	
	/* Get rid of "open"s */
	let onlyOpenDoors = document.querySelectorAll('#playBoard > .doorContainerDisabled > .open');
	onlyOpenDoors.forEach((currentDoorElement, index, array) => {
 		currentDoorElement.classList.remove( "renderInvisible");
		currentDoorElement.classList.remove( "open");
	});

	/* Some may have been disabled.  Restore them. */
	let onlyDisabledDoors = document.querySelectorAll('#playBoard > .doorContainerDisabled');
	onlyDisabledDoors.forEach((currentDoorElement, index, array) => {
		currentDoorElement.classList.remove( "doorContainerDisabled");
		currentDoorElement.classList.add( "doorContainer");
	});
	
	/* Undo the scrambled-tangled-wangled-bejangled mess */
	for ( let i=1; i<=8; i++ ) {
		let dc = document.getElementById("doorContainer"+i);
		let classesToRemove = [...dc.classList].filter(className => className.startsWith("position"));
		if (classesToRemove.length > 0) {
			dc.classList.remove(...classesToRemove);
			dc.classList.add("position"+i);
		}
	}
	
	document.getElementById("reButton").disabled = true;
	
}
















