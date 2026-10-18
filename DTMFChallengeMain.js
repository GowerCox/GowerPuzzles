var loggerOn;
var onASmartPhone;
var tries;
var toneSelectionList;
var digitToGuess;

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
	displayWelcomeScreen();
	initialiseVariables();
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
function displayWelcomeScreen() {
	document.getElementById( "welcomeScreen" ).classList.remove( "renderInvisible");
	
	let action = "Click";
	if ( onASmartPhone ) { action = "Touch"; }
	
	
	let WSMessage = "WELCOME TO DTMF CHALLENGE.<br>" +
	"To play, press the \"Play Tone\" button.  And " +
	"guess the telephone key that creates it.  If you are " +
	"incorrect, keep guessing until you get it correct.  The " + 
	"game tallies the total number of tries for all 10 tones.<br>" +
	action + " here to dismiss this message.";
	
	document.getElementById( "welcomeScreenSpan" ).innerHTML = WSMessage;
	
}


/* **************************************** */
function closeWelcomeScreenMC() {
	
	if ( !onASmartPhone ) {
		closeWelcomeScreen();
	}
}
function closeWelcomeScreenT() {
	
	if ( onASmartPhone ) {
		closeWelcomeScreen();
	}
}
function closeWelcomeScreen() {
	
	document.getElementById( "welcomeScreen" ).classList.add( "renderInvisible");
	document.getElementById( "playBoard" ).classList.remove( "renderInvisible");
	document.getElementById( "tallyBoard" ).classList.remove( "renderInvisible");
	document.getElementById( "blockingOverlay" ).classList.remove( "renderInvisible");
}

/* **************************************** */
function initialiseVariables() {
	
	tries = 0;
	document.getElementById( "TBTriesField" ).innerHTML = tries;
	
	toneSelectionList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	
	document.getElementById("reButton").innerHTML = "RESET";
	
	for ( digitIndex=0; digitIndex <= 9; digitIndex++ ) {
		
		let currentButton = document.getElementById( "digit" + digitIndex );
		currentButton.setAttribute('onclick', 'tryToneMC(this)');
		currentButton.setAttribute('ontouchstart', 'tryToneT(this)');
		
	}
	
	document.getElementById("volumeSlider").oninput = function() {
	  	DTMFLevel = this.value;
	}
	
}

/* **************************************** */
function playRandomToneMC() {
	
	if ( !onASmartPhone ) {
		playRandomTone();
	}
}
function playRandomToneT() {
	
	if ( onASmartPhone ) {
		playRandomTone();
	}
}

function playRandomTone() {
	
	let outOf = toneSelectionList.length;
	let randomSelection = Math.floor(Math.random() * outOf);
	
	/* Remove the one element */
	digitToGuess = toneSelectionList.splice(randomSelection, 1);
	
	playDTMF( digitToGuess );
	document.getElementById("playRandomTone").disabled = true;
	
	blockButtonsForABit();
}

/* **************************************** */
function tryToneMC( e ) {
	
	if ( !onASmartPhone ) {
		tryTone(e);
	}
}
function tryToneT( e ) {
	
	if ( onASmartPhone ) {
		tryTone(e);
	}
}
function tryTone( e ) {
	
	
	/* Q:  Which keypad digit was just pressed? */
	let regexp = /\d/;
	let trialDigit = parseInt( e.id.match(regexp)[0] );
	
	/* Increment trial count */
	tries++;
	document.getElementById( "TBTriesField" ).innerHTML = tries;
	
	/* Play the guessed tone */
	playDTMF( trialDigit );
	
	if ( trialDigit == digitToGuess ) {
		guessedCorrect( e, trialDigit );	
	}
	else {
		blockButtonsForABit();
		guessedIncorrect( trialDigit );
	}
	
}

/* **************************************** */
function guessedCorrect( e, trialDigit ) {
	
	document.getElementById( "blockingOverlay" ).classList.remove( "renderInvisible");
	
	let greenCheckmark = document.getElementById( "greenCheckmark" );
	let classToAdd = "position" + trialDigit;
	greenCheckmark.classList.add( classToAdd );
	
	e.removeAttribute("onclick");
	e.removeAttribute("ontouchstart");
	
	let showCMSequence = [
		[ 10, function() { 
			greenCheckmark.classList.remove( "renderInvisible");
		 }],
		[ 340, function() { 
			greenCheckmark.classList.remove( classToAdd );
			greenCheckmark.classList.add( "renderInvisible");
		 }],
		[ 540, function() {
			checkIfGameOver();
		 }]
	];

 	scheduleUtilities.runSequence( showCMSequence );
 		
	e.classList.remove( "digit");
	e.classList.add( "digitDisabled");
}

function checkIfGameOver() {
	
	if ( toneSelectionList.length == 0 ) {
		gameOver();
	}
	else {
		document.getElementById("playRandomTone").disabled = false;
	}
	
}
function gameOver() {
	
	let GOMSG = `Game over in <br>${tries} tries`;
	document.getElementById( "GOPMessage" ).innerHTML = GOMSG;
	let reButton = document.getElementById("reButton");
	let GOP = document.getElementById( "gamOverPopup" )
	
	let gameOverSequence = [
		[ 5, function() {
			GOP.classList.remove( "renderInvisible");
			document.getElementById( "playRandomTone" ).classList.add( "renderInvisible");
			document.getElementById( "GOFinalMessage" ).classList.remove( "renderInvisible");
			reButton.disabled = true;
		 }],
		[ 1200, function() {
			GOP.classList.add( "renderInvisible");
			reButton.disabled = false;
			reButton.innerHTML = "REPLAY";
		 }]
	];

 	scheduleUtilities.runSequence( gameOverSequence );
}




function guessedIncorrect( trialDigit ) {
	
	let redX = document.getElementById( "redX" );
	let classToAdd = "position" + trialDigit;
	redX.classList.add( classToAdd );
	
	
	let showXSequence = [
		[ 10, function() { 
			redX.classList.remove( "renderInvisible");
		 }],
		[ 340, function() { 
			redX.classList.remove( classToAdd );
			redX.classList.add( "renderInvisible");
		 }]
	];

 	scheduleUtilities.runSequence( showXSequence );	
	
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
	
	initialiseVariables();
	for ( let i=0; i<=9; i++ ) {
		let currentKeyButton = document.getElementById( "digit" + i );
		currentKeyButton.classList.remove( "digitDisabled");
		currentKeyButton.classList.add( "digit");
	}
	
	document.getElementById( "playRandomTone" ).classList.remove( "renderInvisible");
	document.getElementById( "GOFinalMessage" ).classList.add( "renderInvisible");
	document.getElementById("playRandomTone").disabled = false;
	
}

function blockButtonsForABit() {
	
	let temporaryButtonBlockSequence = [
		[ 3, function() { 
			document.getElementById( "blockingOverlay" ).classList.remove( "renderInvisible");
		 }],
		[ 500, function() { 
			document.getElementById( "blockingOverlay" ).classList.add( "renderInvisible");
		 }]
	];

 	scheduleUtilities.runSequence( temporaryButtonBlockSequence );	
	
}



