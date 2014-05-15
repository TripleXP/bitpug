goog.provide('bitpug.events.MainControl');

goog.require('goog.events.Event');

/**
 * @constructor
 * @extends {goog.events.Event}
 * @param {string} type
 */
bitpug.events.MainControl = function(type)
{
    goog.base(this, type);
};
goog.inherits(bitpug.events.MainControl, goog.events.Event);

/**
 * @enum {string}
 */
bitpug.events.MainControl.EventType = {
    WALKLEFT: 'walkleft',
    WALKRIGHT: 'walkright',
    STOPWALKLEFT: 'stopwalkleft',
    STOPWALKRIGHT: 'stopwalkright',
    JUMP: 'jump',
    BOOST: 'boost'
};