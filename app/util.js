var Util = {
    randomInt: function(n1, n2) {
    	let n = parseInt ( Math.random() * ( n2-n1 ) ) + n1;
    	return n;
    },
    rankArray: function(toBeRanked) {
        // STEP 1
        var toBeRankedSorted = toBeRanked.slice().sort( function( a,b ) { return b-a; } ); // sort descending
        //var toBeRankedSorted = toBeRanked.slice().sort( function( a,b ) { return a-b; } ); // sort ascending

        var ranks = {}; // each value from the input array will become a key here and have a rank assigned
        var ranksCount = {}; // each value from the input array will become a key here and will count number of same elements

        // STEP 2
        for (var i = 0; i < toBeRankedSorted.length; i++) { // here we populate ranks and ranksCount
            var currentValue = toBeRankedSorted[ i ].toString();

            if ( toBeRankedSorted[ i ] != toBeRankedSorted[ i-1 ] ) ranks[ currentValue ] = i; // if the current value is the same as the previous one, then do not overwrite the rank that was originally assigned (in this way each unique value will have the lowest rank)
            if ( ranksCount[ currentValue ] == undefined ) ranksCount[ currentValue ] = 1; // if this is the first time we iterate this value, then set count to 1
            else ranksCount[ currentValue ]++; // else increment by one
        }

        var ranked = [];

        // STEP 3
        for (var i = toBeRanked.length - 1; i >= 0; i--) { // we need to iterate backwards because ranksCount starts with maximum values and decreases
            var currentValue = toBeRanked[i].toString();

            ranksCount[ currentValue ]--;
            if ( ranksCount[ currentValue ] < 0 ) { // a check just in case but in theory it should never fail
                console.error( "Negative rank count has been found which means something went wrong :(" );
                return false;
            }
            ranked[ i ] = ranks[ currentValue ]; // start with the lowest rank for that value...
            ranked[ i ] += ranksCount[ currentValue ]; // ...and then add the remaining number of duplicate values
        }

        return ranked;
    }
};
