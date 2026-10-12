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



function honkHonk() {
	
	if ( !(mainAudioContext === undefined || mainAudioContext.state === 'closed') ) {
		mainAudioContext.close();
	}
	mainAudioContext = new (window.AudioContext || window.webkitAudioContext)();
	
	let now = mainAudioContext.currentTime;
    
    let singleHonk = (startTime) => {
		let frequencyGenerator = mainAudioContext.createOscillator();
		let volumeControl = mainAudioContext.createGain();
		let filter = mainAudioContext.createBiquadFilter();
        
        frequencyGenerator.type = 'sawtooth';
        
        frequencyGenerator.frequency.setValueAtTime(580, startTime);
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, startTime);
        
        volumeControl.gain.setValueAtTime(0, startTime);
        volumeControl.gain.linearRampToValueAtTime(0.75, startTime + 0.03);
        volumeControl.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
        
        frequencyGenerator.connect(filter);
        filter.connect(volumeControl);
        volumeControl.connect(mainAudioContext.destination);
        
        frequencyGenerator.start(startTime);
        frequencyGenerator.stop(startTime + 0.16);
    };

    singleHonk(now);
    singleHonk(now + 0.18);
}



function circusSlide() {
	
	if ( !(mainAudioContext === undefined || mainAudioContext.state === 'closed') ) {
		mainAudioContext.close();
	}
	mainAudioContext = new (window.AudioContext || window.webkitAudioContext)();
	
	let now = mainAudioContext.currentTime;
	let duration = 0.6;
    
	let frequencyGenerator = mainAudioContext.createOscillator();
	let volumeControl = mainAudioContext.createGain();
    
    frequencyGenerator.type = 'sine';

    frequencyGenerator.frequency.setValueAtTime( 600, now );
    //frequencyGenerator.frequency.exponentialRampToValueAtTime( 1200, now + duration * 0.8);
    frequencyGenerator.frequency.linearRampToValueAtTime(1200, now + duration * 0.8);
    
    volumeControl.gain.setValueAtTime(0, now);
    volumeControl.gain.linearRampToValueAtTime(0.5, now + 0.01);
    volumeControl.gain.linearRampToValueAtTime(0.5, now + duration - 0.1);
    volumeControl.gain.linearRampToValueAtTime(0.001, now + duration );

    frequencyGenerator.connect(volumeControl);
    volumeControl.connect(mainAudioContext.destination);
    
    frequencyGenerator.start(now);
    frequencyGenerator.stop(now + duration);
}




function NPGameOverSound() {

	let playSequence = [
	    [ 2, function() { insect(); }],
	    [ 250, function() { insect(); }],
	    [ 500, function() { birdCall(); }],
	    [ 750, function() { birdCall(); }]
	];
  	scheduleUtilities.runSequence( playSequence );	
}

function insect() {
	
	if ( !(mainAudioContext === undefined || mainAudioContext.state === 'closed') ) {
		mainAudioContext.close();
	}
	mainAudioContext = new (window.AudioContext || window.webkitAudioContext)();

	let now = mainAudioContext.currentTime;

	let carrierOsc = mainAudioContext.createOscillator();
    carrierOsc.type = 'sine'; 
    carrierOsc.frequency.setValueAtTime(4500, now); 

	let mainGain = mainAudioContext.createGain();
    mainGain.gain.setValueAtTime(0, now);

    carrierOsc.connect(mainGain);
    mainGain.connect(mainAudioContext.destination);

    let startTime = now + 0.1;
	let syllableDuration = 0.015;
	let syllableGap = 0.025;

    for (let i = 0; i < 4; i++) {
        let pulseStart = startTime + (i * syllableGap);
        let pulseEnd = pulseStart + syllableDuration;

        mainGain.gain.setValueAtTime(0, pulseStart);
        mainGain.gain.linearRampToValueAtTime(0.15, pulseStart + 0.003);
        mainGain.gain.setValueAtTime(0.15, pulseEnd - 0.003);
        mainGain.gain.linearRampToValueAtTime(0, pulseEnd);
    }

    carrierOsc.start(now);
    carrierOsc.stop(startTime + (4 * syllableGap) + 0.05);
}

/* **************************************** */
function birdCall() {
	
	if ( !(mainAudioContext === undefined || mainAudioContext.state === 'closed') ) {
		mainAudioContext.close();
	}
	mainAudioContext = new (window.AudioContext || window.webkitAudioContext)();
	
	let osc = mainAudioContext.createOscillator();
	let gainNode = mainAudioContext.createGain();
  
	osc.connect(gainNode);
	gainNode.connect(mainAudioContext.destination);
  
	osc.type = 'sine'; 
  
	let now = mainAudioContext.currentTime;
	let duration = 0.15; 
  
	osc.frequency.setValueAtTime(4000, now);
	osc.frequency.exponentialRampToValueAtTime(1500, now + 0.08);
	osc.frequency.exponentialRampToValueAtTime(3000, now + duration);
  
	gainNode.gain.setValueAtTime(0, now);
	gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
	gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); 
  
	osc.start(now);
	osc.stop(now + duration);
}

