goog.provide('bp.controllers.HighscoreController');

goog.require('goog.net.XhrIo');

/**
 * @constructor
 */
bp.controllers.HighscoreController = function()
{
	this.xhr_ = new goog.net.XhrIo();
};
goog.addSingletonGetter(bp.controllers.HighscoreController);

/**
 * @param  {number} lvl
 * @param  {number} points
 */
bp.controllers.HighscoreController.prototype.writeHighscore = function(lvl, points)
{
	this.xhr_.send('/index.php?hs=true&username=' + bp.username + '&level=' + lvl + '&points=' + points);
};