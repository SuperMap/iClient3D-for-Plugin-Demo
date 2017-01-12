//继承自SuperMap.Web.UI.Action3Ds.SceneAction类扩展一个SuperMap.Web.UI.Action3Ds.DrawVisibiPoint
SuperMap.Web.UI.Action3Ds.SightlineAction = function (sceneControl,visibility_sightline,callback) {
    SuperMap.Web.UI.Action3Ds.SightlineAction.initializeBase(this);
    this._name = "SightlineAction";
    this._sceneControl = sceneControl;
    this._sightline = visibility_sightline;
    this._tmpId = -1;
    this._point;
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.POINTSELECT;
    this._callback = callback;
};
SuperMap.Web.UI.Action3Ds.SightlineAction.prototype = {
    dispose: function () {
        this._sceneControl = null;
    },

    onMouseDown: function (e) {
        var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY());
        var tempPoint = this._sceneControl.pixelToGlobe(pt, SuperMap.Web.Realspace.PixelToGlobeMode.TerrainAndModel);
        if(e.get_flagType()%2 == 1) {
            if(this._point == null){
                this._point = tempPoint;
                this._sightline.set_viewerPosition(this._point);
            }else{
                this._sightline.addTargetPoint(tempPoint);
                this._sightline.build();
            }
        }else{
            this._point = null;
            this._points = new SuperMap.Web.Core.Point3Ds();
            var panAction = new SuperMap.Web.UI.Action3Ds.Pan(sceneControl);
            sceneControl.set_sceneAction(panAction);
            this._callback(this._sightline);
         }
     },

    onMouseMove: function(e){
        if(this._point != null){
            var points = new SuperMap.Web.Core.Point3Ds();
            points.add(this._point)

            var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY());
            var temppoint  = this._sceneControl.pixelToGlobe(pt, SuperMap.Web.Realspace.PixelToGlobeMode.TerrainAndModel);
            points.add(temppoint);
            if(this._tmpId != -1){
                this._sightline.removeTargetPoint(this._tmpId);
            }
            this._tmpId = this._sightline.addTargetPoint(temppoint);
            this._sightline.build();
        }
    }
};
SuperMap.Web.UI.Action3Ds.SightlineAction.registerClass('SuperMap.Web.UI.Action3Ds.SightlineAction', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);