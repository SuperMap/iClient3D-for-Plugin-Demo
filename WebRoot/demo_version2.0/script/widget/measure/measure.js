/**
 *	量算panel 
 */

Ext.onReady(function() {
	
	var measurePanel = Ext.create('Ext.panel.Panel', {
		id:'measurePanel',
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
			id:'measure_spatialDis',
			xtype:'image',
			src: imageDir+'/measure/spatialDis.png',
			overCls:'imageOverClsWithBorder',
			width:46,
			height:46,
			listeners: {
		        el: {
		            click: function() {
		                spatialDisClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'空间距离'
		},{
			id:'measure_terrainDis',
			xtype:'image',
			src: imageDir+'/measure/terrainDis.png',
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
		                terrainDisClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'依地距离'
		},{
			id:'measure_horizontalDis',
			xtype:'image',
			src: imageDir+'/measure/horizontalDis.png',
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
		                horizontalDisClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'水平距离'
		},{
			id:'measure_terrainArea',
			xtype:'image',
			src: imageDir+'/measure/terrainArea.png',
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
		                terrainAreaClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'依地面积'
		},{
			id:'measure_spatialArea',
			xtype:'image',
			src: imageDir+'/measure/spatialArea.png',
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
		                spatialAreaClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'空间面积'
		},{
			id:'measure_height',
			xtype:'image',
			src: imageDir+'/measure/height.png',
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
		                heightClick();
		            }
		        }
		    }
		},{
			xtype:'tbtext',
			text:'高程量算'
		},{
			id:'measure_clear',
			xtype:'image',
			src: imageDir+'/measure/clear.png',
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
	
	Ext.getCmp('measurePanel').addListener('added',init);
	
	var measureClass = null;
	
	// 界面初始化
	function init(){
		measureClass = new SuperMap.Web.UI.Action3Ds.MeasureClass(sceneControl);	
	}
	
	// 空间距离
	function spatialDisClick(){
		if(measureClass){
			measureClass.measureSpatialDis();
		}
		setFocus();
	}
	
	// 依地距离
	function terrainDisClick(){
		measureClass.measurerTerrainDis();
		setFocus();
	}
	
	// 水平距离
	function horizontalDisClick(){
		measureClass.measureHorizontalDistance();
		setFocus();
	}
	
	// 依地面积
	function terrainAreaClick(){
		measureClass.measurerTerrainArea();
		setFocus();
	}
	
	// 空间面积
	function spatialAreaClick(){
		measureClass.measureSpatialArea();
		setFocus();
	}
	
	// 高程量算
	function heightClick(){
		measureClass.measureHeight();
		setFocus();
	}
	
	// 清除
	function clearClick(){
		measureClass.measure_clearAll();
		setFocus();
	}
	
});