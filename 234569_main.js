var loggerOn;
var onASmartPhone;
var masterSegmentMap;
var current3by4SegmentGrid;
var turnCount;
var segmentPairColumnIndices;
var possibleValidDigits;
var columnDigitMap;
var graphicFlashColorPairs;
var graphicFlashColorPairsRunningIndex;
var graphicFlashColorPairsLength;

/* Variables particular to touch devices */
var touchState;
var startSwipeTime;
var touchRowColumnPair;
var soleRowOrColumn;
var rowColumnDecision;
var swipeDataQuardruplets;

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
	create3by4SegmentMap();
	displayWelcomeScreen();
	initialiseTallyBoard();
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
	
	masterSegmentMap = new Map();
	
	let digit2SegmentPairs = [
		[ 0b10100000, 0b00011010 ],
		[ 0b10010000, 0b00101010 ],
		[ 0b10001000, 0b00110010 ],
		[ 0b10000010, 0b00111000 ],
		[ 0b00110000, 0b10001010 ],
		[ 0b00101000, 0b10010010 ],
		[ 0b00100010, 0b10011000 ],
		[ 0b00011000, 0b10100010 ],
		[ 0b00010010, 0b10101000 ],
		[ 0b00001010, 0b10110000 ]
	];
	masterSegmentMap.set("2", digit2SegmentPairs );
	
	let digit3SegmentPairs = [
		[ 0b10100000, 0b00010110 ],
		[ 0b10010000, 0b00100110 ],
		[ 0b10000100, 0b00110010 ],
		[ 0b10000010, 0b00110100 ],
		[ 0b00110000, 0b10000110 ],
		[ 0b00100100, 0b10010010 ],
		[ 0b00100010, 0b10010100 ],
		[ 0b00010100, 0b10100010 ],
		[ 0b00010010, 0b10100100 ],
		[ 0b00000110, 0b10110000 ]
	];
	masterSegmentMap.set("3", digit3SegmentPairs );
	
	let digit4SegmentPairs = [
		[ 0b01010000, 0b00100100 ],
		[ 0b01100000, 0b00010100 ],
		[ 0b01000100, 0b00110000 ]
	];
	masterSegmentMap.set("4", digit4SegmentPairs );
	
	let digit5SegmentPairs = [
		[ 0b11000000, 0b00010110 ],
		[ 0b10010000, 0b01000110 ],
		[ 0b10000100, 0b01010010 ],
		[ 0b10000010, 0b01010100 ],
		[ 0b01010000, 0b10000110 ],
		[ 0b01000100, 0b10010010 ],
		[ 0b01000010, 0b10010100 ],
		[ 0b00010100, 0b11000010 ],
		[ 0b00010010, 0b11000100 ],
		[ 0b00000110, 0b11010000 ]
	];
	masterSegmentMap.set("5", digit5SegmentPairs );
	
	let digit6SegmentPairs = [
		[ 0b11010000, 0b00001110 ],
		[ 0b11001000, 0b00010110 ],
		[ 0b11000100, 0b00011010 ],
		[ 0b11000010, 0b00011100 ],
		[ 0b10011000, 0b01000110 ],
		[ 0b10010100, 0b01001010 ],
		[ 0b10010010, 0b01001100 ],
		[ 0b10001100, 0b01010010 ],
		[ 0b10001010, 0b01010100 ],
		[ 0b10000110, 0b01011000 ],
	];
	masterSegmentMap.set("6", digit6SegmentPairs );
	
	let digit9SegmentPairs = [
		[ 0b11100000, 0b00010110 ],
		[ 0b11010000, 0b00100110 ],
		[ 0b11000100, 0b00110010 ],
		[ 0b11000010, 0b00110100 ],
		[ 0b10110000, 0b01000110 ],
		[ 0b10100100, 0b01010010 ],
		[ 0b10100010, 0b01010100 ],
		[ 0b10010100, 0b01100010 ],
		[ 0b10010010, 0b01100100 ],
		[ 0b10000110, 0b01110000 ]
	];
	masterSegmentMap.set("9", digit9SegmentPairs );

	
	/* ********************* */
	segmentPairColumnIndices = [ [0,1], [0,2], [0,3], [1,2], [1,3], [2,3] ];
	possibleValidDigits = new Set( [ 0b10111010, 0b10110110, 0b01110100, 0b11010110, 0b11011110, 0b11110110 ] );
	columnDigitMap = new Map();
	columnDigitMap.set( 0, [ 0b10111010, 0b11010110 ] );
	columnDigitMap.set( 1, [ 0b10110110, 0b11011110 ] );
	columnDigitMap.set( 2, [ 0b01110100, 0b11110110 ] );
	
	graphicFlashColorPairs = [
		[ "pieceRed", 		"innerPerimeterGreenYellow" ],
		[ "pieceWhite", 	"innerPerimeterDeepPink" ],
		[ "piecePurple", 	"innerPerimeterDarkTurquoise" ],
		[ "pieceBlack", 	"innerPerimeterWhite" ]
	];
	
	graphicFlashColorPairsRunningIndex = 0;
	graphicFlashColorPairsLength = graphicFlashColorPairs.length;
	
	/* Change these AFTER grid is filled in */
	touchState = "unreadyGameState";
	fingerSlideSetup();
	disableAllArrows();
	document.getElementById( "resetButton" ).disabled = true;
}

/* **************************************** */
function create3by4SegmentMap() {
	
	let randomlySelectedSegments = new Map();

	masterSegmentMap.forEach(( value, key ) => {
		
		outOf = value.length;
		let randomSelection = Math.floor(Math.random() * outOf);

		let currentSegmentPair = [value[randomSelection][0], value[randomSelection][1]];

		randomlySelectedSegments.set( key, currentSegmentPair ); 
		
	});
	
	/* Initialize the 3x4 */
	var maxRows = 4;
	var maxCols = 3;
    var zilch = 0;
	current3by4SegmentGrid = Array.from({ length: maxRows }, () => Array(maxCols).fill(zilch));

	/* Pre-fill it */
	current3by4SegmentGrid[0][0] = randomlySelectedSegments.get("2")[0];
	current3by4SegmentGrid[1][0] = randomlySelectedSegments.get("2")[1];
	
	current3by4SegmentGrid[2][0] = randomlySelectedSegments.get("5")[0];
	current3by4SegmentGrid[3][0] = randomlySelectedSegments.get("5")[1];

	current3by4SegmentGrid[0][1] = randomlySelectedSegments.get("3")[0];
	current3by4SegmentGrid[1][1] = randomlySelectedSegments.get("3")[1];
	
	current3by4SegmentGrid[2][1] = randomlySelectedSegments.get("6")[0];
	current3by4SegmentGrid[3][1] = randomlySelectedSegments.get("6")[1];
	
	current3by4SegmentGrid[0][2] = randomlySelectedSegments.get("4")[0];
	current3by4SegmentGrid[1][2] = randomlySelectedSegments.get("4")[1];
	
	current3by4SegmentGrid[2][2] = randomlySelectedSegments.get("9")[0];
	current3by4SegmentGrid[3][2] = randomlySelectedSegments.get("9")[1];
	
	/* Scramble: use "reverse turns" */
	let allTurns = [ "u0", "u1", "u2", "l0", "l1", "l2", "l3", "d0", "d1", "d2", "r0", "r1", "r2", "r3" ];
	let ATLength = allTurns.length;
	
	let rv = (Math.floor(Math.random() * 4)) + 10;
	
	for ( let i=0; i<rv; i++ ) {
		
		let rt = allTurns[Math.floor(Math.random() * ATLength)];
		logger( "  -> " + rt);
		let uldr = rt[0];
		let rc = parseInt(rt[1]);
		
		let swappee;
		
		if (uldr == 'u') {
			/* Too few to warrent for loops */
			swappee = current3by4SegmentGrid[0][rc];
			current3by4SegmentGrid[0][rc] = current3by4SegmentGrid[1][rc];
			current3by4SegmentGrid[1][rc] = current3by4SegmentGrid[2][rc];
			current3by4SegmentGrid[2][rc] = current3by4SegmentGrid[3][rc];
			current3by4SegmentGrid[3][rc] = swappee;
		}
		else if (uldr == 'l') {
			swappee = current3by4SegmentGrid[rc][0];
			current3by4SegmentGrid[rc][0] = current3by4SegmentGrid[rc][1];
			current3by4SegmentGrid[rc][1] = current3by4SegmentGrid[rc][2];
			current3by4SegmentGrid[rc][2] = swappee;
		}
		else if (uldr == 'd') {
			swappee = current3by4SegmentGrid[3][rc];
			current3by4SegmentGrid[3][rc] = current3by4SegmentGrid[2][rc];
			current3by4SegmentGrid[2][rc] = current3by4SegmentGrid[1][rc];
			current3by4SegmentGrid[1][rc] = current3by4SegmentGrid[0][rc];
			current3by4SegmentGrid[0][rc] = swappee;
		}
		else if (uldr == 'r') {
			swappee = current3by4SegmentGrid[rc][2];
			current3by4SegmentGrid[rc][2] = current3by4SegmentGrid[rc][1];
			current3by4SegmentGrid[rc][1] = current3by4SegmentGrid[rc][0];
			current3by4SegmentGrid[rc][0] = swappee;
		}
	}
}


