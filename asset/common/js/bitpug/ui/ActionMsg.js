goog.provide('bitpug.ui.ActionMsg');

goog.require('goog.ui.Component');
goog.require('goog.Timer');

goog.require('bitpug.events.ActionMsgEvent');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bitpug.ui.ActionMsg = function()
{
	goog.base(this);

	/**
	 * @type {boolean}
	 * @private
	 */
	this.isActive_ = false;

	/**
	 * @type {Element}
	 * @private
	 */
	this.shakeEl_ = null;

	/**
	 * @type {number}
	 * @private
	 */
	this.shakeTicks_ = 0;

	/**
	 * @type {goog.Timer}
	 * @private
	 */
	this.shakeTimer_ = new goog.Timer(5);
};
goog.inherits(bitpug.ui.ActionMsg, goog.ui.Component);
goog.addSingletonGetter(bitpug.ui.ActionMsg);

/** @inheritDoc */
bitpug.ui.ActionMsg.prototype.decorateInternal = function(el)
{
	goog.base(this, 'decorateInternal', el);

	// Init shake el
	this.shakeEl_ = goog.dom.getElementByClass('playground');
};

/** @inheritDoc */
bitpug.ui.ActionMsg.prototype.enterDocument = function()
{
	goog.base(this, 'enterDocument');

	// Listen for action msg event
	this.getHandler().listen(bitpug.ui.ActionMsg.getInstance(),
		bitpug.events.ActionMsgEvent.EventType.SETMSG,
		this.enableMsg_);

	// Listen for shake timer
	this.getHandler().listen(this.shakeTimer_, goog.Timer.TICK,
		this.handleScreenShake_);
};

/**
 * @param {bitpug.events.ActionMsgEvent} e
 * @private
 */
bitpug.ui.ActionMsg.prototype.enableMsg_ = function(e)
{
	this.isActive_ = true;
	var message = e.msg;
	this.getElement().innerHTML = message;
	this.setClasses_(e);
};

/**
 * @param {bitpug.events.ActionMsgEvent} e
 * @private
 */
bitpug.ui.ActionMsg.prototype.setClasses_ = function(e)
{
	goog.dom.classes.enable(this.getElement(), 'warning', e.isWarning);
	if(e.isWarning) this.shakeTimer_.start();

	goog.dom.classes.enable(this.getElement(), 'active', true);
	goog.Timer.callOnce(function(){
		goog.dom.classes.enable(this.getElement(), 'inactive', true);
		goog.Timer.callOnce(function(){
			goog.dom.classes.enable(this.getElement(), 'inactive', false);
			goog.dom.classes.enable(this.getElement(), 'active', false);
			this.isActive_ = false;
		}, 400, this);
	}, 1500, this);
};

/**
 * @private
 */
bitpug.ui.ActionMsg.prototype.handleScreenShake_ = function()
{
	var value;
	if(this.shakeTicks_ % 2)
	{
		value = '2px, -2px';
	}
	else
	{
		value = "-2px, 2px";
	}

	if(this.shakeTicks_ >= 30)
	{
		this.shakeTimer_.stop();
		this.shakeTicks_ = 0;
		value = "0px, 0px";
	}

	goog.style.setStyle(this.shakeEl_, {
		'-webkit-transform': 'translate(' + value + ')'
	});

	this.shakeTicks_++;
};