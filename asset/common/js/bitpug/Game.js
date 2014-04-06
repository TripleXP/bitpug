goog.provide('bitpug.Game');

goog.require('bitpug.controllers.GameController');

/**
 * @constructor
 */
bitpug.Game = function(){};

bitpug.Game.prototype.startInit = function()
{
	var settings = {
		firstStart: true
	}

	var gameController = new bitpug.controllers.GameController(settings);
	gameController.start();
};

// Seperated function to keep after it's compiled
bitpug.Initialize = function()
{
	var game = new bitpug.Game();
	game.startInit();
};
goog.exportSymbol('bitpug.Initialize', bitpug.Initialize);