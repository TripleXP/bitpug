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
	this.registry_ = bp.gameComponents.registry;

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
	bp.gameComponents.StatDisplay = this;

	// Listen for play/pause trigger
	this.listenGameHandlers_();
};

/**
 * @private
 */
bp.ui.StatDisplay.prototype.renderDisplay_ = function()
{
	// Append display element
	var gameField = this.registry_.getElement(
		'game-section')[0];
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
	var statDisplay = bp.gameComponents.registry.getElement('stat-display')[0];
	var gameHandlers = goog.dom.getElementByClass('game-handlers', statDisplay);

	// Game state trigger
	var gameState = goog.dom.getElementByClass('game-state', gameHandlers);
	goog.events.listen(gameState, goog.events.EventType.CLICK,
		this.handleGameStateClick_, false, this);
};

/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
bp.ui.StatDisplay.prototype.handleGameStateClick_ = function(e)
{
	var gameStateController = bp.gameComponents.gameStateController;

	if(goog.dom.classes.has(e.target, 'pause'))
	{
		goog.dom.classes.swap(e.target, 'pause', 'continue');
		gameStateController.setPause();
	}
	else if (goog.dom.classes.has(e.target, 'continue'))
	{
		goog.dom.classes.swap(e.target, 'continue', 'pause');
		gameStateController.setContinue();
	}
};