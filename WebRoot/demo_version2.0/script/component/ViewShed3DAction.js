//继承自SuperMap.Web.UI.Action3Ds.SceneAction类扩展一个SuperMap.Web.UI.Action3Ds.ViewShed3DAction
SuperMap.Web.UI.Action3Ds.ViewShed3DAction = function (sceneControl,viewShed3d,onMouseDownCallback,onMouseMoveCallback) {
    SuperMap.Web.UI.Action3Ds.ViewShed3DAction.initializeBase(this);
    this._name = "ViewShed3DAction";
    this._sceneControl = sceneControl;
    this._viewShed3d = viewShed3d;
    this._onMouseDownCallback = onMouseDownCallback;
    this._onMouseMoveCallback = onMouseMoveCallback;
    this._point;
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.POINTSELECT;
};
SuperMap.Web.UI.Action3Ds.ViewShed3DAction.prototype = {
	
    dispose: function () {
        this._sceneControl = null;
    },
    onMouseDown: function (e) {
        if (e.get_flagType() % 2 == 1 ) {
            var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY());
            var tmpPoint = this._sceneControl.pixelToGlobe(pt, SuperMap.Web.Realspace.PixelToGlobeMode.TerrainAndModel);
            if(this._point == null){
                this._point = tmpPoint;
                //setPositonParameters(tmpPoint);
                this._viewShed3d.set_viewerPosition(tmpPoint);
                this._viewShed3d.set_distance(0);
                this._viewShed3d.build();
                if(this._onMouseDownCallback){
                	this._onMouseDownCallback(tmpPoint);
                }
            }else {
                this._point = null;
                var panAction = new SuperMap.Web.UI.Action3Ds.Pan(this._sceneControl);
                this._sceneControl.set_sceneAction(panAction);
            }
        }
    },
    onMouseMove: function (e) {
        if(this._point != null){
            var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY());
            this._point = this._sceneControl.pixelToGlobe(pt, SuperMap.Web.Realspace.PixelToGlobeMode.TerrainAndModel);
            this._viewShed3d.setDistDirByPoint(this._point);
            if(this._onMouseMoveCallback){
            	this._onMouseMoveCallback(this._viewShed3d);
            }
        }
    }
};
SuperMap.Web.UI.Action3Ds.ViewShed3DAction.registerClass('SuperMap.Web.UI.Action3Ds.ViewShed3DAction', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);