/* **************************************** */
function create3by4SegmentMap_v0() {
	
	var randomlySelectedSegments = [];
	var maxRows = 4;
	var maxCols = 3;
    var zilch = 0;
    var outOf;
    
	current3by4SegmentGrid = Array.from({ length: maxRows }, () => Array(maxCols).fill(zilch));

	masterSegmentMap.forEach(( value, key, map ) => {
		
		outOf = value.length;
		let randomSelection = Math.floor(Math.random() * outOf);
		
		randomlySelectedSegments.push( value[randomSelection][0] );
		randomlySelectedSegments.push( value[randomSelection][1] );
		//logger( key + "-> " + value[randomSelection][0].toString(2).padStart(8, '0') + ", " + value[randomSelection][1].toString(2).padStart(8, '0') );
		
	});
	
	outOf = 12;
	for ( let rowIndex=0; rowIndex<=3; rowIndex++ ) {
		for ( let columnIndex=0; columnIndex<=2; columnIndex++ ) {
			
			let randomSelection = Math.floor(Math.random() * outOf);
			let theSegment = randomlySelectedSegments[randomSelection];
			
			current3by4SegmentGrid[rowIndex][columnIndex] = theSegment;
			randomlySelectedSegments[randomSelection] = randomlySelectedSegments[--outOf];
		}
	}
	
}

/* **************************************** */
function displayWelcomeScreen() {
	
	document.getElementById( "welcomeScreen" ).classList.remove( "renderInvisible");
	
	let WSMessage;
	if ( !onASmartPhone ) {
		WSMessage = "WELCOME TO 234569<br><br>" +
		"At the top part of the playboard is a 3x4 grid of numerical segments.  " +
		"Just below that are the LED digits 2-3-4, then 5-6-9.  " +
		"The goal is to use the directional arrows of the segment grid " +
		"to manipulate the positions of the segments so that each column of 4 " +
		"will create the two LED digits directly below.<br><br>HAVE FUN!!!";
	}
	else {
		WSMessage = "WELCOME TO 234569<br><br>" +
		"At the top part of the playboard is a 3x4 grid of numerical segments.  " +
		"Just below that are the LED digits 2-3-4, then 5-6-9.  " +
		"To make a move: in the segnent grid, swipe either a ROW " +
		"left to right (or right to left), or a COLUMN up to down " + 
		"(or down to up).  This will manipulate " +
		"the position of the segments within.  The goal: when each column " +
		"of the segment grid is able to form the two corresponding " +
		"LED digits directly below.<br><br>HAVE FUN!!!";
	} 
	
	document.getElementById( "welcomeScreenSpan" ).innerHTML = WSMessage;
	
}

/* **************************************** */
function initialiseTallyBoard() {
	turnCount = 0;
	document.getElementById( "TCField" ).innerHTML = turnCount;
	document.getElementById( "resetButton" ).innerHTML = "RESET";
}
function incrementTurnCount() {
	turnCount++;
	document.getElementById( "TCField" ).innerHTML = turnCount;
}

/* **************************************** */
function enactPlayCallbackMC() {
	
	if ( !onASmartPhone ) {
		setUpPlayBoard();
	}
}
function enactPlayCallbackT() {
	
	if ( onASmartPhone ) {
		setUpPlayBoard();
	}
}

/* **************************************** */
function setUpPlayBoard() {
	
	document.getElementById( "welcomeScreen" ).classList.add( "renderInvisible" );
	document.getElementById( "segmentGrid" ).classList.remove( "renderInvisible" );
	
	if ( !onASmartPhone ) {
		document.getElementById( "arrowContainer" ).classList.remove( "renderInvisible" );
		document.getElementById( "digitGrid" ).classList.add( "digitGrid_NotOnSmartphone" );
		document.getElementById( "tallyBoard" ).classList.add( "tallyBoard_NotOnSmartphone" );
	}
	else {
		document.getElementById( "nonArrowContainer" ).classList.remove( "renderInvisible" );
		document.getElementById( "digitGrid" ).classList.add( "digitGrid_OnSmartphone" );
		document.getElementById( "tallyBoard" ).classList.add( "tallyBoard_OnSmartphone" );
	}
	
	document.getElementById( "digitGrid" ).classList.remove( "renderInvisible" );
	document.getElementById( "tallyBoard" ).classList.remove( "renderInvisible" );
	fillInSegmentGrid();
	
}

/* **************************************** */
function arrowCallbackMC( whichArrow ) {
	
	if ( !onASmartPhone ) {
		let WAID = whichArrow.id;
		enactArrow( WAID );
	}
}

function enactArrow( WAID ) {
	
	disableAllArrows();
	document.getElementById( "resetButton" ).disabled = true;
	
	/* First: which row or column */
	let regexp = /\d/;
	let whichRC = parseInt( WAID.match(regexp)[0] );
	
	/* Left, right, up or down? */
	regexp = /\Top/;
	let topMatch = regexp.test(WAID);
	regexp = /\Left/;
	let leftMatch = regexp.test(WAID);
	regexp = /\Bottom/;
	let bottomMatch = regexp.test(WAID);
	regexp = /\Right/;
	let rightMatch = regexp.test(WAID);
	
	if ( leftMatch || rightMatch ) {
		
		/* Copy the underlay to the overlay */
		rowCopy_U_TO_O( whichRC );
		
		/* Make overlay visible */
		document.getElementById( "rowOverlayGrid" ).classList.remove( "renderInvisible" );
				
		/* Movem-on-over */
		document.getElementById( "OGenericRow" ).classList.add( "rowPos" + whichRC );
		
		let whichDirection = "add_rowSlideToRight";
		if ( leftMatch ) { whichDirection = "add_rowSlideToLeft"; }
		let rs = document.getElementById( "rowSlider" );
		rs.classList.add( whichDirection );

		rs.addEventListener("animationend", 
			function currentAnimator(e) {
				this.classList.remove( whichDirection );
				this.getAnimations().forEach((anim) => { anim.cancel(); });	
				this.removeEventListener('animationend', currentAnimator);
				rowCopy_O_TO_U( whichRC, whichDirection );
				document.getElementById( "OGenericRow" ).removeAttribute("class");
				incrementTurnCount();
				checkForColumnMatch();
				}
	 		);
		
	}
	else if ( topMatch || bottomMatch ) {
		
		/* Copy the underlay to the overlay */
		columnCopy_U_TO_O( whichRC );
		
		/* Make overlay visible */
		document.getElementById( "columnOverlayGrid" ).classList.remove( "renderInvisible" );
				
		/* Movem-on-up (or down) */
		document.getElementById( "OGenericColumn" ).classList.add( "columnPos" + whichRC );
		
		let whichDirection = "add_columnSlideUpward";
		if ( bottomMatch ) { whichDirection = "add_columnSlideDownward"; }
		let cs = document.getElementById( "columnSlider" );
		cs.classList.add( whichDirection );
		
		cs.addEventListener("animationend", 
			function currentAnimator(e) {
				this.classList.remove( whichDirection );
				this.getAnimations().forEach((anim) => { anim.cancel(); });	
				this.removeEventListener('animationend', currentAnimator);
				columnCopy_O_TO_U( whichRC, whichDirection );
				document.getElementById( "OGenericColumn" ).removeAttribute("class");
				incrementTurnCount();
				checkForColumnMatch();
				}
	 		);
	}
	
}

