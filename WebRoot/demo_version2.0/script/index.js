/**
 * 系统总布局
 */
Ext.onReady(function() {

	var mainPanel = Ext.create('Ext.panel.Panel', {
		id:'mainPanel',
		region:'center',
		autoScroll:false,
		border:0,
		html:'<div id="sceneControlDiv"></div><input id="test" type="text" style="width:1px;margin-top:-9999px"><iframe id="poiDiv" style="position: absolute;top: 50px; display:none;" frameborder="0" scrolling="no"></iframe>',
		tbar:[
		{
			id:'layerSearch',
			xtype:'image',
			src: 'demo_version2.0/images/index/layerSearch_init.png',
			overCls:'imageOverCls',
			width:30,
			height:30,
			style:"margin-left:25px"
			// 图层
		},
		{
			id:'layerGuide',
			xtype:'image',
			src: 'demo_version2.0/images/index/layerGuide_init.png',
			overCls:'imageOverCls',
			width:30,
			height:30,
			style:"margin-left:35px"
			//服务列表
		},
		{
			id:'poiSearch',
			xtype:'image',
			src: 'demo_version2.0/images/index/search_init.png',
			overCls:'imageOverCls',
			width:30,
			height:30,
			style:"margin-left:35px"
		},
		{
			id:'sceneList',
			xtype:'image',
			src: 'demo_version2.0/images/index/sceneList_init.png',
			overCls:'imageOverCls',
			width:30,
			height:30,
			style:"margin-left:35px"
			// 服务列表
		},'->',{
			id:'osgb',
			xtype:'image',
			src: 'demo_version2.0/images/index/osgb_init.png',
			overCls:'imageOverCls',
			style:{
				marginRight:'40px'
			},
			width:24,
			height:24
			//text:'倾斜摄影',
		},{
			id:'measure',
			xtype:'image',
			src: 'demo_version2.0/images/index/measure_init.png',
			overCls:'imageOverCls',
			style:{
				marginRight:'40px'
			},
			width:24,
			height:24
			//text:'量算'
		},{
			id:'analysis',
			xtype:'image',
			src: 'demo_version2.0/images/index/analysis_init.png',
			overCls:'imageOverCls',
			style:{
				marginRight:'40px'
			},
			width:24,
			height:24
			//text:'分析'
		},{
			id:'sunEffects',
			xtype:'image',
			src: 'demo_version2.0/images/index/sun_init.png',
			overCls:'imageOverCls',
			style:{
				marginRight:'40px'
			},
			width:24,
			height:24
			//text:'太阳阴影'
		},{
			id:'flyManagement',
			xtype:'image',
			src: 'demo_version2.0/images/index/fly_init.png',
			overCls:'imageOverCls',
			style:{
				marginRight:'40px'
			},
			width:24,
			height:24
			//text:'飞行'
		},{
			id:'stereoSetting',
			xtype:'image',
			src: 'demo_version2.0/images/index/stereoSetting_init.png',
			overCls:'imageOverCls',
			style:{
				marginRight:'40px'
			},
			width:24,
			height:24
			//text:'立体设置'
		},{
			id:'sceneProperties',
			xtype:'image',
			src: 'demo_version2.0/images/index/scene_init.png',
			overCls:'imageOverCls',
			style:{
				marginRight:'40px'
			},
			width:24,
			height:24
			//text:'场景属性'
		}]
    });

    var tabpanelMask = new Ext.LoadMask(Ext.getBody(),{
    	msg:'正在加载场景，请稍后......'
    });

    tabpanelMask.show();

    Ext.create('Ext.container.Viewport', {
    	id:'viewport',
        layout: 'border',
        listeners:{
        	'add':function(){
        		setTimeout(sceneLoad,1000);
        	}
        }
    });

    Ext.getCmp('viewport').add(mainPanel);

    var searchPanel = Ext.create('Ext.panel.Panel', {
    	id:'searchPanel',
    	layout:'anchor',
    	bodyPadding:5,
		border:0,
		defaults:{
			border:0,
			labelWidth:90
		},
    	items:[{
    		layout:'hbox',
    		items:[{
    			id:'keyWords',
    			width:220,
				xtype:'textfield'
    		},{
				xtype:'button',
				text:'搜索',
    			style:{
    				marginLeft:'5px'
    			}
    		}]
    	},{
    		xtype:'tbtext',
    		text:'例如:美国纽约',
    		style:{
    			marginTop:'5px'
    		}
    	}]
    });

	var leftWindow = Ext.create('Ext.window.Window', {
	    id:'leftWindow',
	    padding:0,
		border:0,
		resizable:false,
		constrain:true,
		animCollapse:true,
		closeAction:'hide',
		autoScroll:true,
		draggable:false
    });

    var workspaceWindow = Ext.create('Ext.window.Window', {
	    id:'workspaceWindow',
		padding:0,
		border:0,
		resizable:false,
		constrain:true,
		animCollapse:true,
		closeAction:'hide',
		autoScroll:true,
		draggable:false
//		collapsible:true,
//		collapseDirection:'right'
    });

	var layerSearchTip = Ext.create('Ext.tip.ToolTip', {
		target: 'layerSearch',
		anchor: 'bottom',
		anchorOffset: -5,
		showDelay:0,
		dismissDelay:0,
		bodyPadding:0,
		border:0,
		html:'图层'
	});

	var layerGuideTip = Ext.create('Ext.tip.ToolTip', {
		target: 'layerGuide',
		anchor: 'bottom',
		anchorOffset: -5,
		showDelay:0,
		dismissDelay:0,
		bodyPadding:0,
		border:0,
		html:'服务列表'
	});

	var poiSearchTip = Ext.create('Ext.tip.ToolTip', {
		target: 'poiSearch',
		anchor: 'bottom',
		anchorOffset: -5,
		showDelay:0,
		dismissDelay:0,
		bodyPadding:0,
		border:0,
		html:'搜索'
	});

	var sceneListTip = Ext.create('Ext.tip.ToolTip', {
		target: 'sceneList',
		anchor: 'bottom',
		anchorOffset: -5,
		showDelay:0,
		dismissDelay:0,
		bodyPadding:0,
		border:0,
		html:'底图'
	});

	var osgbTip = Ext.create('Ext.tip.ToolTip', {
	    target: 'osgb',
	    anchor: 'bottom',
	    anchorOffset: -5,
	    showDelay:0,
	    dismissDelay:0,
	    bodyPadding:0,
	    border:0,
	    html:'倾斜摄影'
	});

    var measureTip = Ext.create('Ext.tip.ToolTip', {
	    target: 'measure',
	    anchor: 'bottom',
	    anchorOffset: -5,
	    showDelay:0,
	    dismissDelay:0,
	    bodyPadding:0,
	    border:0,
	    html:'量算'
	});

	var analysisTip = Ext.create('Ext.tip.ToolTip', {
	    target: 'analysis',
	    anchor: 'bottom',
	    anchorOffset: -5,
	    showDelay:0,
	    dismissDelay:0,
	    bodyPadding:0,
	    border:0,
	    html:'分析'
	});

	var scenePropertiesTip = Ext.create('Ext.tip.ToolTip', {
    	id:'scenePropertiesTip',
	    target: 'sceneProperties',
	    anchor: 'bottom',
	    anchorOffset: -5,
	    showDelay:0,
	    dismissDelay:0,
	    bodyPadding:0,
	    border:0,
	    html:'场景属性'
	});

	var stereoSettingTip = Ext.create('Ext.tip.ToolTip', {
    	id:'stereoSettingTip',
	    target: 'stereoSetting',
	    anchor: 'bottom',
	    anchorOffset: -5,
	    showDelay:0,
	    dismissDelay:0,
	    bodyPadding:0,
	    border:0,
	    html:'立体设置'
	});

	var sunEffectsTip = Ext.create('Ext.tip.ToolTip', {
    	id:'sunEffectsTip',
	    target: 'sunEffects',
	    anchor: 'bottom',
	    anchorOffset: -5,
	    showDelay:0,
	    dismissDelay:0,
	    bodyPadding:0,
	    border:0,
	    html:'太阳阴影'
	});

	var flyManagementTip = Ext.create('Ext.tip.ToolTip', {
    	id:'flyManagementTip',
	    target: 'flyManagement',
	    anchor: 'bottom',
	    anchorOffset: -5,
	    showDelay:0,
	    dismissDelay:0,
	    bodyPadding:0,
	    border:0,
	    html:'飞行'
	});

	Ext.get('poiSearch').on({'click':poiSearchWindowShow});
	Ext.get('poiSearch').on({'mouseover':poiSearchMouseover});
	Ext.get('poiSearch').on({'mouseout':poiSearchMouseout});
	Ext.get('layerSearch').on({'click':layerSearchWindowShow});
	Ext.get('layerSearch').on({'mouseover':layerSearchMouseover});
	Ext.get('layerSearch').on({'mouseout':layerSearchMouseout});
	Ext.get('sceneList').on({'click':sceneListWindowShow});
	Ext.get('sceneList').on({'mouseover':sceneListMouseover});
	Ext.get('sceneList').on({'mouseout':sceneListMouseout});
	Ext.getCmp('workspaceWindow').addListener('hide',setFocus);
	Ext.get('layerGuide').on({'click':layerGuideWindowShow});
	Ext.get('layerGuide').on({'mouseover':layerGuideMouseover});
	Ext.get('layerGuide').on({'mouseout':layerGuideMouseout});
	Ext.get('sceneProperties').on({click: scenePropertiesWindowShow});
	Ext.get('sunEffects').on({click: sunEffectsWindowShow});
	Ext.get('flyManagement').on({click: flyManagementWindowShow});
	Ext.get('osgb').on({click: osgbClick});
	Ext.get('osgb').on({mouseover: osgbMouseover});
	Ext.get('osgb').on({mouseout: osgbMouseout});
	Ext.get('measure').on({click: measureClick});
	Ext.get('measure').on({mouseover: measureMouseover});
	Ext.get('measure').on({mouseout: measureMouseout});
	Ext.get('analysis').on({click: analysisClick});
	Ext.get('analysis').on({mouseover: analysisMouseover});
	Ext.get('analysis').on({mouseout: analysisMouseout});
	Ext.get('sceneProperties').on({mouseover: scenePropertiesMouseover});
	Ext.get('sceneProperties').on({mouseout: scenePropertiesMouseout});
	Ext.get('sunEffects').on({mouseover: sunEffectsMouseover});
	Ext.get('sunEffects').on({mouseout: sunEffectsMouseout});
	Ext.get('flyManagement').on({mouseover: flyManagementMouseover});
	Ext.get('flyManagement').on({mouseout: flyManagementMouseout});
	Ext.get('stereoSetting').on({click: stereoSettingWindowShow});
	Ext.get('stereoSetting').on({mouseover: stereoSettingMouseover});
	Ext.get('stereoSetting').on({mouseout: stereoSettingMouseout});
	Ext.getCmp('leftWindow').addListener('hide',setFocus);
	Ext.getCmp('leftWindow').addListener('show',setFocus);
	Ext.getCmp('mainPanel').addListener('resize',mainPanelResize);

	// 主面板大小改变事件
	function mainPanelResize(){
		var hidden = workspaceWindow.isHidden();
		if(!hidden){
			workspaceWindow.showAt(Ext.getBody().getWidth(),47);
		}
	}

	// 加载场景
    function sceneLoad(){
    	try{
			if(!sceneControl){
				//获取 html 页面中名为 sceneControlDiv 的 div 对象作为场景控件
				sceneControl = new SuperMap.Web.UI.Controls.SceneControl(document.getElementById('sceneControlDiv'), initCallback, failedCallback);
			}
		}
		catch(e){
			//若没有安装插件，则抛出该异常。
			if (e.name == SuperMap.Web.Realspace.ExceptionName.PlugInNotInstalled){
				var url = iserverUrl + "/realspace/iClient/for3D/Setup.exe";
				document.write("<a href='"+url+"'>请点击下载SuperMapiClientForRealspace插件进行安装</a>");
				return;
			}
			//若使用非IE浏览器，则抛出该异常
			else if (e.name == SuperMap.Web.Realspace.ExceptionName.BrowserNotSupport){
				document.write("<p>SuperMap iClient 6R for Realspace目前只支持IE浏览器</p>");
				return;
			}
			//抛出其他异常
			else{
				alert(e.message);
			}
		}
    }

	// 鼠标移出导览
	function layerGuideMouseout(){
		Ext.getCmp('layerGuide').setSrc('demo_version2.0/images/index/layerGuide_init.png');
	}

	// 鼠标进入导览
	function layerGuideMouseover(){
		Ext.getCmp('layerGuide').setSrc('demo_version2.0/images/index/layerGuide_glide.png');
	}

	// 鼠标移出图层查看器
	function layerSearchMouseout(){
		Ext.getCmp('layerSearch').setSrc('demo_version2.0/images/index/layerSearch_init.png');
	}

	// 鼠标进入图层查看器
	function layerSearchMouseover(){
		Ext.getCmp('layerSearch').setSrc('demo_version2.0/images/index/layerSearch_glide.png');
	}

	// 鼠标移出服务列表
	function sceneListMouseout(){
		Ext.getCmp('sceneList').setSrc('demo_version2.0/images/index/sceneList_init.png');
	}

	// 鼠标进入服务列表
	function sceneListMouseover(){
		Ext.getCmp('sceneList').setSrc('demo_version2.0/images/index/sceneList_glide.png');
	}

	// 鼠标移出搜索事件
	function poiSearchMouseover(){
		Ext.getCmp('poiSearch').setSrc('demo_version2.0/images/index/search_glide.png');
	}

	// 鼠标进入搜索事件
	function poiSearchMouseout(){
		Ext.getCmp('poiSearch').setSrc('demo_version2.0/images/index/search_init.png');
	}

	// 鼠标移出飞行事件
	function flyManagementMouseout(){
		Ext.getCmp('flyManagement').setSrc('demo_version2.0/images/index/fly_init.png');
	}

	// 鼠标进入飞行事件
	function flyManagementMouseover(){
		Ext.getCmp('flyManagement').setSrc('demo_version2.0/images/index/fly_glide.png');
	}

	// 鼠标移出太阳阴影事件
	function sunEffectsMouseout(){
		Ext.getCmp('sunEffects').setSrc('demo_version2.0/images/index/sun_init.png');
	}

	// 鼠标进入太阳阴影事件
	function sunEffectsMouseover(){
		Ext.getCmp('sunEffects').setSrc('demo_version2.0/images/index/sun_glide.png');
	}

	// 鼠标移出场景属性事件
	function scenePropertiesMouseout(){
		Ext.getCmp('sceneProperties').setSrc('demo_version2.0/images/index/scene_init.png');
	}

	// 鼠标进入场景属性事件
	function scenePropertiesMouseover(){
		Ext.getCmp('sceneProperties').setSrc('demo_version2.0/images/index/scene_glide.png');
	}

	// 鼠标移出立体设置事件
	function stereoSettingMouseout(){
		Ext.getCmp('stereoSetting').setSrc('demo_version2.0/images/index/stereoSetting_init.png');
	}

	// 鼠标进入场景属性事件
	function stereoSettingMouseover(){
		Ext.getCmp('stereoSetting').setSrc('demo_version2.0/images/index/stereoSetting_glide.png');
	}

	// 鼠标移出分析事件
	function analysisMouseout(){
		Ext.getCmp('analysis').setSrc('demo_version2.0/images/index/analysis_init.png');
	}

	// 鼠标进入分析事件
	function analysisMouseover(){
		Ext.getCmp('analysis').setSrc('demo_version2.0/images/index/analysis_glide.png');
	}

	// 鼠标移出量算事件
	function measureMouseout(){
		Ext.getCmp('measure').setSrc('demo_version2.0/images/index/measure_init.png');
	}

	// 鼠标进入量算事件
	function measureMouseover(){
		Ext.getCmp('measure').setSrc('demo_version2.0/images/index/measure_glide.png');
	}

	// 鼠标进入倾斜摄影事件
	function osgbMouseover(){
		Ext.getCmp('osgb').setSrc('demo_version2.0/images/index/osgb_glide.png');	}

	// 鼠标移出倾斜摄影事件
	function osgbMouseout(){
		Ext.getCmp('osgb').setSrc('demo_version2.0/images/index/osgb_init.png');
	}

	// 右侧窗口属性设置和显示
	function workspaceWindowSettingAndShow(title,width,animateTarget,panel){
		var pos = [Ext.getBody().getWidth() ,47];
		workspaceWindow.removeAll(false);
		workspaceWindow.setTitle(title);
		workspaceWindow.setWidth(width);
		workspaceWindow.animateTarget = animateTarget;
		workspaceWindow.setXY(pos);
		workspaceWindow.add(panel);
		workspaceWindow.show();
	}

	// 分析点击事件
	function analysisClick(){
		var title = '分析';
		var width = 80;
		var animateTarget = 'analysis';
		var panel = Ext.getCmp('analysisPanel');
		workspaceWindowSettingAndShow(title,width,animateTarget,panel);
//		Ext.get('workspaceWindow').on({mouseenter:workspaceWindowMouseenter});
//		Ext.get('workspaceWindow').on({mouseleave:workspaceWindowMouseleave});
		setFocus();
	}

	// 量算点击事件
	function measureClick(){
		var title = '量算';
		var width = 80;
		var animateTarget = 'measure';
		var panel = Ext.getCmp('measurePanel');
		workspaceWindowSettingAndShow(title,width,animateTarget,panel);
//		Ext.get('workspaceWindow').on({mouseenter:workspaceWindowMouseenter});
//		Ext.get('workspaceWindow').on({mouseleave:workspaceWindowMouseleave});
		setFocus();
	}

	// 倾斜摄影点击事件
	function osgbClick(){
		var title = '倾斜摄影';
		var width = 80;
		var animateTarget = 'osgb';
		var panel = Ext.getCmp('osgbPanel');
		workspaceWindowSettingAndShow(title,width,animateTarget,panel);
//		Ext.get('workspaceWindow').on({mouseenter:workspaceWindowMouseenter});
//		Ext.get('workspaceWindow').on({mouseleave:workspaceWindowMouseleave});
		setFocus();
	}


	// 打开场景属性窗口
	function scenePropertiesWindowShow(){
		var title = '场景属性';
		var width = 370;
		var animateTarget = 'sceneProperties';
		var panel = Ext.getCmp('scenePropertiesPanel');
		workspaceWindowSettingAndShow(title,width,animateTarget,panel);
//		Ext.get('workspaceWindow').un({mouseenter:workspaceWindowMouseenter});
//		Ext.get('workspaceWindow').un({mouseleave:workspaceWindowMouseleave});
		setFocus();
	}

	// 打开立体设置窗口
	function stereoSettingWindowShow(){
		var title = '立体设置';
		var width = 370;
		var animateTarget = 'stereoSetting';
		var panel = Ext.getCmp('stereoSettingPanel');
		workspaceWindowSettingAndShow(title,width,animateTarget,panel);
//		Ext.get('workspaceWindow').un({mouseenter:workspaceWindowMouseenter});
//		Ext.get('workspaceWindow').un({mouseleave:workspaceWindowMouseleave});
		setFocus();
	}

	// 打开太阳阴影窗口
	function sunEffectsWindowShow(){
		var title = '太阳阴影';
		var width = 330;
		var animateTarget = 'sunEffects';
		var panel = Ext.getCmp('sunEffectsPanel');
		workspaceWindowSettingAndShow(title,width,animateTarget,panel);
//		Ext.get('workspaceWindow').un({mouseenter:workspaceWindowMouseenter});
//		Ext.get('workspaceWindow').un({mouseleave:workspaceWindowMouseleave});
		setFocus();
	}

	// 打开飞行窗口
	function flyManagementWindowShow(){
		var title = '飞行';
		var width = 320;
		var animateTarget = 'flyManagement';
		var panel = Ext.getCmp('flyManagementPanel');
		workspaceWindowSettingAndShow(title,width,animateTarget,panel);
//		Ext.get('workspaceWindow').un({mouseenter:workspaceWindowMouseenter});
//		Ext.get('workspaceWindow').un({mouseleave:workspaceWindowMouseleave});
		setFocus();
	}

	// 展开poi搜索窗口
	function poiSearchWindowShow(){
		leftWindow.removeAll(false);
		leftWindow.setTitle('搜索');
		leftWindow.setWidth(300);
		//leftWindow.setHeight(410);
		leftWindow.animateTarget = 'poiSearch';
		leftWindow.showAt(3,45);
		leftWindow.add(Ext.getCmp('poiSearchPanel'));
		setFocus();
	}

	// 展开导览窗口
	function layerGuideWindowShow(){
		leftWindow.removeAll(false);
		leftWindow.setTitle('服务列表');
		leftWindow.setWidth(280);
		//leftWindow.setHeight(410);
		leftWindow.animateTarget = 'layerGuide';
		leftWindow.showAt(3,45);
		leftWindow.add(Ext.getCmp('layerGuidePanel'));
		setFocus();
	}

	// 展开图层查看器窗口
	function layerSearchWindowShow(){
		leftWindow.removeAll(false);
		leftWindow.setTitle('图层');
		leftWindow.setWidth(300);
		//leftWindow.setHeight(455);
		leftWindow.animateTarget = 'layerSearch';
		leftWindow.showAt(3,45);
		leftWindow.add(Ext.getCmp('layerSearchPanel'));
		setFocus();
	}

	// 展开服务列表窗口
	function sceneListWindowShow(){
		leftWindow.removeAll(false);
		leftWindow.setTitle('底图');
		leftWindow.setWidth(300);
		//leftWindow.setHeight(420);
		leftWindow.animateTarget = 'sceneList';
		leftWindow.showAt(3,45);
		leftWindow.add(Ext.getCmp('sceneListPanel'));
		setFocus();
	}

	//控件初始化完成后的回调函数，初始化完成之后才能进行数据加载
	function initCallback()
	{
		scene = sceneControl.get_scene();
		scene.open(sceneUrl,sceneName);
		var camera = new SuperMap.Web.Realspace.Camera(115.16703018774997, 23.637063992302448, 1200);
		camera.set_heading(359.57397649293989);
		camera.set_tilt(45);
		camera.set_altitudeMode(1);
		//scene.get_flyingOperator().flyTo(camera,2000,10);
		tabpanelMask.hide();
		workspaceWindow.showAt(Ext.getBody().getWidth(),47);
		
		Ext.getCmp('flyManagement_flyRoutesPath').setValue(flyRoutesDir+'zijin.fpf');
	}

	//控件初始化失败后的回调函数
	function failedCallback()
	{
		alert("Realspace initialized failed!");
		tabpanelMask.hide();
	}
});
