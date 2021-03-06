goog.provide('bp.ui.Layer');

goog.require('goog.dom.classes');
goog.require('goog.ui.Component');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bp.ui.Layer = function()
{
	goog.base(this);

	/**
	 * @type {Element}
	 * @private
	 */
	this.layerEl_ = null;

	/**
	 * @type {Element}
	 * @private
	 */
	this.contentEl_ = null;
};
goog.inherits(bp.ui.Layer, goog.ui.Component);

bp.ui.Layer.prototype.init = function()
{
	this.layerEl_ = goog.dom.getElement('layer');
	this.contentEl_ = goog.dom.getElementByClass('content',
		this.layerEl_);


	var close = goog.dom.getElementByClass('close', this.layerEl_);
	this.getHandler().listen(close, goog.events.EventType.CLICK,
		function(){
			this.setLayerState(false);
		});
};

/**
 * @param {string} filename
 * @param {string=} opt_className
 */
bp.ui.Layer.prototype.setContent = function(filename, opt_className)
{
	if(opt_className)
	{
		goog.dom.classes.enable(this.layerEl_, opt_className, true);
	}
	else
	{
		this.layerEl_.className = "";
	}

	var gaXhr = new goog.net.XhrIo();
	gaXhr.send(bp.baseUrl + 'app/views/' + filename + '.php');

	this.setLayerState(true);

	this.getHandler().listen(gaXhr, goog.net.EventType.SUCCESS,
		this.handleContentLoadComplete_);
};

/**
 * @param {goog.events.Event} e
 * @private
 */
bp.ui.Layer.prototype.handleContentLoadComplete_ = function(e)
{
	var response = e.target.getResponseText();
	this.contentEl_.innerHTML = response;
	this.dispatchEvent(bp.ui.Layer.EventType.READY);
};

/**
 * @param {boolean} isActive
 */
bp.ui.Layer.prototype.setLayerState = function(isActive)
{
	goog.dom.classes.enable(this.layerEl_, 'active', isActive);

	if(isActive)
	{
		var loadingCircle = goog.dom.createDom('div', 'loading-circle');
		this.contentEl_.appendChild(loadingCircle);
	}
};

/**
 * @enum {string}
 */
bp.ui.Layer.EventType = {
	'READY': 'ready'
};