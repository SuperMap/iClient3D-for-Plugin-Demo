/**
 * 动态可视域分析 
 * @param {} sceneControl
 * @param {} jeepModel
 */
 
SuperMap.Web.UI.Action3Ds.DynamicViewshedAction = function (sceneControl,jeepModel,callback,finishCallback) {
        SuperMap.Web.UI.Action3Ds.DynamicViewshedAction.initializeBase(this);
        this._name = "DynamicViewshedAction";
        this._sceneControl = sceneControl;
        this._points = new SuperMap.Web.Core.Point3Ds();
        this._point;
        this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.POINTSELECT;
        this._id1;//记录静态id
        this._id2;//记录动态id
        this._jeepModel = jeepModel;
        this._trackline = null;
        this._viewShed3d = null;
        this._callback = callback;
        this._finishCallback = finishCallback;
        //this._line;
    };
    
var DynamicViewshedAction_this;
    
SuperMap.Web.UI.Action3Ds.DynamicViewshedAction.prototype = {

        dispose: function () {
            this._sceneControl = null;
        },

        onMouseDown: function (e) {
            if (e.get_flagType() % 2 == 1) {
                if (this._point == null) {
                    var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY());
                    this._point = this._sceneControl.pixelToGlobe(pt, SuperMap.Web.Realspace.PixelToGlobeMode.TerrainAndModel);

                    this._points.add(new SuperMap.Web.Core.Point3D(this._point.x, this._point.y, (this._point.z + 0.5)));
                    this._jeepModel.set_position(this._point);

                    var style = new SuperMap.Web.Core.Style3D();
                    style.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.ABSOLUTE);

                    var feature = new SuperMap.Web.Core.Feature3D();
                    feature.set_geometry(this._jeepModel);
                    feature.set_style3D(style);
                    var trackingLayer = this._sceneControl.get_scene().get_trackingLayer3D();
                    trackingLayer.add(feature, "qc");
                } else {
                    var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY());
                    this._point = this._sceneControl.pixelToGlobe(pt, SuperMap.Web.Realspace.PixelToGlobeMode.TerrainAndModel);

                    this._points.add(new SuperMap.Web.Core.Point3D(this._point.x, this._point.y, (this._point.z + 0.5)));
                    this._trackline = new SuperMap.Web.Core.GeoLine3D([this._points]);
                    var feature3D = new SuperMap.Web.Core.Feature3D();

                    var style = new SuperMap.Web.Core.Style3D();
                    style.set_lineColor(new SuperMap.Web.Core.Color(0, 255, 0, 255));
                    style.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.ABSOLUTE);
                    style.set_lineWidth(3);
                    feature3D.set_style3D(style);
                    feature3D.set_geometry(this._trackline);

                    var trackingLayer = this._sceneControl.get_scene().get_trackingLayer3D();
                    trackingLayer.set_isVisible(true);
                    trackingLayer.removeAt(this._id2);
                    trackingLayer.removeAt(this._id1);
                    this._id2 = null;
                    this._id1 = trackingLayer.add(feature3D, "line3D1");
                }
            } else {
            	DynamicViewshedAction_this = this;
                var trackingLayer = this._sceneControl.get_scene().get_trackingLayer3D();
                trackingLayer.removeAt(this._id2);
                this._point = null;
                this._id1 = null;
                this._id2 = null;
                this._points = new SuperMap.Web.Core.Point3Ds();
                var panAction = new SuperMap.Web.UI.Action3Ds.Pan(sceneControl);

                sceneControl.set_sceneAction(panAction);
                var nodeAnmination = this._jeepModel.get_nodeAnimationState();
                nodeAnmination.setTrack(this._trackline);
                nodeAnmination.set_isEnabled(true);
                nodeAnmination.set_length(20);
                nodeAnmination.set_timePosition(0);
                nodeAnmination.set_playMode(SuperMap.Web.Realspace.PlayMode.SRONCE);
                var timeId = setInterval(function(){
                	DynamicViewshedAction_this.doAnalysis(nodeAnmination);
                	DynamicViewshedAction_this._callback(timeId,timeId2,DynamicViewshedAction_this._viewShed3d);
                },0);
                var timeId2 = setTimeout(function(){
                	window.clearInterval(timeId);
                	DynamicViewshedAction_this._finishCallback(DynamicViewshedAction_this._viewShed3d);
                	return;
                },21000);
            }
        },

        onMouseMove: function (e) {
            if (this._point != null) {
                var points = new SuperMap.Web.Core.Point3Ds();
                points.add(this._point)
                var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY());
                var temppoint = this._sceneControl.pixelToGlobe(pt, SuperMap.Web.Realspace.PixelToGlobeMode.TerrainAndModel);

                points.add(new SuperMap.Web.Core.Point3D(temppoint.x, temppoint.y, (temppoint.z + 0.5)));
                var line = new SuperMap.Web.Core.GeoLine3D([points]);

                var feature3D = new SuperMap.Web.Core.Feature3D();
                var style = new SuperMap.Web.Core.Style3D();
                style.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.ABSOLUTE);
                style.set_lineWidth(3);
                style.set_lineColor(new SuperMap.Web.Core.Color(0, 255, 0, 255));
                feature3D.set_style3D(style);
                feature3D.set_geometry(line);
                var trackingLayer = this._sceneControl.get_scene().get_trackingLayer3D();
                trackingLayer.set_isVisible(true);
                trackingLayer.removeAt(this._id2);
                this._id2 = trackingLayer.add(feature3D, "line3D2");
            }
        },
        
        // 执行可视域分析
        doAnalysis:function(nodeAnmination){
        	if(DynamicViewshedAction_this._viewShed3d){
        		DynamicViewshedAction_this._viewShed3d.clear();
        		DynamicViewshedAction_this._viewShed3d = null;
        	}
        	var point3D = nodeAnmination.get_position();
        	point3D = new SuperMap.Web.Core.Point3D(point3D.x, point3D.y, (point3D.z + 2));
        	var direction = nodeAnmination.get_direction();
        	DynamicViewshedAction_this._viewShed3d = new SuperMap.Web.Realspace.ViewShed3D();
        	DynamicViewshedAction_this._viewShed3d.set_viewerPosition(point3D);
            DynamicViewshedAction_this._viewShed3d.set_direction(direction);
            DynamicViewshedAction_this._viewShed3d.set_distance(100);
	        DynamicViewshedAction_this._viewShed3d.set_horizontalFov(90);
	        DynamicViewshedAction_this._viewShed3d.set_verticalFov(60);
            DynamicViewshedAction_this._viewShed3d.build();
        }
    };
    
    SuperMap.Web.UI.Action3Ds.DynamicViewshedAction.registerClass('SuperMap.Web.UI.Action3Ds.DynamicViewshedAction', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);