/**
 * 导航栏panel
 */

Ext.onReady(function() {

	var layerGuidePanel = Ext.create('Ext.panel.Panel',{
		id:'layerGuidePanel',
		layout:'column',
		border:0,
		defaults:{
			border:0		
		},
		items:[{
			id:'layerGuide_left',
			columnWidth:0.5,
			defaults:{
				border:0
			}
		},{
			id:'layerGuide_right',
			columnWidth:0.5,
			defaults:{
				border:0		
			}
		}]
	});
	
	Ext.getCmp('layerGuidePanel').addListener('added',init);
	
	function init(){
		Ext.getCmp('layerGuide_left').removeAll();
		Ext.getCmp('layerGuide_right').removeAll();
		var xmlFile = layerGuideXmlUrl; 
		var xmlDoc = createXmlDoc(xmlFile);
		if(!xmlDoc){
			return false;
		}
		var cameraArr;
		if (window.ActiveXObject) { // IE
			cameraArr = xmlDoc.documentElement.getElementsByTagName("camera");
		} else { // 非IE
			cameraArr = xmlDoc.getElementsByTagName("camera");
		}
		for(var i=0;i<cameraArr.length;i++){
			var name = null;
			var imageUrl = null;
			var longitude = null;
			var latitude = null;
			var altitude = null;
			var heading = null;
			var tilt = null;
			var altitudeMode = null;
			var osgb = null;
			var flat = null;
			var vector = null;
			var theme = null;
			var flyRoute = null;
			var sun = null;
			var childNodes = cameraArr[i].childNodes;
			for(var k=0;k<childNodes.length;k++){
				var childNode = childNodes[k];
				var nodeName = childNode.nodeName;
				if(nodeName == 'name'){
					name = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'imageUrl'){
					imageUrl = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'longitude'){
					longitude = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'latitude'){
					latitude = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'altitude'){
					altitude = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'heading'){
					heading = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'tilt'){
					tilt = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'altitudeMode'){
					altitudeMode = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'osgb'){
					osgb = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'flat'){
					flat = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'vector'){
					vector = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'theme'){
					theme = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'flyRoute'){
					flyRoute = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'sun'){
					sun = childNode.childNodes[0].nodeValue;
				}
			}
			var targetId = i%2 == 0?'layerGuide_left':'layerGuide_right';
			loadImage(targetId,name,imageUrl,longitude,latitude,altitude,heading,tilt,altitudeMode,osgb,flat,vector,theme,flyRoute,sun);
		}
	}
	
	function loadImage(targetId,name,imageUrl,longitude,latitude,altitude,heading,tilt,altitudeMode,osgb,flat,vector,theme,flyRoute,sun){
		var imagePanel = Ext.create('Ext.panel.Panel', {
			height:100,
			border:0,
			items:[{
				xtype:'image',
				src: imageUrl,
				width:120,
				height:80,
				overCls:'imageOverClsWithBorder',
				style:{
					marginTop:'17px',
					marginLeft:'10px'
				},
				listeners: {
			        el: {
			            click: function() {
			            	flatGlobal = flat;
			            	vectorGlobal = vector;
			            	themeGlobal = theme;
			                loadFlyRoute(name,flyRoute);
			                sunSetting(sun);
			                if(placeNameGlobal != name){
			                	placeNameGlobal = name;
			                	location(longitude,latitude,altitude,heading,tilt,altitudeMode,osgb);
			                }
			            }
			        }
			    }
			}]
		});
		var textPanel = Ext.create('Ext.toolbar.TextItem', {
			text:name,
			style:{
				textAlign:'center'
			}
		});
		Ext.getCmp(targetId).add(imagePanel);
		Ext.getCmp(targetId).add(textPanel);
	}
	
	// 定位
	function location(longitude,latitude,altitude,heading,tilt,altitudeMode,osgb){
		setFocus();
		Ext.getCmp('leftWindow').hide();
		var fromCamera = scene.get_firstPersonCamera();
		var toCamera = new SuperMap.Web.Realspace.Camera(longitude, latitude, altitude);
		toCamera.set_heading(heading);
		toCamera.set_tilt(tilt);
		toCamera.set_altitudeMode(altitudeMode);
		var flyTime = fly(fromCamera,toCamera);
		if(osgb == 'true'){
			setTimeout(function(){
				Ext.getCmp('workspaceWindow').removeAll(false);
				Ext.getCmp('workspaceWindow').setTitle('倾斜摄影');
				Ext.getCmp('workspaceWindow').setWidth(80);
				Ext.getCmp('workspaceWindow').showAt(Ext.getBody().getWidth()-80,47);
				Ext.getCmp('workspaceWindow').add(Ext.getCmp('osgbPanel'));
				Ext.getCmp('osgb').show();
				setFocus();
			},flyTime);
		}else{
			Ext.getCmp('osgb').hide();
			var osgbPanel = Ext.getCmp('workspaceWindow').getComponent('osgbPanel');
			if(osgbPanel){
				Ext.getCmp('workspaceWindow').hide();
			}
		}
	}
	
	// 加载飞行路线
	function loadFlyRoute(name,flyRoute){
		var comp = Ext.getCmp('flyManagement_flyRoutesPath');
		var store = comp.getStore();
		store.removeAll();
		store.insert(0,[{text:name,value:flyRoutesDir+flyRoute}]);
		comp.setValue(flyRoutesDir+flyRoute);
	}
	
	// 设置是否开启太阳
	function sunSetting(sun){
		scene.get_sun().set_isVisible(sun);
	}
	
});