/* **************************************** */
class scheduleUtilities {
	
	static fakeConstructor() {}
	
	static schedulize( theSchedule, p=null ) {
		
		/* If theSchedule has dependencies, check if they are already fulfilled.  If */
		/* not, put the schedule on a waiting list. */
		if ( theSchedule.runDependency !== undefined ) {
			if ( scheduleUtilities.alreadyFulfilled( theSchedule.runDependency ) ) {
				/* Run it now */
				setTimeout( theSchedule.runSchedule(p), 10 );
			}
			else {
				/* Put it in the schedule waiting list */
				logger("  -> DEBUG: Putting in waiting list: " + theSchedule.name );
				if ( p != null ) {
					theSchedule.p = p;
				}
				instrumentControllerClass.scheduleWaitingList.push( theSchedule );
			}
		}
		else {
			/* Without a dependency, run it now */
			setTimeout( theSchedule.runSchedule(p), 10 );
		}
	}
	
	/* *************************************************** */
	static alreadyFulfilled( theRunDependency ) {
		//logger( "theRunDependency: " + theRunDependency );
		let result = theRunDependency();
		return result;
	}
	
	/* *************************************************** */
	static dependencyMatch( theRunDependency ) {
		//logger( "theRunDependency: " + theRunDependency );
		let result = theRunDependency();
		return result;
	}
	
	/* *************************************************** */
	static runDependentSchedule( currentWaiter, p=null ) {
		logger( "    DEBUG runDependentSchedule: " + currentWaiter );
		setTimeout( currentWaiter.runSchedule(p), 10 );
	}
	
	/* *************************************************** */
	static runSequence( realSchedule ) {

		for (let index = 0; index < realSchedule.length; index++) {
  			setTimeout( realSchedule[index][1], realSchedule[index][0] );
  		}
	}
}

