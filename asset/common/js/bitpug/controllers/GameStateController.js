goog.provide('bp.controllers.GameStateController');

goog.require('bp.events.GameEvent');
goog.require('bp.handlers.GameHandler');
goog.require('bp.ui.Menu');

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

	/**
	 * @type {bp.ui.Menu}
	 * @private
	 */
	this.menu_ = new bp.ui.Menu();
};
goog.addSingletonGetter(bp.controllers.GameStateController);

bp.controllers.GameStateController.prototype.init = function()
{
	goog.events.listen(this.menu_, bp.ui.Menu.EventType.PAUSECONTINUE,
		this.setContinue, false, this);

	goog.events.listen(window, goog.events.EventType.BLUR,
		this.setPause, false, this);
};

bp.controllers.GameStateController.prototype.toggleState = function()
{
	if(bp.isPlaying)
		this.setPause();
	else
		this.setContinue();
};

bp.controllers.GameStateController.prototype.setPause  = function()
{
	if(bp.isPlaying)
	{
		bp.isPlaying = false;
		bp.gameComponents.keyController.lock(true);

		this.handler_.dispatchEvent(new bp.events.GameEvent(
			bp.events.GameEvent.EventType.PAUSE));

		this.menu_.renderPause();
	}
};

bp.controllers.GameStateController.prototype.setContinue = function()
{
	if(!bp.isPlaying)
	{
		bp.isPlaying = true;
		bp.gameComponents.keyController.lock(false);
		this.handler_.dispatchEvent(new bp.events.GameEvent(
			bp.events.GameEvent.EventType.CONTINUE));

		this.menu_.disableMenu();
	}
};

