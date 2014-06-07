goog.provide('bp.controllers.RainController');

goog.require('goog.Timer');
goog.require('goog.math.Coordinate');
goog.require('goog.math');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');

goog.require('bp.handlers.GameHandler');
goog.require('bp.ui.RainDrop');
goog.require('bp.events.PointCounter');
goog.require('bp.events.GameEvent');
goog.require('bp.handlers.GameHandler');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
bp.controllers.RainController = function()
{
	goog.base(this);

	/**
	 * @type {Array.<bp.ui.RainDrop>}
	 * @private
	 */
	this.rainDrops_ = [];

	/**
	 * @type {Object}
	 * @private
	 */
	this.maxRange_ = {};

	/**
	 * @type {number}
	 * @private
	 */
	this.spawnInterval_ = bp.settings['rain']['spawnInterval'];

	/**
	 * @type {goog.Timer}
	 * @private
	 */
	this.spawnTimer_ = null;

	/**
	 * @type {Element}
	 * @private
	 */
	this.wrapper_ = null;

	/**
	 * @type {bp.ui.RainDrop|Element}
	 * @private
	 */
	this.lastDrop_ = null;

	/**
	 * @type {number}
	 * @private
	 */
	this.missedDrops_ = 0;

	/**
	 * @type {bp.handlers.GameHandler}
	 * @private
	 */
	this.handler_ = bp.handlers.GameHandler.getInstance();

	/**
	 * @type {bp.controllers.SoundController}
	 * @private
	 */
	this.sounds_ = bp.controllers.SoundController.getInstance();
};
goog.inherits(bp.controllers.RainController, goog.events.EventTarget);
goog.addSingletonGetter(bp.controllers.RainController);

bp.controllers.RainController.prototype.init = function()
{
	// Get max range of the playground
	this.maxRange_ = {
		'xS': 0,
		'xE': bp.gameComponents['registry'].getElement(
			'game-section')[0].offsetWidth,
		'yS': 0,
		'yE': bp.gameComponents['registry'].getElement(
			'game-section')[0].offsetHeight
	};

	// Render wrapper
	this.wrapper_ = goog.dom.createDom('div', 'rain-wrapper');
	bp.gameComponents['registry'].getElement(
			'game-section')[0].appendChild(this.wrapper_);
	bp.gameComponents['registry'].addElement(this.wrapper_);

	// Set spawn timer
	this.setSpawnTimer_();

	// Listen for spawn interval
	goog.events.listen(this.spawnTimer_, goog.Timer.TICK,
		this.handleSpawnTick_, false, this);

	// Handler
	var handler = bp.handlers.GameHandler.getInstance();

	// Listen for pause
	goog.events.listen(handler, bp.events.GameEvent.EventType.PAUSE,
		this.stop, false, this);

	// Listen for continue
	goog.events.listen(handler, bp.events.GameEvent.EventType.CONTINUE,
		this.start, false, this);

	// Listen for full stop
	goog.events.listen(handler, bp.events.GameEvent.EventType.STOPGAME,
		this.handleFullStop_, false, this);

	// Listen for play again
	goog.events.listen(handler, bp.events.GameEvent.EventType.PLAYAGAIN,
		this.restart, false, this);
};

bp.controllers.RainController.prototype.start = function()
{
	this.spawnTimer_.start();

	// Reactivate active drops
	for(var i = 0; i < this.rainDrops_.length; i++)
	{
		this.rainDrops_[i].continueAnimation();
	}
};

bp.controllers.RainController.prototype.restart = function()
{
	this.start();

	// Reset vars
	this.missedDrops_ = 0;

	// Reset hearts
	var statDisplay = bp.gameComponents['registry'].getElement('stat-display')[0];
	var life = goog.dom.getElementByClass('life', statDisplay);
	goog.dom.classes.swap(life, 'x0', 'x3');
};

bp.controllers.RainController.prototype.stop = function()
{
	this.spawnTimer_.stop();

	// Freeze active drops
	for(var i = 0; i < this.rainDrops_.length; i++)
	{
		this.rainDrops_[i].pauseAnimation();
	}
};

/**
 * @private
 */
bp.controllers.RainController.prototype.handleFullStop_ = function()
{
	// Pause all rain drops
	this.stop();

	// Clear all raindrops from save
	this.rainDrops_ = [];

	// Remove all rain drops
	goog.dom.removeChildren(this.wrapper_);
};

/**
 * @private
 */
bp.controllers.RainController.prototype.setSpawnTimer_ = function()
{
	this.spawnTimer_ = new goog.Timer(this.spawnInterval_);
};

