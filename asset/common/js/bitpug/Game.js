goog.provide('bitpug.Game');

goog.require('goog.net.XhrIo');

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
   var xhr = new goog.net.XhrIo();
   xhr.send('/app/layout/jsonConfig.php');
   var response = xhr.getResponseText();

   console.log(response);
};

// Seperated function to keep after it's compiled
bitpug.Initialize = function(config)
{
	var game = new bitpug.Game();
	game.startInit(config);
};
goog.exportSymbol('bitpug.Initialize', bitpug.Initialize);