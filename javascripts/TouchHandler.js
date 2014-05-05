/**
 * Created by Brandon on 4/30/2014.
 * This is a javascript to implement gestures into 3Scape
 */

TouchHandler.prototype = new DeviceHandler();
TouchHandler.prototype.constructor = TouchHandler;

function TouchHandler()
{
    DeviceHandler.call(this);
    this.className = "TouchHandler";

    this.name.setValueDirect("TouchHandler");

    this.lastX = 0;
    this.lastY = 0;

    this.x = new NumberAttr(0);
    this.y = new NumberAttr(0);
    this.deltaX = new NumberAttr(0);
    this.deltaY = new NumberAttr(0);
    this.delta = new Vector2DAttr(0, 0);

    this.registerAttribute(this.x, "deviceX");
    this.registerAttribute(this.y, "deviceY");
    this.registerAttribute(this.deltaX, "deltaX");
    this.registerAttribute(this.deltaY, "deltaY");
    this.registerAttribute(this.delta, "delta");

    //this.addEventType();
    //this.addEventType(eEventType.MouseLeftDown);
}

//If we don't have a touch device we can use these plugins in order to fake the events using shift mouse click
if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
    Hammer.plugins.showTouches();
}

if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
    Hammer.plugins.fakeMultitouch();
}

var options = {
    preventDefault: true,
    swipeVelocityX: 0.1,
    dragMinDistance: 100
};
//We are creating a hammer touch event in an element
var hammertime = Hammer(document.getElementById('BwContainer'),options);

