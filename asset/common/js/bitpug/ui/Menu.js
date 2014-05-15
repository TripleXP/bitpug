goog.provide('bp.ui.Menu');

goog.require('goog.ui.Component');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bp.ui.Menu = function()
{
	goog.base(this);
};
goog.inherits(bp.ui.Menu, goog.ui.Component);

bp.ui.Menu.prototype.renderMain = function()
{
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
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
bp.ui.Menu.prototype.handleMainButtonClick_ = function(e)
{
	var value = e.target.innerHTML;

};

/**
 * @enum {string}
 */
bp.ui.Menu.EventType = {
	'MAINSTART': 'mainStart',
	'MAINHOWTOPLAY': 'mainHowtoPlay'
};