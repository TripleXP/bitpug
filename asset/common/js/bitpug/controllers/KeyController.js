goog.provide('bp.controllers.KeyController');

goog.require('bp.events.MainControl');
goog.require('goog.events.EventTarget');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
bp.controllers.KeyController = function()
{
    goog.base(this);

    /**
     * @type {boolean}
     * @private
     */
    this.isLocked_ = true;

    /**
     * @type {boolean}
     * @private
     */
    this.leftKeyActive_ = false;

    /**
     * @type {boolean}
     * @private
     */
    this.rightKeyActive_ = false;

    /**
     * @type {Object}
     */
    bp.controllers.KeyController.activeStates = {};

    /**
     * @type {bp.controllers.GameStateController}
     * @private
     */
    this.gameStateController_ = bp.gameComponents.gameStateController;
};
goog.inherits(bp.controllers.KeyController,
    goog.events.EventTarget);
goog.addSingletonGetter(bp.controllers.KeyController);

bp.controllers.KeyController.prototype.init = function()
{
    this.addKeyListeners_();

    // Add active key properties
    bp.controllers.KeyController.activeStates = {
        'walk': false,
        'boost': false,
        'jump': false
    };
};

/**
 * @private
 */
bp.controllers.KeyController.prototype.addKeyListeners_ = function()
{
    goog.events.listen(window, 
        [goog.events.EventType.KEYUP, goog.events.EventType.KEYDOWN],
        this.handleKeyDownUp_, false, this);
};

/**
 * @param  {boolean} isLocked
 */
bp.controllers.KeyController.prototype.lock = function(isLocked)
{
    this.isLocked_ = isLocked;
    this.handleWalk_(bp.events.MainControl.EventType.STOPWALKLEFT);
    this.handleWalk_(bp.events.MainControl.EventType.STOPWALKRIGHT);
};

/**
 * @private
 * @param  {goog.events.BrowserEvent} e
 */
bp.controllers.KeyController.prototype.handleKeyDownUp_ = function(e)
{
    switch(e.keyCode)
    {
        case 37: // Arrow left
            if(e.type == 'keydown')
            {
                if(this.isLocked_)
                    return;

                if(!this.leftKeyActive_)
                {
                    this.leftKeyActive_ = true;
                    this.handleWalk_(
                        bp.events.MainControl.EventType.WALKLEFT);
                    bp.controllers.KeyController.activeStates['walk'] = true;
                }
            }
            else if(e.type == 'keyup')
            {
                if(this.leftKeyActive_)
                {
                    this.leftKeyActive_ = false;
                    this.handleWalk_(
                        bp.events.MainControl.EventType.STOPWALKLEFT);
                    bp.controllers.KeyController.activeStates['walk'] = false;
                }
            }
        break;

        case 39: // Arrow right
            if(e.type == 'keydown')
            {
                if(this.isLocked_)
                    return;

                if(!this.rightKeyActive_)
                {
                    this.rightKeyActive_ = true;
                    this.handleWalk_(
                            bp.events.MainControl.EventType.WALKRIGHT);
                    bp.controllers.KeyController.activeStates['walk'] = true;
                }
            }
            else if(e.type == 'keyup')
            {
                if(this.rightKeyActive_)
                {
                    this.rightKeyActive_ = false;
                    this.handleWalk_(
                        bp.events.MainControl.EventType.STOPWALKRIGHT);
                    bp.controllers.KeyController.activeStates['walk'] = false;
                }
            }
        break;

        case 32: // Space
            if(this.isLocked_)
                return;

            if(e.type == 'keyup')
            {
               this.dispatchEvent(bp.events.MainControl.EventType.JUMP);
            }
        break;

        case 66: // b
            if(this.isLocked_)
                return;

            if(e.type == 'keydown')
            {
               this.dispatchEvent(bp.events.MainControl.EventType.BOOST);
               bp.controllers.KeyController.activeStates['boost'] = true;
            }
        break;

        case 27: // ESC
        case 80: // Pause
            if(e.type == 'keyup')
            {
                this.gameStateController_.toggleState();
            }
        break;
    }
};

/**
 * @param  {string} event
 */
bp.controllers.KeyController.prototype.handleWalk_ = function(event)
{
    this.dispatchEvent(event);
};