function columnCopy_U_TO_O( whichColumn ) {
	
	let from = document.getElementById( "IP_3_" + whichColumn );
	let to = document.getElementById( "OGCIP_uppee" );
	Array.from( from.children ).forEach( piece => {
	  let itemClone = piece.cloneNode(true); 
	  to.appendChild(itemClone);
	});
	
	from = document.getElementById( "IP_0_" + whichColumn );
	to = document.getElementById( "OGCIP_0" );
	Array.from( from.children ).forEach( piece => {
	  let itemClone = piece.cloneNode(true); 
	  to.appendChild(itemClone);
	});
	
	from = document.getElementById( "IP_1_" + whichColumn );
	to = document.getElementById( "OGCIP_1" );
	Array.from( from.children ).forEach( piece => {
	  let itemClone = piece.cloneNode(true); 
	  to.appendChild(itemClone);
	});
	
	from = document.getElementById( "IP_2_" + whichColumn );
	to = document.getElementById( "OGCIP_2" );
	Array.from( from.children ).forEach( piece => {
	  let itemClone = piece.cloneNode(true); 
	  to.appendChild(itemClone);
	});
	
	from = document.getElementById( "IP_3_" + whichColumn );
	to = document.getElementById( "OGCIP_3" );
	Array.from( from.children ).forEach( piece => {
	  let itemClone = piece.cloneNode(true); 
	  to.appendChild(itemClone);
	});
	
	from = document.getElementById( "IP_0_" + whichColumn );
	to = document.getElementById( "OGCIP_downee" );
	Array.from( from.children ).forEach( piece => {
	  let itemClone = piece.cloneNode(true); 
	  to.appendChild(itemClone);
	});
	
}
function columnCopy_O_TO_U( whichColumn, whichDirection ) {
	
	document.getElementById( "columnOverlayGrid" ).classList.add( "renderInvisible" );
		
	document.getElementById( "IP_0_" + whichColumn ).replaceChildren();
	document.getElementById( "IP_1_" + whichColumn ).replaceChildren();
	document.getElementById( "IP_2_" + whichColumn ).replaceChildren();
	document.getElementById( "IP_3_" + whichColumn ).replaceChildren();
	
	if ( whichDirection == "add_columnSlideUpward" ) {
		
		let from = document.getElementById( "OGCIP_1" );
		let to = document.getElementById( "IP_0_" + whichColumn );
		Array.from( from.children ).forEach( piece => {
		  let itemClone = piece.cloneNode(true); 
		  to.appendChild(itemClone);
		});
		
		from = document.getElementById( "OGCIP_2" );
		to = document.getElementById( "IP_1_" + whichColumn );
		Array.from( from.children ).forEach( piece => {
		  let itemClone = piece.cloneNode(true); 
		  to.appendChild(itemClone);
		});
		
		from = document.getElementById( "OGCIP_3" );
		to = document.getElementById( "IP_2_" + whichColumn );
		Array.from( from.children ).forEach( piece => {
		  let itemClone = piece.cloneNode(true); 
		  to.appendChild(itemClone);
		});
		
		from = document.getElementById( "OGCIP_downee" );
		to = document.getElementById( "IP_3_" + whichColumn );
		Array.from( from.children ).forEach( piece => {
		  let itemClone = piece.cloneNode(true); 
		  to.appendChild(itemClone);
		});
		
		let swappee = current3by4SegmentGrid[0][whichColumn];
		current3by4SegmentGrid[0][whichColumn] = current3by4SegmentGrid[1][whichColumn];
		current3by4SegmentGrid[1][whichColumn] = current3by4SegmentGrid[2][whichColumn];
		current3by4SegmentGrid[2][whichColumn] = current3by4SegmentGrid[3][whichColumn];
		current3by4SegmentGrid[3][whichColumn] = swappee;
		
		
	}
	else if ( whichDirection == "add_columnSlideDownward" ) { 
		
		let from = document.getElementById( "OGCIP_uppee" );
		let to = document.getElementById( "IP_0_" + whichColumn );
		Array.from( from.children ).forEach( piece => {
		  let itemClone = piece.cloneNode(true); 
		  to.appendChild(itemClone);
		});
		
		from = document.getElementById( "OGCIP_0" );
		to = document.getElementById( "IP_1_" + whichColumn );
		Array.from( from.children ).forEach( piece => {
		  let itemClone = piece.cloneNode(true); 
		  to.appendChild(itemClone);
		});
		
		from = document.getElementById( "OGCIP_1" );
		to = document.getElementById( "IP_2_" + whichColumn );
		Array.from( from.children ).forEach( piece => {
		  let itemClone = piece.cloneNode(true); 
		  to.appendChild(itemClone);
		});
		
		from = document.getElementById( "OGCIP_2" );
		to = document.getElementById( "IP_3_" + whichColumn );
		Array.from( from.children ).forEach( piece => {
		  let itemClone = piece.cloneNode(true); 
		  to.appendChild(itemClone);
		});
		
		let swappee = current3by4SegmentGrid[3][whichColumn];
		current3by4SegmentGrid[3][whichColumn] = current3by4SegmentGrid[2][whichColumn];
		current3by4SegmentGrid[2][whichColumn] = current3by4SegmentGrid[1][whichColumn];
		current3by4SegmentGrid[1][whichColumn] = current3by4SegmentGrid[0][whichColumn];
		current3by4SegmentGrid[0][whichColumn] = swappee;
			
	}
	
	/* Clear the overlay */
	document.getElementById( "OGCIP_uppee" ).replaceChildren();
	document.getElementById( "OGCIP_0" ).replaceChildren();
	document.getElementById( "OGCIP_1" ).replaceChildren();
	document.getElementById( "OGCIP_2" ).replaceChildren();
	document.getElementById( "OGCIP_3" ).replaceChildren();
	document.getElementById( "OGCIP_downee" ).replaceChildren();
	
}



