

	

$(function(){
	
	
    var canvas = document.getElementById('matrix'),
        context = canvas.getContext('2d');

    var data = [
        // [
        //     ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
        //     ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
        //     ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
        //     ['0','0','0','1','1','1','0','0','0','0','1','1','1','0','0','0'],
        //     ['0','0','0','1','1','1','0','0','0','0','1','1','1','0','0','0'],
        //     ['0','0','0','1','1','1','0','0','0','0','1','1','1','0','0','0'],
        //     ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
        //     ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
        //     ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
        //     ['0','0','0','1','1','1','1','1','1','1','1','1','1','0','0','0'],
        //     ['0','0','0','0','1','1','1','1','1','1','1','1','1','0','0','0'],
        //     ['0','0','0','0','0','1','1','1','1','1','1','1','1','0','0','0'],
        //     ['0','0','0','0','0','0','1','1','1','1','1','1','1','0','0','0'],
        //     ['0','0','0','0','0','0','0','1','1','1','1','1','1','0','0','0'],
        //     ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
        //     ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0']
        // ],
        [
            ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
            ['0','0','0','0','1','0','0','0','0','0','0','1','0','0','0','0'],
            ['0','0','0','1','1','1','0','0','0','0','1','1','1','0','0','0'],
            ['0','0','0','0','1','0','0','0','0','0','0','1','0','0','0','0'],
            ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
            ['0','0','0','0','1','1','1','1','1','1','1','1','0','0','0','0'],
            ['0','0','0','0','1','0','0','0','0','0','0','1','0','0','0','0'],
            ['0','0','0','0','1','0','0','0','0','0','0','1','0','0','0','0'],
            ['0','0','0','0','1','1','1','1','1','1','1','1','0','0','0','0'],
            ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0']
            ]
    ];

    matrix.draw(
        canvas, 
        data[getRandomInt(0, 1)], 
        10, 
        {
            1: 'rgb(255,255,255)', 
            0: 'rgb(120,120,120)'
        }
    );

    i=0;
    j = 0;
    (function animloop(){
        window.requestAnimationFrame(animloop);
        i++;
        context.clearRect(0,0,400,400);
        if (i % 500 > 0 && i % 500 < 10){
            matrix.draw(
                canvas, 
                data[1], 
                10, 
                {
                   1: 'rgb(255,255,255)', 
                   0: 'rgb(120,120,120)'
                }
            );
        } else {
            matrix.draw(
                canvas, 
                data[0], 
                10, 
                {
                   1: 'rgb(255,255,255)', 
                   0: 'rgb(120,120,120)'
                }
            );
        }
    })();
    
    
});



var matrix = {

    draw: function(canvas, data, radius, colors) {
        var context = canvas.getContext('2d');

        var xMultiplier = canvas.width / data.length;
        var yMultiplier = canvas.height / findLengthOfLongestArray(data);

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

