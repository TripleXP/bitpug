goog.provide('bitpug.ui.Clouds');

goog.require('goog.ui.Component');
goog.require('goog.Timer');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bitpug.ui.Clouds = function()
{
	goog.base(this);

	/**
	 * @type {goog.Timer}
	 * @private
	 */
	this.animTimer_ = new goog.Timer(2000);

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
};
goog.inherits(bitpug.ui.Clouds, goog.ui.Component);

/** @inheritDoc */
bitpug.ui.Clouds.prototype.decorateInternal = function(el)
{
	goog.base(this, 'decorateInternal', el);

	// Render clouds
	this.renderClouds_();

	// Start animation tick
	this.animTimer_.start();
};

/** @inheritDoc */
bitpug.ui.Clouds.prototype.enterDocument = function()
{
	goog.base(this, 'enterDocument');

	this.getHandler().listen(this.animTimer_, goog.Timer.TICK,
		this.updateAnimation_);
};

/**
 * @private
 */
bitpug.ui.Clouds.prototype.updateAnimation_ = function()
{
	console.log('update');
};

/**
 * @private
 */
bitpug.ui.Clouds.prototype.renderClouds_ = function()
{
	for(var i = 1; i <= this.maxClouds_; i++)
	{
		var cloud = goog.dom.createDom('div', 'cloud c' + i);
		this.getElement().appendChild(cloud);
		this.cloudsEl_.push(cloud);
	}
};