function rowCopy_U_TO_O( whichRow ) {
	
	let from = document.getElementById( "IP_" + whichRow + "_2" );
	let to = document.getElementById( "OGRIP_leftee" );
	Array.from( from.children ).forEach( piece => {
	  let itemClone = piece.cloneNode(true); 
	  to.appendChild(itemClone);
	});
	
	from = document.getElementById( "IP_" + whichRow + "_0" );
	to = document.getElementById( "OGRIP_0" );
	Array.from( from.children ).forEach( piece => {
	  let itemClone = piece.cloneNode(true); 
	  to.appendChild(itemClone);
	});
	
	from = document.getElementById( "IP_" + whichRow + "_1" );
	to = document.getElementById( "OGRIP_1" );
	Array.from( from.children ).forEach( piece => {
	  let itemClone = piece.cloneNode(true); 
	  to.appendChild(itemClone);
	});
	
	from = document.getElementById( "IP_" + whichRow + "_2" );
	to = document.getElementById( "OGRIP_2" );
	Array.from( from.children ).forEach( piece => {
	  let itemClone = piece.cloneNode(true); 
	  to.appendChild(itemClone);
	});
	
	from = document.getElementById( "IP_" + whichRow + "_0" );
	to = document.getElementById( "OGRIP_rightee" );
	Array.from( from.children ).forEach( piece => {
	  let itemClone = piece.cloneNode(true); 
	  to.appendChild(itemClone);
	});
}

function rowCopy_O_TO_U( whichRow, whichDirection ) {
	
	document.getElementById( "rowOverlayGrid" ).classList.add( "renderInvisible" );
		
	document.getElementById( "IP_" + whichRow + "_0" ).replaceChildren();
	document.getElementById( "IP_" + whichRow + "_1" ).replaceChildren();
	document.getElementById( "IP_" + whichRow + "_2" ).replaceChildren();
	
	if ( whichDirection == "add_rowSlideToLeft" ) {
		
		let from = document.getElementById( "OGRIP_1" );
		let to = document.getElementById( "IP_" + whichRow + "_0" );
		Array.from( from.children ).forEach( piece => {
		  let itemClone = piece.cloneNode(true); 
		  to.appendChild(itemClone);
		});
		
		from = document.getElementById( "OGRIP_2" );
		to = document.getElementById( "IP_" + whichRow + "_1" );
		Array.from( from.children ).forEach( piece => {
		  let itemClone = piece.cloneNode(true); 
		  to.appendChild(itemClone);
		});
		
		from = document.getElementById( "OGRIP_rightee" );
		to = document.getElementById( "IP_" + whichRow + "_2" );
		Array.from( from.children ).forEach( piece => {
		  let itemClone = piece.cloneNode(true); 
		  to.appendChild(itemClone);
		});
		
		let swappee = current3by4SegmentGrid[whichRow][0];
		current3by4SegmentGrid[whichRow][0] = current3by4SegmentGrid[whichRow][1];
		current3by4SegmentGrid[whichRow][1] = current3by4SegmentGrid[whichRow][2];
		current3by4SegmentGrid[whichRow][2] = swappee;
		
	}
	else if ( whichDirection == "add_rowSlideToRight" ) {
		
		let from = document.getElementById( "OGRIP_leftee" );
		let to = document.getElementById( "IP_" + whichRow + "_0" );
		Array.from( from.children ).forEach( piece => {
		  let itemClone = piece.cloneNode(true); 
		  to.appendChild(itemClone);
		});
		
		from = document.getElementById( "OGRIP_0" );
		to = document.getElementById( "IP_" + whichRow + "_1" );
		Array.from( from.children ).forEach( piece => {
		  let itemClone = piece.cloneNode(true); 
		  to.appendChild(itemClone);
		});
		
		from = document.getElementById( "OGRIP_1" );
		to = document.getElementById( "IP_" + whichRow + "_2" );
		Array.from( from.children ).forEach( piece => {
		  let itemClone = piece.cloneNode(true); 
		  to.appendChild(itemClone);
		});
		
		let swappee = current3by4SegmentGrid[whichRow][2];
		current3by4SegmentGrid[whichRow][2] = current3by4SegmentGrid[whichRow][1];
		current3by4SegmentGrid[whichRow][1] = current3by4SegmentGrid[whichRow][0];
		current3by4SegmentGrid[whichRow][0] = swappee;
	}
	
	/* Clear the overlay */
	document.getElementById( "OGRIP_leftee" ).replaceChildren();
	document.getElementById( "OGRIP_0" ).replaceChildren();
	document.getElementById( "OGRIP_1" ).replaceChildren();
	document.getElementById( "OGRIP_2" ).replaceChildren();
	document.getElementById( "OGRIP_rightee" ).replaceChildren();
}


/* **************************************** */
function fillInSegmentGrid() {
	
	// Delete later on!!!
	//dataDoctor();
	
	let fillSequence = [];
	let t = 80;
	for ( let r=0; r<=3; r++ ) {
		for ( let c=0; c<=2; c++ ) {
			let f_fillElement = function () {
				let theSegment = current3by4SegmentGrid[r][c];
				IPID = `IP_${r}_${c}`;
				segmentContainer = document.getElementById( IPID );
				fillInSegment( segmentContainer, theSegment );
			};
		
		let sequenceItem = [ t, f_fillElement ];
		fillSequence.push( sequenceItem );
		t += 80;
		}	
	}
	
	let f_finalElement = function () {
		enableAllArrows();
		touchState = "readyForSwipe";
		document.getElementById( "resetButton" ).disabled = false;
		document.getElementById( "RLabel" ).classList.add( "renderInvisible");
	};
	let sequenceItem = [ t, f_finalElement ];
	fillSequence.push( sequenceItem );
	
	scheduleUtilities.runSequence( fillSequence );
	
}

function fillInSegment( segmentContainer, binaryNumber ) {
	
	for ( let exp=7; exp>=1; exp-- ) {
		if ( (Math.pow(2, exp) & binaryNumber) > 0 ) {
			let PID = "piece"+(7-exp);
			let newPiece = document.createElement("div");
			newPiece.classList.add( PID );
			newPiece.classList.add( "pieceDefault" );
			segmentContainer.appendChild( newPiece );
		}
	}
	
}

/* **************************************** */
function resetMC() {
	
	if ( !onASmartPhone ) {
		resetBoardl();
	}
}

function resetT() {
	
	if ( onASmartPhone ) {
		resetBoardl();
	}
}

function resetBoardl() {
	
	let rl = document.getElementById( "RLabel" ).classList.remove( "renderInvisible");
	
	document.getElementById( "resetButton" ).disabled = true;
	disableAllArrows();
	
	/* Clear segment grid */
	for (let r=0; r<=3; r++ ) {
		for (let c=0; c<=2; c++) {
			let currentIP = document.getElementById( `IP_${r}_${c}` ).replaceChildren();
		}
	}
	
	/* Recompute the random 3 x 4 segment grid */
	create3by4SegmentMap();
	
	/* Repopulate the segment grid */
	fillInSegmentGrid();
	
	/* Reinitialisation */
	initialiseTallyBoard();
	graphicFlashColorPairsRunningIndex = 0;
	document.getElementById( "resetButton" ).innerHTML = "RESET";
	document.getElementById( "GOLabel" ).classList.add( "renderInvisible");
	document.getElementById( "TBGO_smiley" ).classList.add( "renderInvisible");
	
}


