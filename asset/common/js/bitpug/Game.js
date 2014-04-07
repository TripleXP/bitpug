goog.provide('bitpug.Game');

goog.require('bitpug.controllers.GameController');

/**
 * @constructor
 */
bitpug.Game = function(){this.loadConfig_()};

bitpug.Game.prototype.startInit = function(config)
{
	// Set global settings
    bitpug.settings = config;

    // start game controller
	var gameController = new bitpug.controllers.GameController();
	gameController.start();
};

bitpug.Game.prototype.loadConfig_ = function()
{
    var xmlhttp;
    if(window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    }
    else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function()
    {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            console.log(xmlhttp.responseText, xmlhttp);
        }
    }

    xmlhttp.open("GET", "/app/layout/jsonConfig.php", true);
    xmlhttp.send();
};

// Seperated function to keep after it's compiled
bitpug.Initialize = function(config)
{
	var game = new bitpug.Game();
	game.startInit(config);
};
goog.exportSymbol('bitpug.Initialize', bitpug.Initialize);