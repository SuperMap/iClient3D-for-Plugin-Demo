/**
 * 气泡操作类
 * @param {} sceneControl
 * @param {} iframeComponent
 * @param {} bubbleSrc
 */

SuperMap.Web.UI.Action3Ds.BubbleClass = function (sceneControl) {
	this._sceneControl = sceneControl;
	this._divComponent = null;
	this._bubbleSrc = null;
	this._bubble = null;
	this._address = null;
	this._telephone = null;
	this._title = null;
	this._browserName = null;
};

var BubbleClass_this;

SuperMap.Web.UI.Action3Ds.BubbleClass.prototype = {
	/**
     * 创建气泡
     * @param {} point3D
     */
    createBubble:function(point3D,divComponent,bubbleSrc,title,address,telephone){
    	BubbleClass_this = this;
    	this._title = title;
    	this._address = address;
    	this._telephone = telephone;
    	this._divComponent = divComponent;
    	this._bubbleSrc = bubbleSrc;
    	var titleTextStyle = new SuperMap.Web.Core.TextStyle3D();
    	titleTextStyle.set_backColor(new SuperMap.Web.Core.Color(255,0,0,100));
    	titleTextStyle.set_fontName("微软雅黑");
    	titleTextStyle.set_foreColor(new SuperMap.Web.Core.Color(0,0,0,100));
    	titleTextStyle.set_fontHeight(4);
    	titleTextStyle.set_fontWidth(4);
    	this._bubble = new SuperMap.Web.Realspace.Bubble();
		this._bubble.set_pointer(point3D);
		this._bubble.set_isLockPosition(true);
		this._bubble.set_title(title);
		this._bubble.set_width(350);
		this._bubble.set_height(130);
		this._bubble.set_frameWidth(5);
		this._bubble.set_frameColor(new SuperMap.Web.Core.Color(204,204,204,255));
		this._bubble.set_backColor(new SuperMap.Web.Core.Color(249,249,249,255));
		this._bubble.set_titleTextStyle3D(titleTextStyle);
		this._sceneControl.get_bubbles().removeAll();
		this._sceneControl.get_bubbles().add(this._bubble);
		this._browserName = getBrowser();
		this._sceneControl.addEvent("bubbleInitialize",this.bubbleInitialize);
		this._sceneControl.addEvent("bubbleResize",this.bubbleResize);
		this._sceneControl.addEvent("bubbleClose",this.bubbleClose);
    },

    bubbleInitialize:function(){
    	try{
    		var controlOffsetY = BubbleClass_this._browserName == 'IE'?BubbleClass_this._sceneControl.get_controlOffsetY()-40:BubbleClass_this._sceneControl.get_controlOffsetY();
            var divComponent = BubbleClass_this._divComponent;
            divComponent.src = encodeURI(BubbleClass_this._bubbleSrc+'?name='+BubbleClass_this._title+'&address='+BubbleClass_this._address+'&telephone='+BubbleClass_this._telephone);
            divComponent.style.marginwidth = 0;
            divComponent.style.marginheight = 0;
            divComponent.style.width = BubbleClass_this._bubble.get_clientWidth()+"px";
            divComponent.style.height = BubbleClass_this._bubble.get_clientHeight()+"px";
            divComponent.style.left = BubbleClass_this._bubble.get_clientLeft() + BubbleClass_this._sceneControl.get_controlOffsetX()+"px";
            divComponent.style.top = BubbleClass_this._bubble.get_clientTop() + controlOffsetY +"px";
			divComponent.style.display = "block";
		}catch(e){
			alert("Failed to initialize bubble");
		}
    },

    bubbleResize:function(){
    	try
		{
			var controlOffsetY = BubbleClass_this._browserName == 'IE'?BubbleClass_this._sceneControl.get_controlOffsetY()-40:BubbleClass_this._sceneControl.get_controlOffsetY();
			var divComponent = BubbleClass_this._divComponent;
			divComponent.style.width = BubbleClass_this._bubble.get_clientWidth()+"px";
			divComponent.style.height = BubbleClass_this._bubble.get_clientHeight()+"px";
			divComponent.style.left = BubbleClass_this._bubble.get_clientLeft() + BubbleClass_this._sceneControl.get_controlOffsetX()+"px";
			divComponent.style.top = BubbleClass_this._bubble.get_clientTop() + controlOffsetY +"px";
			divComponent.style.display = "block";
		}
		catch(e)
		{
			alert("Failed to resize bubble");
		}
    },

    bubbleClose:function(){
    	try
		{
			var divComponent = BubbleClass_this._divComponent;
			divComponent.style.display = "none";
			BubbleClass_this._sceneControl.addEvent("bubbleInitialize",this.bubbleInitialize);
			BubbleClass_this._sceneControl.addEvent("bubbleResize",this.bubbleResize);
			BubbleClass_this._sceneControl.addEvent("bubbleClose",this.bubbleClose);
		}
		catch(e){
			alert("Failed to close bubble");
		}
    },

    close:function(){
    	var bubble = new SuperMap.Web.Realspace.Bubble();
    	bubble.set_isVisible(false);
    }
};