/* **************************************** */
function checkForColumnMatch() {
	
	var segmentPairDigitList;
	var matchElements = [];
	
	for ( let c=0; c<=2; c++ ) {
		
		segmentPairDigitList = [];
		
		for (let SPIndex=0; SPIndex<=5; SPIndex++ ) {
			let currentSegmentIndexPair = segmentPairColumnIndices[ SPIndex ];
			let iA = currentSegmentIndexPair[0];
			let iB = currentSegmentIndexPair[1];
			
			let segmentA = current3by4SegmentGrid[iA][c];
			let segmentB = current3by4SegmentGrid[iB][c];
			
			/* First: check if the two segments have pieces in common */
			if ( segmentA&segmentB ) {
				continue;
			}
			{
				/* There are no common pieces, so combine */
				/* the two segments into a possibly valid digit */
				let possiblyValidDigit = segmentA|segmentB;
				if (possibleValidDigits.has( possiblyValidDigit )) {
					
					segmentPairDigitList.push([ iA, iB, possiblyValidDigit ]);
				}

			}
		}
		
		let SPDLength = segmentPairDigitList.length;
		let pairOfBinaryDigits = columnDigitMap.get( c );
		if ( SPDLength >= 2 ) {
			
			/* Need at least two in order to have a chance in matching two digits */
			for ( let firstIndex=0; firstIndex<(SPDLength-1); firstIndex++ ) {
				for ( let secondIndex=(firstIndex+1); secondIndex<SPDLength; secondIndex++ ) {
					
					let possiblyValidDigit1 = segmentPairDigitList[firstIndex][2];
					let possiblyValidDigit2 = segmentPairDigitList[secondIndex][2];
					let desiredDigit1 = pairOfBinaryDigits[0];
					let desiredDigit2 = pairOfBinaryDigits[1];
					
					/* Do these two pairs even match? */					
					if (  (possiblyValidDigit1==desiredDigit1&&possiblyValidDigit2==desiredDigit2) || (possiblyValidDigit1==desiredDigit2&&possiblyValidDigit2==desiredDigit1) ) {

						/* If so, are they mutually exclusive? */
						
						if (  !(
							segmentPairDigitList[firstIndex][0] == segmentPairDigitList[secondIndex][0] ||
							segmentPairDigitList[firstIndex][0] == segmentPairDigitList[secondIndex][1] ||
							segmentPairDigitList[firstIndex][1] == segmentPairDigitList[secondIndex][0] ||
							segmentPairDigitList[firstIndex][1] == segmentPairDigitList[secondIndex][1]
							)
							  ) {
							
								let matchee1 = 1;
								let matchee2 = 0;
								if ( possiblyValidDigit1==desiredDigit1&&possiblyValidDigit2==desiredDigit2 ) {
									matchee1 = 0;
									matchee2 = 1;
								}
								
								let temp1 = segmentPairDigitList[firstIndex].slice();
								let temp2 = segmentPairDigitList[secondIndex].slice();
								let matchElement = [ c, temp1, matchee1, temp2, matchee2 ];
								matchElements.push(matchElement);
						}
					}
					
				}
				
			}
			
		}
		
	}
							
	checkGameStatus( matchElements.slice() );
	
	/* Clear this set */
	matchElements.length = 0;
	
}

/* **************************************** */
function checkGameStatus( matchElements ) {
	
	let completeColumnSet = new Set();
	matchElements.forEach((currentValue) => {
		let thisColumn = currentValue[0];
		completeColumnSet.add( thisColumn );
	});
	
	if ( completeColumnSet.has(0) &&  completeColumnSet.has(1) && completeColumnSet.has(2) ) {
		logger("GAME OVER");
		gameOverSequence( matchElements );
	}
	else {
		gameContinueSequence( matchElements );
	}
}

function gameOverSequence( matchElements ) {
	
	touchState = "gameOver";
	
	let GOSequence = [];
	let t;
	
	t = 120;
	let GO_Dialogue = document.getElementById( "gameOverDialogue" );
	let f_flashGO = function () {
		GO_Dialogue.classList.remove( "renderInvisible");
		let TCWord = "turns";
		if (turnCount == 1) {TCWord = "turn";}
		document.getElementById( "GOMSG" ).innerHTML = `SOLVED!!!<br>(In ${turnCount} ${TCWord})`;
	};
		
	let sequenceItem = [ t, f_flashGO ];
	GOSequence.push( sequenceItem );
	
	t += 1200;
	let f_unflashGO = function () {
		GO_Dialogue.classList.add( "renderInvisible");
		blackOutBoards();
	};
		
	sequenceItem = [ t, f_unflashGO  ];
	GOSequence.push( sequenceItem );
	scheduleUtilities.runSequence( GOSequence );

	/* Flash sequence (of the matching trios) */
	
	let flashSequence = [];
	
	let currentIPID;
	let currentIP;
	let innerPieces;
	
	t += 250;
	
	matchElements.forEach((currentValue) => {
	
		let f_firstTrioVisible = function () {
			
				currentIPID = `IP_${currentValue[1][0]}_${currentValue[0]}`;
				logger("currentIPID: " + currentIPID);
				currentIP = document.getElementById( currentIPID );
				innerPieces = currentIP.children;
				for ( let piece of innerPieces ) {
					piece.classList.remove( "pieceBlack" );
					piece.classList.add( "pieceDefault" );
				}
				
				currentIPID = `IP_${currentValue[1][1]}_${currentValue[0]}`;
				logger("currentIPID: " + currentIPID);
				currentIP = document.getElementById( currentIPID );
				innerPieces = currentIP.children;
				for ( let piece of innerPieces ) {
					piece.classList.remove( "pieceBlack" );
					piece.classList.add( "pieceDefault" );
				}
				
				currentIPID = `DGIP_${currentValue[2]}_${currentValue[0]}`;
				logger("currentIPID: " + currentIPID);
				currentIP = document.getElementById( currentIPID );
				innerPieces = currentIP.children;
				for ( let piece of innerPieces ) {
					piece.classList.remove( "pieceBlack" );
					piece.classList.add( "pieceDefault" );
				}	
				
			};
			
			sequenceItem = [ t, f_firstTrioVisible  ];
			flashSequence.push( sequenceItem );
			t += 500;
	
		let f_firstTrioInvisible = function () {
			
				currentIPID = `IP_${currentValue[1][0]}_${currentValue[0]}`;
				logger("currentIPID: " + currentIPID);
				currentIP = document.getElementById( currentIPID );
				innerPieces = currentIP.children;
				for ( let piece of innerPieces ) {
					piece.classList.remove( "pieceDefault" );
					piece.classList.add( "pieceBlack" );
				}
				
				currentIPID = `IP_${currentValue[1][1]}_${currentValue[0]}`;
				logger("currentIPID: " + currentIPID);
				currentIP = document.getElementById( currentIPID );
				innerPieces = currentIP.children;
				for ( let piece of innerPieces ) {
					piece.classList.remove( "pieceDefault" );
					piece.classList.add( "pieceBlack" );
				}
				
				currentIPID = `DGIP_${currentValue[2]}_${currentValue[0]}`;
				logger("currentIPID: " + currentIPID);
				currentIP = document.getElementById( currentIPID );
				innerPieces = currentIP.children;
				for ( let piece of innerPieces ) {
					piece.classList.remove( "pieceDefault" );
					piece.classList.add( "pieceBlack" );
				}	
				
			};
			
			sequenceItem = [ t, f_firstTrioInvisible  ];
			flashSequence.push( sequenceItem );
			t += 500;
	
		let f_secondTrioVisible = function () {
			
				currentIPID = `IP_${currentValue[3][0]}_${currentValue[0]}`;
				logger("currentIPID: " + currentIPID);
				currentIP = document.getElementById( currentIPID );
				innerPieces = currentIP.children;
				for ( let piece of innerPieces ) {
					piece.classList.remove( "pieceBlack" );
					piece.classList.add( "pieceDefault" );
				}
				
				currentIPID = `IP_${currentValue[3][1]}_${currentValue[0]}`;
				logger("currentIPID: " + currentIPID);
				currentIP = document.getElementById( currentIPID );
				innerPieces = currentIP.children;
				for ( let piece of innerPieces ) {
					piece.classList.remove( "pieceBlack" );
					piece.classList.add( "pieceDefault" );
				}
				
				currentIPID = `DGIP_${currentValue[4]}_${currentValue[0]}`;
				logger("currentIPID: " + currentIPID);
				currentIP = document.getElementById( currentIPID );
				innerPieces = currentIP.children;
				for ( let piece of innerPieces ) {
					piece.classList.remove( "pieceBlack" );
					piece.classList.add( "pieceDefault" );
				}	
				
			};
			
			sequenceItem = [ t, f_secondTrioVisible  ];
			flashSequence.push( sequenceItem );
			t += 500;
	
		let f_secondTrioInvisible = function () {
			
				currentIPID = `IP_${currentValue[3][0]}_${currentValue[0]}`;
				logger("currentIPID: " + currentIPID);
				currentIP = document.getElementById( currentIPID );
				innerPieces = currentIP.children;
				for ( let piece of innerPieces ) {
					piece.classList.remove( "pieceDefault" );
					piece.classList.add( "pieceBlack" );
				}
				
				currentIPID = `IP_${currentValue[3][1]}_${currentValue[0]}`;
				logger("currentIPID: " + currentIPID);
				currentIP = document.getElementById( currentIPID );
				innerPieces = currentIP.children;
				for ( let piece of innerPieces ) {
					piece.classList.remove( "pieceDefault" );
					piece.classList.add( "pieceBlack" );
				}
				
				currentIPID = `DGIP_${currentValue[4]}_${currentValue[0]}`;
				logger("currentIPID: " + currentIPID);
				currentIP = document.getElementById( currentIPID );
				innerPieces = currentIP.children;
				for ( let piece of innerPieces ) {
					piece.classList.remove( "pieceDefault" );
					piece.classList.add( "pieceBlack" );
				}	
				
			};
			
			sequenceItem = [ t, f_secondTrioInvisible  ];
			flashSequence.push( sequenceItem );
			t += 500;
		
	});
	
	let f_lastOfGameOver = function () {
		unBlackOutBoards();
		let rb = document.getElementById( "resetButton" );
		rb.innerHTML = "REPLAY";
		rb.disabled = false;
		document.getElementById( "GOLabel" ).classList.remove( "renderInvisible");
		document.getElementById( "TBGO_smiley" ).classList.remove( "renderInvisible");
	};
		
	sequenceItem = [ t, f_lastOfGameOver ];
	flashSequence.push( sequenceItem );
	
	scheduleUtilities.runSequence( flashSequence );
	
}