/* **************************************** */
function playUpDownSequence( initF, count, multiplier, interval ) {
	
	if ( !(mainAudioContext === undefined || mainAudioContext.state === 'closed') ) {
		mainAudioContext.close();
	}
	mainAudioContext = new (window.AudioContext || window.webkitAudioContext)();

 	function playToneWhen(freq, startTime, duration) {
	    const osc = mainAudioContext.createOscillator();
	    const gain = mainAudioContext.createGain();
	
	    osc.type = 'sine';
	    osc.frequency.setValueAtTime(freq, startTime);
	
	    gain.gain.setValueAtTime(0.4, startTime);
	    
	    gain.gain.exponentialRampToValueAtTime(0.001, startTime + (duration/2) );
	
	    osc.connect(gain);
	    gain.connect(mainAudioContext.destination);
	
	    osc.start(startTime);
	    osc.stop(startTime + duration);
	}

	let now = mainAudioContext.currentTime;
	
	let deltaT = 0;
	let currentFrequency = initF;
	for ( let i=0; i<count; i++ ) {
		playToneWhen( currentFrequency, now + deltaT, interval);
		currentFrequency *= multiplier;
		deltaT += interval;
	}
	
}

/* **************************************** */
function bellEffect( fundamental ) {
	
	if ( !(mainAudioContext === undefined || mainAudioContext.state === 'closed') ) {
		mainAudioContext.close();
	}
	mainAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    let now = mainAudioContext.currentTime;

    let overtones = [
        { ratio: 1.0,  gain: 0.5,  decay: 2.0 },
        { ratio: 1.5,  gain: 0.3,  decay: 1.5 },
        { ratio: 4.0,  gain: 0.2,  decay: 0.8 },
        { ratio: 6.0,  gain: 0.4,  decay: 0.8 } 
    ];

	let masterGain = mainAudioContext.createGain();
    masterGain.gain.setValueAtTime(0.3, now); 
    masterGain.connect(mainAudioContext.destination);

    overtones.forEach(tone => {
        let osc = mainAudioContext.createOscillator();
        let gainNode = mainAudioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(fundamental * tone.ratio, now);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(tone.gain, now + 0.01); 
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + tone.decay);

        osc.connect(gainNode);
        gainNode.connect(masterGain);

        osc.start(now);
        osc.stop(now + tone.decay);
    });
}


/* **************************************** */
function playClick( f ) {

	if ( !(mainAudioContext === undefined || mainAudioContext.state === 'closed') ) {
		mainAudioContext.close();
	}
	mainAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  
	let oscillator = mainAudioContext.createOscillator();
	let gainNode = mainAudioContext.createGain();
  
	oscillator.type = 'sine'; 
	oscillator.frequency.setValueAtTime( f, mainAudioContext.currentTime); 
  
	let now = mainAudioContext.currentTime;
	gainNode.gain.setValueAtTime(0.5, now);
	gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  
	oscillator.connect(gainNode);
	gainNode.connect(mainAudioContext.destination);
  
	oscillator.start(now);
	oscillator.stop(now + 0.05);
}


/* **************************************** */
function playSwoosh() {

	if ( !(mainAudioContext === undefined || mainAudioContext.state === 'closed') ) {
		mainAudioContext.close();
	}
	mainAudioContext = new (window.AudioContext || window.webkitAudioContext)();
  
	if (mainAudioContext.state === 'suspended') {
		mainAudioContext.resume();
	}

	let duration = 0.4;
	let now = mainAudioContext.currentTime;

	let bufferSize = mainAudioContext.sampleRate * duration;
	let buffer = mainAudioContext.createBuffer(1, bufferSize, mainAudioContext.sampleRate); //
	let data = buffer.getChannelData(0); //
  
	for (let i = 0; i < bufferSize; i++) {
		data[i] = Math.random() * 2 - 1;
	}

	let noiseSource = mainAudioContext.createBufferSource();
	noiseSource.buffer = buffer;

	let filter = mainAudioContext.createBiquadFilter();
	filter.type = 'bandpass';
	filter.Q.value = 4.0;

	let gainNode = mainAudioContext.createGain();

	filter.frequency.setValueAtTime(200, now);
	filter.frequency.exponentialRampToValueAtTime(1800, now + (duration * 0.4));
	filter.frequency.exponentialRampToValueAtTime(300, now + duration);

	gainNode.gain.setValueAtTime(0, now);
	gainNode.gain.linearRampToValueAtTime(0.7, now + (duration * 0.3));
	gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

	noiseSource.connect(filter);
	filter.connect(gainNode);
	gainNode.connect(mainAudioContext.destination);

	noiseSource.start(now);
	noiseSource.stop(now + duration);
}


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

	let fadeInDuration = duration*0.4;
	
    gainNode.gain.setValueAtTime( 0.0001 , startTime );
	gainNode.gain.exponentialRampToValueAtTime( 1.0, startTime+fadeInDuration);
	
	
	//startFadeTime = duration*0.9;
	startFadeTime = duration*0.6;
	gainNode.gain.setValueAtTime( 1.0, startFadeTime );
	
	gainNode.gain.exponentialRampToValueAtTime(0.0001, duration);
	
	soundOscillator.type = 'sine';
	soundOscillator.frequency.setValueAtTime( frequency, startTime);

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
	
	let npMove = [  ["A2", "eighth"], ["C#2", "eighth"], ["E2", "eighth"] ];
	chimeSequences.set("npMove", npMove);
	
	let naturesPyramidPlay = [  ["G1", "eighth"], ["A2", "eighth"], ["C2", "eighth"], ["E2", "eighth"], ["G1", "eighth"], ["A2", "eighth"], ["C2", "eighth"], ["E2", "eighth"]];
	chimeSequences.set("naturesPyramidPlay", naturesPyramidPlay);
	
	let npGameWin = [  ["G2", "quarter"], ["G2", "eighth"], ["G2", "eighth"], ["C3", "whole"] ];
	chimeSequences.set("npGameWin", npGameWin );
	

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


