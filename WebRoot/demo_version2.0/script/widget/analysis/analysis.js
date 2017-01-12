/**
 * 分析panel
 */

Ext.onReady(function() {

	var analysisPanel = Ext.create('Ext.panel.Panel', {
		id:'analysisPanel',
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
			style:{
				marginTop:'10px',
				marginLeft:'10px'
			},
			listeners: {
		        el: {
		            click: function() {
		                viewshedClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'可视域'
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
			style:{
				marginTop:'10px',
				marginLeft:'10px'
			},
			listeners: {
		        el: {
		            click: function() {
		                skylineClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'天际线'
		},{
			xtype:'image',
			src: imageDir+'/analysis/slop.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			style:{
				marginTop:'10px',
				marginLeft:'10px'
			},
			listeners: {
		        el: {
		            click: function() {
		                slopClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'坡度坡向'
		},{
			xtype:'image',
			src: imageDir+'/analysis/contourinterval.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			style:{
				marginTop:'10px',
				marginLeft:'10px'
			},
			listeners: {
		        el: {
		            click: function() {
		                contourintervalClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'等高线'
		},{
			xtype:'image',
			src: imageDir+'/analysis/shadow.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			style:{
				marginTop:'10px',
				marginLeft:'10px'
			},
			listeners: {
		        el: {
		            click: function() {
		                shadowClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'阴影分析'
		},{
			id:'analysis_profile',
			xtype:'image',
			src: imageDir+'/analysis/profile.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			style:{
				marginTop:'10px',
				marginLeft:'10px'
			},
			listeners: {
		        el: {
		            click: function() {
		                profileClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'剖面分析'
		},{
			xtype:'image',
			src: imageDir+'/analysis/clear.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			style:{
				marginTop:'10px',
				marginLeft:'10px'
			},
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

	var profileWindow = Ext.create('Ext.window.Window', {
	    id:'profileWindow',
	    title:'剖面分析',
	    width:700,
	    height:500,
	    padding:0,
		border:0,
		resizable:false,
		constrain:true,
		animCollapse:true,
		closeAction:'hide',
		animateTarget:'analysis',
		items:[{
			id:'profileAnalysis_image',
			xtype:'image',
			width:700,
			height:500,
			listeners: {
			        el: {
			            click: function() {
							setFocus();
			            }
			        }
			    }
		}]
    });

	var sightline = null;
	var viewShed3d = null;
	var skyline = null;
	var profile = null;
	var slopMap = null;
	var contourMap = null;
	var shadowQuery = null;
	var dynamicViewShed3d = null;
	var dynamicViewShedTimeId = null;
	var dynamicViewShedTimeId2 = null;

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

	// 通视分析
	function visibilityClick(){
		visibility_clearResult();
		var analysisClass = new SuperMap.Web.UI.Action3Ds.AnalysisClass(sceneControl);
		sightline = analysisClass.setSightlineAction();
		setFocus();
	}

	// 可视域分析
	function viewshedClick(){
		viewshed_clearAll();
	    viewShed3d = new SuperMap.Web.Realspace.ViewShed3D();
	    sceneControl.set_sceneAction(null);
	    var newAction = new SuperMap.Web.UI.Action3Ds.ViewShed3DAction(sceneControl,viewShed3d,null,null);
    	sceneControl.set_sceneAction(newAction);
    	setFocus();
	}

	// 天际线分析
	function skylineClick(){
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
		setFocus();
	}

	// 坡度坡向分析
	function slopClick(){
		clearSlop();
		var slopDisplay = SuperMap.Web.Realspace.SlopeDisplayStyle.ARROW;
		var keys = new Array(0,25);
		var colors = new Array();
	    colors[0] = new SuperMap.Web.Core.Color(0,0,255,255);
	    colors[1] = new SuperMap.Web.Core.Color(255,0,0,255);
	    slopMap = new SuperMap.Web.Realspace.SlopeMap();
		slopMap.set_displayStyle(slopDisplay);
	    slopMap.setColorDictionary(keys,colors);
	    slopMap.set_opacity(80);
	    slopMap.set_isBorderVisible(false);
		var analysisClass = new SuperMap.Web.UI.Action3Ds.AnalysisClass(sceneControl);
		analysisClass.startSlopAnalysis(slopMap,'regional');
		setFocus();
	}

	// 等高线分析
	function contourintervalClick(){
		clearContour();
	    var colors = new Array();
	    colors[0] = new SuperMap.Web.Core.Color(0,0,255,255);
	    colors[1] = new SuperMap.Web.Core.Color(255,0,0,255);
	    var keys = new Array(10,1500);
	    var contourDisplay = SuperMap.Web.Realspace.ContourDisplayStyle.LINES;
	    contourMap = new SuperMap.Web.Realspace.ContourMap();
		contourMap.set_displayStyle(contourDisplay);
		contourMap.set_interval(100);
		contourMap.set_opacity(80);
		contourMap.setColorDictionary(keys,colors);
		contourMap.set_isBorderVisible(false);
		var analysisClass = new SuperMap.Web.UI.Action3Ds.AnalysisClass(sceneControl);
	    analysisClass.startContourAnalysis(contourMap,'regional');
	    setFocus();
	}

	// 阴影分析
	function shadowClick(){
		shadowQuery_clearAll();
		scene.get_sun().set_isVisible(true);
		var layer3Ds = scene.get_layer3Ds();
		var length = layer3Ds.get_count();
		for(var i=0;i<length;i++){
			var layer3D = layer3Ds.get_item(i);
			layer3D.set_isShadowEnable(true);
		}
	    var date = new Date();
	    scene.get_sun().set_dateTime(date);
	    date.setMinutes(0);
	    date.setSeconds(0);
	    date.setHours(0);
	    shadowQuery = new SuperMap.Web.Realspace.ShadowQuery();
	    shadowQuery.set_startTime(date);

	    date.setHours(24);
	    shadowQuery.set_endTime(date);
	    shadowQuery.set_spacing(3);
	    shadowQuery.set_timeInterval(15);
	    var shadowClick = new SuperMap.Web.UI.Action3Ds.ShadowClick(sceneControl,shadowQuery);
	    var analysisClass = new SuperMap.Web.UI.Action3Ds.AnalysisClass(sceneControl);
	    analysisClass.startShadowQuery(shadowQuery,shadowClick);
	    setFocus();
	}

	// 剖面线分析
	function profileClick(){
		profileAnalysis_clear();
		profile = new SuperMap.Web.Realspace.Profile();
		var analysisClass = new SuperMap.Web.UI.Action3Ds.AnalysisClass(sceneControl);
		analysisClass.drawProfileLine(profile,profileAnalysisCallback);
		setFocus();
	}

	// 清除
	function clearClick(){
		visibility_clearResult();
		viewshed_clearAll();
		skyline_clear();
		profileAnalysis_clear();
		clearSlop();
		clearContour();
		shadowQuery_clearAll();
		dynamicViewshed_clearAll();
		setFocus();
	}

	// 绘制剖面线结束后的回调函数
	function profileAnalysisCallback(profile){
		var str = profile.outputProfileToJPG();
		Ext.getCmp('profileAnalysis_image').setSrc(str);
	    profileWindow.show();
	}

	// 清除阴影分析
	function shadowQuery_clearAll(){
		if(shadowQuery){
			shadowQuery.clear();
	    	shadowQuery = null;
		}
		scene.get_trackingLayer3D().removeAll();
	}

	// 坡度、坡向清除结果按钮点击事件
	function clearSlop(){
		if(slopMap){
			slopMap.clear();
			sceneControl.set_sceneAction(new SuperMap.Web.UI.Action3Ds.Pan(sceneControl));
		}
	   	sceneControl.get_scene().get_trackingLayer3D().removeAll();
	}

	// 清除剖面线
	function profileAnalysis_clear(){
		if(profile){
			profile.clear();
		}
   		scene.get_trackingLayer3D().removeAll();
	}

	// 等高线清除结果按钮点击事件
	function clearContour(){
		if(contourMap){
			contourMap.clear();
			sceneControl.set_sceneAction(new SuperMap.Web.UI.Action3Ds.Pan(sceneControl));
		}
	    sceneControl.get_scene().get_trackingLayer3D().removeAll();
	}

	// 清除通视分析
	function visibility_clearResult(){
		if(sightline){
			sightline.clear();
		}
		scene.get_trackingLayer3D().removeAll();
	}

	// 清除可视域分析
	function viewshed_clearAll(){
		if(viewShed3d){
			viewShed3d.clear();
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

	// 清除天际线
	function skyline_clear(){
		if(skyline){
			skyline.clear();
		}
	}

});
