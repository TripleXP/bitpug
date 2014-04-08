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
	this.walkAnimTimer_ = new goog.Timer(bitpug.settings.pug.walkAnimationMs);

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
	 * @type {Number} pixels per tick
	 * @private
	 */
	this.speed_ = bitpug.settings.pug.moveSpeed;

	/**
	 * @type {Number} pixels per tick
	 * @private
	 */
	this.jumpSpeed_ = bitpug.settings.pug.jumpSpeed;

	/**
	 * @type {Number} pixels
	 * @private
	 */
	this.maxJumpHeight_ = bitpug.settings.pug.maxJumpHeight;

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

	/**
	 * @type {Object}
	 */
	this.posX = {};

	/**
	 * @type {Object}
	 */
	this.posY = {};

	/**
	 * @type {Element}
	 * @private
	 */
	this.boostEl_ = null;

	/**
	 * @type {boolean}
	 * @private
	 */
	this.boostLoading_ = false;

	/**
	 * @type {boolean}
	 * @private
	 */
	this.boostLoaded_ = false;

	/**
	 * @type {goog.fx.Animation}
	 * @private
	 */
	this.boostLoader_ = new goog.fx.Animation([0,1], [0,105],
		bitpug.settings.module.boost.reloadingDelay);

	/**
	 * @type {goog.Timer}
	 * @private
	 */
	this.boostTimer_ = new goog.Timer(10);

	/**
	 * @type {Number}
	 * @private
	 */
	this.boostTimerCounter_ = 0;
};
goog.inherits(bitpug.ui.PugPlayer, goog.ui.Component);
goog.addSingletonGetter(bitpug.ui.PugPlayer);

/** @inheritDoc */
bitpug.ui.PugPlayer.prototype.decorateInternal = function(el)
{
	goog.base(this, 'decorateInternal', el);

	// Get game section
	var gameSection = bitpug.gameComponents.Registry.getElement(
			'game-section')[0];

	// Set initial position
	this.posX.left = el.offsetLeft;
	this.posY.bottom = gameSection.offsetHeight - (
		el.offsetTop + el.offsetHeight);

	// Set move range X
	this.moveRange_ = {
		min: 0,
		max: gameSection.offsetWidth - el.offsetWidth
	}

	// Set jump range Y
	this.jumpRange_ = {
		min: this.posY.bottom,
		max: gameSection.offsetHeight - el.offsetHeight
	}

	// Init walk animation frames
	this.walkAnimPos_ = [0, -62, -124, -185];
	this.walkAnimPosCur_ = 0;

	// Init boost element
	var boostModule = bitpug.gameComponents.Registry.getElement(
		'boost-cmp')[0];
	this.boostEl_ = goog.dom.getElementByClass('bar', boostModule);
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

	// Listen for boostloader
	this.getHandler().listen(this.boostLoader_,
		goog.fx.Animation.EventType.ANIMATE,
		this.handleBoostLoad_);
	this.getHandler().listen(this.boostLoader_,
		goog.fx.Animation.EventType.END,
		this.handleBoostLoadEnd_);

	this.getHandler().listen(this.boostTimer_,
		goog.Timer.TICK, this.handleBoostMove_);
};

/**
 * @private
 */
bitpug.ui.PugPlayer.prototype.handleMoveX_ = function()
{
	if(this.moveDirection_ == 'left')
	{
		this.posX.left -= this.speed_;
	}
	else if(this.moveDirection_ == 'right')
	{
		this.posX.left += this.speed_;
	}

	this.posX.left = goog.math.clamp(this.posX.left,
						this.moveRange_.min, this.moveRange_.max);

	if(this.posX.left <= this.moveRange_.min ||
		this.posX.left >= this.moveRange_.max)
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
		left: this.posX.left + 'px'
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

bitpug.ui.PugPlayer.prototype.boost = function()
{
	if(!this.boostLoading_ && !this.boostLoaded_)
	{
		this.loadBoost_();
		return;
	}
	else if(!this.boostLoading_ && this.boostLoaded_ &&
		!goog.dom.classes.has(this.getElement(), 'jumping'))
	{
		this.stop();
		bitpug.gameComponents.KeyController.lock(true);
		this.activateBoost_();
	}
};

/**
 * @private
 */
bitpug.ui.PugPlayer.prototype.activateBoost_ = function()
{
	// start boost
	this.boostTimer_.start();

	// Reload boost automatically
	this.loadBoost_();
};

/**
 * @private
 */
bitpug.ui.PugPlayer.prototype.handleBoostMove_ = function()
{
	if(this.moveDirection_ == 'left')
	{
		this.posX.left -= this.speed_*bitpug.settings.module.boost.speedIncicator;
	}
	else if(this.moveDirection_ == 'right')
	{
		this.posX.left += this.speed_*bitpug.settings.module.boost.speedIncicator;
	}

	this.posX.left = goog.math.clamp(this.posX.left,
						this.moveRange_.min, this.moveRange_.max);

	goog.style.setStyle(this.getElement(), {
		left: this.posX.left + 'px'
	});

	this.boostTimerCounter_++;

	if(this.boostTimerCounter_ >= bitpug.settings.module.boost.maxCount ||
		this.posX.left == this.moveRange_.max ||
		this.posX.left == this.moveRange_.min)
	{
		this.boostTimer_.stop();
		this.boostTimerCounter_ = 0;
	}
};

/**
 * @param  {goog.fx.Animation.EventType} e
 * @private
 */
bitpug.ui.PugPlayer.prototype.handleBoostLoad_ = function(e)
{
	var width = (Number) (goog.math.clamp(e.y, 1, 100).toFixed(2));

	if(width > 80)
	{
		goog.dom.classes.enable(this.boostEl_, 'loading', false);
		goog.dom.classes.enable(this.boostEl_, 'loaded', true);
	}

	goog.style.setStyle(this.boostEl_, {
		'width': width + '%'
	});
};

/**
 * @private
 */
bitpug.ui.PugPlayer.prototype.handleBoostLoadEnd_ = function()
{
	this.boostLoading_ = false;
	this.boostLoaded_ = true;
	goog.dom.classes.enable(this.boostEl_, 'loading', false);
	bitpug.gameComponents.KeyController.lock(false);
};

/**
 * @private
 */
bitpug.ui.PugPlayer.prototype.loadBoost_ = function()
{
	this.boostLoader_.play();
	this.boostLoading_ = true;
	this.boostLoaded_ = false;
	goog.dom.classes.enable(this.boostEl_, 'loading', true);
	goog.dom.classes.enable(this.boostEl_, 'empty', false);
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
	if(this.posY.bottom <= this.maxJumpHeight_ &&
		!goog.dom.classes.has(this.getElement(), 'jumping-down'))
	{
		this.posY.bottom += this.jumpSpeed_;
	}
	else
	{
		this.posY.bottom -= this.jumpSpeed_*1.5;
		goog.dom.classes.enable(
			this.getElement(), 'jumping-down', true);
	}

	this.posY.bottom = goog.math.clamp(this.posY.bottom,
			this.jumpRange_.min, this.jumpRange_.max);

	goog.style.setStyle(this.getElement(), {
		bottom: this.posY.bottom + 'px'
	});

	if(this.posY.bottom <= this.jumpRange_.min)
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
	this.posY.bottom = this.jumpRange_.min;
	this.jumpActive_ = false;
};