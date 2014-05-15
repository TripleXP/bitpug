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
    var gameSection = bitpug.gameComponents.registry.getElement('game-section')[0];
    bitpug.gameComponents.registry.addElement(this.pugEl_);
    gameSection.appendChild(this.pugEl_);
};

/**
 * @private
 */
bitpug.controllers.PugController.prototype.listenMainControl_ = function()
{
    // Walk listeners
    goog.events.listen(
        bitpug.gameComponents.keyController,
        bitpug.events.MainControl.EventType.WALKLEFT,
        function(e){
            this.handleWalkStart_('left');
        }, false, this
    );

    goog.events.listen(
        bitpug.gameComponents.keyController,
        bitpug.events.MainControl.EventType.WALKRIGHT,
        function(){
            this.handleWalkStart_('right');
        }, false, this);

    goog.events.listen(
        bitpug.gameComponents.keyController,
        bitpug.events.MainControl.EventType.STOPWALKLEFT,
        function(){
            this.handleWalkStop_('left');
        }, false, this);

    goog.events.listen(
        bitpug.gameComponents.keyController,
        bitpug.events.MainControl.EventType.STOPWALKRIGHT,
        function(){
            this.handleWalkStop_('right');
        }, false, this);

    // Jump listener
    goog.events.listen(
        bitpug.gameComponents.keyController,
        bitpug.events.MainControl.EventType.JUMP,
        this.handleJump_, false, this);

    // Boost listener
    goog.events.listen(
        bitpug.gameComponents.keyController,
        bitpug.events.MainControl.EventType.BOOST,
        this.handleBoost_, false, this);

    goog.events.listen(
            bitpug.ui.PugPlayer.getInstance(),
            bitpug.ui.PugPlayer.EventType.STOPBOOST,
            this.handleBoostEnd_, false, this);
};

/**
 * @param {string} drn
 * @private
 */
bitpug.controllers.PugController.prototype.handleWalkStart_ = function(drn)
{
    this.pugPlayer_.moveX(drn);
};

/**
 * @param {string} drn
 * @private
 */
bitpug.controllers.PugController.prototype.handleWalkStop_ = function(drn)
{
    if(goog.dom.classes.has(this.pugEl_, 'right') && drn == 'right' ||
        !goog.dom.classes.has(this.pugEl_, 'right') && drn == 'left')
    {
        this.pugPlayer_.stop();
    }
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

/**
 * @private
 */
bitpug.controllers.PugController.prototype.handleBoostEnd_ = function()
{
    bitpug.controllers.KeyController.activeStates['boost'] = false;

    if(bitpug.controllers.KeyController.activeStates['walk'])
    {
        if(goog.dom.classes.has(this.pugEl_, 'right'))
        {
            this.handleWalkStart_('right');
        }
        else if(!goog.dom.classes.has(this.pugEl_, 'right'))
        {
            this.handleWalkStart_('left');
        }
    }
    else
    {
        if(goog.dom.classes.has(this.pugEl_, 'right'))
        {
            this.handleWalkStop_('right');
        }
        else if(!goog.dom.classes.has(this.pugEl_, 'right'))
        {
            this.handleWalkStop_('left');
        }
    }
};