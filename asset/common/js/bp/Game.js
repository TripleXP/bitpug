goog.provide('bp.Game');

goog.require('goog.net.XhrIo');

goog.require('bp.controllers.GameController');
goog.require('bp.controllers.SoundController');
goog.require('bp.ui.Menu');
goog.require('bp.handlers.GameHandler');

/**
 * @constructor
 */
bp.Game = function()
{
    /**
     * @type {string}
     */
    bp.username = "unnamed";

    /**
     * @type {string}
     */
    bp.baseUrl = window.location.pathname;

    /**
     * @type {string}
     */
    bp.accessKey = "";

    /**
     * @type {bp.handlers.GameHandler}
     * @private
     */
    this.gameHandler_ = bp.handlers.GameHandler.getInstance();

    // Load config to start the game with initial configuration
    this.loadConfig_(true);
};

/**
 * @param {boolean} isFirstStart
 * @private
 */
bp.Game.prototype.loadConfig_ = function(isFirstStart)
{
    var xhr = new goog.net.XhrIo();
    xhr.send(bp.baseUrl + 'app/layout/jsonConfig.php');

    goog.events.listenOnce(xhr, goog.net.EventType.SUCCESS,
        function(e){
            bp.settings = e.target.getResponseJson();

            if(isFirstStart) this.startInit();
        }, false, this);

    goog.events.listenOnce(this.gameHandler_, bp.events.GameEvent.EventType.PLAYAGAIN,
        this.reloadConfig_, false, this);
};

/**
 * @private
 */
bp.Game.prototype.reloadConfig_ = function()
{
    this.loadConfig_(false);
};

bp.Game.prototype.startInit = function()
{
    // Init sound controller
    var soundController = bp.controllers.SoundController.getInstance();
        soundController.init();
        soundController.playSound("background");

    // Start game controller
    var menu = new bp.ui.Menu();
    menu.renderMain();

    goog.events.listen(menu, bp.ui.Menu.EventType.MAINSTART,
        this.startGame_, false, this);
};

/**
 * @private
 */
bp.Game.prototype.startGame_ = function(e)
{
    new bp.controllers.GameController().start();
};

/**
 * @param {Object} config
 */
bp.Initialize = function(config)
{
	var game = new bp.Game();
};
goog.exportSymbol('bp.Initialize', bp.Initialize);