goog.provide('bp.controllers.GameStateController');

goog.require('bp.events.GameEvent');
goog.require('bp.handlers.GameHandler');

/**
 * @constructor
 */
bp.controllers.GameStateController = function()
{
	/**
	 * @type {bp.handlers.GameHandler}
	 * @private
	 */
	this.handler_ = bp.handlers.GameHandler.getInstance();
};
goog.addSingletonGetter(bp.controllers.GameStateController);

bp.controllers.GameStateController.prototype.toggleState = function()
{
};

bp.controllers.GameStateController.prototype.setPause  = function()
{
	bp.isPlaying = false;
	bp.gameComponents.keyController.lock(true);
	this.handler_.dispatchEvent(new bp.events.GameEvent(
		bp.events.GameEvent.EventType.PAUSE));
};

bp.controllers.GameStateController.prototype.setContinue = function()
{
	bp.isPlaying = true;
	bp.gameComponents.keyController.lock(false);
	this.handler_.dispatchEvent(new bp.events.GameEvent(
		bp.events.GameEvent.EventType.CONTINUE));
};

