goog.provide('bitpug.controllers.GameController');

goog.require('goog.ui.Component');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventTarget');

// Get game componentes
goog.require('bitpug.ui.StatDisplay');
goog.require('bitpug.controllers.RegistryController');
goog.require('bitpug.controllers.KeyController');
goog.require('bitpug.controllers.PugController');
goog.require('bitpug.controllers.RainController');

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
goog.inherits(bitpug.controllers.GameController, goog.events.EventTarget);

bitpug.controllers.GameController.prototype.start = function()
{
	// Registry
	bitpug.gameComponents.Registry = new bitpug.controllers.RegistryController.getInstance();
	bitpug.gameComponents.Registry.addElement(goog.dom.getElement('game'), 'game-section');

	// Init statdisplay for points
	bitpug.gameComponents.StatDisplay = new bitpug.ui.StatDisplay();
	bitpug.gameComponents.StatDisplay.init();

	// Init Key controller
	bitpug.gameComponents.KeyController = new bitpug.controllers.KeyController.getInstance();
	bitpug.gameComponents.KeyController.init();

	// Init player pug
	bitpug.gameComponents.PugController = new bitpug.controllers.PugController.getInstance();
	bitpug.gameComponents.PugController.init();

	// Init rain controller
	bitpug.gameComponents.RainController = new bitpug.controllers.RainController.getInstance();
	bitpug.gameComponents.RainController.init();
	bitpug.gameComponents.RainController.start();

	// Unlock Key Controller after all components are loaded
	window.onload = bitpug.gameComponents.KeyController.lock(false);
};