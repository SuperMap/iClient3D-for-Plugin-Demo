/**
 * 导航栏panel
 */

Ext.onReady(function() {

	var sceneListPanel = Ext.create('Ext.panel.Panel',{
		id:'sceneListPanel',
		layout:'column',
		border:0,
		defaults:{
			border:0		
		},
		items:[{
			id:'sceneList_left',
			columnWidth:0.5,
			defaults:{
				border:0
			}
		},{
			id:'sceneList_right',
			columnWidth:0.5,
			defaults:{
				border:0		
			}
		}]
	});
	
	Ext.getCmp('sceneListPanel').addListener('added',init);
	
	function init(){
		Ext.getCmp('sceneList_left').removeAll();
		Ext.getCmp('sceneList_right').removeAll();
		var xmlFile = sceneListXmlUrl; 
		var xmlDoc = createXmlDoc(xmlFile);
		if(!xmlDoc){
			return false;
		}
		var sceneArr;
		if (window.ActiveXObject) { // IE
			sceneArr = xmlDoc.documentElement.getElementsByTagName("scene");
		} else { // 非IE
			sceneArr = xmlDoc.getElementsByTagName("scene");
		}
		for(var i=0;i<sceneArr.length;i++){
			var name = null;
			var imageUrl = null;
			var sceneUrl = null;
			var sceneName = null;
			var type = null;
			var layerName = null;
			var childNodes = sceneArr[i].childNodes;
			for(var k=0;k<childNodes.length;k++){
				var childNode = childNodes[k];
				var nodeName = childNode.nodeName;
				if(nodeName == 'name'){
					name = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'imageUrl'){
					imageUrl = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'sceneUrl'){
					sceneUrl = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'sceneName'){
					sceneName = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'type'){
					type = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'layerName'){
					layerName = childNode.childNodes[0].nodeValue;
				}
			}
			var targetId = i%2 == 0?'sceneList_left':'sceneList_right';
			loadImage(targetId,name,imageUrl,sceneUrl,sceneName,type,layerName);
		}
	}
	
	function loadImage(targetId,name,imageUrl,sceneUrl,sceneName,type,layerName){
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
			                imageClick(sceneUrl,sceneName,type,layerName,imagePanel);
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
		
		addSelectImageByLayers(imagePanel,layerName);
	}
	
	// 根据图层存在与否显示已选择图标
	function addSelectImageByLayers(imagePanel,layerName){
		var layer3d = scene.get_layer3Ds().get_item(layerName);
		if(layer3d){
			var selectImagePanel = Ext.create('Ext.Img', {
				src: imageDir + 'correct.png',
				style:{
					marginTop:'-20px',
					marginLeft:'105px'
				}
			});
			imagePanel.add(selectImagePanel);
		}else{
			var comp = imagePanel.getComponent(1);
			if(comp){
				imagePanel.remove(comp);
			}
		}
	}
	
	function imageClick(sceneUrl,sceneName,type,layerName,imagePanel){
		setFocus();
		var layer3d = scene.get_layer3Ds().get_item(layerName);
		if(layer3d){
			scene.get_layer3Ds().removeAt(layerName);
		}else{
			if(type == 'iserver'){
				scene.open(sceneUrl,sceneName);
			}else if(type == 'WMTS'){
				var layer3DTianditu = new SuperMap.Web.Realspace.Layer3DTianditu(sceneUrl,layerName,layerName,96,SuperMap.Web.Realspace.ImageType.JPGPNG);
	            scene.get_layer3Ds().insert(layer3DTianditu);
			}
		}
		addSelectImageByLayers(imagePanel,layerName);
	}
	
});