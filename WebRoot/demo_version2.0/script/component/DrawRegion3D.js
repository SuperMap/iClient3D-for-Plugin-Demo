SuperMap.Web.UI.Action3Ds.DrawRegion3D = function (sceneControl,osgbLyr,regionIndex) {
    SuperMap.Web.UI.Action3Ds.DrawRegion3D.initializeBase(this);
    this._name = "DrawRegion3D";
    this._sceneControl = sceneControl;
    this._points = new SuperMap.Web.Core.Point3Ds();
    this._geoRegion3d = new SuperMap.Web.Core.GeoRegion3D();
    this._point;
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.POINTSELECT;
    this._id1;//记录静态id
    this._id2;//记录动态id
    this._count = 0;
    this._style = new SuperMap.Web.Core.Style3D();
    this._osgbLyr = osgbLyr;
    this._regionIndex = regionIndex;
};
SuperMap.Web.UI.Action3Ds.DrawRegion3D.prototype = {
    dispose: function () {
        this._sceneControl = null;
    },
    onMouseDown: function (e) {
        //this._style.set_altitudeMode(2);
        this._style.set_markerColor(new SuperMap.Web.Core.Color(0,255,0,255));
        this._style.set_fillForeColor( new SuperMap.Web.Core.Color(255,255,0,100));
        this._style.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.ABSOLUTE)
        var trackingLayer = this._sceneControl.get_scene().get_trackingLayer3D();
        if(e.get_flagType()%2 == 1)
        {
            var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY());
            this._point = this._sceneControl.pixelToGlobe(pt, SuperMap.Web.Realspace.PixelToGlobeMode.TerrainAndModel);
            //this._point= new SuperMap.Web.Core.Point3D(e.get_longitude(),e.get_latitude(),e.get_altitude());
            var geoPt = new SuperMap.Web.Core.GeoPoint3D(this._point);
            var feature = new SuperMap.Web.Core.Feature3D();
            feature.set_geometry(geoPt);
            //feature.set_style3D(this._style);
            //trackingLayer.add(feature,"Point"+this._count);

            this._points.add(this._point);
            this._count++;
        }else
        {
            if(this._count >2 ){
                var panAction = new SuperMap.Web.UI.Action3Ds.Pan(sceneControl);
                sceneControl.set_sceneAction(panAction);

                this._geoRegion3d.addPart(this._points);
                var feature = new SuperMap.Web.Core.Feature3D();
                var style=new SuperMap.Web.Core.Style3D();
                feature.set_geometry(this._geoRegion3d);
                feature.set_style3D(this._style);

                trackingLayer.add(feature,"region_"+this._regionIndex);
                this._osgbLyr.addFlattenRegion(this._geoRegion3d,"region_"+this._regionIndex);
               // addNode("region_"+_index);
            }
        }
    }
};
SuperMap.Web.UI.Action3Ds.DrawRegion3D.registerClass('SuperMap.Web.UI.Action3Ds.DrawRegion3D', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);