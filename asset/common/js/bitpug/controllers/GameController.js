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

/**
 * @constructor
 * @param {Object} settings
 * @extends {goog.ui.Component}
 */
bitpug.controllers.GameController = function(settings)
{
	goog.base(this);

	/**
	 * @type {Object}
	 * @private
	 */
	this.settings_ = settings;

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
	var statDisplay = goog.dom.createDom('div', '', [
		goog.dom.createDom('div', 'deko-pug'),
		goog.dom.createDom('div', 'module points'), // Point section
		goog.dom.createDom('div', 'module level')   // Level section
	]);
	//bitpug.gameComponents.StatDisplay.decorate(statDisplay);

	// Init Key controller
	bitpug.gameComponents.KeyController = new bitpug.controllers.KeyController.getInstance();
	bitpug.gameComponents.KeyController.init();

	// Init player pug
	bitpug.gameComponents.PugController = new bitpug.controllers.PugController.getInstance();
	bitpug.gameComponents.PugController.init();


	// Unlock Key Controller
	bitpug.gameComponents.KeyController.lock(false);
};