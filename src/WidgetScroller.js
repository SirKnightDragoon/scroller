
var WidgetScroller = function(opt){
    //Option
    this.options = {
        container:null,
        scrollingX: false,
        scrollingY: true,
        haveScrollBarX: false,
        haveScrollBarY: false,
        navBarX:null,
        navBarY:null,
        btnNavBarX:null,
        btnNavBarY:null,
        bouncing:true,
        locking:true,
        paging:false,
        snapping:null,
        speedMultiplier:1,
        penetrationDeceleration:0.03,
        penetrationAcceleration:0.08,
        animationDuration:250
    };

    for(var o in opt){
        this.options[o] = opt[o];
    }

    this.isScrolling = false;
    this.mouseWheelOldDirection = null;
    this.mouseWheelNewDirection = null;
    this.scrollings = [];
    this.prevTime = new Date().getTime();

    this.onPageChanged = null;

    this.init();

    this.initEvents();
};

WidgetScroller.prototype.init = function(){
    //Init scroller
    this.easyScroller = new EasyScroller(this.options.container[0], {
        scrollingX: this.options.scrollingX,
        scrollingY: this.options.scrollingY,
        bouncing: this.options.bouncing,
        locking: this.options.locking,
        paging: this.options.paging,
        snapping: (this.options.snapping != null ? true : false),
        speedMultiplier : this.options.speedMultiplier,
        penetrationDeceleration : this.options.penetrationDeceleration,
        penetrationAcceleration : this.options.penetrationAcceleration,
        animationDuration : this.options.animationDuration,
        zooming: false,
        minZoom: 1,
        maxZoom: 1
    });

    if(this.options.snapping != null){
        this.easyScroller.scroller.setSnapSize(this.options.snapping.width, this.options.snapping.height);
    }

    //On update scroller
    this.easyScroller.onUpdate = this.onUpdateEasyScroller.bind(this);

    //Resize update
    $(window).resize(this.onResize.bind(this));

    //Mousewheel
    if(this.options.scrollingY) this.options.container.on('mousewheel', this.onMouseWheel.bind(this));

    //Keys
    $(document).keydown(this.onKeyDown.bind(this));

    //Scrollbar
    if(this.options.haveScrollBarX) this.options.btnNavBarX.on((isMobile.any ? "touchstart" : "mousedown"), this.onScrollX.bind(this));
    if(this.options.haveScrollBarY) this.options.btnNavBarY.on((isMobile.any ? "touchstart" : "mousedown"), this.onScrollY.bind(this));
}

WidgetScroller.prototype.onUpdateEasyScroller = function(es, left, top, zoom){
    this.updateNavBarPosition(left, top);

    if(this.options.paging == true && this.onPageChanged != null){
        var pageX = Math.round(this.easyScroller.scroller.__scrollLeft / this.easyScroller.scroller.__clientWidth);
        var pageY = Math.round(this.easyScroller.scroller.__scrollTop / this.easyScroller.scroller.__clientHeight);
        this.onPageChanged(pageX, pageY);
    }
}

WidgetScroller.prototype.updateNavBarPosition = function(left, top){
    if(this.isScrolling) return;

    if(this.options.haveScrollBarX){
        var nPosX = (left / (this.subCntWidth - this.cntWidth)) * (this.navWidth - this.btnWidth);
        TweenMax.set(this.options.btnNavBarX, {y:nPosX});
    }
    if(this.options.haveScrollBarY){
        var nPosY = (top / (this.subCntHeight - this.cntHeight)) * (this.navHeight - this.btnHeight);
        TweenMax.set(this.options.btnNavBarY, {y:nPosY});
    }
}

WidgetScroller.prototype.onResize = function(){
    this.containerBounds = this.options.container.parent()[0].getBoundingClientRect();
    if(this.options.haveScrollBarX){
        this.btnWidth = this.options.btnNavBarX[0].getBoundingClientRect().width;
        this.navWidth = this.options.navBarX[0].getBoundingClientRect().width;
        this.subCntWidth = this.options.container[0].getBoundingClientRect().width;
        this.cntWidth = this.containerBounds.width;
    }
    if(this.options.haveScrollBarY){
        this.btnHeight = this.options.btnNavBarY[0].getBoundingClientRect().height;
        this.navHeight = this.options.navBarY[0].getBoundingClientRect().height;
        this.subCntHeight = this.options.container[0].getBoundingClientRect().height;
        this.cntHeight = this.containerBounds.height;
    }
}

WidgetScroller.prototype.onMouseWheel = function(e){
    e.preventDefault();

    if(this.options.paging){
        var curTime = new Date().getTime();

        var value = e.originalEvent.wheelDelta || -e.originalEvent.deltaY || -e.originalEvent.detail;
        var delta = e.deltaY;

        if(e.deltaY > 0){
            this.mouseWheelNewDirection = 1;
        }else{
            this.mouseWheelNewDirection = -1;
        }

        if(this.scrollings.length > 149){
            this.scrollings.shift();
        }

        this.scrollings.push(Math.abs(value));

        var timeDiff = curTime-this.prevTime;
        this.prevTime = curTime;

        if(timeDiff > 200){
            this.scrollings = [];
        }

        var averageEnd = this.getAverage(this.scrollings, 10);
        var averageMiddle = this.getAverage(this.scrollings, 70);

        var isAccelerating = averageEnd >= averageMiddle;

        if(isAccelerating){
            if(this.mouseWheelOldDirection == null || this.mouseWheelNewDirection != this.mouseWheelOldDirection || this.easyScroller.scroller.__isAnimating == false){
                this.mouseWheelOldDirection = this.mouseWheelNewDirection;
                this.easyScroller.scroller.scrollTo(0, this.easyScroller.scroller.__scrollTop + (this.easyScroller.scroller.__clientHeight * -this.mouseWheelNewDirection), true);
            }
        }

    }else{
        this.easyScroller.scroller.scrollBy(0, -e.deltaY * e.deltaFactor, true);
    }
}