function blackOutBoards() {
	
	for ( let r=0; r<=3; r++ ) {
		for ( let c=0; c<=2; c++ ) {
			let currentIP = document.getElementById( `IP_${r}_${c}` );
			let innerPieces = currentIP.children;
			for ( let piece of innerPieces ) {
				piece.classList.remove( "pieceDefault" );
				piece.classList.add( "pieceBlack" );
			}			
		}
	}
	
	for ( let r=0; r<=1; r++ ) {
		for ( let c=0; c<=2; c++ ) {
			let currentIP = document.getElementById( `DGIP_${r}_${c}` );
			let innerPieces = currentIP.children;
			for ( let piece of innerPieces ) {
				piece.classList.remove( "pieceDefault" );
				piece.classList.add( "pieceBlack" );
			}			
		}
	}	
}

function unBlackOutBoards() {
	
	for ( let r=0; r<=3; r++ ) {
		for ( let c=0; c<=2; c++ ) {
			let currentIP = document.getElementById( `IP_${r}_${c}` );
			let innerPieces = currentIP.children;
			for ( let piece of innerPieces ) {
				piece.classList.remove( "pieceBlack" );
				piece.classList.add( "pieceDefault" );
			}			
		}
		
	}
	
	for ( let r=0; r<=1; r++ ) {
		for ( let c=0; c<=2; c++ ) {
			let currentIP = document.getElementById( `DGIP_${r}_${c}` );
			let innerPieces = currentIP.children;
			for ( let piece of innerPieces ) {
				piece.classList.remove( "pieceBlack" );
				piece.classList.add( "pieceDefault" );
			}			
		}
		
	}	
}

function gameContinueSequence( matchElements ) {
	
	let enhanceSequence = [];
	let t;
	
	if ( matchElements.length > 0  ) {
		
		t = 250;
		let KGD = document.getElementById( "keepGoingDialogueNFM" );
		let f_displayKeepGoing = function () {
			KGD.classList.remove( "renderInvisible");
		};
		
		let sequenceItem = [ t, f_displayKeepGoing ];
		enhanceSequence.push( sequenceItem );
		t += 800;
		
		let f_undisplayKeepGoing = function () {
			KGD.classList.add( "renderInvisible");
		};
		
		sequenceItem = [ t, f_undisplayKeepGoing ];
		enhanceSequence.push( sequenceItem );	
		
		matchElements.forEach((currentValue) => {
				
			let f_enhance = function () {
		  		let c = currentValue[0];
		  		let r = currentValue[1][0];
		  		let eID = `IP_${r}_${c}`;
		  		enhanceInner( eID );
	  		
		  		r = currentValue[1][1];
		  		eID = `IP_${r}_${c}`;
		  		enhanceInner( eID );
	  		
		  		r = currentValue[2];
		  		let DID = `DGIP_${r}_${c}`;
		  		enhanceInner( DID );
	  		
		  		graphicFlashColorPairsRunningIndex++;
		  		if ( graphicFlashColorPairsRunningIndex >= (graphicFlashColorPairsLength-1) ) {
					graphicFlashColorPairsRunningIndex = 0;
				}
				
				
		  		r = currentValue[3][0];
		  		eID = `IP_${r}_${c}`;
		  		enhanceInner( eID );
		  		
		  		r = currentValue[3][1];
		  		eID = `IP_${r}_${c}`;
		  		enhanceInner( eID );
	  		
		  		r = currentValue[4];
		  		DID = `DGIP_${r}_${c}`;
		  		enhanceInner( DID );
	  		
		  		graphicFlashColorPairsRunningIndex++;
		  		if ( graphicFlashColorPairsRunningIndex >= (graphicFlashColorPairsLength-1) ) {
					graphicFlashColorPairsRunningIndex = 0;
				}
				
			};
			let sequenceItem = [ t, f_enhance ];
			enhanceSequence.push( sequenceItem );
			t += 700;
			
			
			let f_unenhance = function () {
		  		let c = currentValue[0];
		  		let r = currentValue[1][0];
		  		let eID = `IP_${r}_${c}`;
		  		unenhanceInner( eID );
	  		
		  		r = currentValue[1][1];
		  		eID = `IP_${r}_${c}`;
		  		unenhanceInner( eID );
	  		
		  		r = currentValue[2];
		  		let DID = `DGIP_${r}_${c}`;
		  		unenhanceInner( DID );
	  		
		  		graphicFlashColorPairsRunningIndex++;
		  		if ( graphicFlashColorPairsRunningIndex >= (graphicFlashColorPairsLength-1) ) {
					graphicFlashColorPairsRunningIndex = 0;
				}
				
		  		r = currentValue[3][0];
		  		eID = `IP_${r}_${c}`;
		  		unenhanceInner( eID );
		  		
		  		r = currentValue[3][1];
		  		eID = `IP_${r}_${c}`;
		  		unenhanceInner( eID );
	  		
		  		r = currentValue[4];
		  		DID = `DGIP_${r}_${c}`;
		  		unenhanceInner( DID );
				
			};
			sequenceItem = [ t, f_unenhance ];
			enhanceSequence.push( sequenceItem );
			t += 700;
	
		});
		
		t -= 300;
		let KGDNM = document.getElementById( "keepGoingDialogueNM" );
		let f_displayKeepGoingNM = function () {
			KGDNM.classList.remove( "renderInvisible");
		};
		
		sequenceItem = [ t, f_displayKeepGoingNM ];
		enhanceSequence.push( sequenceItem );
		t += 600;
		
		let f_undisplayKeepGoingNM = function () {
			KGDNM.classList.add( "renderInvisible");
			enableAllArrows();
			document.getElementById( "resetButton" ).disabled = false;
		};
		
		sequenceItem = [ t, f_undisplayKeepGoingNM ];
		enhanceSequence.push( sequenceItem );
	}
	else {
		t = 120;
		let KGD = document.getElementById( "keepGoingDialogueNM" );
		let f_displayKeepGoing = function () {
			KGD.classList.remove( "renderInvisible");
		};
		
		sequenceItem = [ t, f_displayKeepGoing ];
		enhanceSequence.push( sequenceItem );
		t += 600;
		
		let f_undisplayKeepGoing = function () {
			KGD.classList.add( "renderInvisible");
			enableAllArrows();
			document.getElementById( "resetButton" ).disabled = false;
		};
		
		sequenceItem = [ t, f_undisplayKeepGoing ];
		enhanceSequence.push( sequenceItem );
		
	}
	
	t += 100;
	let f_setTouchState = function () {
		touchState = "readyForSwipe";
		logger( "Setting touchState to readyForSwipe" );
	};
	sequenceItem = [ t, f_setTouchState ];
	enhanceSequence.push( sequenceItem );
	
	scheduleUtilities.runSequence( enhanceSequence );
	
}


