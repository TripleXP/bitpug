goog.provide('bp.events.MainControl');

goog.require('goog.events.Event');

/**
 * @constructor
 * @extends {goog.events.Event}
 * @param {string} type
 */
bp.events.MainControl = function(type)
{
    goog.base(this, type);
};
goog.inherits(bp.events.MainControl, goog.events.Event);

/**
 * @enum {string}
 */
bp.events.MainControl.EventType = {
    WALKLEFT: 'walkleft',
    WALKRIGHT: 'walkright',
    STOPWALKLEFT: 'stopwalkleft',
    STOPWALKRIGHT: 'stopwalkright',
    JUMP: 'jump',
    BOOST: 'boost'
};