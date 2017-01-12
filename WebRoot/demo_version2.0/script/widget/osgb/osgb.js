/**
 * osgb窗口
 */
 
Ext.onReady(function() {
	
	var osgbPanel = Ext.create('Ext.panel.Panel', {
		id:'osgbPanel',
    	layout:'anchor',
		bodyPadding:5,
		border:0,
		defaults:{
			style:{
				marginTop:'5px',
				marginLeft:'10px'
			}		
		},
		items:[{
			xtype:'image',
			src: imageDir+'/osgb/selectModel.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			listeners: {
		        el: {
		            click: function() {
		            	selectModelClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'选择模型'
		},{
			xtype:'image',
			src: imageDir+'/osgb/theme.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			listeners: {
		        el: {
		            click: function() {
		                themClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'专题图'
		},{
			xtype:'image',
			src: imageDir+'/osgb/visibility.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			listeners: {
		        el: {
		            click: function() {
		                visibilityClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'通视分析'
		},{
			xtype:'image',
			src: imageDir+'/osgb/viewshed.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			listeners: {
		        el: {
		            click: function() {
		                viewshedClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'可视域分析'
		},{
			xtype:'image',
			src: imageDir+'/osgb/viewshed.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			listeners: {
		        el: {
		            click: function() {
		                dynamicViewshedClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'动态可视域'
		},{
			xtype:'image',
			src: imageDir+'/osgb/skyline.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			listeners: {
		        el: {
		            click: function() {
		                skylineClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'天际线分析'
		},{
			xtype:'image',
			src: imageDir+'/osgb/water.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			listeners: {
		        el: {
		            click: function() {
		                waterClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'水面效果'
		},{
			xtype:'image',
			src: imageDir+'/osgb/flat.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			listeners: {
		        el: {
		            click: function() {
		                flatClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'局部压平'
		},{
			xtype:'image',
			src: imageDir+'/measure/clear.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			listeners: {
		        el: {
		            click: function() {
		                clearClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'清除'
		}]
	});
	
	var regionIndex = 0;
	var sightline = null;
	var viewShed3d = null;
	var skyline = null;
	var themeLyr = null;
	var dynamicViewShed3d = null;
	var dynamicViewShedTimeId = null;
	var dynamicViewShedTimeId2 = null;
	
	// 选择模型
	function selectModelClick(){
		setFocus();
		var lyrVector = scene.get_layer3Ds().get_item(vectorGlobal);
		lyrVector.get_style3D().set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.CLAMP_TO_OBJECT);
		lyrVector.get_style3D().set_fillForeColor(new SuperMap.Web.Core.Color(255,255,0,0));
		lyrVector.set_isVisible(true);
		lyrVector.set_isSelectable(true);
	
		var style3d2 = new SuperMap.Web.Core.Style3D();
		style3d2.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.CLAMP_TO_OBJECT);
		style3d2.set_fillForeColor(new SuperMap.Web.Core.Color(255,0,0,100));
		lyrVector.set_selectStyle(style3d2);
	}
	
	// 水面效果
	function waterClick(){
		setFocus();
		var tiltDataClass = new SuperMap.Web.UI.Action3Ds.TiltDataClass(sceneControl);
		tiltDataClass.drawWater(waterIDGlobal);
	}
	
	// 局部压平
	function flatClick(){
		setFocus();
		regionIndex++;
		var osgbLyr = scene.get_layer3Ds().get_item(flatGlobal);
		if(osgbLyr){
			var tiltDataClass = new SuperMap.Web.UI.Action3Ds.TiltDataClass(sceneControl);
			tiltDataClass.flattenLayer(osgbLyr,regionIndex);
		}
	}
	
	// 专题图
	function themClick(){
		setFocus();
		theme3D_clear();
		var themeLyr = scene.get_layer3Ds().get_item(themeGlobal);
		if(themeLyr){
			themeLyr.set_isVisible(true);
			var style3d2 = new SuperMap.Web.Core.Style3D();
			style3d2.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.CLAMP_TO_OBJECT);
			style3d2.set_fillForeColor(new SuperMap.Web.Core.Color(255,0,0,100));
			themeLyr.set_selectStyle(style3d2);
		}
		scene.refresh();
//		var tiltDataClass = new SuperMap.Web.UI.Action3Ds.TiltDataClass(sceneControl);
//		themeLyr = tiltDataClass.addtheme(sceneUrl,vectorName,vectorName);
//		tiltDataClass.clampToLayer(themeName);
	}
	
	// 通视分析
	function visibilityClick(){
		setFocus();
		visibility_clearResult();
		var analysisClass = new SuperMap.Web.UI.Action3Ds.AnalysisClass(sceneControl);
		sightline = analysisClass.setSightlineAction();
	}
	
	// 可视域分析
	function viewshedClick(){
		setFocus();
		viewshed_clearAll();
	    viewShed3d = new SuperMap.Web.Realspace.ViewShed3D();
	    sceneControl.set_sceneAction(null);
	    var newAction = new SuperMap.Web.UI.Action3Ds.ViewShed3DAction(sceneControl,viewShed3d,null,null);
    	sceneControl.set_sceneAction(newAction);
	}
	
	// 动态可视域分析
	function dynamicViewshedClick(){
		setFocus();
		dynamicViewshed_clearAll();
		var analysisClass = new SuperMap.Web.UI.Action3Ds.AnalysisClass(sceneControl);
		analysisClass.dynamicViewshed(dynamicViewShed3d,dynamicViewshedCallback,dynamicViewshedFinishCallback);
	}
	
	// 动态可视域分析回调函数
	function dynamicViewshedFinishCallback(viewShed3d){
		dynamicViewShed3d = viewShed3d;
	}
	
	function dynamicViewshedCallback(timeId,timeId2,viewShed3d){
		dynamicViewShed3d = viewShed3d;
		dynamicViewShedTimeId = timeId;
		dynamicViewShedTimeId2 = timeId2;
	}
	
	// 提取天际线
	function skylineClick(){
		setFocus();
		skyline_clear();
		var camera = scene.get_firstPersonCamera();
		var x = camera.get_longitude();
		var y = camera.get_latitude();
		var z = camera.get_altitude();
		var direction = camera.get_heading()
		var pitch = camera.get_tilt()-90;
		var pt3d = new SuperMap.Web.Core.Point3D(x, y, z);
		skyline = new SuperMap.Web.Realspace.Skyline();
		var analysisClass = new SuperMap.Web.UI.Action3Ds.AnalysisClass(sceneControl);
		analysisClass.analysisSkyline(skyline,pt3d,direction,pitch);
	}
	
	// 清除
	function clearClick(){
		setFocus();
		visibility_clearResult();
		viewshed_clearAll();
		skyline_clear();
		clearFlatClick();
		theme3D_clear();
		selectModel_clear();
		dynamicViewshed_clearAll();
	}
	
	// 取消模型选择
	function selectModel_clear(){
		var lyrVector = scene.get_layer3Ds().get_item(vectorGlobal);
		if(lyrVector){
			lyrVector.set_isVisible(false);
		}
	}
	
	// 清除专题图
	function theme3D_clear(){
//		if(themeLyr){
//			var themeLyrName = themeLyr.get_name();
//			sceneControl.get_scene().get_layer3Ds().removeAt(themeLyrName);
//			themeLyr = null;
//		}
		var lyrTheme = scene.get_layer3Ds().get_item(themeGlobal);
		if(lyrTheme){
			lyrTheme.set_isVisible(false);
		}
	}
	
	// 清除天际线
	function skyline_clear(){
		if(skyline){
			skyline.clear();
			skyline = null;
		}
	}
	
	// 清除通视分析
	function visibility_clearResult(){
		if(sightline){
			sightline.clear();
			sightline = null;
		}
		scene.get_trackingLayer3D().removeAll();
	}
	
	// 清除可视域分析
	function viewshed_clearAll(){
		if(viewShed3d){
			viewShed3d.clear();
			viewShed3d = null;
		}
	}
	
	// 清除动态可视域分析
	function dynamicViewshed_clearAll(){
		if(dynamicViewShed3d){
			dynamicViewShed3d.clear();
			dynamicViewShed3d = null;
			window.clearInterval(dynamicViewShedTimeId);
			window.clearInterval(dynamicViewShedTimeId2);
			scene.get_trackingLayer3D().removeAll();
		}	
	}
	
	// 清除压平
	function clearFlatClick(){
		setFocus();
		regionIndex = 0;
		var flatLyr = scene.get_layer3Ds().get_item(flatGlobal);
		var tiltDataClass = new SuperMap.Web.UI.Action3Ds.TiltDataClass(sceneControl);
		tiltDataClass.ClearFlattenLayer(flatLyr);
	}

});