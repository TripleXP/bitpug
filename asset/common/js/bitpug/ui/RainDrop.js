goog.provide('bitpug.ui.RainDrop');

goog.require('goog.ui.Component');
goog.require('goog.style');
goog.require('goog.dom.classes')

goog.require('bitpug.ui.PugPlayer');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bitpug.ui.RainDrop = function()
{
	goog.base(this);

	/**
	 * @type {Number}
	 * @private
	 */
	this.corX = 0;

	/**
	 * @type {Number}
	 * @private
	 */
	this.corY = 0;

	/**
	 * @type {Element}
	 * @private
	 */
	this.dropEl_ = null;

	/**
	 * @type {goog.fx.Animation}
	 * @private
	 */
	this.animation_ = null;

	/**
	 * @type {bitpug.ui.PugPlayer}
	 * @private
	 */
	this.pugPlayer_ = new bitpug.ui.PugPlayer.getInstance();

	/**
	 * @type {boolean}
	 */
	this.isEaten_ = false;
};
goog.inherits(bitpug.ui.RainDrop, goog.ui.Component);

/**
 * @param  {goog.math.Coordinate}
 */
bitpug.ui.RainDrop.prototype.renderDrop = function(coordinates)
{
	// Render RainDrop
	var index = Math.floor(Math.random()*bitpug.settings.rain.dropClasses.length);
	console.log(index);
	var raindropEl = goog.dom.createDom('div', 'drop ' +
		bitpug.settings.rain.dropClasses[index]);

	goog.style.setPosition(raindropEl, coordinates.x, -50);

	bitpug.gameComponents.Registry.getElement(
		'rain-wrapper')[0].appendChild(raindropEl);

	this.dropEl_ = raindropEl;

	// Set animation
	this.animation_ = new goog.fx.Animation([coordinates.x,-50],
		[0,coordinates.y], bitpug.settings.rain.initialFallSpeed);

	// Listen for animation
	this.getHandler().listen(this.animation_,
		goog.fx.Animation.EventType.ANIMATE, this.handleAnimation_);

	this.getHandler().listen(this.animation_,
		goog.fx.Animation.EventType.END, this.destroyDrop_);

	// Dispatch animation of drop
	this.dispatchDrop_();
};

/**
 * @private
 */
bitpug.ui.RainDrop.prototype.dispatchDrop_ = function()
{
	this.animation_.play();
};

/**
 * @param  {goog.fx.Animation.Event} e
 * @private
 */
bitpug.ui.RainDrop.prototype.handleAnimation_ = function(e)
{
	if(this.isInTouchWithHead_())
	{
		this.markAsEaten_();
	}

	var y = (Number) ((e.y).toFixed(0));
	goog.style.setStyle(this.dropEl_, {top: y + 'px'});
};

/**
 * @private
 * @return {Boolean} [description]
 */
bitpug.ui.RainDrop.prototype.isInTouchWithHead_ = function()
{
	var pugPlayer = bitpug.gameComponents.Registry.getElement(
		'pug-player')[0];
	var mouth = goog.dom.getElementByClass('mouth', pugPlayer);

	var borderPug = {
		top: pugPlayer.offsetTop,
		bottom: pugPlayer.offsetTop + mouth.offsetHeight,
		left: goog.dom.classes.has(pugPlayer, 'right') ? pugPlayer.offsetLeft + pugPlayer.offsetWidth - mouth.offsetWidth : pugPlayer.offsetLeft,
		right: goog.dom.classes.has(pugPlayer, 'right') ? pugPlayer.offsetLeft + pugPlayer.offsetWidth : pugPlayer.offsetLeft + mouth.offsetWidth
	}

	var borderDrop = {
		top: this.dropEl_.offsetTop + this.dropEl_.offsetHeight/2,
		left: this.dropEl_.offsetLeft + this.dropEl_.offsetWidth/2
	}

	if(borderDrop.top > borderPug.top &&
		borderDrop.top < borderPug.bottom &&
		borderDrop.left > borderPug.left &&
		borderDrop.left < borderPug.right)
	{
		return true;
	}
};

bitpug.ui.RainDrop.prototype.markAsEaten_ = function()
{
	this.isEaten_ = true;
	goog.dom.classes.enable(this.dropEl_, 'eaten', true);
	this.destroyDrop_();
};

/**
 * @private
 */
bitpug.ui.RainDrop.prototype.destroyDrop_ = function()
{
	// Unlisten
	this.getHandler().unlisten(this.animation_,
		goog.fx.Animation.EventType.ANIMATE, this.handleAnimation_);

	this.getHandler().unlisten(this.animation_,
		goog.fx.Animation.EventType.END, this.destroyDrop_);

	// Remove drop from dom
	/*bitpug.gameComponents.Registry.getElement(
		'rain-wrapper')[0].removeChild(this.dropEl_);*/
};