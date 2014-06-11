goog.provide('bp.controllers.PointController');

goog.require('goog.events');

goog.require('bp.events.ActionMsgEvent');
goog.require('bp.handlers.GameHandler');

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
	 */
	this.points = 0;

	/**
	 * @type {number}
	 * @private
	 */
	this.levelPoints_ = 0;

	/**
	 * @type {number}
	 */
	this.level = 0;

	/**
	 * @type {number}
	 * @private
	 */
	this.levelPointsNeed_ = 0;

	/**
	 * @type {bp.handlers.GameHandler}
	 * @private
	 */
	this.handler_ = bp.handlers.GameHandler.getInstance();

	/**
	 * @type {bp.controllers.SoundController}
	 * @private
	 */
	this.sounds_ = bp.controllers.SoundController.getInstance();
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
		'points': bp.gameComponents['registry'].getElement('point-count-el')[0],
		'level': bp.gameComponents['registry'].getElement('level-count-el')[0]
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

	// Listen for play again
	goog.events.listen(this.handler_, bp.events.GameEvent.EventType.PLAYAGAIN,
		this.resetAll_, false, this);
};

/**
 * @private
 */
bp.controllers.PointController.prototype.resetAll_ = function()
{
	this.points = 0;
	this.module_['points'].innerHTML = this.points;
	this.level = 0;
	this.handleLevelUp_(false);
	this.checkLevel_();
};

/**
 * @param {bp.events.PointCounter} e
 * @private
 */
bp.controllers.PointController.prototype.handlePointAdd_ = function(e)
{
	this.points += (Number) (e.points);
	this.levelPoints_ += (Number) (e.points);
	this.module_['points'].innerHTML = this.points;

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
		if(levelDesigner[i][1] == this.level+1)
		{
			levelExist = true;

			if(levelDesigner[i][0] != '^')
			{
				this.levelPointsNeed_ = levelDesigner[i][0];
			}

			if(this.levelPoints_ >= this.levelPointsNeed_)
			{
				if(levelDesigner[i][2])
				{
					var componentNames = levelDesigner[i][2].split(';');

					for(var i = 0; i < componentNames.length; i++)
					{
						// Remove all spaces in string
						componentNames[i] = componentNames[i].replace(/\s+/g, '');

						if(componentNames[i] == '')
							continue;

						var currentComponentName = componentNames[i].split('[')[0];
						var functionNames = componentNames[i].split('[')[1].replace(']', '').split('/');

						for(var f = 0; f < functionNames.length; f++)
						{
							if(functionNames[f] == '')
								continue;

							var currentFunctionName = functionNames[f].split('(')[0];
							var currentFunctionArgs = functionNames[f].split('(')[1].replace(')', '').split(',');

							if(goog.typeOf(bp.gameComponents[currentComponentName][currentFunctionName]) == 'function')
							{
								bp.gameComponents[currentComponentName][currentFunctionName].apply(
									bp.gameComponents[currentComponentName],
									currentFunctionArgs);
							}
						}
					}
				}

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
	this.level += 1;
	this.module_['level'].innerHTML = this.level;

	this.sounds_.playSound('lvlup');

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