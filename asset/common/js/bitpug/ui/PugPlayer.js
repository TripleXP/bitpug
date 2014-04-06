goog.provide('bitpug.ui.PugPlayer');

goog.require('goog.Timer');
goog.require('goog.ui.Component');
goog.require('goog.style');
goog.require('goog.dom.classes');
goog.require('goog.math');
goog.require('goog.fx.Animation');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bitpug.ui.PugPlayer = function()
{
	goog.base(this);

	/**
	 * @type {goog.Timer}
	 * @private
	 */
	this.moveXTimer_ = new goog.Timer(10);

	/**
	 * @type {goog.Timer}
	 * @private
	 */
	this.jumpTimer_ = new goog.Timer(10);

	/**
	 * @type {goog.Timer} also speed in ms
	 * @private
	 */
	this.walkAnimTimer_ = new goog.Timer(100);

	/**
	 * @type {Array.<Number>}
	 * @private
	 */
	this.walkAnimPos_ = [];

	/**
	 * @type {Number}
	 * @private
	 */
	this.walkAnimPosCur_ = 0;

	/**
	 * @type {string}
	 * @private
	 */
	this.moveDirection_ = '';

	/**
	 * @type {Object}
	 * @private
	 */
	this.posX_ = {};

	/**
	 * @type {Object}
	 * @private
	 */
	this.posY_ = {};

	/**
	 * @type {Number} pixels per tick
	 * @private
	 */
	this.speed_ = 2.5;

	/**
	 * @type {Number} pixels per tick
	 * @private
	 */
	this.jumpSpeed_ = 6;

	/**
	 * @type {Number} pixels
	 * @private
	 */
	this.maxJumpHeight_ = 150;

	/**
	 * @type {Object}
	 * @private
	 */
	this.moveRange_ = {};

	/**
	 * @type {Object}
	 * @private
	 */
	this.jumpRange_ = {};

	/**
	 * @type {boolean}
	 * @private
	 */
	this.jumpActive_ = false;

	/**
	 * @type {string}
	 * @private
	 */
	this.pugDrn_ = 'left';
};
goog.inherits(bitpug.ui.PugPlayer, goog.ui.Component);

/** @inheritDoc */
bitpug.ui.PugPlayer.prototype.decorateInternal = function(el)
{
	goog.base(this, 'decorateInternal', el);

	// Get game section
	var gameSection = bitpug.gameComponents.Registry.getElement(
			'game-section')[0];

	// Set initial position
	this.posX_.left = el.offsetLeft;
	this.posY_.bottom = gameSection.offsetHeight - (
		el.offsetTop + el.offsetHeight);

	// Set move range X
	this.moveRange_ = {
		min: 0,
		max: gameSection.offsetWidth - el.offsetWidth
	}

	// Set jump range Y
	this.jumpRange_ = {
		min: this.posY_.bottom,
		max: gameSection.offsetHeight - el.offsetHeight
	}

	// Init walk animation frames
	this.walkAnimPos_ = [0, -62, -124, -185];
	this.walkAnimPosCur_ = 0;
};

/** @inheritDoc */
bitpug.ui.PugPlayer.prototype.enterDocument = function()
{
	// Listen for X movement
	this.getHandler().listen(this.moveXTimer_, goog.Timer.TICK,
		this.handleMoveX_);

	// Listen for jump
	this.getHandler().listen(this.jumpTimer_,
		goog.Timer.TICK, this.handleJumpAnimation_);

	// Listen for walk animation
	this.getHandler().listen(this.walkAnimTimer_,
		goog.Timer.TICK, this.handleWalkAnimTick_);
};

/**
 * @private
 */
bitpug.ui.PugPlayer.prototype.handleMoveX_ = function()
{
	if(this.moveDirection_ == 'left')
	{
		this.posX_.left -= this.speed_;
	}
	else if(this.moveDirection_ == 'right')
	{
		this.posX_.left += this.speed_;
	}

	this.posX_.left = goog.math.clamp(this.posX_.left,
						this.moveRange_.min, this.moveRange_.max);

	if(this.posX_.left <= this.moveRange_.min ||
		this.posX_.left >= this.moveRange_.max)
	{
		goog.dom.classes.enable(
			this.getElement(), 'walking', false);
		this.walkAnimTimer_.stop();
	}
	else
	{
		goog.dom.classes.enable(this.getElement(), 'walking', true);
		this.walkAnimTimer_.start();
	}

	goog.style.setStyle(this.getElement(), {
		left: this.posX_.left + 'px'
	});
};

/**
 * Move the player in X directions
 * @param  {string} drn
 */
bitpug.ui.PugPlayer.prototype.moveX = function(drn)
{
	this.moveDirection_ = drn;
	this.moveXTimer_.start();

	if(drn == 'right')
	{
		this.pugDrn_ = 'right';
		goog.dom.classes.enable(this.getElement(), 'right', true);
	}
	else
	{
		this.pugDrn_ = 'left';
		goog.dom.classes.enable(this.getElement(), 'right', false);
	}
};

bitpug.ui.PugPlayer.prototype.stop = function()
{
	this.moveXTimer_.stop();
	this.walkAnimTimer_.stop();
	goog.dom.classes.enable(this.getElement(), 'walking', false);
};

bitpug.ui.PugPlayer.prototype.jump = function()
{
	if(!this.jumpActive_)
	{
		this.jumpTimer_.start();
		goog.dom.classes.enable(this.getElement(), 'jumping', true);
		this.jumpActive_ = true;
	}
};

/**
 * @private
 */
bitpug.ui.PugPlayer.prototype.handleWalkAnimTick_ = function()
{
	if(this.walkAnimPos_[this.walkAnimCur_+1])
	{
		this.walkAnimCur_ = this.walkAnimCur_ + 1;
	}
	else
	{
		this.walkAnimCur_ = 0;
	}

	goog.style.setStyle(this.getElement(), {
		'background-position': '0 ' + this.walkAnimPos_[this.walkAnimCur_] + 'px'
	});
};

/**
 * @private
 */
bitpug.ui.PugPlayer.prototype.handleJumpAnimation_ = function()
{
	if(this.posY_.bottom <= this.maxJumpHeight_ &&
		!goog.dom.classes.has(this.getElement(), 'jumping-down'))
	{
		this.posY_.bottom += this.jumpSpeed_;
	}
	else
	{
		this.posY_.bottom -= this.jumpSpeed_*1.5;
		goog.dom.classes.enable(
			this.getElement(), 'jumping-down', true);
	}

	this.posY_.bottom = goog.math.clamp(this.posY_.bottom,
			this.jumpRange_.min, this.jumpRange_.max);

	goog.style.setStyle(this.getElement(), {
		bottom: this.posY_.bottom + 'px'
	});

	if(this.posY_.bottom <= this.jumpRange_.min)
	{
		this.handleJumpAnimationEnd_();
	}
};

/**
 * @private
 */
bitpug.ui.PugPlayer.prototype.handleJumpAnimationEnd_ = function()
{
	this.jumpTimer_.stop();
	goog.dom.classes.enable(this.getElement(), 'jumping', false);
	goog.dom.classes.enable(this.getElement(), 'jumping-down', false);
	this.posY_.bottom = this.jumpRange_.min;
	this.jumpActive_ = false;
};