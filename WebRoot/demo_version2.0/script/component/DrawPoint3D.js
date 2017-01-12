/**
 * Created by ligm on 14-9-24.
 */

//继承自SuperMap.Web.UI.Action3Ds.SceneAction类扩展一个SuperMap.Web.UI.Action3Ds.DrawPoint3D
SuperMap.Web.UI.Action3Ds.DrawPoint3D = function (sceneControl, style3d) {
    SuperMap.Web.UI.Action3Ds.DrawPoint3D.initializeBase(this);
    this._name = "DrawPoint3D";
    this._sceneControl = sceneControl;
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.POINTSELECT;
    this._style3d = style3d;
    this._point3D;
    this._point;
    this._id = 0;

};
SuperMap.Web.UI.Action3Ds.DrawPoint3D.prototype = {

    dispose: function () {
        this._sceneControl = null;
    },

    onMouseDown: function (e) {
        if (e.get_flagType() % 2 == 1) {
           // this._point = new SuperMap.Web.Core.Point3D(e.get_longitude(), e.get_latitude(), e.get_altitude());
            var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY());
            this._point = this._sceneControl.pixelToGlobe(pt, SuperMap.Web.Realspace.PixelToGlobeMode.TerrainAndModel);
            this._point3D = new SuperMap.Web.Core.GeoPoint3D(this._point);
            var feature3D = new SuperMap.Web.Core.Feature3D();
            feature3D.set_geometry(this._point3D);
            feature3D.set_style3D(this._style3d.clone());
            var trackingLayer = this._sceneControl.get_scene().get_trackingLayer3D();
            trackingLayer.set_isVisible(true);
            this._id = this._id + 1;
            trackingLayer.add(feature3D, "Point3D" + this._id);
        } else {
            var panAction = new SuperMap.Web.UI.Action3Ds.Pan(this._sceneControl);
            this._sceneControl.set_sceneAction(panAction);
        }
    }
};
SuperMap.Web.UI.Action3Ds.DrawPoint3D.registerClass('SuperMap.Web.UI.Action3Ds.DrawPoint3D', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);

