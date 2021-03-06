// === API Variables ===

// Source
var apiSource = "http://api.kwielford.com/meta/mood.json";
var faceSource = "http://api.kwielford.com/meta/face.json";

// Refresh rate (in seconds)
var apiRefreshRate = 20;

// === Metrics Variables ===

var stressBreakpoint = 50;
var thirstBreakpoint = 50;
var tempBreakpoint = 50;
var sociabilityBreakpoint = 50;
var energyBreakpoint = 50;
var lowEnergyBreakpoint = 20;

// === Media Queries ===

// Medium Width
var mediumWidth = 800;

// === Reveal Transition === 

// Duration
var timing = 1200;



// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


// Api Initialised
$(function(){
    updateInfo();
});


// Api Refresh
var refreshRate = apiRefreshRate * 1000;
setInterval(function(){
    updateInfo();   
},refreshRate);


// Responsive resizing of the canvas ( Temp - this just streches it if its bigger than inital size )
$(window).on('resize load', function(){
    if ($(window).innerWidth() <= 800) {
        var matrixWidth = $(window).innerWidth() /1.5;
        $('#matrix').width(matrixWidth);
    } else {
        $('#matrix').width('auto');
    }
});


function slideFaceUp() {
    kwizFace.css({ 'top' : ( '-101%') });
    kwizFace.css({ 'transition' : 'all '+timing+'ms ease-in-out'});
    topVisible = false;
    $('.hide-ribbon').addClass('slide-out');
}

function slideFaceDown() {
    kwizFace.css({ 'top' : ( '0%') });
    kwizFace.css({ 'transition' : 'all '+timing+'ms ease-in-out'});
    topVisible = true;
    $('.hide-ribbon').removeClass('slide-out');
}

// Reveal Buttons
var kwizFace = $('.casing');
var topVisible = true;


// Desktop Face-reveal.
$(window).on('mousewheel', function(e) {
    if(e.deltaY < 0) {
        if ( topVisible == true) {
            slideFaceUp();
        };
    } else {
            if ( topVisible == false && $('.container').scrollTop() == 0) {
            slideFaceDown();
        };
    }
});

// Prevent page scroll when the face is visible.
$(document).on('touchstart',function(e){
    if ( topVisible == true ) {
        e.preventDefault();
    } else {
        return true;
    }
});

// Mobile face reveal.
var lastY;
$(document).bind('touchmove', function (e){
     var currentY = e.originalEvent.touches[0].clientY;
     if(currentY < lastY){
        if ( topVisible == true) {
            slideFaceUp();
        }
    }
     lastY = currentY;
});


// Mobile face hide.
$('.hide').on('click', function(){
    slideFaceDown();
    return false;
});

    

// Little bit of jitter on the stress meter.

// Every second update the degree by +1 or -2  to give it a bit of small random movement similar to a real dial.

var b = 0;

setInterval(function(){ 

    b++
    var degreeChange = Math.floor(Math.random() * 2) + 1
    var stressDegree = currentStress;

    // Every other iteration it adds or deletes - keeps it closer to the original number.
    if ( b % 2 === 0) {
        $('.stress-o-meter .pointer').css("-webkit-transform", "rotate("+(Number(stressDegree)+degreeChange)+"deg)");
    } else {
        $('.stress-o-meter .pointer').css("-webkit-transform", "rotate("+(Number(stressDegree)-degreeChange)+"deg)");
    }
}, 1000);


