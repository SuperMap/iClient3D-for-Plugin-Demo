/**
 * 绘制飞行路线类
 * @param {} sceneControl			三维场景控件
 * @param {} flyRouteIndex			飞行路线索引
 * @param {} startStopIndex			起始站点索引
 * @param {} operation				操作类型(add、update)
 * @param {} drawFlyRouteCallback	绘制每个站点后的回调函数
 */


SuperMap.Web.UI.Action3Ds.DrawFlyRoute = function (sceneControl,flyRouteIndex,startStopIndex,operation,drawFlyRouteCallback) {
    SuperMap.Web.UI.Action3Ds.DrawFlyRoute.initializeBase(this);
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.POINTSELECT;
    this._sceneControl = sceneControl;
    this._flyRouteIndex = flyRouteIndex;
    this._startStopIndex = startStopIndex;
    this._drawFlyRouteCallback = drawFlyRouteCallback;
    this._operation = operation;
};
SuperMap.Web.UI.Action3Ds.DrawFlyRoute.prototype = {

    onMouseDown: function (e) {
        if (e.get_flagType() % 2 == 1) {
        	var camera = this._sceneControl.get_scene().get_firstPersonCamera();
        	camera.set_longitude(e.get_longitude());
        	camera.set_latitude(e.get_latitude());
        	var stops = this._sceneControl.get_scene().get_flyManager().get_routes().get_item(this._flyRouteIndex).get_routeStops();
        	var stop;
        	if(this._operation == 'add'){
        		stop = new SuperMap.Web.Realspace.RouteStop();
	        	stop.set_camera(camera);
        		stops.insert(this._startStopIndex++,stop);
        	}else if(this._operation == 'update'){
        		stop = stops.get_stop(this._startStopIndex);
        		stop.set_camera(camera);
        	}
        	this._sceneControl.get_scene().get_flyManager().update();
        	this._drawFlyRouteCallback(stop,camera,this._operation);
        } else {
        	var panAction = new SuperMap.Web.UI.Action3Ds.Pan(this._sceneControl);
        	this._sceneControl.set_sceneAction(panAction);
        }
    }
};
SuperMap.Web.UI.Action3Ds.DrawFlyRoute.registerClass('SuperMap.Web.UI.Action3Ds.DrawFlyRoute', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);