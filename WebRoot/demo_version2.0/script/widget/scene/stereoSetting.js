/**
 * 立体设置
 */

Ext.onReady(function() {
	
	var stereoMode_store = Ext.create('Ext.data.Store',{
	    fields:['text','value'],
	    data:[{text:'非立体',value:'非立体'},
	    	  {text:'互补色立体',value:'互补色立体'},
	    	  {text:'水平跨越式立体',value:'水平跨越式立体'},
	    	  {text:'四缓存式立体',value:'四缓存式立体'},
	    	  {text:'垂直跨越式立体',value:'垂直跨越式立体'}]
	});
	
	var parallax_store = Ext.create('Ext.data.Store',{
		fields:['text','value'],
		data:[{text:'负视差',value:'负视差'},
			  {text:'正视差',value:'正视差'}]
	});
	
	var stereoSettingPanel = Ext.create('Ext.panel.Panel',{
		id:'stereoSettingPanel',
		bodyPadding:5,
		border:0,
		defaults:{
			labelWidth:150
		},
		bodyStyle:'border-color:#EBEBEB',
		items:[{
			id:'sceneProperties_stereoMode',
			xtype:'combo',
			fieldLabel:'立体模式',
			queryMode:'local',
			displayField:'text',
			valueField:'value',
			triggerAction:'all',
			editable:false,
			store:stereoMode_store,
			value:'非立体'
		},{
			id:'sceneProperties_parallax',
			xtype:'combo',
			fieldLabel:'视差模式',
			queryMode:'local',
			displayField:'text',
			valueField:'value',
			triggerAction:'all',
			editable:false,
			store:parallax_store,
			value:'负视差',
			disabled:true
		},{
			id:'sceneProperties_cameraSeparation',
			xtype:'numberfield',
			fieldLabel:'深度(毫米)',
			allowDecimals: false,
			maxValue:1000,
			minValue:-1000,
			value:50,
			disabled:true
		},{
			id:'sceneProperties_cameraAngle',
			xtype:'textfield',
			fieldLabel:'视角(度)',
			value:-0.012,
			disabled:true
		}]
	});
	
	Ext.getCmp('sceneProperties_stereoMode').addListener('change',stereoModeChange);
	Ext.getCmp('sceneProperties_parallax').addListener('change',parallaxChange);
	Ext.getCmp('sceneProperties_cameraSeparation').addListener('change',cameraSeparationChange);
	Ext.getCmp('sceneProperties_cameraAngle').addListener('change',cameraAngleChange);
	
	// 视角改变
	function cameraAngleChange(){
		var steroe = scene.get_stereo();
		var cameraAngleValue = Ext.getCmp('sceneProperties_cameraAngle').getValue();
		steroe.set_cameraAngle(cameraAngleValue);
	}
	
	// 深度改变
	function cameraSeparationChange(){
		if(!Ext.getCmp('sceneProperties_cameraSeparation').isValid()){
			return;
		}
		var cameraSeparationValue = Ext.getCmp('sceneProperties_cameraSeparation').getValue();
		var steroe = scene.get_stereo();
		steroe.set_cameraSeparation(cameraSeparationValue/1000);
	}
	
	// 视差模式改变
	function parallaxChange(){
		var steroe = scene.get_stereo();
		var cameraAngle = Ext.getCmp("sceneProperties_cameraAngle");
		var parallaxValue = Ext.getCmp('sceneProperties_parallax').getValue();
		if(parallaxValue == '负视差'){
			steroe.set_parallaxMode(parent.SuperMap.Web.Realspace.ParallaxMode.NegativeParallax);
			cameraAngle.setDisabled(true);
		}else if(parallaxValue == '正视差'){
			steroe.set_parallaxMode(parent.SuperMap.Web.Realspace.ParallaxMode.PositiveParallax);
			cameraAngle.setDisabled(false);
			cameraAngleChange();
		}
	}
	
	// 立体模式改变
	function stereoModeChange(){
		var parallax = Ext.getCmp('sceneProperties_parallax');
		var cameraSeparation = Ext.getCmp('sceneProperties_cameraSeparation');
		var cameraAngle = Ext.getCmp('sceneProperties_cameraAngle');
		var stereoModeValue = Ext.getCmp('sceneProperties_stereoMode').getValue();
		if(stereoModeValue == '非立体'){
			parallax.setDisabled(true);
        	cameraSeparation.setDisabled(true);
        	cameraAngle.setDisabled(true);
			var steroe = scene.get_stereo();
        	steroe.set_enable(false);
		}else if(stereoModeValue == '互补色立体'){
			parallax.setDisabled(false);
        	cameraSeparation.setDisabled(false);
        	parallaxChange();
			var steroe = scene.get_stereo();
        	steroe.set_enable(true);
        	steroe.set_stereoMode(parent.SuperMap.Web.Realspace.StereoMode.Anaglyphic);
	        steroe.set_cameraSeparation(cameraSeparation.getValue()/1000);
		}else if(stereoModeValue == '水平跨越式立体'){
			parallax.setDisabled(false);
        	cameraSeparation.setDisabled(false);
        	parallaxChange();
        	var steroe = scene.get_stereo();
	        steroe.set_enable(true);
	        steroe.set_stereoMode(parent.SuperMap.Web.Realspace.StereoMode.HorizontalSplit);
	        steroe.set_cameraSeparation(cameraSeparation.getValue()/1000);
		}else if(stereoModeValue == '四缓存式立体'){
			parallax.setDisabled(false);
        	cameraSeparation.setDisabled(false);
        	parallaxChange();
			var steroe = scene.get_stereo();
        	steroe.set_enable(true);
        	steroe.set_stereoMode(parent.SuperMap.Web.Realspace.StereoMode.QuadBuffer);
	        steroe.set_cameraSeparation(cameraSeparation.getValue()/1000);
		}else if(stereoModeValue == '垂直跨越式立体'){
			parallax.setDisabled(false);
        	cameraSeparation.setDisabled(false);
        	parallaxChange();
        	var steroe = scene.get_stereo();
	        steroe.set_enable(true);
	        steroe.set_stereoMode(parent.SuperMap.Web.Realspace.StereoMode.VerticalSplit);
	        steroe.set_cameraSeparation(cameraSeparation.getValue()/1000);
		}
	}
});