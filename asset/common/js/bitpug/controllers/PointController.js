goog.provide('bp.controllers.PointController');

goog.require('goog.events');

goog.require('bp.events.ActionMsgEvent');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
bp.controllers.PointController = function()
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
goog.inherits(bp.controllers.PointController, goog.events.EventTarget);
goog.addSingletonGetter(bp.controllers.PointController);

/**
 * @param {Array.<Object>} listeners
 */
bp.controllers.PointController.prototype.init = function(listeners)
{
	// Add self to the listeners
	listeners.push(this);

	// Init module
	this.module_ = {
		'points': bp.gameComponents.registry.getElement('point-count-el')[0],
		'level': bp.gameComponents.registry.getElement('level-count-el')[0]
	};

	// Get first points neede for level up
	this.levelPointsNeed_ = bp.settings['levels'][0][0];

	// Add listeners from config
	for(var i = 0; i < listeners.length; i++)
	{
		// Listen for point add
		goog.events.listen(
			/** @type {goog.events.EventTarget} */ (listeners[i]),
			bp.events.PointCounter.EventType.ADD,
			this.handlePointAdd_, false, this);
	}

	// Set level and points to 0
	this.dispatchEvent(new bp.events.PointCounter(
		bp.events.PointCounter.EventType.ADD, '0'));
	this.handleLevelUp_(false);
};

/**
 * @param {bp.events.PointCounter} e
 * @private
 */
bp.controllers.PointController.prototype.handlePointAdd_ = function(e)
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
bp.controllers.PointController.prototype.checkLevel_ = function()
{
	var levelDesigner = bp.settings['levels'];
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
 * @param {boolean} sendMsg
 * @private
 */
bp.controllers.PointController.prototype.handleLevelUp_ = function(sendMsg)
{
	this.levelPoints_ = 0;
	this.level_ += 1;
	this.module_['level'].innerHTML = this.level_;

	// Send action msg
	if(sendMsg)
	{
		bp.ui.ActionMsg.getInstance().dispatchEvent(new
				bp.events.ActionMsgEvent(
					bp.events.ActionMsgEvent.EventType.SETMSG,
					'Level up!'
				));
	}
};