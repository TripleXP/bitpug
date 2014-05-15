goog.provide('bitpug.controllers.PointController');

goog.require('goog.events');

goog.require('bitpug.events.ActionMsgEvent');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
bitpug.controllers.PointController = function()
{
	goog.base(this);

	/**
	 * @type {Object}
	 * @private
	 */
	this.module_ = {};

	/**
	 * @type {number}
	 * @private
	 */
	this.points_ = 0;

	/**
	 * @type {number}
	 * @private
	 */
	this.levelPoints_ = 0;

	/**
	 * @type {number}
	 * @private
	 */
	this.level_ = 0;

	/**
	 * @type {number}
	 * @private
	 */
	this.levelPointsNeed_ = 0;
};
goog.inherits(bitpug.controllers.PointController, goog.events.EventTarget);
goog.addSingletonGetter(bitpug.controllers.PointController);

/**
 * @param {Array.<Object>} listeners
 */
bitpug.controllers.PointController.prototype.init = function(listeners)
{
	// Add self to the listeners
	listeners.push(this);

	// Init module
	this.module_ = {
		'points': bitpug.gameComponents.registry.getElement('point-count-el')[0],
		'level': bitpug.gameComponents.registry.getElement('level-count-el')[0]
	};

	// Get first points neede for level up
	this.levelPointsNeed_ = bitpug.settings['levels'][0][0];

	// Add listeners from config
	for(var i = 0; i < listeners.length; i++)
	{
		// Listen for point add
		goog.events.listen(
			/** @type {goog.events.EventTarget} */ (listeners[i]),
			bitpug.events.PointCounter.EventType.ADD,
			this.handlePointAdd_, false, this);
	}

	// Set level and points to 0
	this.dispatchEvent(new bitpug.events.PointCounter(
		bitpug.events.PointCounter.EventType.ADD, '0'));
	this.handleLevelUp_(false);
};

/**
 * @param {bitpug.events.PointCounter} e
 * @private
 */
bitpug.controllers.PointController.prototype.handlePointAdd_ = function(e)
{
	this.points_ += (Number) (e.points);
	this.levelPoints_ += (Number) (e.points);
	this.module_['points'].innerHTML = this.points_;

	// Check for level up
	this.checkLevel_();
};

/**
 * @private
 */
bitpug.controllers.PointController.prototype.checkLevel_ = function()
{
	var levelDesigner = bitpug.settings['levels'];
	var levelExist = false;
	for(var i = 0; i < levelDesigner.length; i++)
	{
		if(levelDesigner[i][1] == this.level_+1)
		{
			levelExist = true;
			this.levelPointsNeed_ = levelDesigner[i][0];

			if(this.levelPoints_ >= this.levelPointsNeed_)
			{
				this.handleLevelUp_(true);
				break;
			}
		}
	}

	if(!levelExist)
	{
		if(this.levelPoints_ >= this.levelPointsNeed_)
		{
			this.handleLevelUp_(true);
		}
	}
};

/**
 * @param {boolen} sendMsg
 * @private
 */
bitpug.controllers.PointController.prototype.handleLevelUp_ = function(sendMsg)
{
	this.levelPoints_ = 0;
	this.level_ += 1;
	this.module_['level'].innerHTML = this.level_;

	// Send action msg
	if(sendMsg)
	{
		bitpug.ui.ActionMsg.getInstance().dispatchEvent(new
				bitpug.events.ActionMsgEvent(
					bitpug.events.ActionMsgEvent.EventType.SETMSG,
					'Level up!'
				));
	}
};