function dataDoctor() {
	
	/* To match columns 1 and 2 only */
	/* Move bottom row to the right */
	/*
	testColumn = 0;
	current3by4SegmentGrid[0][testColumn] = 0b11100000;
	current3by4SegmentGrid[1][testColumn] = 0b00000110;
	current3by4SegmentGrid[2][testColumn] = 0b00001010;
	current3by4SegmentGrid[3][2] = 0b10110000;

	testColumn = 1;
	current3by4SegmentGrid[0][testColumn] = 0b00011010;
	current3by4SegmentGrid[1][testColumn] = 0b10100000;
	current3by4SegmentGrid[2][testColumn] = 0b11000100;
	current3by4SegmentGrid[3][0] = 0b00010110;
	
	testColumn = 2;
	current3by4SegmentGrid[0][testColumn] = 0b01010000;
	current3by4SegmentGrid[1][testColumn] = 0b11010000;
	current3by4SegmentGrid[2][testColumn] = 0b00100110;
	current3by4SegmentGrid[3][1] = 0b00100100;
	*/
	
	
	/* Need all three columns to ALMOST match */
	/* This is one move short of a complete match */
	/* Move bottom row to the right */

	testColumn = 0;
	current3by4SegmentGrid[0][testColumn] = 0b11010000;
	current3by4SegmentGrid[1][testColumn] = 0b00000110;
	current3by4SegmentGrid[2][testColumn] = 0b00001010;
	current3by4SegmentGrid[3][2] = 0b10110000;

	testColumn = 1;
	current3by4SegmentGrid[0][testColumn] = 0b00011010;
	current3by4SegmentGrid[1][testColumn] = 0b10100000;
	current3by4SegmentGrid[2][testColumn] = 0b11000100;
	current3by4SegmentGrid[3][0] = 0b00010110;
	
	testColumn = 2;
	current3by4SegmentGrid[0][testColumn] = 0b01010000;
	current3by4SegmentGrid[1][testColumn] = 0b11010000;
	current3by4SegmentGrid[2][testColumn] = 0b00100110;
	current3by4SegmentGrid[3][1] = 0b00100100;
	
}

function enhanceInner( innerID ) {
	
	/* Remove all colors */
	let innerElement = document.getElementById( innerID );
	innerElement.classList.remove( "innerPerimeterDefault");
	
	/* Now give it a color and enhance it */
	let IPColor = graphicFlashColorPairs[graphicFlashColorPairsRunningIndex][1];
	innerElement.classList.add( IPColor );
	innerElement.classList.add( "innerPerimeterEnhance");
	
	/* Update the pieces inside */
	let pieceColor = graphicFlashColorPairs[graphicFlashColorPairsRunningIndex][0];
	let innerPieces = innerElement.children;
	for ( let piece of innerPieces ) {
		piece.classList.remove( "pieceDefault" );
		piece.classList.add( pieceColor );
	}
}

function unenhanceInner( innerID ) {
	
	/* Remove all colors */
	let innerElement = document.getElementById( innerID );
	innerElement.classList.remove( "innerPerimeterGreenYellow");
	innerElement.classList.remove( "innerPerimeterDeepPink");
	innerElement.classList.remove( "innerPerimeterDarkTurquoise");
	innerElement.classList.remove( "innerPerimeterWhite");
	innerElement.classList.remove( "innerPerimeterEnhance");
	
	/* Now restore it */
	innerElement.classList.remove( "innerPerimeterDefault");
	
	/* Restore the pieces inside */
	let innerPieces = innerElement.children;
	for ( let piece of innerPieces ) {
		piece.classList.remove( "pieceRed" );
		piece.classList.remove( "pieceWhite" );
		piece.classList.remove( "piecePurple" );
		piece.classList.remove( "pieceBlack" );
		piece.classList.add( "pieceDefault" );
	}
}

/* **************************************** */
function disableAllArrows() {
	
	let allArrowElements = document.getElementById( "arrowContainer" ).children;
	
	Array.from( allArrowElements ).forEach(( arrowElement ) => {
		arrowElement.disabled = true;
	});
	
}
function enableAllArrows() {
	
	let allArrowElements = document.getElementById( "arrowContainer" ).children;
	
	Array.from( allArrowElements ).forEach(( arrowElement ) => {
		arrowElement.disabled = false;
	});
	
}


/* **************************************** */
function testDisplayableSegemnts() {
	
	/* Clear segment grid */
	for (let r=0; r<=3; r++ ) {
		for (let c=0; c<=2; c++) {
			document.getElementById( `IP_${r}_${c}` ).replaceChildren();
		}
	}
	
	/* Displays ALL segment pairs in upper left inner perimeters */
	masterSegmentMap.forEach(( value, key, map ) => {
		
		let v = value;
			
		document.getElementById( "TCField" ).innerHTML = key;
		
		value.forEach(( segmentPair, kkey, mmap ) => {
		
			let s = segmentPair;
			
			let s0 = s[0];
			let s1 = s[1];
			segmentContainer0 = document.getElementById( "IP_0_0" );
			segmentContainer1 = document.getElementById( "IP_0_1" );
			
			fillInSegment( segmentContainer0, s0 );
			fillInSegment( segmentContainer1, s1 );
			
			let end=0;
			
			document.getElementById( "IP_0_0" ).replaceChildren();
			document.getElementById( "IP_0_1" ).replaceChildren();
		
		});
	});
	
}

