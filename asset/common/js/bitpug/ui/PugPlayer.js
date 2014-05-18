goog.provide('bp.ui.PugPlayer');

goog.require('goog.Timer');
goog.require('goog.ui.Component');
goog.require('goog.style');
goog.require('goog.dom.classes');
goog.require('goog.math');
goog.require('goog.fx.Animation');

goog.require('bp.events.ActionMsgEvent');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bp.ui.PugPlayer = function()
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
	this.walkAnimTimer_ = new goog.Timer(bp.settings['pug']['walkAnimationMs']);

	/**
	 * @type {Array.<Number>}
	 * @private
	 */
	this.walkAnimPos_ = [];

	/**
	 * @type {number}
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
	this.speed_ = bp.settings['pug']['moveSpeed'];

	/**
	 * @type {number} pixels per tick
	 * @private
	 */
	this.jumpSpeed_ = bp.settings['pug']['jumpSpeed'];

	/**
	 * @type {number} pixels
	 * @private
	 */
	this.maxJumpHeight_ = bp.settings['pug']['maxJumpHeight'];

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
		bp.settings['module']['boost']['reloadingDelay']);

	/**
	 * @type {goog.Timer}
	 * @private
	 */
	this.boostTimer_ = new goog.Timer(10);

	/**
	 * @type {number}
	 * @private
	 */
	this.boostTimerCounter_ = 0;
};
goog.inherits(bp.ui.PugPlayer, goog.ui.Component);
goog.addSingletonGetter(bp.ui.PugPlayer);

/** @inheritDoc */
bp.ui.PugPlayer.prototype.decorateInternal = function(el)
{
	goog.base(this, 'decorateInternal', el);

	// Get game section
	var gameSection = bp.gameComponents.registry.getElement(
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
	var boostModule = bp.gameComponents.registry.getElement(
		'boost-cmp')[0];
	this.boostEl_ = goog.dom.getElementByClass('bar', boostModule);
};

/** @inheritDoc */
bp.ui.PugPlayer.prototype.enterDocument = function()
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
bp.ui.PugPlayer.prototype.handleMoveX_ = function()
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
bp.ui.PugPlayer.prototype.moveX = function(drn)
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

bp.ui.PugPlayer.prototype.stop = function()
{
	this.moveXTimer_.stop();
	this.walkAnimTimer_.stop();
	goog.dom.classes.enable(this.getElement(), 'walking', false);
};

bp.ui.PugPlayer.prototype.jump = function()
{
	if(!this.jumpActive_)
	{
		this.jumpTimer_.start();
		goog.dom.classes.enable(this.getElement(), 'jumping', true);
		this.jumpActive_ = true;
	}
};

bp.ui.PugPlayer.prototype.boost = function()
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
		this.activateBoost_();
	}
};

/**
 * @private
 */
bp.ui.PugPlayer.prototype.activateBoost_ = function()
{
	// Lock
	bp.gameComponents.keyController.lock(true);

	// start boost
	this.boostTimer_.start();

	// Reload boost automatically
	this.loadBoost_();
};

/**
 * @private
 */
bp.ui.PugPlayer.prototype.handleBoostMove_ = function()
{
	if(this.moveDirection_ == 'left')
	{
		this.posX.left -= this.speed_*bp.settings['module']['boost']['speedIncicator'];
	}
	else if(this.moveDirection_ == 'right')
	{
		this.posX.left += this.speed_*bp.settings['module']['boost']['speedIncicator'];
	}

	if(this.boostTimerCounter_ < bp.settings['module']['boost']['maxCount']/2)
	{
		this.posY.bottom += bp.settings['module']['boost']['pixelY'];
	}
	else
	{
		this.posY.bottom -= bp.settings['module']['boost']['pixelY'];
	}

	this.posX.left = goog.math.clamp(this.posX.left,
						this.moveRange_.min, this.moveRange_.max);

	goog.style.setStyle(this.getElement(), {
		left: this.posX.left + 'px',
		bottom: this.posY.bottom + 'px'
	});

	this.boostTimerCounter_++;

	if(this.boostTimerCounter_ >= bp.settings['module']['boost']['maxCount'] ||
		this.posX.left == this.moveRange_.max ||
		this.posX.left == this.moveRange_.min)
	{
		this.boostTimer_.stop();
		this.boostTimerCounter_ = 0;

		goog.style.setStyle(this.getElement(), {
			bottom: this.jumpRange_.min + 'px'
		});

		bp.ui.PugPlayer.getInstance().dispatchEvent(
			bp.ui.PugPlayer.EventType.STOPBOOST);

		bp.gameComponents.keyController.lock(false);
	}
};

/**
 * @param  {goog.fx.AnimationEvent} e
 * @private
 */
bp.ui.PugPlayer.prototype.handleBoostLoad_ = function(e)
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
bp.ui.PugPlayer.prototype.handleBoostLoadEnd_ = function()
{
	this.boostLoading_ = false;
	this.boostLoaded_ = true;
	goog.dom.classes.enable(this.boostEl_, 'loading', false);

	bp.ui.ActionMsg.getInstance().dispatchEvent(
		new bp.events.ActionMsgEvent(
				bp.events.ActionMsgEvent.EventType.SETMSG,
				'Boost loaded'
			));
};

/**
 * @private
 */
bp.ui.PugPlayer.prototype.loadBoost_ = function()
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
bp.ui.PugPlayer.prototype.handleWalkAnimTick_ = function()
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
bp.ui.PugPlayer.prototype.handleJumpAnimation_ = function()
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
bp.ui.PugPlayer.prototype.handleJumpAnimationEnd_ = function()
{
	this.jumpTimer_.stop();
	goog.dom.classes.enable(this.getElement(), 'jumping', false);
	goog.dom.classes.enable(this.getElement(), 'jumping-down', false);
	this.posY.bottom = this.jumpRange_.min;
	this.jumpActive_ = false;
};

/**
 * @enum {string}
 */
bp.ui.PugPlayer.EventType = {
	STOPBOOST: 'stopboost'
};