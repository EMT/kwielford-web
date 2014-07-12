

$(function(){

    $.get( "http://api.kwielford.com/meta/mood.json", function( data ) {
        var currentMood = data.mood;
        var currentFace = currentMood.face;

        var canvas = document.getElementById('matrix'),
            context = canvas.getContext('2d');

        matrix.draw(
            canvas, 
            currentFace, 
            10, 
            {
                1: 'rgba(255,255,255,1)', 
                0: 'rgba(255,255,255,0.3)'
            }
        );
        
    });


});



var matrix = {

    draw: function(canvas, data, radius, colors) {
        var context = canvas.getContext('2d');


        var yMultiplier = canvas.height / data.length;
        var xMultiplier = canvas.width / findLengthOfLongestArray(data);


        for (var x = 0, xLen = data.length; x < xLen; x ++) {
            for (var y = 0, yLen = data[x].length; y < yLen; y ++) {
                matrix.circle(
                    context, 
                    (y * yMultiplier) + (yMultiplier / 2), 
                    (x * xMultiplier) + (xMultiplier / 2), 
                    radius,
                    colors[data[x][y]]
                );

            }
        }
    },

    circle: function(context, x, y, radius, color) {
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
    }
}


/**
 * Find the length of the longest array in an array of arrays
 * @param  array arr an array of arrays
 * @return integer     the length of the longest array
 */
function findLengthOfLongestArray(arr) {
    var l = 0;

    for (var i = 0, len = arr.length; i < len; i ++) {
        l = (arr[i].length > l) ? arr[i].length : l;
    }

    return l;
}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

