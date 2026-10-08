var loggerOn;
var audioController;
var noteFrequenctMap;
var mainAudioContext;
var timingBasis;
var chimeSequences;

/* test varibles in dev tools */
var audioController2;
var gainNode2;
var soundOscillator2;


/* **************************************** */
function playSingleNote( note, pDuration ) {
	
	let frequency = noteFrequenctMap.get(note);

	if ( !(mainAudioContext === undefined || mainAudioContext.state === 'closed') ) {
		mainAudioContext.close();
	}
	mainAudioContext = new (window.AudioContext || window.webkitAudioContext)();
	
	if (mainAudioContext.state === 'suspended') {
	    mainAudioContext.resume();
	}
	
	/* How long is this note? */
	if ( pDuration == "whole") {
		duration = timingBasis;
	}
	else if ( pDuration == "half") {
		duration = timingBasis/2;
	}
	else if ( pDuration == "quarter") {
		duration = timingBasis/4;
	}
	else if ( pDuration == "eighth") {
		duration = timingBasis/8;
	}
	else {
		duration = pDuration;
	}
	
	
	/* Volume controller */
	let soundOscillator = mainAudioContext.createOscillator();
	let gainNode = mainAudioContext.createGain();
	soundOscillator.connect(gainNode);
	gainNode.connect(mainAudioContext.destination);
	let startTime = mainAudioContext.currentTime;
	//let fadeInDuration = duration/10;
	let fadeInDuration = duration*0.4;
	
	// 3. Schedule the volume (Gain) envelope
	//  VERY IMPORTANT NOTICE - do not use the value of 0.0 for zero volume, use 0.0001 instead
    gainNode.gain.setValueAtTime( 0.0001 , startTime );
	gainNode.gain.exponentialRampToValueAtTime( 1.0, startTime+fadeInDuration);
	
	
	//startFadeTime = duration*0.9;
	startFadeTime = duration*0.6;
	// Maintain full volume until the fade starts
	gainNode.gain.setValueAtTime( 1.0, startFadeTime );
	
	// Exponentially ramp down to almost 0 (exponentialRamp cannot end at exactly 0)
	gainNode.gain.exponentialRampToValueAtTime(0.0001, duration);
	
	// 4. Start and stop the oscillator
	soundOscillator.type = 'sine';
	soundOscillator.frequency.setValueAtTime( frequency, startTime); // A4 note

	soundOscillator.start(startTime);
	soundOscillator.stop(duration);
	
}

function setUpChimeSequences() {
	
	chimeSequences = new Map();
	
	let chime1 = [ [ "A2", "half" ], ["B2", "quarter"], ["C2", "quarter"], ["D2", "eighth"], ["E2", "whole"], ];
	chimeSequences.set("chime1", chime1);
	
	let chime2 = [  ["D2", "eighth"], ["E2", "eighth"], ["B2", "eighth"], ["D2", "eighth"], ["E2", "eighth"], ["B2", "eighth"] ];
	chimeSequences.set("chime2", chime2);
	
	let chime3 = [  ["D2", "quarter"], ["E2", "quarter"], ["B2", "quarter"], ["D2", "quarter"], ["E2", "quarter"], ["B2", "quarter"] ];
	chimeSequences.set("chime3", chime3);
	
	let chime4 = [  ["D2", "half"], ["E2", "half"], ["B2", "half"], ["D2", "half"], ["E2", "half"], ["B2", "half"] ];
	chimeSequences.set("chime4", chime4);
	
	let chime5 = [  ["D2", "whole"], ["E2", "whole"], ["B2", "whole"], ["D2", "whole"], ["E2", "whole"], ["B2", "whole"] ];
	chimeSequences.set("chime5", chime5);
	
	let chime6 = [  ["E1", "whole"], ["D1", "eighth"], ["C1", "quarter"], ["B1", "eighth"], ["A1", "quarter"], ["A2", "whole"] ];
	chimeSequences.set("chime6", chime6);
	
	let chime234569Play = [  ["A2", "eighth"], ["F1", "eighth"], ["D1", "eighth"], ["F1", "eighth"], ["A2", "eighth"], ["F1", "eighth"] ];
	chimeSequences.set("chime234569Play", chime234569Play);

}


