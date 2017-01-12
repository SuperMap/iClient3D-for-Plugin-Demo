SuperMap.Web.UI.Action3Ds.DrawProfileLine = function (sceneControl,profile,callback) {
    SuperMap.Web.UI.Action3Ds.DrawProfileLine.initializeBase(this);
    this._name = "DrawProfileLine";
    this._profile = profile;
    //this._fileName = fileName;
    this._sceneControl = sceneControl;
    this._points = new SuperMap.Web.Core.Point3Ds();
    this._geoLine = null;
    this._point = null;
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.POINTSELECT;
    this._id1 = -1;//记录静态id
    this._id2 = -1;//记录动态id
    this._callback = callback;
};
SuperMap.Web.UI.Action3Ds.DrawProfileLine.prototype = {

    dispose: function () {
        this._sceneControl = null;
    },

    onMouseDown: function (e) {
        if (e.get_flagType() % 2 == 1) {
            var curPt = new SuperMap.Web.Core.Point3D(e.get_longitude(), e.get_latitude(), e.get_altitude());
            if (this._point == null) {
                this._point = curPt;
                this._points.add(curPt);
                this._profile.set_startPoint(this._point);
            } else {
                this._points.add(curPt);
                this._profile.set_endPoint(curPt);

                this._geoLine = new SuperMap.Web.Core.GeoLine3D([this._points]);
                var feature3D = new SuperMap.Web.Core.Feature3D();
                var style = new SuperMap.Web.Core.Style3D();
                style.set_lineColor(new SuperMap.Web.Core.Color(255,0,0,255));
                
                style.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.ABSOLUTE);
		        style.set_bottomAltitude(20);
                
                feature3D.set_style3D(style);
                feature3D.set_geometry(this._geoLine);

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
            this._id1 = -1;
            this._id2 = -1;
            this._points = new SuperMap.Web.Core.Point3Ds();
            var panAction = new SuperMap.Web.UI.Action3Ds.Pan(this._sceneControl);
            this._sceneControl.set_sceneAction(panAction);
            this._callback(this._profile);
            //this.probuild(this._profile);
        }
    },
    
    onMouseMove: function (e) {
        if (this._point != null) {
            var points = new SuperMap.Web.Core.Point3Ds();
            points.add(this._point)
            var temppoint = new SuperMap.Web.Core.Point3D(e.get_longitude(), e.get_latitude(), e.get_altitude());
            points.add(temppoint);
            var line = new SuperMap.Web.Core.GeoLine3D([points]);

            var feature3D = new SuperMap.Web.Core.Feature3D();
            var style = new SuperMap.Web.Core.Style3D();
            style.set_fillForeColor(new SuperMap.Web.Core.Color(255,0,0,255));
            
            style.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.ABSOLUTE);
	        style.set_bottomAltitude(20);
            
            feature3D.set_style3D(style);
            feature3D.set_geometry(line);

            var trackingLayer = this._sceneControl.get_scene().get_trackingLayer3D();
            trackingLayer.removeAt(this._id2);
            this._id2 = trackingLayer.add(feature3D, "line2");
        }
    }
};
SuperMap.Web.UI.Action3Ds.DrawProfileLine.registerClass('SuperMap.Web.UI.Action3Ds.DrawProfileLine', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);
