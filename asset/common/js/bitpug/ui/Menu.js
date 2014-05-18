goog.provide('bp.ui.Menu');

goog.require('goog.ui.Component');
goog.require('bp.ui.Layer');

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
			goog.dom.createDom('div', 'button', 'Howto play')
		]);

	var buttons = goog.dom.getChildren(el);
	for(var i = 0; i < buttons.length; i++)
	{
		this.getHandler().listen(buttons[i],
			goog.events.EventType.CLICK, this.handleMainButtonClick_);
	}

	goog.dom.getElement('menu').appendChild(el);

	//this.dispatchEvent(bp.ui.Menu.EventType.MAINSTART);
};

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
			this.dispatchEvent(bp.ui.Menu.EventType.MAINSTART);
			this.disableMenu_();
		break;
		case "Howto play":
			this.layer_.setContent('howto');
		break;
	}
};

/**
 * @private
 */
bp.ui.Menu.prototype.disableMenu_ = function()
{
	goog.dom.classes.enable(this.menu_, 'inactive', true);
};

/**
 * @enum {string}
 */
bp.ui.Menu.EventType = {
	'MAINSTART': 'mainStart',
	'MAINHOWTOPLAY': 'mainHowtoPlay'
};