function playChimeDriver( whichChime ) {
	
	let theChime = chimeSequences.get( whichChime );
	
	let currentT = 0.0;
	
	let chimeSequence = [];
	
	theChime.forEach((element, index, array) => {
		
		let note = element[0];
		let pDuration = element[1];
       logger( `currentT: ${currentT}  note ${note}  pDuration ${pDuration} ${typeof currentT}` );
		let f = function() { playSingleNote( note, pDuration ); };
		let sequenceItem = [ currentT*1000, f ];
		chimeSequence.push( sequenceItem );
       
		if ( element[1] == "whole") {
			currentT += (timingBasis * 1.1);
		}
		else if ( element[1] == "half") {
			currentT += (1.1*timingBasis/2);
		}
		else if ( element[1] == "quarter") {
			currentT += (1.1*timingBasis/4);
		}
		else if ( element[1] == "eighth") {
			currentT += (1.1*timingBasis/8);
		}
       
       
	});
	scheduleUtilities.runSequence( chimeSequence );
	
}

	
function playWarble( frequency, duration, warblesPerSecond ) {

	alert("Playing warble");
	
	if ( mainAudioContext === undefined ) {
		logger("Creating mainAudioContext");
		mainAudioContext = new (window.AudioContext || window.webkitAudioContext)();
		}
	else {
		logger("mainAudioContext has been already created");
	}	
	
	
	  // Ensure the context is running (browsers block autoplay)
	  if (mainAudioContext.state === 'suspended') {
	    mainAudioContext.resume();
	  }

  const carrier 	= mainAudioContext.createOscillator(); // The main sound
  const warbleEffect = mainAudioContext.createOscillator();      // The warble effect
  const warbleGain 	= mainAudioContext.createGain();        // The intensity of the warble
  const mainGain 	= mainAudioContext.createGain();       // Master volume / envelope

  carrier.type = 'sine';
  carrier.frequency.setValueAtTime( 440, mainAudioContext.currentTime); // Base pitch (A4)

  warbleEffect.type = 'sine';
  /* How many warbles per second? */
  warbleEffect.frequency.setValueAtTime( warblesPerSecond, mainAudioContext.currentTime + 0); 
  warbleGain.gain.setValueAtTime( frequency, mainAudioContext.currentTime + 0 ); // Depth: Pitch swings by +/- 30Hz

  mainGain.gain.setValueAtTime( 0.6, mainAudioContext.currentTime);
  mainGain.gain.exponentialRampToValueAtTime(0.0001, mainAudioContext.currentTime + duration);

  warbleEffect.connect( warbleGain );
  warbleGain.connect(carrier.frequency); 
  
  carrier.connect(mainGain);
  mainGain.connect(mainAudioContext.destination);

  warbleEffect.start();
  carrier.start();
  
  warbleEffect.stop(mainAudioContext.currentTime + duration);
  carrier.stop(mainAudioContext.currentTime + duration );
}







function DTSetUP3() {
	
	/* This one fades in properly */
		
	audioController2 = new (window.AudioContext || window.webkitAudioContext)();
	
	/* Volume controller */
	soundOscillator2 = audioController2.createOscillator();
	gainNode2 = audioController2.createGain();
	soundOscillator2.connect(gainNode2);
	gainNode2.connect(audioController2.destination);
	
	let startTime = audioController2.currentTime + 3;
	let fadeInDuration = 1;
	
	// 3. Schedule the volume (Gain) envelope
	//  VERY IMPORTANT NOTICE - do not use the value of 0.0 for zero volume, use 0.0001 instead
    gainNode2.gain.setValueAtTime( 0.0001 , startTime );
	gainNode2.gain.exponentialRampToValueAtTime( 1.0, startTime+fadeInDuration);
	
	
	// 4. Start and stop the oscillator
	soundOscillator2.type = 'sine'; // Standard pure tone
	soundOscillator2.frequency.setValueAtTime( 220, startTime); // A4 note

	soundOscillator2.start(startTime);
	soundOscillator2.stop(7); // Completely stop node when fade finishes
	
}


function createNoteFrequencyMap() {
	
	noteFrequenctMap = new Map([
		  ["A1", 220 ],
		  ["A#1", 233 ],
		  ["B1", 247 ],
		  ["C1", 262 ],
		  ["C#1", 277 ],
		  ["D1", 294],
		  ["D#1", 311 ],
		  ["E1", 330 ],
		  ["F1", 349 ],
		  ["F#", 370 ],
		  ["G1", 392 ],
		  ["G#", 415 ],
		  ["A2", 440 ],
		  ["A#2", 466 ],
		  ["B2", 494 ],
		  ["C2", 523 ],
		  ["C#2", 554 ],
		  ["D2", 587 ],
		  ["D#2", 622 ],
		  ["E2", 659 ],
		  ["F2", 698 ],
		  ["F#2", 740 ],
		  ["G2", 784 ],
		  ["G#2", 831 ],
		  ["A3", 880 ],
		  ["A#3", 932 ],
		  ["B3", 988 ],
		  ["C3", 1047 ],
		  ["C#3", 1109 ],
		  ["D3", 1175 ],
		  ["D#3", 1245 ],
		  ["E3", 1319 ],
		  ["F3", 1397 ],
		  ["F#3", 1480 ],
		  ["G3", 1568 ],
		  ["G#3", 1661 ]
		]);
	
}



