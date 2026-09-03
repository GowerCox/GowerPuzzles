var loggerOn;
var gameLoadState;
var gameContainer;
var mainContainer;
var theX;

/* **************************************** */
document.addEventListener("DOMContentLoaded", (event) => {
	loggerOn = true;
	gameLoadState = "loaded";
	gameContainer = document.getElementById('gameContainer');
	mainContainer = document.getElementById('mainContainer');
	theX = document.getElementById('closeX');
});

/* **************************************** */
function logger( m ) {
	if ( loggerOn ) { console.log(m); }
}

/* **************************************** */
function openPuzzle( whichPuzzle ) {
	
	gameSM( "open", whichPuzzle );
}

/* **************************************** */
function closePuzzle() {
	gameSM( "close" );
}

/* **************************************** */
function gameSM( gEvent, p1 ) {
	
	switch(gEvent) {
		
		case "open":
			switch(gameLoadState) {
				
				case "loaded":
					gameLoadState = "opening";
					document.getElementById("gameFrame").src = p1;
					gameContainer.style.display = "block";
					gameContainer.classList.add( "phaseInGeneral" );
					gameContainer.addEventListener("animationend", 
						function currentAnimator(e) {
						this.classList.remove( "phaseInGeneral" );
						this.getAnimations().forEach((anim) => { anim.cancel(); });	
						this.removeEventListener('animationend', currentAnimator);
						theX.style.display = "block";
						gameLoadState = "ready";
						}
	 				);
	 				logger("Start background phaseout here???");
	 				
	 				mainContainer.classList.add( "phaseOutGeneral" );
					mainContainer.addEventListener("animationend", 
						function currentAnimator(e) {
						this.classList.remove( "phaseOutGeneral" );
						this.getAnimations().forEach((anim) => { anim.cancel(); });	
						this.removeEventListener('animationend', currentAnimator);
						this.style.display = "none";
						}
	 				);	
	 				
	 				
				break;
			}
			break;
			
		case "close":
			switch(gameLoadState) {
				
				case "ready":
					gameLoadState = "closing";
					theX.style.display = "none";
					gameContainer.classList.add( "phaseOutGeneral" );
					gameContainer.addEventListener("animationend", 
						function currentAnimator(e) {
						this.classList.remove( "phaseOutGeneral" );
						this.getAnimations().forEach((anim) => { anim.cancel(); });	
						this.removeEventListener('animationend', currentAnimator);
						this.style.display = "none";
						gameLoadState = "loaded";
						}
	 				);
	 				
	 				mainContainer.style.display = "block";
	 				mainContainer.classList.add( "phaseInGeneral" );
					mainContainer.addEventListener("animationend", 
						function currentAnimator(e) {
						this.classList.remove( "phaseInGeneral" );
						this.getAnimations().forEach((anim) => { anim.cancel(); });	
						this.removeEventListener('animationend', currentAnimator);
						}
	 				);	
	 				
	 					
				break;
			}
			break;
		
	}
	
}