/**
 * @private
 */
bp.controllers.RainController.prototype.spawnRainDrop_ = function()
{
	var cordX = 0;
	if(this.lastDrop_)
	{
		if(this.lastDrop_.dropEl.offsetLeft < this.maxRange_['xE']/2)
		{
			cordX = (Number) (this.lastDrop_.dropEl.offsetLeft + (Math.random()*(this.maxRange_['xE']/3)));
		}
		else if(this.lastDrop_.dropEl.offsetLeft > this.maxRange_['xE']/2)
		{
			cordX = (Number) (this.lastDrop_.dropEl.offsetLeft - (Math.random()*(this.maxRange_['xE']/3)));
		}
	}
	else
	{
		cordX = (Number) ((Math.random()*this.maxRange_['xE']).toFixed(0));
	}
	var cordY = (Number) (this.maxRange_['yE'] + bp.settings['rain']['defaultSize']);

	cordX = goog.math.clamp(cordX, this.maxRange_['xS'],
		this.maxRange_['xE'] - bp.settings['rain']['defaultSize']);

	var spawnCoordinates = new goog.math.Coordinate(cordX, cordY);

	var raindrop = new bp.ui.RainDrop();
	raindrop.renderDrop(spawnCoordinates);
	this.lastDrop_ = raindrop;
	this.rainDrops_.push(raindrop);

	goog.events.listenOnce(raindrop,
		bp.ui.RainDrop.EventType.MISSED, this.handleMiss_,
		false, this);

	goog.events.listenOnce(raindrop,
		bp.ui.RainDrop.EventType.EATEN, this.handleEat_,
		false, this);
};

/**
 * @private
 */
bp.controllers.RainController.prototype.handleSpawnTick_ = function()
{
	this.spawnRainDrop_();
};

/**
 * @param {goog.events.Event} e
 * @private
 */
bp.controllers.RainController.prototype.handleMiss_ = function(e)
{
	if(this.missedDrops_ < 3)
	{
		this.missedDrops_ += 1;
	}

	// Play sound
	this.sounds_.playSound('lost-drop');

	bp.ui.ActionMsg.getInstance().dispatchEvent(new
			bp.events.ActionMsgEvent(
				bp.events.ActionMsgEvent.EventType.SETMSG,
				'Lost life! ' + goog.math.clamp(3-this.missedDrops_, 0, 3) + ' left',
				true
			));

	// Set lifes in stat display
	var statDisplay = bp.gameComponents['registry'].getElement('stat-display')[0];
	var life = goog.dom.getElementByClass('life', statDisplay);
	goog.dom.classes.swap(life, 'x' + Number(3 - this.missedDrops_ + 1), 'x' + Number(3 - this.missedDrops_));

	// Remove from list
	var index = this.rainDrops_.indexOf(e.target);
	this.rainDrops_.splice(index, 1);

	// Dispatch gameover state
	if(this.missedDrops_ >= 3)
	{
		this.handler_.dispatchEvent(new bp.events.GameEvent(
				bp.events.GameEvent.EventType.GAMEOVER
			));
		return;
	}

	// Remove raindrop
	goog.Timer.callOnce(function(){
		if(e.target.dropEl)
		{
			this.wrapper_.removeChild(e.target.dropEl);
		}
	}, 200, this);
};

/**
 * @param {goog.events.Event} e
 * @private
 */
bp.controllers.RainController.prototype.handleEat_ = function(e)
{
	// Dispatch point add event
	this.dispatchEvent(new bp.events.PointCounter(
		bp.events.PointCounter.EventType.ADD,
		e.target.dropEl.offsetWidth));

	// Remove from list
	var index = this.rainDrops_.indexOf(e.target);
	this.rainDrops_.splice(index, 0);

	// Remove node
	goog.Timer.callOnce(function(){
		this.wrapper_.removeChild(e.target.dropEl);
	}, 0, this);
};

/**
 * *
 * Functions called from the configuration of the user
 * IMPORTANT: All functions need a expose
 * *
 */

/**
 * @expose
 */
bp.controllers.RainController.prototype.newSpawnInterval = function()
{
	var spawnInterval = parseInt(arguments[0], 10);
	this.spawnTimer_.setInterval(spawnInterval);
};

/**
 * @expose
 */
bp.controllers.RainController.prototype.newDropFallspeed = function()
{
	var fallspeed = parseInt(arguments[0], 10);
	bp.settings['rain']['initialFallSpeed'] = fallspeed;
}