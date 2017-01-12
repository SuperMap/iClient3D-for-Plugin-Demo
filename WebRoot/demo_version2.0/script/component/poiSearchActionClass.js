//通过继承SceneAction的方式来扩展用户的Action，继承方式采用框架提供的格式
//扩展Action的构造函数
SuperMap.Web.UI.Action3Ds.poiSearchActionClass = function (sceneControl,divComponent,bubbleSrc) {
    ///<param name="sceneControl" type="SuperMap.Web.UI.Controls.SceneControl"></param>
    SuperMap.Web.UI.Action3Ds.poiSearchActionClass.initializeBase(this);

    this._name = "poiSearchActionClass";

    this._sceneControl = sceneControl;

    //对应的场景操作类型为漫游
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.PANSELECT;

    this._divComponent = divComponent;
	this._bubbleSrc = bubbleSrc;
};

var poiSearchActionClass_this;

//扩展Action的属性和方法
SuperMap.Web.UI.Action3Ds.poiSearchActionClass.prototype = {
    /*
    * 析构方法
    */
    dispose: function () {
        ///<returns type="void"></returns>
        this._sceneControl = null;
    },

    /*
    * 鼠标单击方法
    */
    onMouseDown: function (e) {

        //通过事件对象查询到相关的信息

        var x = e.get_clientX();
        var y = e.get_clientY();
        var point = new SuperMap.Pixel(x, y);

        var feature3D = scene.get_trackingLayer3D().hitTest(point);
        if (feature3D != null){
        	var point3D = feature3D.get_geometry().get_position();
        	var bubbleClass = new SuperMap.Web.UI.Action3Ds.BubbleClass(this._sceneControl);
        	var name = feature3D.get_name();
        	var title = name.split(',')[0];
        	var address = name.split(',')[1];
        	var telephone = name.split(',')[2];
        	bubbleClass.createBubble(point3D,this._divComponent,this._bubbleSrc,title,address,telephone);
        }
    }
};
SuperMap.Web.UI.Action3Ds.poiSearchActionClass.registerClass('SuperMap.Web.UI.Action3Ds.poiSearchActionClass', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);