//We are turning on touch capabilities and setting which we want to define.
hammertime.on('touch drag doubletap transform pinchin pinchout release swipeleft swiperight', function(ev) {
    bridgeworks.TouchHandler.eventPerformed(ev);
});
var x = 0;
var temp;
//Function that manages the type of touch we are performing.
TouchHandler.prototype.eventPerformed = function(ev)
{
    var y = ev.gesture.touches[0].clientY;
    var X = bridgeworks.getRegistry().find("SceneInspector");
    //bridgeworks.TouchHandler = new TouchHandler();

    switch (ev.type)
    {
        case 'swipeleft':
            console.log("This is swiping left");
            //bridgeworks.TouchHandler.
            break;

        case 'touch':

            temp = ev.gesture.touches[0].clientX;

            console.log("TESTING: "+ev.gesture.touches[0].clientX);
            //----------------------------------------------------------------
            //I am printing the X and Y coordinate of the first touch, touches are logged in an array.

            console.log("We are touching the screen. Your X position is: "+ev.gesture.touches[0].clientX);
            console.log("We are touching the screen. Your Y position is: "+ev.gesture.touches[0].clientY);



            //Prints out the 2nd touches x and y when u have more than 1 finger on the screen.
            if(ev.gesture.touches.length>1) {
                console.log("We are touching the screen. Your X position is: " + ev.gesture.touches[1].clientX);
                console.log("We are touching the screen. Your Y position is: " + ev.gesture.touches[1].clientY);
            }

            //I am making a mouseEvent and plugging my touch event x and y into it and then letting the current mouseHandler handle
            //the movement.
            var button = event.gesture.touches.length;
            var mouseEvent = new MouseEvent("mousedown", 0, 0, 0, 0, 0, null);
            mouseEvent.button = button-1;
            mouseEvent.clientX = ev.gesture.touches[0].clientX;
            mouseEvent.clientY = ev.gesture.touches[0].clientY;
            console.log("Mouse.clientX: "+mouseEvent.clientX);
            bridgeworks.handleEvent(mouseEvent);


            break;

        case 'drag':

            //For Testing Purposes
            console.log("We are dragging the screen. And here is its change in x: "+temp);
            //I am making a mouseEvent and plugging my touch event x and y into it and then letting the current mouseHandler handle
            //the movement.
                var button1 = event.gesture.touches.length;
                var mouseEvent1 = new MouseEvent("mousemove", 0, 0, 0, 0, 0, null);
                mouseEvent1.button = button1 - 1;
                mouseEvent1.clientX = temp;//ev.gesture.touches[0].clientX;
                mouseEvent1.clientY = ev.gesture.touches[0].clientY;
                bridgeworks.handleEvent(mouseEvent1);

            temp = ev.gesture.touches[0].clientX;

            break;

        /*case 'transform':

            bridgeworks.TouchHandler.deltaY.addElementTarget(X.panDelta,0,2);
           // x = ev.gesture.deltaY;

            //For tesiting purposes
            console.log("Delta Y for the Transform is : "+ev.gesture.deltaY);


            //this.deltaY.setValueDirect(ev.gesture.deltaY);
            //cmd = "\<Scale target='"+ pointWorld.x + "' y='" +ev.gesture.deltaY+ "' z='" + pointWorld.z + "'/>";
            //var blah = new SceneInspector();
            //blah.panDelta = (0,this.deltaY,0);

            console.log("We are pinching the screen. We will use this to modify the scale.");
            break;*/

        case 'pinchin':
            if(this.lastX<0)
            {
                this.lastX = 0;
            }
            console.log("We are pinching in right now");
            //console.log("This is your deltaY: "+ev.gesture.deltaY);
            //console.log("This is your new deltaY"+deltaY);
            if(x==1){
                bridgeworks.TouchHandler.deltaY.removeElementTarget(X.panDelta,0,2);
                x=0;
            }
            this.lastX = this.lastX + .5;
            bridgeworks.TouchHandler.deltaY.addElementTarget(X.panDelta,0,2);
            x = 1;
            break;
        case 'pinchout':
            if(this.lastX>0)
            {
                this.lastX = 0;
            }
            if(x==1){
                bridgeworks.TouchHandler.deltaY.removeElementTarget(X.panDelta,0,2);
                x=0;
            }
            this.lastX = this.lastX - .5;
            console.log("We are pinching out right now");
            //console.log("This is your new deltaY: "+this.lastX);
            bridgeworks.TouchHandler.deltaY.addElementTarget(X.panDelta,0,2);
            x=1;
            break;

        case 'doubletap': //Locates an object when you double tap the screen, and then views that object
        {
            console.log("We are double tapping");
            var name = selectedModel.name.getValueDirect().join("");
            var pointWorld = bridgeworks.selector.pointWorld.getValueDirect();
            var cmd = "";
            if (ev.metaKey || ev.ctrlKey) {
                cmd = "\<AutoInterpolate target='" + name + "'>";
                cmd += "\<position x='" + pointWorld.x + "' y='" + pointWorld.y + "' z='" + pointWorld.z + "'/>"
                cmd += "\</AutoInterpolate>";
            }
            else {
                cmd = "\<Locate target='" + name + "'/>";
            }
            bridgeworks.updateScene(cmd);
        }

        //Needed to add a release function cause if not then there is not way to register if the user is switching between using a
        //touch and a mouse.
        case 'release':

            //For testing purposes
            console.log("Thank God! Your finger was getting heavy");

            //I am making a mouseEvent and plugging my touch event x and y into it and then letting the current mouseHandler handle
            //the movement.
            var button2 = event.gesture.touches.length;
            var mouseEvent2 = new MouseEvent("mouseup", 0, 0, 0, 0, 0, null);
            mouseEvent2.button = button2-1;
            mouseEvent2.clientX = ev.gesture.touches[0].clientX;
            mouseEvent2.clientY = ev.gesture.touches[0].clientY;
            bridgeworks.handleEvent(mouseEvent2);

            bridgeworks.TouchHandler.deltaY.removeElementTarget(X.panDelta,0,2);

            break;
    }


    //this.x.setValueDirect(x);
    //this.y.setValueDirect(y);

    this.deltaX.setValueDirect(ev.gesture.deltaX);
    this.deltaY.setValueDirect(this.lastX);
    //this.deltaY.setValueDirect(ev.gesture.deltaY);

    this.delta.setValueDirect(ev.gesture.deltaX,ev.gesture.deltaY);

    // call the base class to copy the rest of the InputEvent data
    DeviceHandler.prototype.eventPerformed.call(this, ev);

    this.deltaX.setValueDirect(0);
    this.deltaY.setValueDirect(0);
    this.delta.setValueDirect(0, 0);

}

