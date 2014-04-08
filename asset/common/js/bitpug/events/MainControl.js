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

bitpug.events.MainControl.EventType = {
    WALKLEFT: 'walkleft',
    WALKRIGHT: 'walkright',
    STOPWALK: 'stopwalk',
    JUMP: 'jump',
    BOOST: 'boost'
}