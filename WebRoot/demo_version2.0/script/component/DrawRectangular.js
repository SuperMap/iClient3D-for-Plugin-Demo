/**
 * 矩形绘制类
 * @param {} sceneControl
 * @param {} analysis
 */
SuperMap.Web.UI.Action3Ds.DrawRectangular = function (sceneControl,analysis) {
    SuperMap.Web.UI.Action3Ds.DrawRectangular.initializeBase(this);
    this._name = "DrawRectangular";
    this._sceneControl = sceneControl;
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.POINTSELECT;
    this._analysis = analysis;
    this._drawEnd = true;//判断是否结束绘制图形
    this._isDrawing = false;//判断是否正在绘制图形
    this._point3D = null;//绘制图形的起始点
};

SuperMap.Web.UI.Action3Ds.DrawRectangular.prototype = {

    dispose: function () {
    },
    onMouseUp: function (e) {
    },
    onMouseDown: function (e) {
        if (this._drawEnd) {
            var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY());
            var tempPoint = this._sceneControl.pixelToGlobe(pt, SuperMap.Web.Realspace.PixelToGlobeMode.TerrainAndModel);
            this._point3D = new SuperMap.Web.Core.Point3D(e.get_longitude(), e.get_latitude(), 0);
            this._isDrawing = true;
            this._drawEnd = false;
        }
        else {
            this._drawEnd = true; //结束绘制
            this._isDrawing = false; //绘制状态变为 false

            var panAction = new SuperMap.Web.UI.Action3Ds.Pan(sceneControl);
            sceneControl.set_sceneAction(panAction);
            this._analysis.set_coverageArea(bounds);
            this._analysis.build();
            this._sceneControl.get_scene().get_trackingLayer3D().removeAll();
        }
    },
    onMouseMove: function (e) {
        if (this._isDrawing && this._point3D != null) {
            var pnt1 = this._point3D;
            var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY());
            var tempPoint = this._sceneControl.pixelToGlobe(pt, SuperMap.Web.Realspace.PixelToGlobeMode.TerrainAndModel);
            var pnt3 = new SuperMap.Web.Core.Point3D(e.get_longitude(), e.get_latitude(), 0);

            var pnt2 = new SuperMap.Web.Core.Point3D(pnt1.x, pnt3.y, 0);
            var pnt4 = new SuperMap.Web.Core.Point3D(pnt3.x, pnt1.y, 0);
            var pnt3Ds = new SuperMap.Web.Core.Point3Ds();
            pnt3Ds.add(pnt1);
            pnt3Ds.add(pnt2);
            pnt3Ds.add(pnt3);
            pnt3Ds.add(pnt4);
            var geoRegion = new SuperMap.Web.Core.GeoRegion3D();
            geoRegion.addPart(pnt3Ds);

            var feature = new SuperMap.Web.Core.Feature3D();
            feature.set_geometry(geoRegion);
            bounds = geoRegion.get_bounds();
            var style = new SuperMap.Web.Core.Style3D();
            style.set_fillForeColor(new SuperMap.Web.Core.Color(255, 0, 0, 180));
            style.set_lineColor(new SuperMap.Web.Core.Color(0, 0, 255, 100));
            style.set_lineWidth(1);
            /*style.set_altitudeMode(3);*/
            feature.set_style3D(style);
            this._sceneControl.get_scene().get_trackingLayer3D().removeAll(); //删除跟踪图层上的图像
            this._sceneControl.get_scene().get_trackingLayer3D().add(feature, "region");
            this._sceneControl.get_scene().get_trackingLayer3D().refresh();
        }
    }
};

SuperMap.Web.UI.Action3Ds.DrawRectangular.registerClass('SuperMap.Web.UI.Action3Ds.DrawRectangular', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);
