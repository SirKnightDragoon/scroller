Zynga Scroller
==============

A pure logic component for scrolling/zooming. It is independent of any specific kind of rendering or event system. 

The "demo" folder contains examples for usage with DOM and Canvas renderings which works both, on mouse and touch driven devices.

This repo is fork from zynga

New features from SirKnightDragoon
----------------------------------

Features:
* Add onUpdate event
* WidgetScroller
    - Complete Scroller Widget (include EasyScroller)
    - MouseWheel Simple and Single for normal and paging
    - ArrowKey Navigation (From keyboard)
    - Anchor navigation
    - ScrollBar X and Y (Custom)

Fix:

* Add the possibility to have EasyScroller inner EasyScroller (fix double scrolling)

Doc:

* Add missing options
* Add small example of EasyScroller
* Rename some word

Merges usefuls:

* Fix a corner case where scrollingComplete callback never fires (kanongil merge)
* Let the user stop and hold the page during a bounce (juliangarnier merge)
* Some fix from (mattlo merge)

WidgetScroller Dependencies
-----

* look into the Bower.json

WidgetScroller Examples
-----

```js
//Init widgetScroller
jQuery(document).ready(function($) {
    var widgetScroller = new WidgetScroller({
        container:$("[data-contents]"),
        haveScrollBarY:true,
        navBarY:$("[data-nav-bar]"),
        btnNavBarY:$("[data-btn-nav-bar]"),
        bouncing:false,
        paging:true,
        speedMultiplier:.75,
        animationDuration:1000
    });
});
```
```js
//Get the current Page (paging mode)
var oldBtnActiveIndex = 0;
widgetScroller.onPageChanged = function(pageX, pageY){
    if(pageY != oldBtnActiveIndex){
        oldBtnActiveIndex = pageY;
        $(".nav-sections a").removeClass("active");
        $(".nav-sections a:eq("+pageY+")").addClass("active");
    }
};
```
```js
//Go to a anchor point
$(".nav-sections a").on("click", function (e) {
    e.preventDefault();

    $(".nav-sections a").removeClass("active");
    $(this).addClass("active");
    var anchor = $(this).attr("href");
    widgetScroller.scrollToAnchor(anchor);
});
```

WidgetScroller Options
-------
* container:`null`,
* scrollingX: `false`,
* scrollingY: `true`,
* haveScrollBarX: `false`,
* haveScrollBarY: `false`,
* navBarX:`null`,
* navBarY:`null`,
* btnNavBarX:`null`,
* btnNavBarY:`null`,
* bouncing:`true`,
* locking:`true`,
* paging:`false`,
* snapping:`null`,
* speedMultiplier:`1`,
* penetrationDeceleration:`0.03`,
* penetrationAcceleration:`0.08`,
* animationDuration:`250`
* pageOffsetPaddingX:`0`,
* pageOffsetPaddingY:`0`,
* mouseWheelForce:`1`,
* parentWidgetScroller:`null`

WidgetScroller Demos
-----

* Coming Soon

Scroller and EasyScroller Demos
-----

See our demos online here: http://zynga.github.com/scroller/


Scroller Features
--------

* Customizable enabling/disabling of scrolling for x-axis and y-axis
* Deceleration (decelerates when user action ends in motion)
* Bouncing (bounces back on the edges)
* Paging (snap to full page width/height)
* Snapping (snap to an user definable pixel grid)
* Zooming (automatic centered zooming or based on a point in the view with configurable min/max zoom)
* Locking (locks drag direction based on initial movement)
* Pull-to-Refresh (Pull top out of the boundaries to start refresh of list)
* Configurable regarding whether animation should be used.

Scroller Options
-------

These are the available options with their defaults. Options can be modified using the second constructor parameter or during runtime by modification of `scrollerObj.options.optionName`.

* scrollingX = `true`
* scrollingY = `true`
* animating = `true`
* animationDuration = `250`
* bouncing = `true`
* locking = `true`
* paging = `false`
* snapping = `false`
* zooming = `false`
* minZoom = `0.5`
* maxZoom = `3`
* speedMultiplier = `1`
* scrollingComplete = `function(){}`
* penetrationDeceleration = `0.03`
* penetrationAcceleration = `0.08`

Scroller and EasyScroller Examples
-----

Callback (first parameter of constructor) is required. Options are optional. Defaults are listed above. The created instance must have proper dimensions using a `setDimensions()` call. Afterwards you can pass in event data or manually control scrolling/zooming via the API.

```js
var scrollerObj = new Scroller(function(left, top, zoom) {
	// apply coordinates/zooming
}, {
	scrollingY: false
});

// Configure to have an outer dimension of 1000px and inner dimension of 3000px
scrollerObj.setDimensions(1000, 1000, 3000, 3000);
```

```js
// Create EasyScroller with JS
var easyScroller = new EasyScroller($("[data-container]")[0], {
  scrollingX: false,
  scrollingY: true,
  zooming: false,
  minZoom: 1,
  maxZoom: 1
});

// Configure to have an outer dimension of 1000px and inner dimension of 3000px
easyScroller.scroller.setDimensions(1000, 1000, 3000, 3000);
easyScroller.onUpdate = function(es, left, top, zoom){
  
}
```


Scroller Methods
----------

* Setup scroll object dimensions.  
  `scrollerObj.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);`
* Setup scroll object position (in relation to the document). Required for zooming to event position (mousewheel, touchmove).  
  `scrollerObj.setPosition(clientLeft, clientTop);`
* Setup snap dimensions (only needed when `snapping` is enabled)  
  `scrollerObj.setSnapSize(width, height);`
* Setup pull-to-refresh. Height of the info region plus three callbacks which are executed on the different stages.  
  `scrollerObj.activatePullToRefresh(height, activate, deactivate, start);`
* Stop pull-to-refresh session. Called inside the logic started by start callback for activatePullToRefresh call.  
  `scrollerObj.finishPullToRefresh();`
* Get current scroll positions and zooming.  
  `scrollerObj.getValues() => { left, top, zoom }`
* Zoom to a specific level. Origin defines the pixel position where zooming should centering to. Defaults to center of scrollerObj.  
  `scrollerObj.zoomTo(level, animate ? false, originLeft ? center, originTop ? center)`
* Zoom by a given amount. Same as `zoomTo` but by a relative value.  
  `scrollerObj.zoomBy(factor, animate ? false, originLeft ? center, originTop ? center);`
* Scroll to a specific position.  
  `scrollerObj.scrollTo(left, top, animate ? false);`
* Scroll by the given amount.  
  `scrollerObj.scrollBy(leftOffset, topOffset, animate ? false);`

Scroller Events (actions)
---------

This API part can be used to pass event data to the `scrollerObj` to react on user actions. 

* `doMouseZoom(wheelDelta, timeStamp, pageX, pageY)`
* `doTouchStart(touches, timeStamp)`
* `doTouchMove(touches, timeStamp, scale)`
* `doTouchEnd(timeStamp)`

For a touch device just pass the native `touches` event data to the doTouch* methods. On mouse systems one can emulate this data using an array with just one element:

* Touch device: `doTouchMove(e.touches, e.timeStamp);`
* Mouse device: `doTouchMove([e], e.timeStamp);`

To zoom using the `mousewheel` event just pass the data like this:

* `doMouseZoom(e.wheelDelta, e.timeStamp, e.pageX, e.pageY);`

Scroller Events (callback)
---------

* `onUpdate(es, left, top, zoom);`

For more information about this please take a look at the demos.
