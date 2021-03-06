goog.provide('bp.ui.StatDisplay');

goog.require('goog.ui.Component');
goog.require('goog.Timer');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
bp.ui.StatDisplay = function()
{
	goog.base(this);

	/**
	 * @type {Element}
	 * @private
	 */
	this.statDisplay_ = null;

	/**
	 * @type {Object}
	 * @private
	 */
	this.registry_ = bp.gameComponents['registry'];

	/**
	 * @type {number}
	 * @private
	 */
	this.gamePoints_ = 0;

	/**
	 * @type {Element}
	 * @private
	 */
	this.pointEl_ = null;

	/**
	 * @type {number}
	 * @private
	 */
	this.gameLevel_ = 0;

	/**
	 * @type {Element}
	 * @private
	 */
	this.levelEl_ = null;

	/**
	 * @type {Element}
	 * @private
	 */
	this.gameStateEl_ = null;
};
goog.inherits(bp.ui.StatDisplay, goog.ui.Component);

bp.ui.StatDisplay.prototype.init = function()
{
	// Stat display element tree (Modules)
	this.statDisplay_ = goog.dom.createDom('div', '', [
		goog.dom.createDom('div', 'deko-pug'), // Deko
		goog.dom.createDom('div', 'module life x3', [
				goog.dom.createDom('div', 'hearts')
			]), // Life section
		goog.dom.createDom('div', 'module points'), // Point section
		goog.dom.createDom('div', 'module level'),   // Level section
		goog.dom.createDom('div', 'module boost', [
			goog.dom.createDom('div', 'bar-wrapper', [
				goog.dom.createDom('div', 'bar empty')])]
		), // Boost section
		goog.dom.createDom('div', 'module action-msg'), // Action msg
		goog.dom.createDom('div', 'game-handlers', [
				goog.dom.createDom('div', 'game-state pause')
			]) // Game handler section (start, pause, etc.)
	]);

	// Add boost module to components
	var boostModule = goog.dom.getElementByClass('boost',
		this.statDisplay_);
	this.registry_.addElement(boostModule, 'boost-cmp');

	// Get point el
	this.pointEl_ = goog.dom.getElementByClass('points',
		this.statDisplay_);

	// Get level el
	this.levelEl_ = goog.dom.getElementByClass('level',
		this.statDisplay_);

	// Add element to registry
	this.registry_.addElement(this.statDisplay_, 'stat-display');

	// Render display
	this.renderDisplay_();

	// Add point element to registry
	this.registry_.addElement(this.pointEl_, 'point-count-el');

	// Add level element to registry
	this.registry_.addElement(this.levelEl_, 'level-count-el');

	// Add Component
	bp.gameComponents['StatDisplay'] = this;

	// Listen for play/pause trigger
	this.listenGameHandlers_();
};

/**
 * @private
 */
bp.ui.StatDisplay.prototype.renderDisplay_ = function()
{
	// Append display element
	var gameField = goog.dom.getElementByClass('playground');
	gameField.appendChild(this.statDisplay_);
	goog.Timer.callOnce(function(){
		goog.dom.classes.enable(this.statDisplay_, 'visible', true);
	}, 0, this);
};

/**
 * @private
 */
bp.ui.StatDisplay.prototype.listenGameHandlers_ = function()
{
	var statDisplay = this.registry_.getElement('stat-display')[0];
	var gameHandlers = goog.dom.getElementByClass('game-handlers', statDisplay);

	// Game state trigger
	this.gameStateEl_ = goog.dom.getElementByClass('game-state', gameHandlers);
	this.getHandler().listen(this.gameStateEl_, goog.events.EventType.CLICK,
		this.handleGameStateClick_);

	// Listen to change classes
	var handler = bp.handlers.GameHandler.getInstance();
	this.getHandler().listen(handler, [
			bp.events.GameEvent.EventType.PAUSE,
			bp.events.GameEvent.EventType.CONTINUE,
			bp.events.GameEvent.EventType.PLAYAGAIN,
			bp.events.GameEvent.EventType.STOPGAME
		], this.handleStateChange_);
};

/**
 * @param {goog.events.Event} e
 * @private
 */
bp.ui.StatDisplay.prototype.handleStateChange_ = function(e)
{
	if(e.type == 'pause' || e.type == 'stopgame')
	{
		goog.dom.classes.enable(this.statDisplay_, 'visible', false);
		goog.dom.classes.swap(this.gameStateEl_ , 'pause', 'continue');
	}
	else if (e.type == 'continue' || e.type == 'playagain')
	{
		goog.dom.classes.enable(this.statDisplay_, 'visible', true);
		goog.dom.classes.swap(this.gameStateEl_ , 'continue', 'pause');
	}
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
bp.ui.StatDisplay.prototype.handleGameStateClick_ = function(e)
{
	var gameStateController = bp.gameComponents['gameStateController'];
	gameStateController.toggleState();
};