goog.provide('bp.controllers.GameController');

goog.require('goog.ui.Component');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');

// Get game componentes
goog.require('bp.ui.StatDisplay');
goog.require('bp.ui.Clouds');
goog.require('bp.ui.ActionMsg');

goog.require('bp.events.GameEvent');
goog.require('bp.handlers.GameHandler');

goog.require('bp.controllers.RegistryController');
goog.require('bp.controllers.GameStateController');
goog.require('bp.controllers.KeyController');
goog.require('bp.controllers.PugController');
goog.require('bp.controllers.RainController');
goog.require('bp.controllers.PointController');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
bp.controllers.GameController = function()
{
	goog.base(this);

	/**
	 * @type {Object}
	 * @const
	 */
	bp.gameComponents = {};

	/**
	 * @type {boolean}
	 * @const
	 */
	bp.isPlaying = false;

	/**
	 * @type {boolean}
	 * @const
	 */
	bp.isPaused = false;
};
goog.inherits(bp.controllers.GameController,
	goog.events.EventTarget);

bp.controllers.GameController.prototype.start = function()
{
	// Registry
	bp.gameComponents.registry = bp.controllers.RegistryController.getInstance();
	bp.gameComponents.registry.addElement(goog.dom.getElement('game'), 'game-section');

	// Init statdisplay for points
	bp.gameComponents.statDisplay = new bp.ui.StatDisplay();
	bp.gameComponents.statDisplay.init();

	// Init action msg
	bp.gameComponents.actionMsg = bp.ui.ActionMsg.getInstance();
	bp.gameComponents.actionMsg.init();

	// Init game state controller
	bp.gameComponents.gameStateController = bp.controllers.GameStateController.getInstance();
	bp.gameComponents.gameStateController.init();

	// Init Key controller
	bp.gameComponents.keyController = bp.controllers.KeyController.getInstance();
	bp.gameComponents.keyController.init();

	// Init player pug
	bp.gameComponents.pugController = bp.controllers.PugController.getInstance();
	bp.gameComponents.pugController.init();

	// Init rain controller
	bp.gameComponents.rainController = bp.controllers.RainController.getInstance();
	bp.gameComponents.rainController.init();

	// Init point controller (After the modules are loaded)
	bp.gameComponents.pointController = bp.controllers.PointController.getInstance();
	bp.gameComponents.pointController.init([
		bp.gameComponents.rainController]);

	// Unlock Components after load end
	goog.Timer.callOnce(this.pageLoadEnd_, 100, this);
};

/**
 * @private
 */
bp.controllers.GameController.prototype.pageLoadEnd_ = function()
{
	bp.gameComponents.rainController.start();
	bp.gameComponents.keyController.lock(false);
	this.loadEnvironmentComponents_();

	// Set playing state
	bp.isPlaying = true;
};

/**
 * @private
 */
bp.controllers.GameController.prototype.loadEnvironmentComponents_ = function()
{
	// Clouds
	var cloudWrapper = goog.dom.createDom('div', 'cloud-wrapper');
	goog.dom.getElementByClass('environment').appendChild(cloudWrapper);
	new bp.ui.Clouds().decorate(cloudWrapper);
};