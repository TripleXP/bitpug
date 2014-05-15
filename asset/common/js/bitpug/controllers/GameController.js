goog.provide('bitpug.controllers.GameController');

goog.require('goog.ui.Component');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');

// Get game componentes
goog.require('bitpug.ui.StatDisplay');
goog.require('bitpug.ui.Clouds');
goog.require('bitpug.ui.ActionMsg');

goog.require('bitpug.controllers.RegistryController');
goog.require('bitpug.controllers.KeyController');
goog.require('bitpug.controllers.PugController');
goog.require('bitpug.controllers.RainController');
goog.require('bitpug.controllers.PointController');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
bitpug.controllers.GameController = function()
{
	goog.base(this);

	/**
	 * @type {Object}
	 */
	bitpug.gameComponents = {};
};
goog.inherits(bitpug.controllers.GameController,
	goog.events.EventTarget);

bitpug.controllers.GameController.prototype.start = function()
{
	// Registry
	bitpug.gameComponents.registry = bitpug.controllers.RegistryController.getInstance();
	bitpug.gameComponents.registry.addElement(goog.dom.getElement('game'), 'game-section');

	// Init action msg
	bitpug.gameComponents.actionMsg = new bitpug.ui.ActionMsg();
	bitpug.gameComponents.actionMsg.decorate(
		goog.dom.getElement('action-msg'));

	// Init statdisplay for points
	bitpug.gameComponents.statDisplay = new bitpug.ui.StatDisplay();
	bitpug.gameComponents.statDisplay.init();

	// Init Key controller
	bitpug.gameComponents.keyController = bitpug.controllers.KeyController.getInstance();
	bitpug.gameComponents.keyController.init();

	// Init player pug
	bitpug.gameComponents.pugController = bitpug.controllers.PugController.getInstance();
	bitpug.gameComponents.pugController.init();

	// Init rain controller
	bitpug.gameComponents.rainController = bitpug.controllers.RainController.getInstance();
	bitpug.gameComponents.rainController.init();

	// Init point controller (After the modules are loaded)
	bitpug.gameComponents.pointController = bitpug.controllers.PointController.getInstance();
	bitpug.gameComponents.pointController.init([
		bitpug.gameComponents.rainController]);

	// Unlock Components after load end
	goog.Timer.callOnce(this.pageLoadEnd_, 100, this);
};

/**
 * @private
 */
bitpug.controllers.GameController.prototype.pageLoadEnd_ = function()
{
	bitpug.gameComponents.rainController.start();
	bitpug.gameComponents.keyController.lock(false);
	this.loadEnvironmentComponents_();
};

/**
 * @private
 */
bitpug.controllers.GameController.prototype.loadEnvironmentComponents_ = function()
{
	// Clouds
	var cloudWrapper = goog.dom.createDom('div', 'cloud-wrapper');
	bitpug.gameComponents.registry.getElement(
		'game-section')[0].appendChild(cloudWrapper);
	new bitpug.ui.Clouds().decorate(cloudWrapper);
};