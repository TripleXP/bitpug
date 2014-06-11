goog.provide('bp.events.FormularEvent');

goog.require('goog.events.Event');

/**
 * @constructor
 * @param {Array.<Object>=} opt_values
 * @extends {goog.events.Event}
 */
bp.events.FormularEvent = function(type, opt_values)
{
    goog.base(this, type);

    /**
     *  @type {Array.<Object>}
     */
    this.values = opt_values || [];
};
goog.inherits(bp.events.FormularEvent, goog.events.Event);

/**
 * @enum {string}
 */
bp.events.FormularEvent.EventType = {
	'READY': 'ready'
};