function touchSM (touchEvent, p1, p2 ) {
	
	let rv;
	
	switch (touchEvent) {
  		case "touchstart":
			switch(touchState) {
		  		case "unreadyGameState":
					/* Do nothing.  "Play" will change out of this state. */
		    	break;
		  		case "readyForSwipe":
					rv = figureOutRowAndColumn( p1, p2 );
					if ( outOfBounds( rv ) ) {
						touchState = "outOfBoundsTouchDown";
						logger("-> " + touchState);
					}
					else {
						touchState = "bothRowAndColumn";
						startSwipeTime = Date.now();
						touchRowColumnPair = rv;
						swipeDataQuardruplets = [];
						swipeDataQuardruplets.push( [ p1, p2, 0, 0 ] );
					}
		    	break;
			}		
		break;

  		case "touchend":
			switch(touchState) {
		  		case "outOfBoundsTouchDown":
					touchState = "readyForSwipe";
		    	break;
		  		case "bothRowAndColumn":
					touchState = "readyForSwipe";
		    	break;
		  		case "RowColumnIsDecided":
					processSwipe();
		    	break;
		  		case "InvalidSwipeOperation":
					touchState = "readyForSwipe";
		    	break;
			}	
		break;

  		case "touchmove":
			switch(touchState) {
		  		case "outOfBoundsTouchDown":
					rv = figureOutRowAndColumn( p1, p2 );
					if ( outOfBounds( rv ) ) {
						logger("-> " + touchState);
					}
					else {
						touchState = "bothRowAndColumn";
						logger("-> " + touchState);
						startSwipeTime = Date.now();
						touchRowColumnPair = rv;
						swipeDataQuardruplets = [];
						swipeDataQuardruplets.push( [ p1, p2, 0, 0 ] );
					}
		    	break;
		  		case "bothRowAndColumn":
					rv = figureOutRowAndColumn( p1, p2 );
					let tmr = touchMoveResult( rv );
					if ( tmr == "sameRowAndColumn" ) {
						touchState = "bothRowAndColumn";
						
						let SDQLength = swipeDataQuardruplets.length;
						let dx = p1 - swipeDataQuardruplets[SDQLength-1][0];
						let dy = p2 - swipeDataQuardruplets[SDQLength-1][1];
						swipeDataQuardruplets.push( [p1, p2, dx, dy] );
						
					}
					else if ( tmr == "sameColumn" || tmr == "sameRow" ) {
						touchState = "RowColumnIsDecided";
						
						soleRowOrColumn = touchRowColumnPair[1];
						rowColumnDecision = "column";
						
						if ( touchRowColumnPair[0] == rv[0] && touchRowColumnPair[1] != rv[1] ) {
							soleRowOrColumn = touchRowColumnPair[0];
							rowColumnDecision = "row";
						}
						
						let SDQLength = swipeDataQuardruplets.length;
						let dx = p1 - swipeDataQuardruplets[SDQLength-1][0];
						let dy = p2 - swipeDataQuardruplets[SDQLength-1][1];
						swipeDataQuardruplets.push( [p1, p2, dx, dy] );
					}
					else if ( tmr == "InvalidResult") {
						touchState = "InvalidSwipeOperation";
					}
		    	break;
		  		case "InvalidSwipeOperation":
					touchState = "InvalidSwipeOperation"; // same
		    	break;
		  		case "RowColumnIsDecided":
					rv = figureOutRowAndColumn( p1, p2 );
					if ( rowColumnDecision == "row" && rv[0] == soleRowOrColumn ) {
						
						let SDQLength = swipeDataQuardruplets.length;
						let dx = p1 - swipeDataQuardruplets[SDQLength-1][0];
						let dy = p2 - swipeDataQuardruplets[SDQLength-1][1];
						swipeDataQuardruplets.push( [p1, p2, dx, dy] );
					}
					else if ( rowColumnDecision == "column" && rv[1] == soleRowOrColumn ) {
						
						let SDQLength = swipeDataQuardruplets.length;
						let dx = p1 - swipeDataQuardruplets[SDQLength-1][0];
						let dy = p2 - swipeDataQuardruplets[SDQLength-1][1];
						swipeDataQuardruplets.push( [p1, p2, dx, dy] );
					}
					else {
						touchState = "InvalidSwipeOperation";
					}
					
		    	break;
			}	
		break;
	}
	
}
	
function processSwipe() {
	
	let elapsedTime = Date.now() - startSwipeTime;
	
	if (elapsedTime > 2000) {
		touchState = "readyForSwipe";
		return;
	}
	
	let netDX;
	let netDY
	
	let dataLength = swipeDataQuardruplets.length;
	if ( rowColumnDecision == "row" ) {
		netDX = swipeDataQuardruplets[dataLength-1][0] - swipeDataQuardruplets[0][0];

		if ( netDX > 0 && swipeDataQuardruplets[dataLength-1][2] < 0 ) {
			logger( "Invalid x" );
			touchState = "readyForSwipe";
			return;
		}
		if ( netDX < 0 && swipeDataQuardruplets[dataLength-1][2] > 0 ) {
			logger( "Invalid x" );
			touchState = "readyForSwipe";
			return;
		}		
		
	}
	else if ( rowColumnDecision == "column" ) {
		netDY = swipeDataQuardruplets[dataLength-1][1] - swipeDataQuardruplets[0][1];
		
		if ( netDY > 0 && swipeDataQuardruplets[dataLength-1][3] < 0 ) {
			logger( "Invalid y" );
			touchState = "readyForSwipe";
			return;
		}
		if ( netDY < 0 && swipeDataQuardruplets[dataLength-1][3] > 0 ) {
			logger( "Invalid y" );
			touchState = "readyForSwipe";
			return;
		}
	}
	touchState = "enactingArrow";
	logger( "--->::: " + touchState );
	
	let simulatedArowID;
	if ( rowColumnDecision == "row" && netDX > 0  ) {
		simulatedArowID = "arrowRight_" + soleRowOrColumn;
	}
	else if ( rowColumnDecision == "row" && netDX < 0  ) {
		simulatedArowID = "arrowLeft_" + soleRowOrColumn;
	}
	else if ( rowColumnDecision == "column" && netDY > 0  ) {
		simulatedArowID = "arrowBottom_" + soleRowOrColumn;
	}
	else if ( rowColumnDecision == "column" && netDY < 0  ) {
		simulatedArowID = "arrowTop_" + soleRowOrColumn;
	}

	enactArrow( simulatedArowID );
	
}


function outOfBounds( pair ) {
	if ( pair[0] == -1 || pair[1] == -1 ) {
		return true;
	}
	return false;
}


function touchMoveResult( pair ) {

	if ( pair[0] == -1 || pair[1] == -1 ) {
		return "InvalidResult";
	}
	
	if ( pair[0] == touchRowColumnPair[0] && pair[1] == touchRowColumnPair[1] ) {
		return "sameRowAndColumn";
	}
	else if ( pair[0] == touchRowColumnPair[0] && pair[1] != touchRowColumnPair[1] ) {
		return "sameRow";
	}
	else if ( pair[0] != touchRowColumnPair[0] && pair[1] == touchRowColumnPair[1] ) {
		return "sameColumn";
	}
	else if ( pair[0] != touchRowColumnPair[0] && pair[1] != touchRowColumnPair[1] ) {
		return "InvalidResult";
	}
}

function figureOutRowAndColumn( startX, startY ) {
	
	let theRow = -1;
	
	if ( startY > 51 && startY <= 121) {
		theRow = 0;
	}
	else if ( startY > 121 && startY <= 200) {
		theRow = 1;
	}
	else if ( startY > 200 && startY <= 279) {
		theRow = 2;
	}
	else if ( startY > 279 && startY < 350) {
		theRow = 3;
	}
	
	let theColumn = -1;
	if ( startX > 64 && startX <= 138 ) {
		theColumn = 0;
	}
	else if ( startX > 138 && startX <= 226 ) {
		theColumn = 1;
	}
	else if ( startX > 226 && startX < 300 ) {
		theColumn = 2;
	}
	
	return [ theRow, theColumn ];
	
}


function fingerSlideSetup() {

	document.addEventListener('touchstart', (touchEvent) => {
		
	  	startX = touchEvent.touches[0].clientX;
	  	startY = touchEvent.touches[0].clientY; 	
	  	touchSM( 'touchstart', startX, startY );
	});

	document.addEventListener('touchmove', (touchEvent) => {
		
		endX = touchEvent.touches[0].clientX;
		endY = touchEvent.touches[0].clientY;
	  	touchSM( 'touchmove', endX, endY );
	});

	document.addEventListener('touchend', (touchEvent) => {
	  	touchSM( 'touchend', null, null );
	});
}






