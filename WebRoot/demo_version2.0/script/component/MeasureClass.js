/**
 * 量算类
 */

SuperMap.Web.UI.Action3Ds.MeasureClass = function(sceneControl){
	this.sceneControl = sceneControl;
	this.measure_altitudeMode = null;
	this.measure_tag = null;
	this.transparency = null;
	this.depth = null;
};

var MeasureClass_this;
	
SuperMap.Web.UI.Action3Ds.MeasureClass.prototype = {
	
	addGeometryToScene:function(geometry,tag){
	    var feature3D = new SuperMap.Web.Core.Feature3D();
	    feature3D.set_geometry(geometry);
	    var style3d = new SuperMap.Web.Core.Style3D();
	    style3d.set_altitudeMode(MeasureClass_this.measure_altitudeMode);
	    style3d.set_markerColor(new SuperMap.Web.Core.Color(255, 0, 255, 250));
	    style3d.set_lineWidth(1.5);
	    style3d.set_lineColor(new SuperMap.Web.Core.Color(255, 255, 0, 255));
	    style3d.set_fillForeColor(new SuperMap.Web.Core.Color(255, 255, 0, 100));
	    feature3D.set_style3D(style3d);
	    MeasureClass_this.sceneControl.get_scene().get_trackingLayer3D().add(feature3D, tag);
	},
	
	addTextToScene:function(text,position,tag){
	    var feature3D = new SuperMap.Web.Core.Feature3D();
	    var geoText3D = new SuperMap.Web.Core.GeoText3D();
	    var textPart3D = new SuperMap.Web.Core.TextPart3D(text, position);
	    geoText3D.addPart(textPart3D);
	    feature3D.set_geometry(geoText3D);
	
	    var style3d = new SuperMap.Web.Core.Style3D();
	    style3d.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.ABSOLUTE);
	
	    var textStyle = new SuperMap.Web.Core.TextStyle3D();
	    textStyle.set_outline(true);
	    textStyle.set_foreColor(new SuperMap.Web.Core.Color(255, 255, 0, 255));
	    textStyle.set_backColor(new SuperMap.Web.Core.Color(0,0,0,255));
	    textStyle.set_isSizeFixed(true);
	    textStyle.set_fontScale(1.2);
	    feature3D.set_textStyle3D(textStyle);
	    feature3D.set_style3D(style3d);
	    MeasureClass_this.sceneControl.get_scene().get_trackingLayer3D().add(feature3D, tag);
	},
	
	addGeometryPoint:function(geo,strText){
		if(geo == null){
			return;
		}
	    for (var i = 0; i < geo.get_partCount() ; i++) {
	        var point3Ds = geo.getPart(i);
	        for (var j = 0; j < point3Ds.get_count() ; j++) {
	            var point3D = point3Ds.get_item(j);
	            var geoPoint = new SuperMap.Web.Core.GeoPoint3D(point3D);
	            MeasureClass_this.addGeometryToScene(geoPoint,"disLine_"+j);
	
	            //特殊处理最后一个点
	            if ((j == point3Ds.get_count() - 1) && (strText != undefined)) {
	                this.addTextToScene(strText,point3D,"MeasureDistance");
	            }
	        }
	    }
	},
	
	measure_pan:function(){
	    //设置控件的当前操作为漫游
		var panAction = new SuperMap.Web.UI.Action3Ds.Pan(this.sceneControl);
		this.sceneControl.set_sceneAction(panAction);
	},
	
	/**
	 * 空间距离量算
	 */
	measureSpatialDis:function(){
		MeasureClass_this = this;
		//设置控件的当前操作为距离量算
		var measureDisAction = new SuperMap.Web.UI.Action3Ds.MeasureDistance(this.sceneControl);
		this.sceneControl.set_sceneAction(measureDisAction);
		this.measure_altitudeMode = 2;
		//给距离量算事件和量算结束事件注册回调函数
		this.sceneControl.removeEvent("measureDistance", this.measureDistanceHandler);
		this.sceneControl.removeEvent("measureDistanceFinished", this.measureDistanceFinishedHandler);
		this.sceneControl.addEvent("measureDistance", this.measureDistanceHandler);
		this.sceneControl.addEvent("measureDistanceFinished", this.measureDistanceFinishedHandler);
	},
	
	// 距离量算过程中事件
	measureDistanceHandler:function(disList,line3D){
	    if (line3D == null) {
	        return;
	    }
	    var point3D_1 = line3D.getPart(0).get_item(line3D.getPart(0).get_count() - 1);
        var point3D_2 = line3D.getPart(0).get_item(line3D.getPart(0).get_count() - 2);
        var point3Ds = new SuperMap.Web.Core.Point3Ds();
        point3Ds.add(point3D_2);
        point3Ds.add(point3D_1);
	    var line3D_Current = new SuperMap.Web.Core.GeoLine3D(point3Ds);
        line3D_Current.addPart(point3Ds);
	    var centerPoint3D_curLine = line3D_Current.get_innerPoint3D();
	    var textPart3D = new SuperMap.Web.Core.TextPart3D('距离：' + disList[0].toFixed(2) + '米', centerPoint3D_curLine);
	    var geoText3D = new SuperMap.Web.Core.GeoText3D();
	    geoText3D.addPart(textPart3D);
	    var textStyle3D = new SuperMap.Web.Core.TextStyle3D();
	    textStyle3D.set_fontScale(1);
        textStyle3D.set_opaqueRate(100);
        textStyle3D.set_foreColor(new SuperMap.Web.Core.Color(255, 255, 255, 255));
        textStyle3D.set_bold(true);
        var feature3D = new SuperMap.Web.Core.Feature3D();
        feature3D.set_geometry(geoText3D);
        feature3D.set_textStyle3D(textStyle3D);
        var trackingLayer3D = scene.get_trackingLayer3D();
        trackingLayer3D.add(feature3D, 'disTextCurrentLine');
	},
	
	// 距离量算结束事件
	measureDistanceFinishedHandler:function(dTotalDis,line3D) 
	{
		if (line3D == null) {
	        return;
	    }
	    var unit = '米';
		//量算结束后显示总的距离信息
	    var text = "总距离："  + Number(dTotalDis).toFixed(2) + unit;
		MeasureClass_this.addGeometryPoint(line3D,text);
		MeasureClass_this.measure_tag = "MeasureDistance";
	    MeasureClass_this.addGeometryToScene(line3D,MeasureClass_this.measure_tag);
	    MeasureClass_this.measure_pan();
	    MeasureClass_this.sceneControl.removeEvent("measureDistance", MeasureClass_this.measureDistanceHandler);
	    MeasureClass_this.sceneControl.removeEvent("measureDistanceFinished", MeasureClass_this.measureDistanceFinishedHandler);
	},
	
	/**
	 * 空间面积量算
	 */
	measureSpatialArea:function(){
		MeasureClass_this = this;
		this.measure_altitudeMode = 2;
		this.measure_tag = "MeasureArea";
		//设置控件的当前操作为面积量算
		var measureAreaAction = new SuperMap.Web.UI.Action3Ds.MeasureArea(this.sceneControl);
		this.sceneControl.set_sceneAction(measureAreaAction); 
		
		//给面积量算事件和量算结束事件注册回调函数
		this.sceneControl.removeEvent("measureAreaFinished", this.measureArea_areaFinishedHandler);
		this.sceneControl.addEvent("measureAreaFinished", this.measureArea_areaFinishedHandler);
	},

	// 面积量算结束事件
	measureArea_areaFinishedHandler:function(dArea, region3d) 
	{
		var unit = '平方米';
	    if(dArea >1000000){
	        unit = "平方千米";
	        dArea = dArea/1000000;
	    }
		//量算结束后显示总的面积信息
		var text = "总面积：" + dArea.toFixed(2) + unit;
		MeasureClass_this.addGeometryToScene(region3d,MeasureClass_this.measure_tag);
		MeasureClass_this.addGeometryPoint(region3d);
	
	    /*添加标注字体*/
	    var point3D = region3d.get_innerPoint3D();
	    MeasureClass_this.addTextToScene(text,point3D,"MeasureArea");
	    MeasureClass_this.measure_pan();
	    MeasureClass_this.sceneControl.removeEvent("measureAreaFinished", MeasureClass_this.measureArea_areaFinishedHandler);
	},

	/**
	 * 高程量算
	 */
	measureHeight:function()
	{
		MeasureClass_this = this;
		//设置控件的当前操作为高程量算
	    var measureHeightAction = new SuperMap.Web.UI.Action3Ds.MeasureHeightCustom(this.sceneControl);
	    this.sceneControl.set_sceneAction(measureHeightAction);
	    //this.sceneControl.get_sceneAction().set_StopMove(false);
	
	    //给面高程算事件和量算结束事件注册回调函数
	    this.sceneControl.addEvent("measureHeight", this.measureHeightHandler);
	    this.sceneControl.addEvent("measureHeightFinished", this.measureHeightFinishedHandler);
	},
	
	// 高程量算过程中事件
	measureHeightHandler:function(dHeight) {
	    //量算过程中及时的显示量算信息
	    //MeasureClass_this.sceneControl.get_sceneAction().set_StopMove(false);
	    MeasureClass_this.sceneControl.get_sceneAction().set_height(dHeight);
	},

	// 高程量算结束事件
	measureHeightFinishedHandler:function(dHeight, line3D) 
	{
		/******** 结果线绘制 start *********/
	    var feature3D_1 = new SuperMap.Web.Core.Feature3D();
	    var style3D_1 = new SuperMap.Web.Core.Style3D();
	    feature3D_1.set_geometry(line3D);
	
	    //定义线宽
	    style3D_1.set_lineWidth(1);
	
	    //定义线颜色
	    style3D_1.set_lineColor(new SuperMap.Web.Core.Color(255, 255, 0, 225));
	    style3D_1.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.ABSOLUTE);
	    feature3D_1.set_style3D(style3D_1);
	    var scene = MeasureClass_this.sceneControl.get_scene();
	    scene.get_trackingLayer3D().add(feature3D_1, 'p1');
	
	    /******** 结果线绘制 end *********/
	    /******** 结果值文本绘制 start *********/
	
	    var textPos = new SuperMap.Web.Core.Point3D();
	    textPos.x = line3D.getPart(0).get_item(1).x;
	    textPos.y = line3D.getPart(0).get_item(1).y;
	    textPos.z = line3D.getPart(0).get_item(1).z;
	
	    var feature3D = new SuperMap.Web.Core.Feature3D();
	    var geoText3D = new SuperMap.Web.Core.GeoText3D();
	    var textPart3D = new SuperMap.Web.Core.TextPart3D('高度：' + dHeight + '米', textPos);
	    var textStyle3D = new SuperMap.Web.Core.TextStyle3D();
	    geoText3D.addPart(textPart3D);
	    textStyle3D.set_fontScale(1);
	    textStyle3D.set_opaqueRate(100);
	    textStyle3D.set_foreColor(new SuperMap.Web.Core.Color(255, 255, 255, 255));
	    textStyle3D.set_bold(true);
	    feature3D.set_geometry(geoText3D);
	    feature3D.set_textStyle3D(textStyle3D);
	
	    var pointStyle = new SuperMap.Web.Core.Style3D();
	    pointStyle.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.ABSOLUTE);
	    feature3D.set_style3D(pointStyle);
	    scene.get_trackingLayer3D().add(feature3D, 'heightText');
	
	    /******** 结果值文本绘制 end *********/
	
	    //移除游标提示
	    var trackingLayer3D = scene.get_trackingLayer3D();
	    trackingLayer3D.removeAt(trackingLayer3D.indexOf('pos'));
	
	    //测量结束后使鼠标提示不可移动
	    //MeasureClass_this.sceneControl.get_sceneAction().set_StopMove(true);
	    MeasureClass_this.measure_pan();
	    MeasureClass_this.sceneControl.removeEvent("measureHeight", MeasureClass_this.measureHeightHandler);
	    MeasureClass_this.sceneControl.removeEvent("measureHeightFinished", MeasureClass_this.measureHeightFinishedHandler);
	},

	/**
	 * 依地距离量算
	 */
	measurerTerrainDis:function(){
		MeasureClass_this = this;
		this.measure_altitudeMode = 0;
		//设置控件的当前操作为距离量算
		var measureTerDisAction = new SuperMap.Web.UI.Action3Ds.MeasureTerrainDistance(this.sceneControl);
		this.sceneControl.set_sceneAction(measureTerDisAction);
	    //注册过程中的回调函数
		this.sceneControl.removeEvent("measureDistance", this.measureDistanceHandler);
		this.sceneControl.removeEvent("measureDistanceFinished", this.measureDistanceFinishedHandler);
	    this.sceneControl.addEvent("measureDistance", this.measureDistanceHandler);
	    this.sceneControl.addEvent("measureDistanceFinished", this.measureDistanceFinishedHandler);
	},

	/**
	 * 水平距离量算
	 */
	measureHorizontalDistance:function(){
		MeasureClass_this = this;
		this.measure_altitudeMode = 2;
	    //设置控件的当前操作为面积量算
		var measureHorizontalDistance = new SuperMap.Web.UI.Action3Ds.MeasureHorizontalDistance(this.sceneControl);
		this.sceneControl.set_sceneAction(measureHorizontalDistance);
		//给面积量算事件和量算结束事件注册回调函数
		this.sceneControl.removeEvent("measureDistance", this.measureDistanceHandler);
		this.sceneControl.removeEvent("measureDistanceFinished", this.measureDistanceFinishedHandler);
		//this.sceneControl.addEvent("measureDistance", this.measureDistanceHandler);
	    this.sceneControl.addEvent("measureDistanceFinished", this.measureDistanceFinishedHandler);
	},
	
	/**
	 * 依地面积量算
	 */
	measurerTerrainArea:function(){
		MeasureClass_this = this;
		this.measure_altitudeMode = 0;
		this.measure_tag = "MeasureTerrainArea";
		//设置控件的当前操作为面积量算
		var measureAreaAction = new SuperMap.Web.UI.Action3Ds.MeasureTerrainArea(this.sceneControl);
		this.sceneControl.set_sceneAction(measureAreaAction);
		//给面积量算事件和量算结束事件注册回调函数
		sceneControl.removeEvent("measureAreaFinished", this.measureArea_areaFinishedHandler);
		this.sceneControl.addEvent("measureAreaFinished", this.measureArea_areaFinishedHandler);
	},

	/**
	 * 清除跟踪图层
	 */
	measure_clearAll:function(){
		this.sceneControl.get_scene().get_trackingLayer3D().removeAll();
	},
	
	/**
	 * 地下绘制挖方区域
	 * @param {} depth			 地下绘制深度
	 * @param {} transparency	 挖方区域是否透明(true or false)
	 */
	excavation:function(depth,transparency){
		this.depth = depth;
		this.transparency = transparency;
		MeasureClass_this = this;
		var measureAreaAction = new SuperMap.Web.UI.Action3Ds.ExcavationRegion(this.sceneControl);
		this.sceneControl.set_sceneAction(measureAreaAction); 
		sceneControl.removeEvent("measureAreaFinished", this.measureArea_areaFinishedHandler);
    	sceneControl.removeEvent("addExcavationRegion", this.excavationFinished);
		this.sceneControl.addEvent("addExcavationRegion", this.excavationFinished);
	},
	
	/**
	 * 地下绘制结束
	 * @param {} region3D
	 */
	excavationFinished:function(region3D){
		if(!MeasureClass_this.transparency){
			var style3D = new SuperMap.Web.Core.Style3D();
			style3D.set_lineColor(new SuperMap.Web.Core.Color(255,0,0,255));
			style3D.set_extendHeight(-MeasureClass_this.depth);
			style3D.set_altitudeMode(3);
	        var feature = new SuperMap.Web.Core.Feature3D();
	        feature.set_geometry(region3D);
	        feature.set_style3D(style3D);
			var trackingLayer3D = MeasureClass_this.sceneControl.get_scene().get_trackingLayer3D();
			trackingLayer3D.add(feature, "object");
			//trackingLayer3D.set_isEditable(true);
	        feature.set_isVisible(true);
		}
		MeasureClass_this.sceneControl.get_scene().get_globalImage().addExcavationRegion(region3D,Math.uuid());
		MeasureClass_this.sceneControl.set_sceneAction(new SuperMap.Web.UI.Action3Ds.PanSelect(MeasureClass_this.sceneControl));
		MeasureClass_this.sceneControl.removeEvent("addExcavationRegion", MeasureClass_this.excavationFinished);
	}
	
};