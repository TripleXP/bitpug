goog.provide('bp.ui.Menu');

goog.require('goog.ui.Component');
goog.require('bp.ui.Layer');
goog.require('bp.ui.Formular');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bp.ui.Menu = function()
{
	goog.base(this);

	/**
	 * @type {Element}
	 * @private
	 */
	this.menu_ = null;

	/**
	 * @type {bp.ui.Layer}
	 * @private
	 */
	this.layer_ = new bp.ui.Layer();
};
goog.inherits(bp.ui.Menu, goog.ui.Component);

/**
 * @private
 */
bp.ui.Menu.prototype.init_ = function()
{
	this.menu_ = goog.dom.getElement('menu');
	goog.dom.classes.enable(this.menu_, 'inactive', false);

	this.layer_.init();
};

bp.ui.Menu.prototype.renderMain = function()
{
	this.init_();

	var el = goog.dom.createDom('div', 'submenu main', [
			goog.dom.createDom('div', 'button', 'Start'),
			goog.dom.createDom('div', 'button', 'Howto play'),
			goog.dom.createDom('div', 'button', 'Credits')
		]);

	this.renderMenu_(el, this.handleMainButtonClick_, 'Bitpug');
};

bp.ui.Menu.prototype.renderPause = function()
{
	this.init_();

	var el = goog.dom.createDom('div', 'submenu main', [
			goog.dom.createDom('div', 'button', 'Continue'),
			goog.dom.createDom('div', 'button', 'Howto play')
		]);

	this.renderMenu_(el, this.handlePauseButtonClick_, 'Pause');
};

bp.ui.Menu.prototype.renderLost = function()
{
	this.init_();

	var el = goog.dom.createDom('div', 'submenu main', [
			goog.dom.createDom('div', 'button', 'Play again'),
			goog.dom.createDom('div', 'button', 'Howto play'),
			goog.dom.createDom('div', 'button', 'Credits')
		]);

	this.renderMenu_(el, this.handleLostButtonClick_, 'Game over');
};


/**
 * @param {Element} el
 * @param {Function} callbackClickFnc
 * @param {string=} opt_heading
 * @private
 */
bp.ui.Menu.prototype.renderMenu_ = function(el, callbackClickFnc, opt_heading)
{
	// Add listeners to button click
	var buttons = goog.dom.getChildren(el);
	for(var i = 0; i < buttons.length; i++)
	{
		this.getHandler().listen(buttons[i],
			goog.events.EventType.CLICK, callbackClickFnc);
	}

	// Render to html
	var menuEl = goog.dom.getElement('menu');
	menuEl.innerHTML = '';

	// Set heading
	if(opt_heading)
	{
		var headingEl = goog.dom.createDom('h2', '', opt_heading);
		menuEl.appendChild(headingEl);
	}

	menuEl.appendChild(el);
};

bp.ui.Menu.prototype.disableMenu = function()
{
	goog.dom.classes.enable(this.menu_, 'inactive', true);
};

/**
 * *
 * All callback functions for each menu
 * *
 */

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
bp.ui.Menu.prototype.handleMainButtonClick_ = function(e)
{
	var value = e.target.innerHTML;
	switch(value)
	{
		case "Start":
			this.layer_.setContent('name', 'dynamic');
			this.getHandler().listenOnce(this.layer_, bp.ui.Layer.EventType.READY,
				this.handleMainLayerLoadComplete_);
		break;
		case "Howto play":
			this.layer_.setContent('howto');
		break;
		case "Credits":
			this.layer_.setContent('credits');
		break;		
	}
};

/**
 * @private
 */
bp.ui.Menu.prototype.handleMainLayerLoadComplete_ = function()
{
	var formEl = goog.dom.getElement('username-injection');
	var formular = new bp.ui.Formular();
	formular.decorate(formEl);

	this.getHandler().listen(formular, bp.events.FormularEvent.EventType.READY,
		this.handleMainFormularLoadComplete_);
};

/**
 * @param  {bp.events.FormularEvent}
 * @private
 */
bp.ui.Menu.prototype.handleMainFormularLoadComplete_ = function(e)
{
	var username = e['values'][0]['el'].value;
	bp.username = username;

	// Send ready state
	this.layer_.setLayerState(false);
	this.disableMenu();
	this.dispatchEvent(bp.ui.Menu.EventType.MAINSTART);
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
bp.ui.Menu.prototype.handlePauseButtonClick_ = function(e)
{
	var value = e.target.innerHTML;
	switch(value)
	{
		case "Continue":
			this.dispatchEvent(bp.ui.Menu.EventType.PAUSECONTINUE);
		break;
		case "Howto play":
			this.handleMainButtonClick_(e);
		break;
	}
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
bp.ui.Menu.prototype.handleLostButtonClick_ = function(e)
{
	var value = e.target.innerHTML;
	switch(value)
	{
		case "Play again":
			this.dispatchEvent(bp.ui.Menu.EventType.LOSTRESTART);
		break;
		case "Howto play":
			this.handleMainButtonClick_(e);
		break;
		case "Credits":
			this.handleMainButtonClick_(e);
		break;
	}
};

/**
 * @enum {string}
 */
bp.ui.Menu.EventType = {
	// Main menu
	'MAINSTART': 'mainStart',
	'MAINHOWTOPLAY': 'mainHowtoPlay',
	// Pause menu
	'PAUSECONTINUE': 'pauseContinue',
	// Lost menu
	'LOSTRESTART': 'lostRestart'
};