goog.provide('bp.handlers.GameHandler');

goog.require('goog.events.EventTarget');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
bp.handlers.GameHandler = function()
{
	goog.base(this);
};
goog.inherits(bp.handlers.GameHandler, goog.events.EventTarget);
goog.addSingletonGetter(bp.handlers.GameHandler);