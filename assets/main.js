// Create a 2D array for the custom char
var customchar = new Array(8);
for (i = 0; i < customchar.length; i++) {
    customchar[i] = new Array(5);
}

function clear() {

    // Clear array
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 5; j++) {
            customchar[i][j] = 0;
        }
    }

    // Reset pixels
    $(".pixel").addClass('off');
    $(".pixel").removeClass('on');
}

function togglePixel(pixel) {

    // Get row/column of pixel from the ID
    var id = $(pixel).attr('id').split("-");
    var row = id[1];
    var column = id[2];

    // Toggle pixels and update array
    if ($(pixel).hasClass('off')) {
        $(pixel).addClass('on');
        $(pixel).removeClass('off');
        customchar[row][column] = 1;
    } else {
        $(pixel).addClass('off');
        $(pixel).removeClass('on');
        customchar[row][column] = 0;
    }
}

function invert() {

    // Toggle all pixels
    $('.pixel').each(function (index) {
        togglePixel($(this));
    });
}

function generateOutput(data) {
    // Create output
    var output = 'byte customChar[8] = {\n';
    for (i = 0; i < 8; i++) {
        output += '\t0b';
        for (j = 0; j < 5; j++) {
            output += customchar[i][j];
        }
        if (i < 7) {
            output += ',\n';
        }
    }
    output += '\n};';

    // Update the code display
    $('.output').text(output);

    // Create Arduino Ouput
    // $('#codeArduino').attr('readonly', 'false');
    $('#codeArduino').text(`#include <LiquidCrystal.h>;

// initialize the library
LiquidCrystal lcd(${$("#RSPin").val()}, ${$("#EnablePin").val()}, ${$("#D4Pin").val()}, ${$("#D5Pin").val()}, ${$("#D6Pin").val()}, ${$("#D7Pin").val()});

${output}

void setup() 
{
\t// create a new custom character
\tlcd.createChar(0, customChar);

\t// set up number of columns and rows
\n\tlcd.begin(16, 2);

\t// print the custom char to the lcd
\t// why typecast? see: http://arduino.cc/forum/index.php?topic=74666.0
\tlcd.write((uint8_t)0);
}

void loop()
{

}`);
    // $('#codeArduino').attr('readonly', 'true');
}

function copy(id, element) {
    var copyText = document.getElementById(id);
    copyText.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();

    $(element).text('COPIED!');
    $(element).removeClass('badge-primary');
    $(element).addClass('badge-success');
    setTimeout(() => {
        $(element).text('COPY');
        $(element).removeClass('badge-success');
        $(element).addClass('badge-primary');
    }, 1500);
}


$(document).ready(function () {
    // Clear/initialise the pixels and array
    clear();
    generateOutput();

    // Disable selection of pixels (cosmetic)
    $('#pixels').mousedown(function () {
        return false;
    });

    // Bind a click event listener to the clear button
    $('#clear').click(function () {
        clear();
        generateOutput();
    });

    // Bind a click event listener to the invert button
    $('#invert').click(function () {
        invert();
        generateOutput();
    });

    // Bind a click event listener to pixels
    $(".pixel").click(function () {
        // Toggle pixels
        togglePixel($(this));
        // Output code
        generateOutput();
    });

    // Bind a change event listener to every numerical pin inputs
    $(".pinChange").on("change", function () {
        // Change the output code that deals with the lcd (pin) initialization
        generateOutput();
    });
});