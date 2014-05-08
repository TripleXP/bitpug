goog.provide('bitpug.controllers.GameController');

goog.require('goog.ui.Component');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');

// Get game componentes
goog.require('bitpug.ui.StatDisplay');
goog.require('bitpug.ui.Clouds');
goog.require('bitpug.controllers.RegistryController');
goog.require('bitpug.controllers.KeyController');
goog.require('bitpug.controllers.PugController');
goog.require('bitpug.controllers.RainController');
goog.require('bitpug.controllers.PointController');

/**
 * @constructor
 * @param {Object} settings
 * @extends {goog.ui.Component}
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
	bitpug.gameComponents.registry = new bitpug.controllers.RegistryController.getInstance();
	bitpug.gameComponents.registry.addElement(goog.dom.getElement('game'), 'game-section');

	// Init statdisplay for points
	bitpug.gameComponents.statDisplay = new bitpug.ui.StatDisplay();
	bitpug.gameComponents.statDisplay.init();

	// Init Key controller
	bitpug.gameComponents.keyController = new bitpug.controllers.KeyController.getInstance();
	bitpug.gameComponents.keyController.init();

	// Init player pug
	bitpug.gameComponents.pugController = new bitpug.controllers.PugController.getInstance();
	bitpug.gameComponents.pugController.init();

	// Init rain controller
	bitpug.gameComponents.rainController = new bitpug.controllers.RainController.getInstance();
	bitpug.gameComponents.rainController.init();

	// Init point controller (After the modules are loaded)
	bitpug.gameComponents.pointController = new bitpug.controllers.PointController.getInstance();
	bitpug.gameComponents.pointController.init([
		bitpug.gameComponents.rainController]);

	// Unlock Components onloadend
	window.onload = bitpug.gameComponents.rainController.start();
	window.onload = bitpug.gameComponents.keyController.lock(false);
	window.onload = this.loadEnvironmentComponents_();
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