

$(function(){

    $.get( "http://api.kwielford.com/meta/mood.json", function( data ) {

        var currentMood = data.mood.mood;
        var currentFace = data.mood.face;
        var currentEnergy = data.mood.metrics.energy;
        var currentStress = data.mood.metrics.stress;
        var currentThirst = data.mood.metrics.thirst;
        var currentTemperature = data.mood.metrics.temperature;
        var currentSociability = data.mood.metrics.sociability;

        $('.mood').html(currentMood);
        $('.energy').html(currentEnergy);
        $('.stress').html(currentStress);
        $('.thirst').html(currentThirst);
        $('.temperature').html(currentTemperature);
        $('.sociability').html(currentSociability);

        // Stressed

        if (currentStress >= 50) {
            $('.stressed').html('very stressed.');
        } else {
            $('.stressed').html('not that stressed.');
        };

            // Stress-o-meter

            $('.stress-o-meter .pointer').css("-webkit-transform", "rotate("+currentStress+"deg)");
            // Every second update the degree by +1 or -2  to give it a bit of small random movement similar to a real dial.
            // Needs some tweaking, currently looks a bit floating and not very convincing.
                            
            setInterval(function(){ 
                i++
                var degreeChange = Math.floor(Math.random() * 2) + 1
                var stressDegree = currentStress;

                if ( i && (i % 2 === 0)) {
                    $('.stress-o-meter .pointer').css("-webkit-transform", "rotate("+(Number(stressDegree)+degreeChange)+"deg)");
                } else {
                    $('.stress-o-meter .pointer').css("-webkit-transform", "rotate("+(Number(stressDegree)-degreeChange)+"deg)");
                }
            }, 1000);

        // Thirst 

        if (currentThirst >= 50) {
            $('.thirsty').html(' He is also quite thirsty.');
        } else {
            $('.thirsty').html(' He is also not that thirsty.');
        };

        $('.thirst-meter .progress').css('width',currentThirst+'%');


        // Energy 

        if (currentEnergy >= 50) {
            $('p .mood').append(', energetic');
        };

        $('.energy-meter .progress').css('width',currentEnergy+'%');

        // Temperature 

        if (currentTemperature >= 51) {
            $('p .mood').append(', warm');
            $('.sunny').addClass('visible');
        } else {
            $('.rainy').addClass('visible');
        }

        // Sociability 

        if (currentSociability <= 50) {
            $('.about').append("<p>Kwielford dosn't want to talk right now.</p>");
        };

        // Face

        for (var i = 0, len = currentFace.length; i < len; i ++) {
            currentFace[i] = currentFace[i].split('');
        }

        var canvas = document.getElementById('matrix'),
            context = canvas.getContext('2d');

        matrix.animateIn(canvas, currentFace);

        // matrix.draw(
        //     canvas, 
        //     currentFace, 
        //     10, 
        //     {
        //         1: 'rgba(255,255,255,1)', 
        //         0: 'rgba(255,255,255,0.3)'
        //     }
        // );
        
    });




});


// Internal reveal.
// Note: deltaY = Scroll direction normalised across browsers

var div = $('.casing');
var i = 0;
var timing = 1500;

    $('.reveal').on('click', function(){
        div.css({ 'top' : ( '-101%') });
        div.css({ 'transition' : 'all '+timing+'ms ease-in-out'});
                setTimeout(function(){
            div.css({ 'transition' : 'all 0s ease-in-out'});
        },timing);
        i = 102;
        return false;
    });

