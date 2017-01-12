/**
 * Created by ligm on 14-9-24.
 */
//继承自SuperMap.Web.UI.Action3Ds.SceneAction类扩展一个SuperMap.Web.UI.Action3Ds.DrawRegion
SuperMap.Web.UI.Action3Ds.DrawRegion = function(sceneControl,style3d)
{
    SuperMap.Web.UI.Action3Ds.DrawRegion.initializeBase(this);
    this._name = "DrawRegion";
    this._sceneControl = sceneControl;
    this._points = new SuperMap.Web.Core.Point3Ds();
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.POINTSELECT;
    this._style3d = style3d;
    this._id1;//记录动态面id
    this._id2;//记录动态线id
};
SuperMap.Web.UI.Action3Ds.DrawRegion.prototype = {

    dispose: function()
    {
        this._sceneControl = null;
    },

    onMouseDown: function(e)
    {
    	var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY());
        var tempPoint = this._sceneControl.pixelToGlobe(pt, SuperMap.Web.Realspace.PixelToGlobeMode.TerrainAndModel);
        if(e.get_flagType()%2 == 1)
        {
            //this._points.add(new SuperMap.Web.Core.Point3D(e.get_longitude(),e.get_latitude(),0));
        	this._points.add(tempPoint);
        }else
        {	
        	this._style3d.set_fill3DMode(SuperMap.Web.Core.Fill3DMode.FACE);
            var trackingLayer = this._sceneControl.get_scene().get_trackingLayer3D();
            trackingLayer.removeAt(this._id1);

            var region = new SuperMap.Web.Core.GeoRegion3D([this._points]);
            var feature3D = new SuperMap.Web.Core.Feature3D();

            feature3D.set_geometry(region);
            feature3D.set_style3D(this._style3d.clone());
            trackingLayer.set_isVisible(true);
            trackingLayer.add(feature3D, "region2");
            this._id1 = null;
            this._id2 = null;
            this._points = new SuperMap.Web.Core.Point3Ds();

            var panAction = new SuperMap.Web.UI.Action3Ds.PanSelect(sceneControl);
            sceneControl.set_sceneAction(panAction);
        }
    },

    onMouseMove: function(e)
    {
    	this._style3d.set_fill3DMode(SuperMap.Web.Core.Fill3DMode.LINE);
        if(this._points.get_count() > 0)
        {
            var points = new SuperMap.Web.Core.Point3Ds();
            points.add(this._points.get_item(0))
            //var temppoint = new SuperMap.Web.Core.Point3D(e.get_longitude(),e.get_latitude(),0);
            var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY());
        	var temppoint = this._sceneControl.pixelToGlobe(pt, SuperMap.Web.Realspace.PixelToGlobeMode.TerrainAndModel);
            points.add(temppoint);
            var line = new SuperMap.Web.Core.GeoLine3D([points]);

            var feature3D = new SuperMap.Web.Core.Feature3D();

            feature3D.set_geometry(line);
            feature3D.set_style3D(this._style3d.clone());

            var trackingLayer = this._sceneControl.get_scene().get_trackingLayer3D();
            trackingLayer.set_isVisible(true);
            trackingLayer.removeAt(this._id2);
            this._id2 = trackingLayer.add(feature3D, "line1");
        }
        if(this._points.get_count() > 1)
        {
            var trackingLayer = this._sceneControl.get_scene().get_trackingLayer3D();

            if(this._points.get_count() == 2) trackingLayer.removeAt(this._id2);

            var points = new SuperMap.Web.Core.Point3Ds();
            for(var i=0;i<this._points.get_count();i++)
            {
                points.add(this._points.get_item(i));
            }
            //var temppoint = new SuperMap.Web.Core.Point3D(e.get_longitude(),e.get_latitude(),0);
            var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY());
        	var temppoint = this._sceneControl.pixelToGlobe(pt, SuperMap.Web.Realspace.PixelToGlobeMode.TerrainAndModel);
            points.add(temppoint);
            var region = new SuperMap.Web.Core.GeoRegion3D([points]);

            var feature3D = new SuperMap.Web.Core.Feature3D();

            feature3D.set_geometry(region);
            feature3D.set_style3D(this._style3d.clone());
            trackingLayer.set_isVisible(true);
            trackingLayer.removeAt(this._id1);
            this._id1 = trackingLayer.add(feature3D, "region1");
        }
    }

};
SuperMap.Web.UI.Action3Ds.DrawRegion.registerClass('SuperMap.Web.UI.Action3Ds.DrawRegion', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);

