goog.provide('bp.controllers.PugController');

goog.require('bp.ui.PugPlayer');
goog.require('bp.events.MainControl');
goog.require('bp.controllers.RegistryController');

/**
 * @constructor
 */
bp.controllers.PugController = function()
{
    /**
     * @type {Element}
     * @private
     */
    this.pugEl_ = null;

    /**
     * @type {bp.ui.PugPlayer}
     * @private
     */
    this.pugPlayer_ = new bp.ui.PugPlayer();
};
goog.addSingletonGetter(bp.controllers.PugController);

bp.controllers.PugController.prototype.init = function()
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
bp.controllers.PugController.prototype.spawnPug_ = function()
{
    // Create pug element
    this.pugEl_ = goog.dom.createDom('div', 'pug-player', [
            goog.dom.createDom('div', 'mouth')
        ]);
    var gameSection = bp.gameComponents['registry'].getElement('game-section')[0];
    bp.gameComponents['registry'].addElement(this.pugEl_);
    gameSection.appendChild(this.pugEl_);
};

/**
 * @private
 */
bp.controllers.PugController.prototype.listenMainControl_ = function()
{
    // Walk listeners
    goog.events.listen(
        bp.gameComponents['keyController'],
        bp.events.MainControl.EventType.WALKLEFT,
        function(e){
            this.handleWalkStart_('left');
        }, false, this
    );

    goog.events.listen(
        bp.gameComponents['keyController'],
        bp.events.MainControl.EventType.WALKRIGHT,
        function(){
            this.handleWalkStart_('right');
        }, false, this);

    goog.events.listen(
        bp.gameComponents['keyController'],
        bp.events.MainControl.EventType.STOPWALKLEFT,
        function(){
            this.handleWalkStop_('left');
        }, false, this);

    goog.events.listen(
        bp.gameComponents['keyController'],
        bp.events.MainControl.EventType.STOPWALKRIGHT,
        function(){
            this.handleWalkStop_('right');
        }, false, this);

    // Jump listener
    goog.events.listen(
        bp.gameComponents['keyController'],
        bp.events.MainControl.EventType.JUMP,
        this.handleJump_, false, this);

    // Boost listener
    goog.events.listen(
        bp.gameComponents['keyController'],
        bp.events.MainControl.EventType.BOOST,
        this.handleBoost_, false, this);

    goog.events.listen(
        bp.ui.PugPlayer.getInstance(),
        bp.ui.PugPlayer.EventType.STOPBOOST,
        this.handleBoostEnd_, false, this);
};

/**
 * @param {string} drn
 * @private
 */
bp.controllers.PugController.prototype.handleWalkStart_ = function(drn)
{
    this.pugPlayer_.moveX(drn);
};

/**
 * @param {string} drn
 * @private
 */
bp.controllers.PugController.prototype.handleWalkStop_ = function(drn)
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
bp.controllers.PugController.prototype.handleJump_ = function()
{
    this.pugPlayer_.jump();
};

/**
 * @private
 */
bp.controllers.PugController.prototype.handleBoost_ = function()
{
    this.pugPlayer_.boost();
};

/**
 * @private
 */
bp.controllers.PugController.prototype.handleBoostEnd_ = function()
{
    bp.controllers.KeyController.activeStates['boost'] = false;

    if(bp.controllers.KeyController.activeStates['walk'])
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

/**
 * *
 * Functions called from the configuration of the user
 * IMPORTANT: All functions need a expose
 * *
 */

/**
 * @expose
 */
bp.controllers.PugController.prototype.newMoveSpeed = function()
{
    var newPxTick = parseInt(arguments[0], 10);
    var increase = false;
    if(arguments[1] && arguments[1] == 'true')
    {
        increase = true;
    }

    this.pugPlayer_.changeWalkSpeed(newPxTick, increase);
};

/**
 * @expose
 */
bp.controllers.PugController.prototype.newBoostLoaderDelay = function()
{
    var ms = parseInt(arguments[0], 10);
    this.pugPlayer_.changeBoostLoaderDelay(ms);
};

/**
 * @expose
 */
bp.controllers.PugController.prototype.newWalkAnimationMs = function()
{
    var ms = parseInt(arguments[0], 10);
    this.pugPlayer_.changeAnimationTicks(ms);
};

/**
 * @expose
 */
bp.controllers.PugController.prototype.newMaxJumpHeight = function()
{
    var px = parseInt(arguments[0], 10);
    this.pugPlayer_.changeMaxJumpHeight(px);
};

/**
 * @expose
 */
bp.controllers.PugController.prototype.newJumpSpeed = function()
{
    var ms = parseInt(arguments[0], 10);
    this.pugPlayer_.changeJumpSpeed(ms);
};