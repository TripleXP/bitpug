goog.provide('bp.ui.Clouds');

goog.require('goog.ui.Component');
goog.require('goog.Timer');
goog.require('goog.math');
goog.require('goog.style');

goog.require('bp.handlers.GameHandler');

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

	/**
	 * @type {bp.handlers.GameHandler}
	 * @private
	 */
	this.handler_ = bp.handlers.GameHandler.getInstance();
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

	// Listen for game stop
	goog.events.listen(this.handler_, bp.events.GameEvent.EventType.STOPGAME,
		this.handleFullStop_, false, this);

	// Listen for replay
	goog.events.listen(this.handler_, bp.events.GameEvent.EventType.PLAYAGAIN,
		this.renderClouds_, false, this);
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

	if(this.cloudsEl_.length <= 0)
	{
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
	}
	else
	{
		for(var i = 0; i < this.cloudsEl_.length; i++)
		{
			goog.dom.classes.enable(this.cloudsEl_[i], 'inactive', false);
		}		
	}

	// Update animation immediately
	this.updateAnimation_();	
};

/**
 * @private
 */
bp.ui.Clouds.prototype.handleFullStop_ = function()
{
	this.animTimer_.stop();

	for(var i = 0; i < this.cloudsEl_.length; i++)
	{
		goog.dom.classes.enable(this.cloudsEl_[i], 'inactive', true);
	}
};