/* **************************************** */
function repeatPlay() {
	setInterval( playWarble, 1000 );
}



function DTSetUP2() {
	
	/* This one fades away properly */
	
	audioController2 = new (window.AudioContext || window.webkitAudioContext)();
	
	/* Volume controller */
	soundOscillator2 = audioController2.createOscillator();
	gainNode2 = audioController2.createGain();
	soundOscillator2.connect(gainNode2);
	gainNode2.connect(audioController2.destination);
	
	let startTime = audioController2.currentTime;
	let steadyDuration = 2.5;
	let fadeDuration = 1;
	let startFadeTime = startTime + steadyDuration;
	let endTime = startFadeTime + fadeDuration;
	
	// 3. Schedule the volume (Gain) envelope
	// Set initial full volume immediately
    gainNode2.gain.setValueAtTime( 1.0 , startTime );
    
	// Maintain full volume until the fade starts
	gainNode2.gain.setValueAtTime( 1.0, startFadeTime );
	
	// Exponentially ramp down to almost 0 (exponentialRamp cannot end at exactly 0)
	gainNode2.gain.exponentialRampToValueAtTime(0.0001, endTime);
	
	// 4. Start and stop the oscillator
	soundOscillator2.type = 'sine'; // Standard pure tone
	soundOscillator2.frequency.setValueAtTime(440, startTime); // A4 note

	soundOscillator2.start(startTime);
	soundOscillator2.stop(endTime); // Completely stop node when fade finishes
	
}




/* **************************************** */
document.addEventListener("DOMContentLoaded", (event) => {
	loggerOn = true;
	logger( "Gower wuz here" );
	createNoteFrequencyMap();
	timingBasis = 1.0;
	setUpChimeSequences();
});

/* **************************************** */
function logger( m ) {
	if ( loggerOn ) { console.log(m); }
}


/* **************************************** */
function playTone( f, t ) {
	audioController = new (window.AudioContext || window.webkitAudioContext)();
	let gainNode = audioController.createGain();
	let soundGenerator = audioController.createOscillator();
	soundGenerator.connect(gainNode);
	gainNode.connect(audioController.destination);
	soundGenerator.type = 'sine';
	soundGenerator.frequency.value = f; 
	soundGenerator.connect(audioController.destination);
  	soundGenerator.start();
	//soundGenerator.stop(audioController.currentTime + t ); 
    const fadeDuration = 0.15; // 20 milliseconds fade-out
    const now = audioController.currentTime;
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(0, now + fadeDuration);
    soundGenerator.stop(now + fadeDuration);
}


/* **************************************** */
function playSequence1() {
	let playSequence = [
	    [ 5, function() { playTone( 440, 2 ); }],
	    [ 1200, function() { playTone( 660, 2 ); }],
	    [ 2300, function() { playTone( 880, 2 ); }]
	];
  	scheduleUtilities.runSequence( playSequence );
	
}

/* **************************************** */
function playSequence2() {
	
	let t=5;
	let deltaT = 500;
	let PTDT = deltaT/1000;
	let playSequence = [
	    [ 5, function() { playTone( 440, PTDT ); t+=deltaT; }],
	    [ 505, function() { playTone( 660, PTDT ); t+=deltaT; }],
	    [ 1005, function() { playTone( 880, 2*PTDT ); t+=(2*deltaT); }],
	    [ 1505, function() { playTone( 1000, PTDT ); t+=deltaT; }],
	    [ 2005, function() { playTone( 1500, 2*PTDT ); t+=deltaT; }],
	    [ 2505, function() { playTone( 2250, PTDT ); t+=deltaT; }],
	    [ 3005, function() { playTone( 2000, PTDT ); t+=deltaT; }]
	];
  	scheduleUtilities.runSequence( playSequence );
	
}


/* **************************************** */
function moveDivs() {
	playSequence2();
	let OD1 = document.getElementById("d1");
	OD1.classList.add( "moveD1" );
	let OD2 = document.getElementById("d2");
	OD2.classList.add( "moveD2" );
}


