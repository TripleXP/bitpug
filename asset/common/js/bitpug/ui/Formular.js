goog.provide('bp.ui.Formular');

goog.require('goog.ui.Component');

goog.require('bp.events.FormularEvent');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bp.ui.Formular = function()
{
	goog.base(this);

	/**
	 * @type {Array.<Object>}
	 * @private
	 */
	this.inputs_ = [];

	/**
	 * @type {Element}
	 * @private
	 */
	this.errorEl_ = null;
};
goog.inherits(bp.ui.Formular, goog.ui.Component);

/** @inheritDoc */
bp.ui.Formular.prototype.decorateInternal = function(el)
{
	goog.base(this, 'decorateInternal', el);

	// Set error box
	this.errorEl_ = this.getElementByClass('error');
	if(!this.errorEl_)
	{
		var errorEl = goog.dom.createDom('div', 'error');
		this.errorEl_ = errorEl;
		el.appendChild(this.errorEl_);
	}

	// Get inputs
	var inputsRaw = goog.dom.getElementsByTagNameAndClass('input', '', el);
	for(var i = 0; i < inputsRaw.length; i++)
	{
		this.inputs_[inputsRaw[i].id || inputsRaw[i].name || inputsRaw[i].type] = {
			"id": inputsRaw[i].id,
			"el": inputsRaw[i],
			"type": inputsRaw[i].type,
			"value": inputsRaw[i].value
		};
	}
};

/** @inheritDoc */
bp.ui.Formular.prototype.enterDocument = function()
{
	goog.base(this, 'enterDocument');

	this.getHandler().listen(this.getElement(),
		goog.events.EventType.SUBMIT, this.handleSubmit_);
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
bp.ui.Formular.prototype.handleSubmit_ = function(e)
{
	e.preventDefault();

	// Update inputs value
	for(var id in this.inputs_)
	{
		this.inputs_[id]['value'] = this.inputs_[id]['el'].value;
	}

	if(this.checkInputs_())
	{
		this.dispatchEvent(
			new bp.events.FormularEvent(
				bp.events.FormularEvent.EventType.READY,
				this.inputs_)
			);
	}
};

/**
 * @private
 * @return {boolean}
 */
bp.ui.Formular.prototype.checkInputs_ = function()
{
	for(var id in this.inputs_)
	{
		switch(this.inputs_[id]['type'])
		{
			case 'text':
				if(this.inputs_[id]['el'].value == '')
				{
					this.setError_('Please enter a username');
				}
				else if(this.inputs_[id]['el'].value.length < 4)
				{
					this.setError_('You have to enter at least 4 signs');
				}
				else if(this.inputs_[id]['el'].value.length > 20)
				{
					this.setError_('Username too big!');
				}
				else
				{
					this.setError_('');
					return true;
				}
			break;
		}
	}

	return false;
};

/**
 * @param {string} error
 * @private
 */
bp.ui.Formular.prototype.setError_ = function(error)
{
	this.errorEl_.innerHTML = "&raquo; " + error;
};
