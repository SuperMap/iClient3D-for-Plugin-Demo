/**
 * 网络分析类
 * @param {} sceneControl
 */
 
SuperMap.Web.UI.Action3Ds.AnalysisClass = function(sceneControl){
	this.sceneControl = sceneControl;
	this.skyline = null;
	this.shadowQuery = null;
	this.shadowClick = null;
};

var AnalysisClass_this;

SuperMap.Web.UI.Action3Ds.AnalysisClass.prototype = {
	
	/**
	 * 绘制剖面线
	 * @param {} profile 	Profile类
	 */
	drawProfileLine:function(profile,callback){
		this.sceneControl.set_sceneAction(null);
	    var newAction = new SuperMap.Web.UI.Action3Ds.DrawProfileLine(this.sceneControl,profile,callback);
	    this.sceneControl.set_sceneAction(newAction);
	    profile.build();
	},
	
	/**
	 * 开始阴影分析
	 * @param {} shadowQuery	阴影查询类
	 * @param {} shadowClick	阴影点击类
	 */
	startShadowQuery:function(shadowQuery,shadowClick){
		var measureAreaAction = new SuperMap.Web.UI.Action3Ds.MeasureArea(this.sceneControl);
	    this.sceneControl.set_sceneAction(measureAreaAction);
	    this.shadowQuery = shadowQuery;
	    this.shadowClick = shadowClick;
	    AnalysisClass_this = this;
	    //给量算结束事件注册回调函数
	    this.sceneControl.addEvent("measureAreaFinished", this.startShadowQuery_measureAreaFinished);
	},
	
	/**
	 * 等高线分析
	 * @param {} contourMap
	 * @param {} coverageType	显示区域
	 */
	startContourAnalysis:function(contourMap,coverageType){
	    if(coverageType=='regional'){
	        var drawBoxAction = new SuperMap.Web.UI.Action3Ds.DrawRectangular(this.sceneControl,contourMap);
	        this.sceneControl.set_sceneAction(drawBoxAction);
	    }else if(coverageType == 'whole'){
	        var demAnaly_bounds = this.sceneControl.get_scene().get_terrainLayers().get_item(0).get_bounds();
	        contourMap.set_coverageArea(demAnaly_bounds);
	        contourMap.build();
	    }
	},
	
	/**
	 * 坡度坡向分析
	 * @param {} slopMap
	 * @param {} coverageType	显示区域
	 */
	startSlopAnalysis:function(slopMap,coverageType){
	    if(coverageType=='regional'){
	        var drawBoxAction = new SuperMap.Web.UI.Action3Ds.DrawRectangular(this.sceneControl,slopMap);
	        this.sceneControl.set_sceneAction(drawBoxAction);
	    }else if(coverageType == 'whole'){
	        var demAnaly_bounds = this.sceneControl.get_scene().get_terrainLayers().get_item(0).get_bounds();
	        slopMap.set_coverageArea(demAnaly_bounds);
	        slopMap.build();
	    }
	},
	
	/**
	 * 获得天际线
	 * @param {} skyline	天际线类
	 */
	getSkyline:function(skyline){
		var line3d = skyline.getSkyline();
	    var trackingLayer = this.sceneControl.get_scene().get_trackingLayer3D();
	
	    var feature = new SuperMap.Web.Core.Feature3D();
	    feature.set_geometry(line3d);
	    var style = new SuperMap.Web.Core.Style3D();
	    style.set_lineColor(new SuperMap.Web.Core.Color(0, 0, 255, 255));
	    style.set_lineWidth(3);
	    style.set_altitudeMode(1);
	    feature.set_style3D(style);
	    trackingLayer.add(feature, "line");
	},
	
	/**
	 * 获得限高体
	 * @param {} skyline	天际线类
	 */
	getLimitBody:function(skyline){
		var count = skyline.getLimitBodyCount();
		if(count == 0){
			return;
		}
	    var model = skyline.getLimitModel(0);
	    var trackingLayer = this.sceneControl.get_scene().get_trackingLayer3D();
	
	    var feature = new SuperMap.Web.Core.Feature3D();
	    feature.set_geometry(model);
	    var style = new SuperMap.Web.Core.Style3D();
	    style.set_fillForeColor(new SuperMap.Web.Core.Color(255, 0, 255, 255))
	    style.set_altitudeMode(1);
	    feature.set_style3D(style);
	    trackingLayer.add(feature, "model");
	},
	
	/**
	 * 绘制限高体
	 * @param {} skyline	天际线类
	 */
	drawRegionSkyline:function(skyline){
		this.skyline = skyline;
		AnalysisClass_this = this;
		var measureAreaAction = new SuperMap.Web.UI.Action3Ds.MeasureArea(this.sceneControl);
	    this.sceneControl.set_sceneAction(measureAreaAction);
	    this.sceneControl.addEvent("measureAreaFinished", this.drawLimitBodySkyline);
	},
	
	/**
	 * 天际线分析
	 * @param {} skyline		天际线类
	 * @param {} pt3d			观察者位置
	 * @param {} direction		相机与正北方向的夹角，单位：度
	 * @param {} pitch			相机方向和水面方向的夹角，单位：度
	 */
	analysisSkyline:function(skyline,pt3d,direction,pitch){
		skyline.set_viewerPosition(pt3d);
	    skyline.set_direction(direction);
	    skyline.set_pitch(pitch);
	    skyline.set_color(new SuperMap.Web.Core.Color(255, 0, 255, 255));
	    skyline.build();
	},
	
	/**
	 * 设置当前操作类型是通视分析
	 * @return {}
	 */
	setSightlineAction:function(){
		AnalysisClass_this = this;
		var sightline = new SuperMap.Web.Realspace.Sightline();
        this.sceneControl.set_sceneAction(null);
        var newAction = new SuperMap.Web.UI.Action3Ds.SightlineAction(this.sceneControl, sightline,this.getBarrierAndTargetPoint);
        this.sceneControl.set_sceneAction(newAction);
        return sightline;
	},
	
	/**
	 * 获得障碍点和目标点
	 * @param {} sightline
	 */
	getBarrierAndTargetPoint:function(sightline){
		AnalysisClass_this.getBarrierPoint(sightline);
		AnalysisClass_this.getTargetPoint(sightline);
	},
	
	/**
	 * 获得障碍点
	 * @param {} sightline
	 */
	getBarrierPoint:function(sightline){
		var count = sightline.get_targetPointCount();
	    for(var i=0; i<count; i++){
	        var result = sightline.getVisibleResult(i);
	        var pt = result.get_barrierPoint();
	        if(!result.get_isVisible()){
	            var geoPt3d = new SuperMap.Web.Core.GeoPoint3D(pt);
	            this.visibility_addGeometryToScene(geoPt3d,0);
	        }
	    }
	},
	
	/**
	 * 获得目标点
	 * @param {} sightline
	 */
	getTargetPoint:function(sightline){
		var count = sightline.get_targetPointCount();
	    for(var i=0; i<count; i++){
	        var result = sightline.getVisibleResult(i);
	        var pt = result.get_targetPoint();
	        var geoPt3d = new SuperMap.Web.Core.GeoPoint3D(pt);
	        this.visibility_addGeometryToScene(geoPt3d,1);
	    }
	},
	
	visibility_addGeometryToScene:function(geo,num){
	    var style = new SuperMap.Web.Core.Style3D();
	    if(num == 0){
	        style.set_markerColor(new SuperMap.Web.Core.Color(255, 0, 0, 255))
	    }else{
	        style.set_markerColor(new SuperMap.Web.Core.Color(0, 255, 255, 255))
	    }
	
	    style.set_markerSize(10);
	    style.set_altitudeMode(2);
	
	    var trackingLayer = this.sceneControl.get_scene().get_trackingLayer3D();
	    var feature = new SuperMap.Web.Core.Feature3D();
	    feature.set_geometry(geo);
	    feature.set_style3D(style);
	    trackingLayer.add(feature, "pt");
	},
	
	drawLimitBodySkyline:function(dArea,region3d){
		var panAction = new SuperMap.Web.UI.Action3Ds.Pan(AnalysisClass_this.sceneControl);
	    AnalysisClass_this.sceneControl.set_sceneAction(panAction);
	    var feature3d = new SuperMap.Web.Core.Feature3D();
	    var style = new SuperMap.Web.Core.Style3D();
	    style.set_fillForeColor(new SuperMap.Web.Core.Color(200,100,0,180));
	    feature3d.set_style3D(style);
	    feature3d.set_geometry(region3d);
	    AnalysisClass_this.skyline.addLimitBody(feature3d);
	    AnalysisClass_this.sceneControl.removeEvent("measureAreaFinished", AnalysisClass_this.skyline_drawLimitBody);
	},
	
	startShadowQuery_measureAreaFinished:function(dArea,geoRegion){
		var panAction = new SuperMap.Web.UI.Action3Ds.Pan(AnalysisClass_this.sceneControl);
	    AnalysisClass_this.sceneControl.set_sceneAction(panAction);
		
	    var feature3d = new SuperMap.Web.Core.Feature3D();
	    var style = new SuperMap.Web.Core.Style3D();
	    style.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.ABSOLUTE);
	    style.set_bottomAltitude(100);
	    feature3d.set_style3D(style);
	    feature3d.set_geometry(geoRegion);
	    
	    AnalysisClass_this.shadowQuery.set_queryRegion(feature3d);
	    var colors = new Array();
	    colors[0] = new SuperMap.Web.Core.Color(255,0,0,255);
	    colors[1] =new SuperMap.Web.Core.Color(0,0,255,255);
	    var keys = new Array(0,1);
	    AnalysisClass_this.shadowQuery.setColorDictionary(keys,colors);
	    AnalysisClass_this.shadowQuery.build();
	    AnalysisClass_this.sceneControl.removeEvent("measureAreaFinished",AnalysisClass_this.startShadowQuery_measureAreaFinished);
	    //AnalysisClass_this.sceneControl.removeEvent("measureAreaFinished",AnalysisClass_this.startShadowQuery_measureAreaFinished);
	    //AnalysisClass_this.sceneControl.set_sceneAction(AnalysisClass_this.shadowClick);
	},
	
	/**
	 * 动态可视域分析
	 */
	dynamicViewshed:function(dynamicViewShed3d,callback,finishCallback){
		var modelurl = modelDir+'/jeep.zip';
		var jeepModel = new SuperMap.Web.Core.GeoModel();
        jeepModel.fromModelFile(modelurl);
		var DynamicViewshedAction = new SuperMap.Web.UI.Action3Ds.DynamicViewshedAction(sceneControl,jeepModel,callback,finishCallback);
        sceneControl.set_sceneAction(DynamicViewshedAction);
	},
	
	addGeometryToScene:function(geometry,tag){
	    var feature3D = new SuperMap.Web.Core.Feature3D();
	    feature3D.set_geometry(geometry);
	    var style3d = new SuperMap.Web.Core.Style3D();
	    style3d.set_altitudeMode(2);
	    style3d.set_markerColor(new SuperMap.Web.Core.Color(255, 0, 255, 250));
	    style3d.set_lineWidth(1.5);
	    style3d.set_lineColor(new SuperMap.Web.Core.Color(255, 255, 0, 255));
	    style3d.set_fillForeColor(new SuperMap.Web.Core.Color(255, 255, 0, 100));
	    feature3D.set_style3D(style3d);
	    AnalysisClass_this.sceneControl.get_scene().get_trackingLayer3D().add(feature3D, tag);
	}
};