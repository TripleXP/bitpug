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

/**
 * @private
 */
bitpug.Game.prototype.loadConfig_ = function()
{
    var xhr = new goog.net.XhrIo();
    xhr.send('app/layout/jsonConfig.php');

    goog.events.listenOnce(xhr, goog.net.EventType.SUCCESS,
        function(e){
            bitpug.settings = e.target.getResponseJson();
            this.startInit();
        }, false, this);
};

bitpug.Game.prototype.startInit = function()
{
    // Start game controller
	new bitpug.controllers.GameController().start();
};

// Seperated function to keep after it's compiled
bitpug.Initialize = function(config)
{
	var game = new bitpug.Game();
};
goog.exportSymbol('bitpug.Initialize', bitpug.Initialize);