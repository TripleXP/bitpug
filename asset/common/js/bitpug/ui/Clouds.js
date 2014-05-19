goog.provide('bp.ui.Clouds');

goog.require('goog.ui.Component');
goog.require('goog.Timer');
goog.require('goog.math');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bp.ui.Clouds = function()
{
	goog.base(this);

	/**
	 * @type {goog.Timer}
	 * @private
	 */
	this.animTimer_ = new goog.Timer(10000);

	/**
	 * @type {Array.<Element>}
	 * @private
	 */
	this.cloudsEl_ = [];

	/**
	 * @type {number}
	 * @private
	 */
	this.maxClouds_ = 5;

	/**
	 * @type {number}
	 * @private
	 */
	this.maxCloudStyles_ = 1;
};
goog.inherits(bp.ui.Clouds, goog.ui.Component);

/** @inheritDoc */
bp.ui.Clouds.prototype.decorateInternal = function(el)
{
	goog.base(this, 'decorateInternal', el);

	// Render clouds
	this.renderClouds_();

	// Start animation tick
	this.animTimer_.start();

	this.updateAnimation_();
};

/** @inheritDoc */
bp.ui.Clouds.prototype.enterDocument = function()
{
	goog.base(this, 'enterDocument');

	this.getHandler().listen(this.animTimer_, goog.Timer.TICK,
		this.updateAnimation_);
};

/**
 * @private
 */
bp.ui.Clouds.prototype.updateAnimation_ = function()
{
	for(var i = 0; i < this.cloudsEl_.length; i++)
	{
		this.cloudsEl_[i].style.left = Math.round(goog.math.uniformRandom(this.cloudsEl_[i].offsetWidth,
			goog.dom.getElementByClass('playground').offsetWidth) - this.cloudsEl_[i].offsetWidth) + 'px';
	}
};

/**
 * @private
 */
bp.ui.Clouds.prototype.renderClouds_ = function()
{
	for(var i = 1; i <= this.maxClouds_; i++)
	{
		var index = Math.round(goog.math.uniformRandom(1, this.maxCloudStyles_));
		var cloud = goog.dom.createDom('div', 'cloud c' + index);
		this.getElement().appendChild(cloud);
		this.cloudsEl_.push(cloud);
	}
};