function updateInfo(){
    $.get( apiSource, function( data ) {

        var currentMood = data.mood.mood;
        // var currentEnergy = data.mood.metrics.energy;
        currentEnergy = data.mood.metrics.energy;
        currentStress = data.mood.metrics.stress;
        currentThirst = data.mood.metrics.thirst;
        currentTemperature = data.mood.metrics.temperature;
        currentSociability = data.mood.metrics.sociability;

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

        // Thirst 

        if (currentThirst >= thirstBreakpoint) {
            $('.thirsty').html(' He is also quite thirsty.');
        } else {
            $('.thirsty').html(' He is also not that thirsty.');
        };

        $('.thirst-meter .progress').css('height',currentThirst+'%');


        // Energy 

        if (currentEnergy >= energyBreakpoint) {
            $('p .mood').append(', energetic');
        };

        if (currentEnergy <= lowEnergyBreakpoint) {
            $('.energy-meter').addClass('low-energy')
        }

        $('.energy-meter .progress').css('width',currentEnergy+'%');

        // Temperature 

        if (currentTemperature >= tempBreakpoint) {
            $('p .mood').append(', warm');
            $('.sunny').addClass('visible');
        } else {
            $('.rainy').addClass('visible');
        }

        // Sociability 

        if (currentSociability <= sociabilityBreakpoint) {
            $('.social').html("Kwielford dosn't want to talk right now.");
        } else {
            $('.social').html("Kwielford is happy to talk <a href='#'>here</a>.");
        }

        // Face


        // clock();
        
    });

    $.get( faceSource, function( data ) {

        var currentFace = data.face.face;

        for (var i = 0, len = currentFace.length; i < len; i ++) {
            currentFace[i] = currentFace[i].split('');
        }

        var canvas = document.getElementById('matrix'),
            context = canvas.getContext('2d');

        matrix.animateIn(canvas, currentFace);

        var text = matrix.createTextMatrix("Great to see our friends SparkAndMettle get a mention here. Also AppsforGoodCDI http://fldwrk.co/1jHXX0X ");
        counter = 0;

        function animloop(){
            requestAnimationFrame(animloop);

            counter++;
            if (counter % parseInt(matrix.scrollInterval * 60) == 0){
            matrixData = matrix.scrollData(text);

            matrix.draw(
                canvas, 
                matrixData, 
                10, 
                {
                    1: 'rgba(255,255,255,1)', 
                    0: 'rgba(255,255,255,0.3)'
                }
            );
            }
        }

        //uncomment the below to sroll some text
        // animloop();

        var text = matrix.createTextMatrix(getTime());
        function clock(){
            requestAnimationFrame(clock);

            counter++;
            if (counter % parseInt(matrix.scrollInterval * 60) == 0){
                text = matrix.createTextMatrix(getTime());
                matrix.draw(
                    canvas, 
                    text, 
                    10, 
                    {
                        1: 'rgba(255,255,255,1)', 
                        0: 'rgba(255,255,255,0.3)'
                    }
                );
            }
        }
    });
};

var matrix = {

    canvas: null,
    width: 32,
    finalFrame: [],
    currentFrame: [],
    currentCell: [0,0],
    totalCells: 0,
    animatedCells: 0,
    animationCompleted: false,
    lastStep: 0,
    stepInterval: 30,
    scrollInterval: 0.25, //seconds

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
        var xMultiplier = canvas.width / matrix.width;

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

    createTextMatrix: function(text){
        //the font only contains uppercase letters so make sure all letters are uppercase
        text = text.toUpperCase();

        //create an array of 8 strings filled with 32 zeros (32 chars is the minimum width a message can be)
        data = Array(8);
        for (i = 0;i<8;i++){
            data[i] = Array(33).join("0");
        }

        //the middle 4 rows are where are text is going to be
        data[2] = data[3] = data[4] = data[5] = "";

        //write the text data
        for (j = 0 ; j < text.length ; j++){
            spacing = (j == text.length -1) ? "000" : "0";
            if (text[j] == " ") spacing = "";
            for (k = 2 ; k <= 5 ; k++){
                data[k] += font[text[j]][k-2] + spacing;
            }
        }

        //pad any unfilled rows with zeros
        for (i = 2;i<7;i++){
            if (data[i].length < 32){
                data[i] += Array(33 - data[i].length).join("0");
            }
        }

        return data;

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
    },

    scrollData: function(data){
        
        for (i = 0;i<data.length;i++){
            data[i] = data[i].substr(1) + data[i].substr(0,1);
        }

        return data;
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

function getTime() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    return timeString = String(padZero(h)) + ":" + String(padZero(m)) + ":" + String(padZero(s));
}

function padZero(num) {
    if (num < 10) { 
        return "0" + String(num);
    }
    else {
        return String(num);
    }
}
