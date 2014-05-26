goog.provide('bp.ui.Clouds');

goog.require('goog.ui.Component');
goog.require('goog.Timer');
goog.require('goog.math');
goog.require('goog.style');

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
	this.animTimer_ = new goog.Timer(bp.settings['environment']['clouds']['updateTrigger']);

	/**
	 * @type {Array.<Element>}
	 * @private
	 */
	this.cloudsEl_ = [];

	/**
	 * @type {number}
	 * @private
	 */
	this.maxClouds_ = Math.round(goog.math.uniformRandom(
		bp.settings['environment']['clouds']['amount']['min'],
		bp.settings['environment']['clouds']['amount']['max']));

	/**
	 * @type {number}
	 * @private
	 */
	this.maxCloudStyles_ = bp.settings['environment']['clouds']['classCount'];

	/**
	 * @type {number}
	 * @private
	 */
	this.lastCloudLeft_ = 0;
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

	// Update animation on init
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
		var cloud = this.cloudsEl_[i];
		var min = -goog.dom.getElementByClass('playground').offsetWidth;
		var max = cloud.offsetWidth + cloud.offsetLeft + goog.dom.getElementByClass('playground').offsetWidth;

		goog.style.setStyle(cloud, {
			"left": goog.math.clamp(goog.math.uniformRandom(min, max),
						0, goog.dom.getElementByClass('playground').offsetWidth - cloud.offsetWidth) + 'px'
		});
	}
};

/**
 * @private
 */
bp.ui.Clouds.prototype.renderClouds_ = function()
{
	var transition = "left " + (bp.settings['environment']['clouds']['updateTrigger'] + 1000) / 1000 + "s linear"

	for(var i = 1; i <= this.maxClouds_; i++)
	{
		var index = Math.round(goog.math.uniformRandom(1, this.maxCloudStyles_));
		var cloud = goog.dom.createDom('div', 'cloud c' + index);
		this.getElement().appendChild(cloud);

		goog.style.setStyle(cloud, {
			"-webkit-transition": transition,
			"-moz-transition": transition,
			"-o-transition": transition,
			"-ms-transition": transition,
			"transition:": transition,
			"left": this.lastCloudLeft_ + 'px',
			"top": (cloud.offsetTop + goog.math.uniformRandom(-cloud.offsetHeight, cloud.offsetHeight)) + 'px'
		});

		this.lastCloudLeft_ = this.lastCloudLeft_ + cloud.offsetWidth - Math.round(goog.math.uniformRandom(50, cloud.offsetWidth/2));

		if(this.lastCloudLeft_ + cloud.offsetWidth + 40 >= goog.dom.getElementByClass('playground').offsetWidth)
		{
			this.lastCloudLeft_ = cloud.offsetWidth - Math.round(goog.math.uniformRandom(50, 150));
		}

		this.cloudsEl_.push(cloud);
	}
};