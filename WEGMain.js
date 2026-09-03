var loggerOn;
var randomValue;
var incorrectCount;
var onASmartPhone;
var inputState;

/* **************************************** */
document.addEventListener("DOMContentLoaded", (event) => {
	loggerOn = true;
	logger("Starting");
	initialise();
	whatAmIRunningOn();
});
	
/* **************************************** */
function logger( m ) {
	if ( loggerOn ) { console.log(m); }
}

/* **************************************** */
function whatAmIRunningOn() {
	
	let OSPQuery = window.matchMedia("(pointer: coarse)");
	onASmartPhone = OSPQuery.matches;
	
	OSPQuery.addEventListener("change", (e) => {
		onASmartPhone = e.matches;
	});
}

/* **************************************** */
function initialise() {
	
	let instructions1 = "WELCOME!!!<br>For this game, there will be a secret-hidden number " +
	"between 1 and 2.  You must guess what it is.  You get 2 tries.<br>";
	
	document.getElementById("IPMsg1").innerHTML = instructions1;
	
	let instructions2 = "&#x1F921;   Try not to take this game too seriously.   &#x1F921;";
	document.getElementById("IPMsg2").innerHTML = instructions2;
	
	let guessFieldElement = document.getElementById('guessField');
	guessFieldElement.focus();
	
	guessFieldElement.addEventListener('keydown', (event) => {
		
		if ( event.key == "Meta"  || event.key == "Control" ) {
			/* CTRL causes this event listener to run twice */
			return;
		}
		
		if ( (inputState == "nothing") && !(event.ctrlKey || event.metaKey) ) {
			if ( !(event.key == "1" || event.key == "2") ) {
				inputState = "disregardingInput";
			}
			else if ( event.key == "1" || event.key == "2" ) {
				inputState = "acceptingInput";
			}
					
		}
		else if ( (inputState == "nothing") && (event.ctrlKey || event.metaKey) ) {
			if ( event.key.toLowerCase() === 'v' ) {
				inputState = "pastingInput";
			}
			else if ( event.key.toLowerCase() != 'v' ) {
				inputState = "disregardingInput";		
			}
		}
	});
	

	guessFieldElement.addEventListener('keyup', (e) => {
		
		if ( inputState == "disregardingInput" ) {
    		temporaryPopup();
		}
		else if ( inputState == "acceptingInput" ) {
			inputState = "analysingGuess";
			analyseGuess();
		}
		else if ( inputState == "pastingInput" ) {
			validatePaste();
		}
		
	});
	
	inputState = "nothing";
	randomValue = (Math.floor(Math.random() * 2 )) + 1;
	incorrectCount = 0;
}

function validatePaste() {
	
	inputState = "validatingPaste";	
	let userInput = document.getElementById('guessField').value;
	
	if ( userInput == "1" || userInput == 2 ) {
		inputState = "analysingGuess";
		analyseGuess();
	}
	else {
		inputState = "disregardingInput"
    	temporaryPopup();
	}
}
	
/* **************************************** */
function temporaryPopup() {
	
	let pe = document.getElementById( "oopsPopup" );
	let guessFieldElement = document.getElementById('guessField');
	
	let sequenceItself = [
	    [ 3, function() { 
			pe.classList.remove( "renderInvisible" );
			guessFieldElement.disabled = true;
			 } ],
	    [ 650, function() {
			guessFieldElement.disabled = false;
			pe.classList.add( "renderInvisible" );
			guessFieldElement.focus();
			guessFieldElement.value = "";
			inputState = "nothing";
			}]
	];

  	scheduleUtilities.runSequence( sequenceItself );
}
	
/* **************************************** */
function analyseGuess() {
	
	let userValue = document.getElementById( "guessField" ).value;
	
	if ( userValue == randomValue ) {
		gotIt(randomValue);
	}
	else {
		dontGotIt(userValue);
	}
}
	
/* **************************************** */
function gotIt(randomValue) {

	let msg = `"${randomValue}" IS CORRECT!!!<br>Want to try again?`;
	document.getElementById( "PPCALabel" ).innerHTML = msg;
	document.getElementById( "playPortion" ).classList.add( "renderInvisible" );
	document.getElementById( "playPortionCorrectAnswer" ).classList.remove( "renderInvisible" );
	inputState = "gameOver";
}
	
/* **************************************** */
function dontGotIt(userValue) {
	
	incorrectCount++;
 	
 	if ( incorrectCount == 1 ) {
		let msg = `SORRY. "${userValue}" IS INCORRECT!!!<br>Try again?`;
		
		let pp = document.getElementById( "playPortion" );
		let wa = document.getElementById( "wrongAnswer" );
		document.getElementById( "WALabel" ).innerHTML = msg;
		
		let sequenceItself = [
	    [ 5, function() { 
			pp.classList.add( "renderInvisible" );
			wa.classList.remove( "renderInvisible" );
			 } ],
	    [ 2000, function() {
			pp.classList.remove( "renderInvisible" );
			wa.classList.add( "renderInvisible" );
			let guessFieldElement = document.getElementById('guessField');
			guessFieldElement.value = "";
			guessFieldElement.focus();
			inputState = "nothing";
			}]
	];

  	scheduleUtilities.runSequence( sequenceItself );
	}
	else if ( incorrectCount > 1 ){
		
		let msg = `SORRY. "${userValue}" IS INCORRECT!!!<br>Game over.`;
		document.getElementById( "SGOLabel" ).innerHTML = msg;
		document.getElementById( "playPortion" ).classList.add( "renderInvisible" );
		document.getElementById( "sorryGameOver" ).classList.remove( "renderInvisible" );
		inputState = "gameOver";
	}
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
	
	document.getElementById( "playPortionCorrectAnswer" ).classList.add( "renderInvisible" );
	document.getElementById( "sorryGameOver" ).classList.add( "renderInvisible" );
	document.getElementById( "playPortion" ).classList.remove( "renderInvisible" );
	reinitialise();
}
function reinitialise() {
	
	let guessFieldElement = document.getElementById('guessField');
	guessFieldElement.focus();
	guessFieldElement.value = "";
	inputState = "nothing";
	randomValue = (Math.floor(Math.random() * 2 )) + 1;
	incorrectCount = 0;
	
}








