goog.provide('bitpug.controllers.PugController');

goog.require('bitpug.ui.PugPlayer');
goog.require('bitpug.events.MainControl');
goog.require('bitpug.controllers.RegistryController');

/**
 * @constructor
 */
bitpug.controllers.PugController = function()
{
    /**
     * @type {Element}
     * @private
     */
    this.pugEl_ = null;

    /**
     * @type {bitpug.ui.PugPlayer}
     * @private
     */
    this.pugPlayer_ = new bitpug.ui.PugPlayer();
};
goog.addSingletonGetter(bitpug.controllers.PugController);

bitpug.controllers.PugController.prototype.init = function()
{
    this.spawnPug_();
    this.listenMainControl_();

    // Decorate (init) pug player
    this.pugPlayer_.decorate(this.pugEl_);

    // Load boost module
    this.pugPlayer_.boost();
};

/**
 * @private
 */
bitpug.controllers.PugController.prototype.spawnPug_ = function()
{
    // Create pug element
    this.pugEl_ = goog.dom.createDom('div', 'pug-player', [
            goog.dom.createDom('div', 'mouth')
        ]);
    var gameSection = bitpug.gameComponents.Registry.getElement('game-section')[0];
    bitpug.gameComponents.Registry.addElement(this.pugEl_);
    gameSection.appendChild(this.pugEl_);
};

/**
 * @private
 */
bitpug.controllers.PugController.prototype.listenMainControl_ = function()
{
    // Walk listeners
    goog.events.listen(
        bitpug.gameComponents.KeyController,
        bitpug.events.MainControl.EventType.WALKLEFT,
        function(e){
            this.handleWalkStart_('left');
        }, false, this
    );

    goog.events.listen(
        bitpug.gameComponents.KeyController,
        bitpug.events.MainControl.EventType.WALKRIGHT,
        function(){
            this.handleWalkStart_('right');
        }, false, this);

    goog.events.listen(
        bitpug.gameComponents.KeyController,
        bitpug.events.MainControl.EventType.STOPWALK,
        function(){
            this.handleWalkStop_();
        }, false, this);

    // Jump listener
    goog.events.listen(
        bitpug.gameComponents.KeyController,
        bitpug.events.MainControl.EventType.JUMP,
        this.handleJump_, false, this);

    // Boost listener
    goog.events.listen(
        bitpug.gameComponents.KeyController,
        bitpug.events.MainControl.EventType.BOOST,
        this.handleBoost_, false, this);
};

/**
 * @private
 * @param {bitpug.events.MainControl} drn
 */
bitpug.controllers.PugController.prototype.handleWalkStart_ = function(drn)
{
    this.pugPlayer_.moveX(drn);
};

/**
 * @private
 */
bitpug.controllers.PugController.prototype.handleWalkStop_ = function()
{
    this.pugPlayer_.stop();
};

/**
 * @private
 */
bitpug.controllers.PugController.prototype.handleJump_ = function()
{
    this.pugPlayer_.jump();
};

/**
 * @private
 */
bitpug.controllers.PugController.prototype.handleBoost_ = function()
{
    this.pugPlayer_.boost();
};