goog.provide('bitpug.Game');

goog.require('goog.net.XhrIo');

goog.require('bitpug.controllers.GameController');

/**
 * @constructor
 */
bitpug.Game = function()
{
    this.loadConfig_();
};

bitpug.Game.prototype.startInit = function()
{
    // Start game controller
	var gameController = new bitpug.controllers.GameController();
	gameController.start();
};

bitpug.Game.prototype.loadConfig_ = function()
{
    var xhr = new goog.net.XhrIo();
    xhr.send('app/layout/jsonConfig.php');

    goog.events.listenOnce(xhr, goog.net.EventType.COMPLETE,
        function(e){
            bitpug.settings = e.target.getResponseJson();
            this.startInit();
        }, false, this);
};

// Seperated function to keep after it's compiled
bitpug.Initialize = function(config)
{
	var game = new bitpug.Game();
};
goog.exportSymbol('bitpug.Initialize', bitpug.Initialize);