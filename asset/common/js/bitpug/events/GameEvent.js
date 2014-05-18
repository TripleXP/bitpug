goog.provide('bp.events.GameEvent');

goog.require('goog.events.Event');

/**
 * @constructor
 * @extends {goog.events.Event}
 */
bp.events.GameEvent = function(type)
{
    goog.base(this, type);
};
goog.inherits(bp.events.GameEvent, goog.events.Event);

/**
 * @enum {string}
 */
bp.events.GameEvent.EventType = {
	PAUSE: 'pause',
    CONTINUE: 'continue',
    GAMEOVER: 'gameover'
};