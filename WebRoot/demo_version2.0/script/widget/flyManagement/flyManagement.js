/**
 * 飞行管理
 */

Ext.onReady(function() {
	
	var flyRoutesStore = Ext.create('Ext.data.Store',{
	    fields:['text','value'],
	    data:[{text:'紫金',value:flyRoutesDir+'zijin.fpf'}]
	});

	var flyManagementPanel = Ext.create('Ext.panel.Panel',{
		id:'flyManagementPanel',
		layout:'hbox',
		bodyPadding:5,
		border:0,
		items:[{
			id:'flyManagement_flyRoutesPath',
			xtype:'combo',
			labelWidth:'83px',
			fieldLabel:'飞行路线',
			queryMode:'local',
			displayField:'text',
			valueField:'value',
			triggerAction:'all',
			editable:false,
			store:flyRoutesStore
		}],
		tbar:[{
			id:'flyManagement_play',
			text:'播放',
			iconCls:'icon_routePlay'
		},{
			id:'flyManagement_pause',
			text:'暂停',
			iconCls:'icon_routePause',
			hidden:true
		},'-',{
			id:'flyManagement_stop',
			text:'停止',
			iconCls:'icon_routeStop'
		},'-',{
			id:'flyManagement_plus',
			text:'加速',
			iconCls:'icon_routePlus',
			disabled:true
		},'-',{
			id:'flyManagement_subtraction',
			text:'减速',
			iconCls:'icon_routeSubtraction',
			disabled:true
		}]
	});
	
	Ext.getCmp('flyManagement_flyRoutesPath').addListener('change',flyRoutesPathChange);
	Ext.getCmp('flyManagement_play').addListener('click',playClick);
	Ext.getCmp('flyManagement_stop').addListener('click',stopClick);
	Ext.getCmp('flyManagement_subtraction').addListener('click',subtractionClick);
	Ext.getCmp('flyManagement_plus').addListener('click',plusClick);
	Ext.getCmp('flyManagement_pause').addListener('click',pauseClick);
	
	var playRate = 1;
	
	// 暂停按钮点击事件
	function pauseClick(){
		setFocus();
		var flyManager = scene.get_flyManager();
		var routes = flyManager.get_routes();
		if(routes.get_count() == 0){
			return;
		}
		flyManager.pause();
		Ext.getCmp('flyManagement_play').show();
		Ext.getCmp('flyManagement_pause').hide();
	}
	
	// 加速按钮点击事件
	function plusClick(){
		setFocus();
		var flyManager = scene.get_flyManager();
		var routes = flyManager.get_routes();
		if(routes.get_count() == 0){
			return;
		}
		if(playRate == 100){
			return;
		}
		if(playRate < 1){
			playRate = Number(playRate) + 0.1;
			if(playRate == 1){
				playRate = playRate.toFixed(0);
			}else{
				playRate = playRate.toFixed(1);
			}
		}else{
			playRate = Number(playRate) + 1;
			playRate = playRate.toFixed(0);
		}
		flyManager.set_playRate(playRate);
	}
	
	// 减速按钮点击事件
	function subtractionClick(){
		setFocus();
		var flyManager = scene.get_flyManager();
		var routes = flyManager.get_routes();
		if(routes.get_count() == 0){
			return;
		}
		if(playRate == 0.1){
			return;
		}
		if(playRate <= 1){
			playRate = playRate - 0.1;
			playRate = playRate.toFixed(1);
		}else{
			playRate = playRate - 1;
			playRate = playRate.toFixed(0);
		}
		flyManager.set_playRate(playRate);
	}
	
	// 播放按钮点击事件
	function playClick(){
		setFocus();
		var flyManager = scene.get_flyManager();
		var routes = flyManager.get_routes();
		if(routes.get_count() == 0){
			return;
		}
		flyManager.play();
		Ext.getCmp('flyManagement_play').hide();
		Ext.getCmp('flyManagement_pause').show();
		Ext.getCmp('flyManagement_flyRoutesPath').setDisabled(true);
		Ext.getCmp('flyManagement_plus').setDisabled(false);
		Ext.getCmp('flyManagement_subtraction').setDisabled(false);
		judgeIsFlyStop(flyManager);
	}
	
	// 判断是否飞行停止结束
	function judgeIsFlyStop(flyManager){
		var timeObj = setInterval(function(){
			var flyStatus = flyManager.get_flyStatus();
			if(flyStatus == SuperMap.Web.Realspace.FlyStatus.FSTOP){
			  	window.clearInterval(timeObj);
			  	Ext.getCmp('flyManagement_play').show();
				Ext.getCmp('flyManagement_pause').hide();
				Ext.getCmp('flyManagement_flyRoutesPath').setDisabled(false);
				Ext.getCmp('flyManagement_plus').setDisabled(true);
				Ext.getCmp('flyManagement_subtraction').setDisabled(true);
			}
		},500);
	}
	
	// 停止按钮点击事件
	function stopClick(){
		setFocus();
		var flyManager = scene.get_flyManager();
		var routes = flyManager.get_routes();
		if(routes.get_count() == 0){
			return;
		}
		flyManager.stop();
		Ext.getCmp('flyManagement_play').show();
		Ext.getCmp('flyManagement_pause').hide();
		Ext.getCmp('flyManagement_flyRoutesPath').setDisabled(false);
		Ext.getCmp('flyManagement_plus').setDisabled(true);
		Ext.getCmp('flyManagement_subtraction').setDisabled(true);
	}
	
	// 飞行路线设置按钮点击事件
	function flyRoutesPathChange(t,newValue,oldValue,eOpts){
		setFocus();
		var flyRoutesPath = newValue;
		var flyRoutes = scene.get_flyManager().get_routes();
		if (flyRoutes.fromFile(flyRoutesPath) == false) {
            return false;
        }
	}
	
});