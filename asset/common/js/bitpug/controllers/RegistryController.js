goog.provide('bitpug.controllers.RegistryController');

goog.require('goog.dom.classes');

/**
 * @constructor
 */
bitpug.controllers.RegistryController = function()
{
	/**
	 * @type {Object}
	 */
	this.register = {
		'elements': []
	};
};
goog.addSingletonGetter(bitpug.controllers.RegistryController);

/**
 * @param {className} string
 * @param {Element} el
 */
bitpug.controllers.RegistryController.prototype.addElement = function(el, className)
{
	goog.dom.classes.add(el, className);
	this.register.elements.push(el);
};

/**
 * @param {className} string
 * @return {Array} Element
 */
bitpug.controllers.RegistryController.prototype.getElement = function(className)
{
	// Search in the register
	var results = []
	for(var i = 0; i < this.register.elements.length; i++)
	{
		if(goog.dom.classes.has(this.register.elements[i], className))
		{
			results.push(this.register.elements[i]);
		}
	}
	return results;
};