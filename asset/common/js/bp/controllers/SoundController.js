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
	var sounds = [
		{
			"name": "boost",
			"types": [
				"wav"
			]
		},
		{
			"name": "jump",
			"types": [
				"wav"
			]
		},
		{
			"name": "lost-drop",
			"types": [
				"wav"
			]
		},
		{
			"name": "lvlup",
			"types": [
				"wav"
			]
		},
		{
			"name": "background",
			"types": [
				"mp3",
				"ogg"
			],
			'volume': 0.2,
			'loop': true
		}
	]

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

	for(var i = 0, len = sounds.length; i < len; i++)
	{
		var audioEl = goog.dom.createDom('audio', 'audio-for-' + sounds[i]['name']);

		for(var x = 0, lenX = sounds[i]['types'].length; x < lenX; x++)
		{
			var sourceEl = goog.dom.createDom('source');
			sourceEl.src = soundDir + sounds[i]['name'] + '.' + sounds[i]['types'][x];
			sourceEl.type = 'audio/' + sounds[i]['types'][x];
			audioEl.appendChild(sourceEl);
		}

		if(sounds[i]['volume'])
		{
			audioEl['volume'] = sounds[i]['volume'];
		}

		if(sounds[i]['loop'] && sounds[i]['loop'] == true)
		{
			audioEl.setAttribute('loop', '');
		}

		this.wrapper_.appendChild(audioEl);
		this.sounds_.push(audioEl);
	}

	goog.dom.getElement('game').appendChild(this.wrapper_);
};

/**
 * @param  {string} soundName
 */
bp.controllers.SoundController.prototype.playSound = function(soundName)
{
	var sound = goog.dom.getElementByClass('audio-for-' + soundName, this.wrapper_);
	if(sound) sound.play();
};