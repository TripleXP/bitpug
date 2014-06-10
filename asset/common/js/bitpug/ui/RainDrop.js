goog.provide('bp.ui.RainDrop');

goog.require('goog.ui.Component');
goog.require('goog.style');
goog.require('goog.dom.classes');
goog.require('goog.math');

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
	 */
	this.corX = 0;

	/**
	 * @type {number}
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
	 * @private
	 */
	this.isEaten_ = false;

	/**
	 * @type {Object}
	 * @private
	 */
	this.windConfig_ = {}

	/**
	 * @type {boolean}
	 * @private
	 */
	this.isOffset_ = false;

	/**
	 * @type {Object}
	 * @private
	 */
	this.windConfig_ = {
		'active': false
	};
};
goog.inherits(bp.ui.RainDrop, goog.ui.Component);

/**
 * @param {goog.math.Coordinate} coordinates
 * @param {boolean} isRandom
 * @param {Object} windConfig
 */
bp.ui.RainDrop.prototype.renderDrop = function(coordinates, isRandom, windConfig)
{
	// Render RainDrop
	var index = Math.floor(
		Math.random()*bp.settings['rain']['dropClasses'].length);

	var raindropEl = goog.dom.createDom('div', 'drop ' +
		bp.settings['rain']['dropClasses'][index]);

	goog.style.setPosition(raindropEl, coordinates.x, -50);

	bp.gameComponents['registry'].getElement(
		'rain-wrapper')[0].appendChild(raindropEl);

	this.dropEl = raindropEl;
	this.windConfig_ = windConfig;

	// Set animation
	var initialFallspeed = bp.settings['rain']['initialFallSpeed'];
	var randomSpeed = Math.round(goog.math.uniformRandom(bp.settings['rain']['initialFallSpeed']/2,
		bp.settings['rain']['initialFallSpeed']));
	var currentSpeed = isRandom ? randomSpeed : initialFallspeed;

	this.animation_ = new goog.fx.Animation([coordinates.x,-50],
		[0,coordinates.y], currentSpeed);

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
		return;
	}

	if(this.checkOffset_())
	{
		this.destroyDrop_();
		return;
	}

	var y = (Number) ((e.y).toFixed(0));
	this.corY = y;
	goog.style.setStyle(this.dropEl, {'top': y + 'px'});

	if(this.windConfig_['active'])
	{
		if(this.windConfig_['direction'] == 'ltr')
		{
			this.corX = this.dropEl.offsetLeft + this.windConfig_['pixel'];
		}
		else
		{
			this.corX = this.dropEl.offsetLeft - this.windConfig_['pixel'];
		}

		goog.style.setStyle(this.dropEl, {'left': this.corX + 'px'});
	}
};

/**
 * @private
 * @return {boolean}
 */
bp.ui.RainDrop.prototype.isInTouchWithHead_ = function()
{
	var pugPlayer = bp.gameComponents['registry'].getElement(
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

/**
 * @private
 * @return {boolean}
 */
bp.ui.RainDrop.prototype.checkOffset_ = function()
{
	var playground = bp.gameComponents['registry'].getElement(
		'game-section')[0];

	if(this.dropEl.offsetLeft > playground.offsetWidth ||
		(this.dropEl.offsetLeft + this.dropEl.offsetWidth) < 0)
	{
		this.isOffset_ = true;
		return true;
	}

	return false;
};

/**
 * @private
 */
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

	if(this.isOffset_)
	{
		var wrapper = goog.dom.getElementByClass('rain-wrapper');
		wrapper.removeChild(this.dropEl);
	}
	else
	{
		// Dispatch event
		if(this.isEaten_)
		{
			this.dispatchEvent(bp.ui.RainDrop.EventType.EATEN);
		}
		else
		{
			this.dispatchEvent(bp.ui.RainDrop.EventType.MISSED);
		}
	}
};

/**
 * Eventtypes
 */
bp.ui.RainDrop.EventType = {
	MISSED: 'missed',
	EATEN: 'eaten'
};