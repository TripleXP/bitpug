goog.provide('bp.controllers.RegistryController');

goog.require('goog.dom.classes');

/**
 * @constructor
 */
bp.controllers.RegistryController = function()
{
	/**
	 * @type {Object}
	 */
	this.register = {
		'elements': []
	};
};
goog.addSingletonGetter(bp.controllers.RegistryController);

/**
 * @param {Element} el
 * @param {string=} opt_className
 */
bp.controllers.RegistryController.prototype.addElement = function(el, opt_className)
{
	if(!opt_className) opt_className = '';

	goog.dom.classes.add(el, opt_className);
	this.register.elements.push(el);
};

/**
 * @param {string} className
 * @return {Array} Element
 */
bp.controllers.RegistryController.prototype.getElement = function(className)
{
	// Search in the register
	var results = [];
	for(var i = 0; i < this.register.elements.length; i++)
	{
		if(goog.dom.classes.has(this.register.elements[i], className))
		{
			results.push(this.register.elements[i]);
		}
	}
	return results;
};