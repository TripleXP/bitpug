goog.provide('bp.controllers.HighscoreController');

goog.require('goog.net.XhrIo');

/**
 * @constructor
 */
bp.controllers.HighscoreController = function()
{
	/**
	 * @type {goog.net.XhrIo}
	 * @private
	 */
	this.xhr_ = new goog.net.XhrIo();

	/**
	 * @type {boolean} Need key
	 * @private
	 */
	this.granted_ = false;
};
goog.addSingletonGetter(bp.controllers.HighscoreController);

/**
 * @param  {number} lvl
 * @param  {number} points
 */
bp.controllers.HighscoreController.prototype.writeHighscore = function(lvl, points)
{
	this.granted_ = true;

	if(this.granted_ == true &&
		bp.accessKey == bp.settings['highscore']['accessKey'] &&
		points >= bp.settings['highscore']['pointsNeed'])
	{
		this.xhr_.send('/index.php?hs=true&username=' + bp.username + '&level=' + lvl + '&points=' + points);
	}

	// Deny access
	goog.events.listen(this.xhr_, goog.net.EventType.COMPLETE, function(){
		this.granted_ = false;
		bp.accessKey = "";
	}, false, this);
};