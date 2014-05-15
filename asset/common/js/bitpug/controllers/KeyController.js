goog.provide('bitpug.controllers.KeyController');

goog.require('bitpug.events.MainControl');
goog.require('goog.events.EventTarget');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
bitpug.controllers.KeyController = function()
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
    bitpug.controllers.KeyController.activeStates = {};

};
goog.inherits(bitpug.controllers.KeyController, goog.events.EventTarget);
goog.addSingletonGetter(bitpug.controllers.KeyController);

bitpug.controllers.KeyController.prototype.init = function()
{
    this.addKeyListeners_();

    // Add active key properties
    bitpug.controllers.KeyController.activeStates = {
        'walk': false,
        'boost': false,
        'jump': false
    };
};

/**
 * @private
 */
bitpug.controllers.KeyController.prototype.addKeyListeners_ = function()
{
    goog.events.listen(window, goog.events.EventType.KEYDOWN,
        this.handleKeyDownUp_, false, this);

    goog.events.listen(window, goog.events.EventType.KEYUP,
        this.handleKeyDownUp_, false, this);
};

/**
 * @param  {boolean} isLocked
 */
bitpug.controllers.KeyController.prototype.lock = function(isLocked)
{
    this.isLocked_ = isLocked;
};

/**
 * @private
 * @param  {goog.events.BrowserEvent} e
 */
bitpug.controllers.KeyController.prototype.handleKeyDownUp_ = function(e)
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
                        bitpug.events.MainControl.EventType.WALKLEFT);
                    bitpug.controllers.KeyController.activeStates['walk'] = true;
                }
            }
            else if(e.type == 'keyup')
            {
                if(this.leftKeyActive_)
                {
                    this.leftKeyActive_ = false;
                    this.handleWalk_(
                        bitpug.events.MainControl.EventType.STOPWALKLEFT);
                    bitpug.controllers.KeyController.activeStates['walk'] = false;
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
                            bitpug.events.MainControl.EventType.WALKRIGHT);
                    bitpug.controllers.KeyController.activeStates['walk'] = true;
                }
            }
            else if(e.type == 'keyup')
            {
                if(this.rightKeyActive_)
                {
                    this.rightKeyActive_ = false;
                    this.handleWalk_(
                        bitpug.events.MainControl.EventType.STOPWALKRIGHT);
                    bitpug.controllers.KeyController.activeStates['walk'] = false;
                }
            }
        break;

        case 32: // Space
            if(this.isLocked_)
                return;

            if(e.type == 'keyup')
            {
               this.dispatchEvent(bitpug.events.MainControl.EventType.JUMP);
            }
        break;

        case 66: // b
            if(this.isLocked_)
                return;

            if(e.type == 'keydown')
            {
               this.dispatchEvent(bitpug.events.MainControl.EventType.BOOST);
               bitpug.controllers.KeyController.activeStates['boost'] = true;
            }
        break;
    }
};

/**
 * @param  {string} event
 */
bitpug.controllers.KeyController.prototype.handleWalk_ = function(event)
{
    this.dispatchEvent(event);
};