$(window).on('mousewheel', function(e) {

    // if is scrolling up remove -3% from top style 
    if(e.deltaY > 0) {
      i-=3
      if ( i > -3) { div.css({ 'top' : ( '-'+i+'%') }) };
    } else  {
    // Otherwise add +3% to the top style.
      i+=3
      if ( i < 103) {div.css({ 'top' : ( '-'+i+'%') }) };
    }
    // Limited to within 0 - 100 range.


    // When the overlay is fully hidden you can then scroll the container.
    if ( i >= 100 ) {
        $('.container').css('overflow','auto');
    } else {
        $('.container').css('overflow','hidden');
        // Reset the scroll on the container as this can get out of sync if you scroll up and down alot.
        $('.container').scrollTop(0);
    }

    // Reset i if the user keeps scrolling up.
    if ( i < 0 ) {
        i = 0;
    }


});


var matrix = {

    canvas: null,
    finalFrame: [],
    currentFrame: [],
    currentCell: [0,0],
    totalCells: 0,
    animatedCells: 0,
    animationCompleted: false,
    lastStep: 0,
    stepInterval: 30,

    animateIn: function(canvas, data) {
        // Set up animation vars
        matrix.canvas = canvas;
        matrix.finalFrame = data;
        matrix.currentFrame = matrix.blankFrame(data);
        matrix.currentCell = [0,0];
        matrix.totalCells = countFilledCellsInMatrix(matrix.finalFrame);
        matrix.animatedCells = 0;
        matrix.animationCompleted = false;
        matrix.lastStep = 0;

                // shim layer with setTimeout fallback
        window.requestAnimFrame = (function(){
          return  window.requestAnimationFrame       ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame    ||
                  function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                  };
        })();


        // Start the animation
        window.requestAnimFrame(matrix.animationStep);
    },

    animationStep: function() {
        if (new Date().getTime() - matrix.lastStep >= matrix.stepInterval) {
            matrix.lastStep = new Date().getTime();

            // Set data for frame
            matrix.currentFrame[matrix.currentCell[0]][matrix.currentCell[1]] = matrix.finalFrame[matrix.currentCell[0]][matrix.currentCell[1]];

            // draw frame
            matrix.draw(
                matrix.canvas, 
                matrix.currentFrame, 
                10, 
                {
                    1: 'rgba(255,255,255,1)', 
                    0: 'rgba(255,255,255,0.3)'
                }
            );

            matrix.animatedCells ++;

            if (matrix.animatedCells > matrix.totalCells) {
                matrix.animationCompleted = true;
            }

            if (!matrix.animationCompleted) {
                // Set up next frame
                matrix.currentCell = matrix.nextCell(matrix.finalFrame, matrix.currentCell);
            }
        }

        if (!matrix.animationCompleted) {
            window.requestAnimFrame(matrix.animationStep);
        }
    },

    draw: function(canvas, data, radius, colors) {
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

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
    },

    blankFrame: function(data) {
        blank = [];

        for (var x = 0, xLen = data.length; x < xLen; x ++) {
            if (!blank[x]) {
                blank[x] = [];
            }

            for (var y = 0, yLen = data[x].length; y < yLen; y ++) {
                blank[x][y] = 0;
            }
        }

        return blank;
    },

    nextCell: function(data, startCell) {
        for (var x = startCell[0], xLen = data.length; x < xLen; x ++) {
            var y = (x === startCell[0]) ? startCell[1] : 0;
            for (var yLen = data[x].length; y < yLen; y ++) {
                if ((data[x][y] * 1) == 1 && (x !== startCell[0] || y !== startCell[1])) {
                    return [x, y];
                }
            }
        }
        return false;
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


/**
 * Count the total number of cells in a mtrix
 */
function countCellsInMatrix(arr) {
    var count = 0;

    for (var i = 0, len = arr.length; i < len; i ++) {
        count += arr[i].length;
    }

    return count;
}


/**
 * Count the total number of filled cells in a matrix
 */
function countFilledCellsInMatrix(arr) {
    var count = 0;

    for (var x = 0, xLen = arr.length; x < xLen; x ++) {
        for (var y = 0, yLen = arr[x].length; y < yLen; y ++) {
            count += (arr[x][y] * 1);
        }
    }

    return count;
}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

