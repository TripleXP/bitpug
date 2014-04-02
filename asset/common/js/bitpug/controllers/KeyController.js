goog.provide('bitpug.controllers.KeyController');

goog.require('bitpug.events.MainControl');
goog.require('goog.events.EventTarget');

/**
 * @constructor
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

};
goog.inherits(bitpug.controllers.KeyController, goog.events.EventTarget);
goog.addSingletonGetter(bitpug.controllers.KeyController);

bitpug.controllers.KeyController.prototype.init = function()
{
    this.addKeyListeners_();
    var eTarget = new bitpug.events.MainControl();
};

/**
 * @private
 */
bitpug.controllers.KeyController.prototype.addKeyListeners_ = function()
{
    goog.events.listen(window, goog.events.EventType.KEYDOWN,
        this.handleKeyDown_, false, this);

    goog.events.listen(window, goog.events.EventType.KEYUP,
        this.handleKeyDown_, false, this);
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
bitpug.controllers.KeyController.prototype.handleKeyDown_ = function(e)
{
    if(this.isLocked_)
        return;

    switch(e.keyCode)
    {
        // Arrow left
        case 37:
            if(e.type == 'keydown')
            {
                if(!this.leftKeyActive_)
                {
                    this.leftKeyActive_ = true;
                    this.handleWalk_(
                        bitpug.events.MainControl.EventType.WALKLEFT);
                }
            }
            else if(e.type == 'keyup')
            {
                if(this.leftKeyActive_)
                {
                    this.leftKeyActive_ = false;
                    this.handleWalk_(
                        bitpug.events.MainControl.EventType.STOPWALKLEFT);
                }
            }
        break;

        // Arrow right
        case 39:
            if(e.type == 'keydown')
            {
                if(!this.rightKeyActive_)
                {
                    this.rightKeyActive_ = true;
                    this.handleWalk_(
                            bitpug.events.MainControl.EventType.WALKRIGHT);
                }
            }
            else if(e.type == 'keyup')
            {
                if(this.rightKeyActive_)
                {
                    this.rightKeyActive_ = false;
                    this.handleWalk_(
                        bitpug.events.MainControl.EventType.STOPWALKRIGHT);
                }
            }
        break;
    }
};

bitpug.controllers.KeyController.prototype.handleWalk_ = function(event)
{
    this.dispatchEvent(event);
};