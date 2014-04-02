goog.provide('bitpug.controllers.PugController');

goog.require('bitpug.events.MainControl');
goog.require('bitpug.controllers.RegistryController');

/**
 * @constructor
 */
bitpug.controllers.PugController = function()
{

};
goog.addSingletonGetter(bitpug.controllers.PugController);

bitpug.controllers.PugController.prototype.init = function()
{
    this.spawnPug_();
    this.listenMainControl_();
};

/**
 * @private
 */
bitpug.controllers.PugController.prototype.spawnPug_ = function()
{

};

/**
 * @private
 */
bitpug.controllers.PugController.prototype.listenMainControl_ = function()
{
    goog.events.listen(
        bitpug.gameComponents.KeyController,
        bitpug.events.MainControl.EventType.WALKLEFT,
        function(e){
            this.handleWalkStart_('left');
        }, false, this
    );

    goog.events.listen(
        bitpug.gameComponents.KeyController,
        bitpug.events.MainControl.EventType.STOPWALKLEFT,
        function(){
            this.handleWalkStop_();
        }, false, this);

    goog.events.listen(
        bitpug.gameComponents.KeyController,
        bitpug.events.MainControl.EventType.WALKRIGHT,
        function(){
            this.handleWalkStart_('right');
        }, false, this);

    goog.events.listen(
        bitpug.gameComponents.KeyController,
        bitpug.events.MainControl.EventType.STOPWALKRIGHT,
        function(){
            this.handleWalkStop_();
        }, false, this);
};

/**
 * @private
 * @param {bitpug.events.MainControl} drn
 */
bitpug.controllers.PugController.prototype.handleWalkStart_ = function(drn)
{
    console.log(drn);
};

/**
 * @private
 */
bitpug.controllers.PugController.prototype.handleWalkStop_ = function()
{
    console.log('stop');
}