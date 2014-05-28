goog.provide('bp.ui.RainDrop');

goog.require('goog.ui.Component');
goog.require('goog.style');
goog.require('goog.dom.classes')

goog.require('bp.ui.PugPlayer');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bp.ui.RainDrop = function()
{
	goog.base(this);

	/**
	 * @type {number}
	 * @private
	 */
	this.corX = 0;

	/**
	 * @type {number}
	 * @private
	 */
	this.corY = 0;

	/**
	 * @type {Element}
	 */
	this.dropEl = null;

	/**
	 * @type {goog.fx.Animation}
	 * @private
	 */
	this.animation_ = null;

	/**
	 * @type {boolean}
	 */
	this.isEaten_ = false;
};
goog.inherits(bp.ui.RainDrop, goog.ui.Component);

/**
 * @param  {goog.math.Coordinate} coordinates
 */
bp.ui.RainDrop.prototype.renderDrop = function(coordinates)
{
	// Render RainDrop
	var index = Math.floor(
		Math.random()*bp.settings['rain']['dropClasses'].length);

	var raindropEl = goog.dom.createDom('div', 'drop ' +
		bp.settings['rain']['dropClasses'][index]);

	goog.style.setPosition(raindropEl, coordinates.x, -50);

	bp.gameComponents.registry.getElement(
		'rain-wrapper')[0].appendChild(raindropEl);

	this.dropEl = raindropEl;

	// Set animation
	this.animation_ = new goog.fx.Animation([coordinates.x,-50],
		[0,coordinates.y], bp.settings['rain']['initialFallSpeed']);

	// Listen for animation
	this.getHandler().listen(this.animation_,
		goog.fx.Animation.EventType.ANIMATE, this.handleAnimation_);

	this.getHandler().listen(this.animation_,
		goog.fx.Animation.EventType.END, this.destroyDrop_);

	// Dispatch animation of drop
	this.dispatchDrop_();
};

bp.ui.RainDrop.prototype.pauseAnimation = function()
{
	this.animation_.pause();
};

bp.ui.RainDrop.prototype.continueAnimation = function()
{
	this.animation_.play();
};

/**
 * @private
 */
bp.ui.RainDrop.prototype.dispatchDrop_ = function()
{
	this.animation_.play();
};

/**
 * @param  {goog.fx.AnimationEvent} e
 * @private
 */
bp.ui.RainDrop.prototype.handleAnimation_ = function(e)
{
	if(this.isInTouchWithHead_())
	{
		this.markAsEaten_();
	}

	var y = (Number) ((e.y).toFixed(0));
	goog.style.setStyle(this.dropEl, {top: y + 'px'});
};

/**
 * @private
 * @return {boolean} [description]
 */
bp.ui.RainDrop.prototype.isInTouchWithHead_ = function()
{
	var pugPlayer = bp.gameComponents.registry.getElement(
		'pug-player')[0];
	var mouth = goog.dom.getElementByClass('mouth', pugPlayer);

	var borderPug = {
		top: pugPlayer.offsetTop,
		bottom: pugPlayer.offsetTop + mouth.offsetHeight,
		left: goog.dom.classes.has(pugPlayer, 'right') ? pugPlayer.offsetLeft + pugPlayer.offsetWidth - mouth.offsetWidth : pugPlayer.offsetLeft,
		right: goog.dom.classes.has(pugPlayer, 'right') ? pugPlayer.offsetLeft + pugPlayer.offsetWidth : pugPlayer.offsetLeft + mouth.offsetWidth
	}

	var borderDrop = {
		top: this.dropEl.offsetTop + this.dropEl.offsetHeight/2,
		left: this.dropEl.offsetLeft + this.dropEl.offsetWidth/2
	}

	if(borderDrop.top > borderPug.top &&
		borderDrop.top < borderPug.bottom &&
		borderDrop.left > borderPug.left &&
		borderDrop.left < borderPug.right)
	{
		return true;
	}

	return false;
};

bp.ui.RainDrop.prototype.markAsEaten_ = function()
{
	this.isEaten_ = true;
	goog.dom.classes.enable(this.dropEl, 'eaten', true);
	this.destroyDrop_();
};

/**
 * @private
 */
bp.ui.RainDrop.prototype.destroyDrop_ = function()
{
	// Unlisten
	this.getHandler().unlisten(this.animation_,
		goog.fx.Animation.EventType.ANIMATE, this.handleAnimation_);

	this.getHandler().unlisten(this.animation_,
		goog.fx.Animation.EventType.END, this.destroyDrop_);

	// Dispatch event
	if(this.isEaten_)
	{
		this.dispatchEvent(bp.ui.RainDrop.EventType.EATEN);
	}
	else
	{
		this.dispatchEvent(bp.ui.RainDrop.EventType.MISSED);
	}
};

/**
 * Eventtypes
 */
bp.ui.RainDrop.EventType = {
	MISSED: 'missed',
	EATEN: 'eaten'
};