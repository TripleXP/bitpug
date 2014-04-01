goog.provide('bitpug.controllers.GameController');

goog.require('goog.ui.Component');

// Get game componentes
goog.require('bitpug.ui.StatDisplay');
goog.require('bitpug.controllers.RegistryController');

/**
 * @constructor
 * @param {Object} settings
 * @extends {goog.ui.Component}
 */
bitpug.controllers.GameController = function(settings)
{
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
	bitpug.gameComponents.StatDisplay.decorate(statDisplay);
};