WidgetScroller.prototype.getAverage = function(elements, number){
    var sum = 0;

    //taking `number` elements from the end to make the average, if there are not enought, 1
    var lastElements = elements.slice(Math.max(elements.length - number, 1));

    for(var i = 0; i < lastElements.length; i++){
        sum = sum + lastElements[i];
    }

    return Math.ceil(sum/number);
}

WidgetScroller.prototype.onKeyDown = function(e){
    if(this.options.scrollingX){
        if( e.which == 37 ){
            e.preventDefault();
            if(this.options.paging) {
                this.easyScroller.scroller.scrollTo(this.easyScroller.scroller.__scrollTop + (this.easyScroller.scroller.__clientHeight * -1), 0, true);
            }else{
                this.easyScroller.scroller.scrollBy(-50, 0, true);
            }
        }else if( e.which == 39 ){
            e.preventDefault();
            if(this.options.paging) {
                this.easyScroller.scroller.scrollTo(this.easyScroller.scroller.__scrollTop + (this.easyScroller.scroller.__clientHeight * 1), 0, true);
            }else{
                this.easyScroller.scroller.scrollBy(50, 0, true);
            }
        }
    }
    if(this.options.scrollingY){
        if( e.which == 38 ){
            e.preventDefault();
            if(this.options.paging) {
                this.easyScroller.scroller.scrollTo(0, this.easyScroller.scroller.__scrollTop + (this.easyScroller.scroller.__clientHeight * -1), true);
            }else{
                this.easyScroller.scroller.scrollBy(0, -50, true);
            }
        }else if( e.which == 40 ){
            e.preventDefault();
            if(this.options.paging) {
                this.easyScroller.scroller.scrollTo(0, this.easyScroller.scroller.__scrollTop + (this.easyScroller.scroller.__clientHeight * 1), true);
            }else{
                this.easyScroller.scroller.scrollBy(0, 50, true);
            }
        }
    }
}

WidgetScroller.prototype.onScrollX = function(e){
    var _this = this;
    e.preventDefault();
    e.stopPropagation();

    this.isScrolling = true;

    var btnPosStart = this.options.btnNavBarX[0].getBoundingClientRect();
    var posStart = isMobile.any ? e.originalEvent.changedTouches[0].pageX : e.pageX;
    var posEnd = isMobile.any ? e.originalEvent.changedTouches[0].pageX : e.pageX;

    $(document).off((isMobile.any ? "touchmove" : "mousemove"));
    $(document).off((isMobile.any ? "touchend" : "mouseup"));

    $(document).on((isMobile.any ? "touchmove" : "mousemove"), function(e){
        posEnd = isMobile.any ? e.originalEvent.changedTouches[0].pageX : e.pageX;
        var nPos = btnPosStart.left - _this.options.navBarY.position().left + (posEnd - posStart);
        if(nPos < 0) nPos = 0;
        if(nPos > _this.navWidth - _this.btnWidth) nPos = _this.navWidth - _this.btnWidth;
        TweenMax.set(_this.options.btnNavBarX, {y:nPos});

        _this.easyScroller.scroller.scrollTo((nPos / (_this.navWidth - _this.btnWidth)) * (_this.subCntWidth - _this.cntWidth), 0, _this.options.paging);
    });

    $(document).on((isMobile.any ? "touchend" : "mouseup"), function(e){
        $(document).off((isMobile.any ? "touchmove" : "mousemove"));
        $(document).off((isMobile.any ? "touchend" : "mouseup"));
        _this.isScrolling = false;
    });
}

WidgetScroller.prototype.onScrollY = function(e){
    var _this = this;
    e.preventDefault();
    e.stopPropagation();

    this.isScrolling = true;

    var btnPosStart = this.options.btnNavBarY[0].getBoundingClientRect();
    var posStart = isMobile.any ? e.originalEvent.changedTouches[0].pageY : e.pageY;
    var posEnd = isMobile.any ? e.originalEvent.changedTouches[0].pageY : e.pageY;

    $(document).off((isMobile.any ? "touchmove" : "mousemove"));
    $(document).off((isMobile.any ? "touchend" : "mouseup"));

    $(document).on((isMobile.any ? "touchmove" : "mousemove"), function(e){
        posEnd = isMobile.any ? e.originalEvent.changedTouches[0].pageY : e.pageY;
        var nPos = btnPosStart.top - _this.options.navBarY.position().top + (posEnd - posStart);
        if(nPos < 0) nPos = 0;
        if(nPos > _this.navHeight - _this.btnHeight) nPos = _this.navHeight - _this.btnHeight;
        TweenMax.set(_this.options.btnNavBarY, {y:nPos});

        _this.easyScroller.scroller.scrollTo(0, (nPos / (_this.navHeight - _this.btnHeight)) * (_this.subCntHeight - _this.cntHeight), _this.options.paging);
    });

    $(document).on((isMobile.any ? "touchend" : "mouseup"), function(e){
        $(document).off((isMobile.any ? "touchmove" : "mousemove"));
        $(document).off((isMobile.any ? "touchend" : "mouseup"));
        _this.isScrolling = false;
    });
}

WidgetScroller.prototype.initEvents = function(){
    this.onResize();
    this.easyScroller.reflow();
}

WidgetScroller.prototype.scrollToAnchor = function(anchor){
    this.easyScroller.scroller.scrollTo($("a[name='"+anchor.substring(1)+"']").parent().position().left - this.options.container.position().left, $("a[name='"+anchor.substring(1)+"']").parent().position().top - this.options.container.position().top, true);
}


