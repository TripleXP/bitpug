goog.provide('bp.events.ActionMsgEvent');

goog.require('goog.events.Event');

/**
 * @constructor
 * @extends {goog.events.Event}
 * @param {string} type
 * @param {string} msg
 * @param {boolean=} opt_warning
 */
bp.events.ActionMsgEvent = function(type, msg, opt_warning)
{
    goog.base(this, type);

    /**
     * @type {string}
     */
    this.msg = msg;

    /**
     * @type {boolean}
     */
    this.isWarning = opt_warning || false;
};
goog.inherits(bp.events.ActionMsgEvent, goog.events.Event);

/**
 * @enum {string}
 */
bp.events.ActionMsgEvent.EventType = {
	SETMSG: 'setmsg'
};