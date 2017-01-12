/**
 * Created by ligm on 14-9-24.
 */
//继承自SuperMap.Web.UI.Action3Ds.SceneAction类扩展一个SuperMap.Web.UI.Action3Ds.DrawLine
SuperMap.Web.UI.Action3Ds.DrawLine2D = function (sceneControl, style3d) {
    SuperMap.Web.UI.Action3Ds.DrawLine2D.initializeBase(this);
    this._name = "DrawLine2D";
    this._sceneControl = sceneControl;
    this._points = new SuperMap.Web.Core.Point3Ds();
    this._point;
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.POINTSELECT;
    this._style3d = style3d;
    this._id1;//记录静态id
    this._id2;//记录动态id
};
SuperMap.Web.UI.Action3Ds.DrawLine2D.prototype = {

    dispose: function () {
        this._sceneControl = null;
    },

    onMouseDown: function (e) {
        if (e.get_flagType() % 2 == 1) {
            if (this._point == null) {
                this._point = new SuperMap.Web.Core.Point3D(e.get_longitude(), e.get_latitude(), 0);
                this._points.add(new SuperMap.Web.Core.Point3D(e.get_longitude(), e.get_latitude(), 0));
            } else {
                this._point = new SuperMap.Web.Core.Point3D(e.get_longitude(), e.get_latitude(), 0);
                this._points.add(new SuperMap.Web.Core.Point3D(e.get_longitude(), e.get_latitude(), 0));
                var line = new SuperMap.Web.Core.GeoLine3D([this._points]);
                var feature3D = new SuperMap.Web.Core.Feature3D();
                feature3D.set_style3D(this._style3d.clone());
                feature3D.set_geometry(line);
                var trackingLayer = this._sceneControl.get_scene().get_trackingLayer3D();
                trackingLayer.set_isVisible(true);
                trackingLayer.removeAt(this._id2);
                trackingLayer.removeAt(this._id1);
                this._id2 = null;
                this._id1 = trackingLayer.add(feature3D, "line1");
            }
        } else {
            var trackingLayer = this._sceneControl.get_scene().get_trackingLayer3D();
            trackingLayer.removeAt(this._id2);
            this._point = null;
            this._id1 = null;
            this._id2 = null;
            this._points = new SuperMap.Web.Core.Point3Ds();
            var panAction = new SuperMap.Web.UI.Action3Ds.Pan(sceneControl);
            sceneControl.set_sceneAction(panAction);
        }
    },

    onMouseMove: function (e) {
        if (this._point != null) {
            var points = new SuperMap.Web.Core.Point3Ds();
            points.add(this._point)
            var temppoint = new SuperMap.Web.Core.Point3D(e.get_longitude(), e.get_latitude(), 0);
            points.add(temppoint);
            var line = new SuperMap.Web.Core.GeoLine3D([points]);
            var feature3D = new SuperMap.Web.Core.Feature3D();
            var style = new SuperMap.Web.Core.Style3D();
            style.set_lineWidth(1);
            style.set_lineColor(new SuperMap.Web.Core.Color(0,255,0,255));
            feature3D.set_style3D(style);
            feature3D.set_geometry(line);
            var trackingLayer = this._sceneControl.get_scene().get_trackingLayer3D();
            trackingLayer.set_isVisible(true);
            trackingLayer.removeAt(this._id2);
            this._id2 = trackingLayer.add(feature3D, "line2");
        }
    }
};
SuperMap.Web.UI.Action3Ds.DrawLine2D.registerClass('SuperMap.Web.UI.Action3Ds.DrawLine2D', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);
