goog.provide('bp.controllers.GameStateController');

goog.require('bp.events.GameEvent');
goog.require('bp.handlers.GameHandler');
goog.require('bp.controllers.HighscoreController');
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

	goog.events.listen(this.menu_, bp.ui.Menu.EventType.LOSTRESTART,
		this.handlePlayAgain_, false, this);

	goog.events.listen(this.handler_, bp.events.GameEvent.EventType.GAMEOVER,
		this.handleGameOver_, false, this);

	goog.events.listen(this.handler_, bp.events.GameEvent.EventType.PLAYAGAIN,
		this.handlePlayAgain_, false, this);

	goog.events.listen(window, goog.events.EventType.BLUR,
		this.setPause, false, this);
};

bp.controllers.GameStateController.prototype.toggleState = function()
{
	if(bp.isPlaying) this.setPause();
	else this.setContinue();
};

bp.controllers.GameStateController.prototype.setPause  = function()
{
	if(bp.isPlaying && !bp.isLost)
	{
		bp.isPlaying = false;
		bp.isPaused = true;
		bp.gameComponents.keyController.lock(true);

		this.handler_.dispatchEvent(new bp.events.GameEvent(
			bp.events.GameEvent.EventType.PAUSE));

		this.menu_.renderPause();
	}
};

bp.controllers.GameStateController.prototype.setContinue = function()
{
	if(!bp.isPlaying && !bp.isLost)
	{
		bp.isPlaying = true;
		bp.isPaused = false;
		bp.gameComponents.keyController.lock(false);
		this.handler_.dispatchEvent(new bp.events.GameEvent(
			bp.events.GameEvent.EventType.CONTINUE));

		this.menu_.disableMenu();
	}
};

/**
 * @private
 */
bp.controllers.GameStateController.prototype.handleGameOver_ = function()
{
	if(!bp.isLost)
	{
		bp.isPlaying = false;
		bp.isLost = true;
		bp.gameComponents.keyController.lock(true);

		this.handler_.dispatchEvent(new bp.events.GameEvent(
			bp.events.GameEvent.EventType.STOPGAME));

		this.menu_.renderLost();

		// Write highscore
		var pointController = bp.controllers.PointController.getInstance();
		var highscoreController = bp.controllers.HighscoreController.getInstance();
		bp.accessKey = "73j&)1!ßß34";
		highscoreController.writeHighscore(pointController.level, pointController.points);
	}
};

/**
 * @private
 */
bp.controllers.GameStateController.prototype.handlePlayAgain_ = function()
{
	if(bp.isLost)
	{
		bp.isPlaying = true;
		bp.isLost = false;
		bp.gameComponents.keyController.lock(false);
		this.handler_.dispatchEvent(new bp.events.GameEvent(
			bp.events.GameEvent.EventType.PLAYAGAIN));

		this.menu_.disableMenu();
	}
};