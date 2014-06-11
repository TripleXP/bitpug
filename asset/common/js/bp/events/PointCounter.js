goog.provide('bp.events.PointCounter');

goog.require('goog.events.Event');

/**
 * @constructor
 * @extends {goog.events.Event}
 * @param {string} type
 */
bp.events.PointCounter = function(type, points)
{
	goog.base(this, type);

	/**
	 * @type {Number}
	 */
	this.points = points
};
goog.inherits(bp.events.PointCounter, goog.events.Event);

bp.events.PointCounter.EventType = {
	ADD: 'add'
};