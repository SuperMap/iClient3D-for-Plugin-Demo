/**
 * 场景属性
 */

Ext.onReady(function() {
	
	var scenePropertiesPanel = Ext.create('Ext.panel.Panel',{
		id:'scenePropertiesPanel',
		bodyPadding:5,
		layout:'anchor',
		border:0,
		defaults:{
			labelWidth:150,
			border:0
		},
		items:[{
			layout:'hbox',
			defaults:{
				align:'center',
				width:180
			},
			items:[{
				id:'sceneProperties_navigation',
				xtype:'checkbox',
				boxLabel:'导航罗盘'
			},{
				id:'sceneProperties_fps',
				xtype:'checkbox',
				boxLabel:'帧率信息'
			}]
		},{
			layout:'hbox',
			defaults:{
				align:'center',
				width:180
			},
			items:[{
				id:'sceneProperties_ocean',
				xtype:'checkbox',
				boxLabel:'海洋水体'
			},{
				id:'sceneProperties_grid',
				xtype:'checkbox',
				boxLabel:'经纬网'
			}]
		},{
			layout:'hbox',
			defaults:{
				align:'center',
				width:180
			},
			items:[{
				id:'sceneProperties_gridText',
				xtype:'checkbox',
				boxLabel:'经纬网标签'
			}]
		}]
	});
	
	Ext.getCmp('scenePropertiesPanel').addListener('added',init);
	Ext.getCmp('sceneProperties_navigation').addListener('change',navigationChange);
	Ext.getCmp('sceneProperties_ocean').addListener('change',oceanChange);
	Ext.getCmp('sceneProperties_grid').addListener('change',gridChange);
	Ext.getCmp('sceneProperties_gridText').addListener('change',gridTextChange);
	Ext.getCmp('sceneProperties_fps').addListener('change',fpsChange);
	
	// 帧率改变
	function fpsChange(){
		var checked = Ext.getCmp('sceneProperties_fps').checked;
		if(checked){
			sceneControl.set_isFPSVisible(true);
		}else{
			sceneControl.set_isFPSVisible(false);
		}
	}	
	
	// 经纬网标签改变
	function gridTextChange(){
		var checked = Ext.getCmp('sceneProperties_gridText').checked;
		if(checked){
			scene.get_sceneOption().set_isLatLonGridTextVisible(true);
		}else{
			scene.get_sceneOption().set_isLatLonGridTextVisible(false);
		}
	}
	
	// 经纬网改变
	function gridChange(){
		var checked = Ext.getCmp('sceneProperties_grid').checked;
		if(checked){
			scene.get_sceneOption().set_isLatLonGridVisible(true);
			Ext.getCmp('sceneProperties_gridText').setDisabled(false);
			gridTextChange();
		}else{
			scene.get_sceneOption().set_isLatLonGridVisible(false);
			Ext.getCmp('sceneProperties_gridText').setDisabled(true);
		}
	}
	
	// 海洋水体改变
	function oceanChange(){
		var checked = Ext.getCmp('sceneProperties_ocean').checked;
		if(checked){
			scene.get_sceneOption().set_isOceanVisible(true);
		}else{
			scene.get_sceneOption().set_isOceanVisible(false);
		}
	}
	
	// 导航罗盘改变
	function navigationChange(){
		var checked = Ext.getCmp('sceneProperties_navigation').checked;
		if(checked){
			scene.get_sceneOption().set_isControlPlaneVisible(true);
		}else{
			scene.get_sceneOption().set_isControlPlaneVisible(false);
		}
	}
	
	// 界面初始化
	function init(){
		var isControlPlaneVisible = scene.get_sceneOption().get_isControlPlaneVisible();
		var isFPSVisible = sceneControl.get_isFPSVisible();
		var isOceanVisible = scene.get_sceneOption().get_isOceanVisible()
		var isLatLonGridVisible = scene.get_sceneOption().get_isLatLonGridVisible();
		var isLatLonGridTextVisible = scene.get_sceneOption().get_isLatLonGridTextVisible()
		
		Ext.getCmp('sceneProperties_navigation').setValue(isControlPlaneVisible);
		Ext.getCmp('sceneProperties_fps').setValue(isFPSVisible);
		Ext.getCmp('sceneProperties_ocean').setValue(isOceanVisible);
		Ext.getCmp('sceneProperties_grid').setValue(isLatLonGridVisible);
		Ext.getCmp('sceneProperties_gridText').setValue(isLatLonGridTextVisible);
		
	}
	
});