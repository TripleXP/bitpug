goog.provide('bitpug.controllers.RainController');

goog.require('goog.Timer');
goog.require('goog.math.Coordinate');
goog.require('goog.math');

goog.require('bitpug.ui.RainDrop');

/**
 * @constructor
 */
bitpug.controllers.RainController = function()
{
	/**
	 * @type {Array.<bitpug.ui.RainDrop>}
	 * @private
	 */
	this.rainDrops_ = [];

	/**
	 * @type {Number}
	 * @private
	 */
	this.maxRange_ = {};

	/**
	 * @type {Number}
	 * @private
	 */
	this.spawnInterval_ = 2000;

	/**
	 * @type {goog.Timer}
	 * @private
	 */
	this.spawnTimer_ = null;
};
goog.addSingletonGetter(bitpug.controllers.RainController);

bitpug.controllers.RainController.prototype.init = function()
{
	// Get max range of the playground
	this.maxRange_ = {
		xS: 0,
		xE: bitpug.gameComponents.Registry.getElement(
			'game-section')[0].offsetWidth,
		yS: 0,
		yE: bitpug.gameComponents.Registry.getElement(
			'game-section')[0].offsetHeight,
	};

	// Render wrapper
	var wrapper = goog.dom.createDom('div', 'rain-wrapper');
	bitpug.gameComponents.Registry.getElement(
			'game-section')[0].appendChild(wrapper);
	bitpug.gameComponents.Registry.addElement(wrapper);

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
	var cordX = (Number) ((Math.random()*this.maxRange_.xE).toFixed(0));
	var cordY = (Number) (this.maxRange_.yE + 20);

	cordX = goog.math.clamp(cordX, this.maxRange_.xS, this.maxRange_.xE - 20);

	var spawnCoordinates = new goog.math.Coordinate(cordX, cordY);

	var raindrop = new bitpug.ui.RainDrop();
	raindrop.renderDrop(spawnCoordinates);

	this.rainDrops_.push(raindrop);
};

/**
 * @private
 */
bitpug.controllers.RainController.prototype.handleSpawnTick_ = function()
{
	this.spawnRainDrop_();
};