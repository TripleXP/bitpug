goog.provide('bitpug.controllers.PointController');

goog.require('goog.events');

/**
 * @constructor
 */
bitpug.controllers.PointController = function()
{
	/**
	 * @type {Object}
	 * @private
	 */
	this.module_ = {};

	/**
	 * @type {Number}
	 * @private
	 */
	this.points_ = 0;
};
goog.addSingletonGetter(bitpug.controllers.PointController);

/**
 * @param {Array.<Object>} listeners
 */
bitpug.controllers.PointController.prototype.init = function(listeners)
{
	// Init module
	this.module_ = {
		'points': bitpug.gameComponents.Registry.getElement('point-count-el')[0],
		'level': bitpug.gameComponents.Registry.getElement('level-count-el')[0]
	}

	// Add listeners from config
	for(var i = 0; i < listeners.length; i++)
	{
		// Listen for point add
		goog.events.listen(listeners[i],
			bitpug.events.PointCounter.EventType.ADD,
			this.handlePointAdd_, false, this);
	}
};

/**
 * @param {bitpug.events.PointCounter.EventType.ADD} e
 * @private
 */
bitpug.controllers.PointController.prototype.handlePointAdd_ = function(e)
{
	this.points_ += (Number) (e.points);
	this.module_.points.innerHTML = this.points_;
};