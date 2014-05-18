goog.provide('bp.Game');

goog.require('goog.net.XhrIo');

goog.require('bp.controllers.GameController');
goog.require('bp.ui.Menu');

/**
 * @constructor
 */
bp.Game = function()
{
    this.loadConfig_();
};

/**
 * @private
 */
bp.Game.prototype.loadConfig_ = function()
{
    var xhr = new goog.net.XhrIo();
    xhr.send('app/layout/jsonConfig.php');

    goog.events.listenOnce(xhr, goog.net.EventType.SUCCESS,
        function(e){
            bp.settings = e.target.getResponseJson();
            this.startInit();
        }, false, this);
};

bp.Game.prototype.startInit = function()
{
    // Start game controller
    var menu = new bp.ui.Menu();
    menu.renderMain();

    goog.events.listen(menu, bp.ui.Menu.EventType.MAINSTART,
        function(){
            new bp.controllers.GameController().start();
        }, false, this);
};

/**
 * @param {Object} config
 */
bp.Initialize = function(config)
{
	var game = new bp.Game();
};
goog.exportSymbol('bp.Initialize', bp.Initialize);