goog.provide('bp.controllers.SoundController');

/**
 * @constructor
 */
bp.controllers.SoundController = function()
{
	/**
	 * @type {Array.<Element>}
	 * @private
	 */
	this.sounds_ = [];

	this.wrapper_ = null;
};
goog.addSingletonGetter(bp.controllers.SoundController);

bp.controllers.SoundController.prototype.init = function()
{
	// Set all sounds
	var sounds = ["boost", "jump", "lost-drop", "lvlup"];

	// Render sound elements to play
	this.renderSounds_(sounds);
};

/**
 * @param {Array.<string>} sounds
 * @private
 */
bp.controllers.SoundController.prototype.renderSounds_ = function(sounds)
{
	var soundDir = '/asset/common/sounds/';

	this.wrapper_ = goog.dom.createDom('div', 'sound-wrapper');

	for(var i = 0; i < sounds.length; i++)
	{
		var audioEl = goog.dom.createDom('audio', 'audio-for-' + sounds[i]);
		var sourceEl = goog.dom.createDom('source');
		sourceEl.src = soundDir + sounds[i] + '.wav';
		sourceEl.type = "audio/wav";
		audioEl.appendChild(sourceEl);
		this.wrapper_.appendChild(audioEl);
		this.sounds_.push(audioEl);
	}

	goog.dom.getElement('game').appendChild(this.wrapper_);
};

bp.controllers.SoundController.prototype.playSound = function(soundName)
{
	var sound = goog.dom.getElementByClass('audio-for-' + soundName, this.wrapper_);
	sound.play();
};