/**
 * 倾斜数据操作类
 * @param {} sceneControl
 */

SuperMap.Web.UI.Action3Ds.TiltDataClass = function(sceneControl){
	this._sceneControl = sceneControl;
	this._layer3D = null;
	this._regionIndex = null;
	this._waterIDGlobal = null;
	this._waterRegionID = null;
};

var TiltDataClass_this = null;

SuperMap.Web.UI.Action3Ds.TiltDataClass.prototype = {
	
	/**
	 * 矢量依模型显示
	 * @param {} layerName
	 */
	vectorClampToLayer:function(layerName){
		//获取矢量图层
	    var lyrVector = this._sceneControl.get_scene().get_layer3Ds().get_item(layerName);
	    lyrVector.get_style3D().set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.CLAMP_TO_OBJECT);
	    lyrVector.get_style3D().set_fillForeColor(new SuperMap.Web.Core.Color(255,0,0,100));
	    lyrVector.refresh();
	    lyrVector.set_isSelectable(true);
	
	    var style3d2 = new SuperMap.Web.Core.Style3D();
	    style3d2.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.CLAMP_TO_OBJECT);
	    style3d2.set_fillForeColor(new SuperMap.Web.Core.Color(255,255,0,100));
	    lyrVector.set_selectStyle(style3d2);
	    lyrVector.refresh();
	},
	
	/**
	 * 制作专题图
	 * @param {} serviceUrl
	 * @param {} layerName
	 * @param {} dataName
	 */
	addtheme:function(serviceUrl,layerName,dataName){
		var themeRange = new SuperMap.Web.Realspace.Theme3DRange();
        themeRange.set_rangeExpression("SmID");

        var style3d = new SuperMap.Web.Core.Style3D();
        var color = new SuperMap.Web.Core.Color(255, 0, 0, 255);

        var item1 = new SuperMap.Web.Realspace.Theme3DRangeItem();
        item1.set_start(0);
        item1.set_end(20);
        style3d.set_fillForeColor(new SuperMap.Web.Core.Color(255, 153, 0, 100));
        item1.set_style3D(style3d);

        var item2 = new SuperMap.Web.Realspace.Theme3DRangeItem();
        item2.set_start(21);
        item2.set_end(40);
        var style3d1 = new SuperMap.Web.Core.Style3D();
        style3d1.set_fillForeColor(new SuperMap.Web.Core.Color(255, 215, 0, 100));
        item2.set_style3D(style3d1);

        var item3 = new SuperMap.Web.Realspace.Theme3DRangeItem();
        item3.set_start(41);
        item3.set_end(60);
        var style3d2 = new SuperMap.Web.Core.Style3D();
        style3d2.set_fillForeColor(new SuperMap.Web.Core.Color(127, 255, 0,100));
        item3.set_style3D(style3d2);

 		var item4 = new SuperMap.Web.Realspace.Theme3DRangeItem();
        item4.set_start(61);
        item4.set_end(80);
        var style3d3 = new SuperMap.Web.Core.Style3D();
        style3d3.set_fillForeColor(new SuperMap.Web.Core.Color(0, 255, 0, 100));
        item4.set_style3D(style3d3);

 		var item5 = new SuperMap.Web.Realspace.Theme3DRangeItem();
        item5.set_start(81);
        item5.set_end(100);
        var style3d4 = new SuperMap.Web.Core.Style3D();
        style3d4.set_fillForeColor(new SuperMap.Web.Core.Color(255, 0, 0, 100));
        item5.set_style3D(style3d4);

 		var item6 = new SuperMap.Web.Realspace.Theme3DRangeItem();
        item6.set_start(101);
        item6.set_end(120);
        var style3d5 = new SuperMap.Web.Core.Style3D();
        style3d5.set_fillForeColor(new SuperMap.Web.Core.Color(0, 0, 255, 100));
        item6.set_style3D(style3d5);

 		var item7 = new SuperMap.Web.Realspace.Theme3DRangeItem();
        item7.set_start(121);
        item7.set_end(200);
        var style3d6 = new SuperMap.Web.Core.Style3D();
        style3d6.set_fillForeColor(new SuperMap.Web.Core.Color(255, 0, 255, 100));
        item7.set_style3D(style3d2);

        themeRange.addToHead(item7);
        themeRange.addToHead(item6);
        themeRange.addToHead(item5);
        themeRange.addToHead(item4);
        themeRange.addToHead(item3);
        themeRange.addToHead(item2);
        themeRange.addToHead(item1);
    	var themeLyr = this._sceneControl.get_scene().get_layer3Ds().addTheme3D(serviceUrl, layerName, dataName, SuperMap.Web.Realspace.Layer3DType.VECTOR, themeRange);
    	return themeLyr;
	},
	
	/**
	 * 专题图依模型显示
	 * @param {} layerName
	 */
	clampToLayer:function(layerName){
		//获取矢量图层
	    var lyrVector = this._sceneControl.get_scene().get_layer3Ds().get_item(layerName);
	    lyrVector.get_style3D().set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.CLAMP_TO_OBJECT);
	    lyrVector.get_style3D().set_fillForeColor(new SuperMap.Web.Core.Color(255,0,0,100));
	    lyrVector.refresh();
	    lyrVector.set_isSelectable(true);
	
	    var style3d2 = new SuperMap.Web.Core.Style3D();
	    style3d2.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.CLAMP_TO_OBJECT);
	    style3d2.set_fillForeColor(new SuperMap.Web.Core.Color(255,255,0,100));
	    lyrVector.set_selectStyle(style3d2);
	    lyrVector.refresh();
	},
	
	/**
	 * 矢量贴地
	 * @param {} layerName1
	 * @param {} layerName2
	 */
	setVectorClampGround:function(layerName1,layerName2){
	    var lyrVector = this._sceneControl.get_scene().get_layer3Ds().get_item(layerName1);
	    lyrVector.get_style3D().set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.CLAMP_TO_GROUND);
	    lyrVector.refresh();
	
	    var lyrVector2 = this._sceneControl.get_scene().get_layer3Ds().get_item(layerName2);
	    lyrVector2.get_style3D().set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.CLAMP_TO_GROUND);
	    lyrVector2.refresh();
	},
	
	/**
	 * 压平模型
	 * @param {} layer3D
	 * @param {} regionIndex
	 */
	flattenLayer:function(layer3D,regionIndex){
//	    this._sceneControl.set_sceneAction(null);
//	    var newAction = new SuperMap.Web.UI.Action3Ds.DrawRegion3D(this._sceneControl,layer3D,regionIndex);
//	    this._sceneControl.set_sceneAction(newAction);
		TiltDataClass_this = this;
		this._layer3D = layer3D;
		this._regionIndex = regionIndex;
		this._sceneControl.set_sceneAction(null);
		var measureAreaAction = new SuperMap.Web.UI.Action3Ds.MeasureArea(this._sceneControl);
	    this._sceneControl.set_sceneAction(measureAreaAction);
	    this._sceneControl.removeEvent("measureAreaFinished", this.drawWaterFinishedHandler);
	    this._sceneControl.addEvent("measureAreaFinished", this.flattenLayerFinishedHandler);
	},
	
	/**
	 * 压平结束事件
	 * @param {} dArea
	 * @param {} region3d
	 */
	flattenLayerFinishedHandler:function(dArea,region3d){
	    var feature3D = new SuperMap.Web.Core.Feature3D();
	    feature3D.set_geometry(region3d);
	    var style3d = new SuperMap.Web.Core.Style3D();
	    style3d.set_altitudeMode(2);
	    style3d.set_markerColor(new SuperMap.Web.Core.Color(255, 0, 255, 250));
	    style3d.set_lineWidth(1.5);
	    style3d.set_lineColor(new SuperMap.Web.Core.Color(255, 255, 0, 255));
	    style3d.set_fillForeColor(new SuperMap.Web.Core.Color(255, 255, 0, 100));
	    feature3D.set_style3D(style3d);
	    TiltDataClass_this._sceneControl.get_scene().get_trackingLayer3D().add(feature3D, "area");
	    TiltDataClass_this._sceneControl.removeEvent("measureAreaFinished",TiltDataClass_this.areaFinishedHandler);
	    var panSelectAction = new SuperMap.Web.UI.Action3Ds.PanSelect(TiltDataClass_this._sceneControl);
	    TiltDataClass_this._sceneControl.set_sceneAction(panSelectAction);
	    TiltDataClass_this._layer3D.addFlattenRegion(region3d,"region_"+TiltDataClass_this._regionIndex);
	    TiltDataClass_this._regionIndex++;
	    TiltDataClass_this._sceneControl.removeEvent("measureAreaFinished", TiltDataClass_this.flattenLayerFinishedHandler);
	},
	
	/**
	 * 清除压平
	 * @param {} layer3D
	 */
	ClearFlattenLayer:function(layer3D){
	    this._sceneControl.get_scene().get_trackingLayer3D().removeAll();
	    //this._sceneControl.get_scene().get_trackingLayer3D().refresh();
	    layer3D.clearFlattenRegions();
	    //layer3D.refresh();
	},
	
	/**
	 * 水面绘制
	 */
	drawWater:function(waterIDGlobal){
		var trackingLayer = this._sceneControl.get_scene().get_trackingLayer3D();
		this._waterIDGlobal = waterIDGlobal;
		TiltDataClass_this = this;
		var measureAreaAction = new SuperMap.Web.UI.Action3Ds.MeasureArea(this._sceneControl);
	    this._sceneControl.set_sceneAction(measureAreaAction);
	    this._sceneControl.removeEvent("measureAreaFinished", this.flattenLayerFinishedHandler);
	    this._sceneControl.addEvent("measureAreaFinished", this.drawWaterFinishedHandler);
	},
	
	/**
	 * 水面绘制结束事件
	 */
	drawWaterFinishedHandler:function(dArea,region3d){
		var style3d = new SuperMap.Web.Core.Style3D();
		style3d.set_fillSymbolID(TiltDataClass_this._waterIDGlobal);
		style3d.set_altitudeMode(2);
        var trackingLayer = TiltDataClass_this._sceneControl.get_scene().get_trackingLayer3D();
        var feature3D = new SuperMap.Web.Core.Feature3D();
        feature3D.set_geometry(region3d);
        feature3D.set_style3D(style3d.clone());
        trackingLayer.set_isVisible(true);
        trackingLayer.removeAt(TiltDataClass_this._waterRegionID);
        TiltDataClass_this._waterRegionID = trackingLayer.add(feature3D, "region2");
        var panAction = new SuperMap.Web.UI.Action3Ds.PanSelect(TiltDataClass_this._sceneControl);
        TiltDataClass_this._sceneControl.set_sceneAction(panAction);
        TiltDataClass_this._sceneControl.removeEvent("measureAreaFinished", TiltDataClass_this.drawWaterFinishedHandler);
	}
	
};