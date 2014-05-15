goog.provide('bitpug.controllers.RainController');

goog.require('goog.Timer');
goog.require('goog.math.Coordinate');
goog.require('goog.math');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');

goog.require('bitpug.ui.RainDrop');
goog.require('bitpug.events.PointCounter');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
bitpug.controllers.RainController = function()
{
	goog.base(this);

	/**
	 * @type {Array.<bitpug.ui.RainDrop>}
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
	this.spawnInterval_ = bitpug.settings['rain']['spawnInterval'];

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
	 * @type {bitpug.ui.RainDrop|Element}
	 * @private
	 */
	this.lastDrop_ = null;

	/**
	 * @type {number}
	 * @private
	 */
	this.missedDrops_ = 0;
};
goog.inherits(bitpug.controllers.RainController, goog.events.EventTarget);

goog.addSingletonGetter(bitpug.controllers.RainController);

bitpug.controllers.RainController.prototype.init = function()
{
	// Get max range of the playground
	this.maxRange_ = {
		'xS': 0,
		'xE': bitpug.gameComponents.registry.getElement(
			'game-section')[0].offsetWidth,
		'yS': 0,
		'yE': bitpug.gameComponents.registry.getElement(
			'game-section')[0].offsetHeight
	};

	// Render wrapper
	this.wrapper_ = goog.dom.createDom('div', 'rain-wrapper');
	bitpug.gameComponents.registry.getElement(
			'game-section')[0].appendChild(this.wrapper_);
	bitpug.gameComponents.registry.addElement(this.wrapper_);

	// Set spawn timer
	this.setSpawnTimer_();

	// Listen for spawn interval
	goog.events.listen(this.spawnTimer_, goog.Timer.TICK,
		this.handleSpawnTick_, false, this);
};

bitpug.controllers.RainController.prototype.start = function()
{
	this.spawnTimer_.start();
};

bitpug.controllers.RainController.prototype.stop = function()
{
	this.spawnTimer_.stop();
};

/**
 * @private
 */
bitpug.controllers.RainController.prototype.setSpawnTimer_ = function()
{
	this.spawnTimer_ = new goog.Timer(this.spawnInterval_);
};

/**
 * @private
 */
bitpug.controllers.RainController.prototype.spawnRainDrop_ = function()
{
	var cordX = 0;
	if(this.lastDrop_)
	{
		if(this.lastDrop_.dropEl.offsetLeft < this.maxRange_['xE']/2)
		{
			cordX = (Number) (this.lastDrop_.dropEl.offsetLeft + (Math.random()*(this.maxRange_['xE']/2)));
		}
		else if(this.lastDrop_.dropEl.offsetLeft > this.maxRange_['xE']/2)
		{
			cordX = (Number) (this.lastDrop_.dropEl.offsetLeft - (Math.random()*(this.maxRange_['xE']/2)));
		}
	}
	else
	{
		cordX = (Number) ((Math.random()*this.maxRange_['xE']).toFixed(0));
	}
	var cordY = (Number) (this.maxRange_['yE'] + bitpug.settings['rain']['defaultSize']);

	cordX = goog.math.clamp(cordX, this.maxRange_['xS'],
		this.maxRange_['xE'] - bitpug.settings['rain']['defaultSize']);

	var spawnCoordinates = new goog.math.Coordinate(cordX, cordY);

	var raindrop = new bitpug.ui.RainDrop();
	raindrop.renderDrop(spawnCoordinates);
	this.lastDrop_ = raindrop;
	this.rainDrops_.push(raindrop);

	goog.events.listenOnce(raindrop,
		bitpug.ui.RainDrop.EventType.MISSED, this.handleMiss_,
		false, this);

	goog.events.listenOnce(raindrop,
		bitpug.ui.RainDrop.EventType.EATEN, this.handleEat_,
		false, this);
};

/**
 * @private
 */
bitpug.controllers.RainController.prototype.handleSpawnTick_ = function()
{
	this.spawnRainDrop_();
};

/**
 * @param {goog.events.Event} e
 * @private
 */
bitpug.controllers.RainController.prototype.handleMiss_ = function(e)
{
	this.missedDrops_ += 1;

	//if(this.missedDrops_ >= 3){}

	bitpug.ui.ActionMsg.getInstance().dispatchEvent(new
			bitpug.events.ActionMsgEvent(
				bitpug.events.ActionMsgEvent.EventType.SETMSG,
				'Lost life! ' + goog.math.clamp(3-this.missedDrops_, 0, 3) + ' left',
				true
			));

	// Remove raindrop
	goog.Timer.callOnce(function(){
		this.wrapper_.removeChild(e.target.dropEl);
	}, 200, this);
};

/**
 * @param {goog.events.Event} e
 * @private
 */
bitpug.controllers.RainController.prototype.handleEat_ = function(e)
{
	// Dispatch point add event
	this.dispatchEvent(new bitpug.events.PointCounter(
		bitpug.events.PointCounter.EventType.ADD,
		e.target.dropEl.offsetWidth));

	// Remove node
	goog.Timer.callOnce(function(){
		this.wrapper_.removeChild(e.target.dropEl);
	}, 0, this);
};