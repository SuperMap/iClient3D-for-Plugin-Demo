/**
 * 图层管理器
 */

Ext.onReady(function() {

	var layerSearchStore = Ext.create('Ext.data.TreeStore', {
	    fields:['name','iconCls','longitude','latitude','altitude','heading','refLayer','leaf']
	});
	
	var layerSearchPanel = Ext.create('Ext.tree.Panel', {
		id:'layerSearchPanel',
		height:410,
		border:0,
		bodyStyle :"overflow-x:hidden",
		rowLines:false,
		rootVisible:false,
		forceFit: true,
		useArrows:true,
		store: layerSearchStore,
		hideHeaders:true,
		columns: [{
			xtype: 'treecolumn',
            dataIndex: 'name',
            sortable: true
		}]
	});
	
	var layerSearch_nodemenu = Ext.create('Ext.menu.Menu', {
		id:'layerSearch_nodemenu',
		items: [{
			id:'layerSearch_nodemenu_fly',
			text: '定位'
		}]
	});
	
	Ext.getCmp('layerSearchPanel').addListener('added',layerSearchPanelAdd);
	Ext.getCmp('layerSearchPanel').addListener('itemdblclick',layerSearchPanelItemdblclick);
	Ext.getCmp('layerSearchPanel').addListener('itemcontextmenu',layerSearchPanelItemcontextmenu);
	Ext.getCmp('layerSearch_nodemenu_fly').addListener('click',nodemenuFlyClick);
	Ext.getCmp('layerSearchPanel').addListener('checkchange',layerSearchPanelCheckchange);
	Ext.getCmp('layerSearchPanel').addListener('itemclick',setFocus);
	Ext.getCmp('layerSearchPanel').addListener('itemcollapse',setFocus);
	Ext.getCmp('layerSearchPanel').addListener('itemexpand',setFocus);
	Ext.getCmp('layerSearchPanel').addListener('containerclick',setFocus);
	
	// 图层列表复选框改变事件
	function layerSearchPanelCheckchange(node, checked, eOpts){
		setFocus();
		setChildNodesCheckState(node,checked);
		setParentNodeCheckState(node,checked);
	}
	
	// 设置父节点复选框状态
	function setParentNodeCheckState(node,checked){
		var parentNode = node.parentNode;
		if(!parentNode){
			return;
		}
		if(checked){
			parentNode.set('checked',true);
			setParentNodeCheckState(parentNode,true);
		}else{
			var checkedTmp = true;
			var childNodes = parentNode.childNodes;
			var length = childNodes.length;
			for(var i=0;i<length;i++){
				var childNode = childNodes[i];
				checkedTmp = childNode.get('checked');
				if(checkedTmp){
					break;
				}
			}
			parentNode.set('checked',checkedTmp);
			setParentNodeCheckState(parentNode,checkedTmp);
		}
	}
	
	// 设置子节点复选框选择状态
	function setChildNodesCheckState(node,checked){
		var leaf = node.data.leaf;
		if(leaf){
			var refLayer = node.data.refLayer;
			var layer3D = scene.get_layer3Ds().get_item(refLayer);
			if(layer3D){
				layer3D.set_isVisible(checked);
			}
		}
		else{
			node.eachChild(function(childNode){
				childNode.set('checked',checked);
				setChildNodesCheckState(childNode,checked);
			});
		}
	}
	
	// 节点定位
	function nodemenuFlyClick(){
		setFocus();
		var selNode = Ext.getCmp('layerSearchPanel').getSelectionModel().selected.items[0];
		var longitude = selNode.data.longitude;
		var latitude = selNode.data.latitude;
		var altitude = selNode.data.altitude;
		var heading = selNode.data.heading;
		var refLayer = selNode.data.refLayer;
		if(longitude){
			var fromCamera = scene.get_firstPersonCamera();
			var toCamera = new SuperMap.Web.Realspace.Camera(longitude, latitude, altitude);
			toCamera.set_heading(heading);
			fly(fromCamera,toCamera);
		}else if(refLayer){
			var layer3D = scene.get_layer3Ds().get_item(refLayer);
			scene.get_flyingOperator().flyToBounds(layer3D.get_bounds(),2000);
		}
	}
	
	// 右键树节点事件
	function layerSearchPanelItemcontextmenu(t, record, item, index, e, eOpts){
		setFocus();
		e.preventDefault();  
        e.stopEvent();
        if(record.get('longitude')||record.get('refLayer')){
        	Ext.getCmp('layerSearch_nodemenu').showAt(e.getXY());
        }
	}
	
	// 树结构节点双击事件
	function layerSearchPanelItemdblclick(t, record, item, index, e, eOpts){
		setFocus();
		var longitude = record.get('longitude');
		var latitude = record.get('latitude');
		var altitude = record.get('altitude');
		var heading = record.get('heading');
		var refLayer = record.get('refLayer');
		if(longitude){
			var fromCamera = scene.get_firstPersonCamera();
			var toCamera = new SuperMap.Web.Realspace.Camera(longitude, latitude, altitude);
			toCamera.set_heading(heading);
			fly(fromCamera,toCamera);
		}else if(refLayer){
			var layer3D = scene.get_layer3Ds().get_item(refLayer);
			if(layer3D){
				scene.get_flyingOperator().flyToBounds(layer3D.get_bounds(),2000);
			}
		}
	}
	
	// 图层查询器初始化事件
	function layerSearchPanelAdd(t, container, pos, eOpts){
		setFocus();
		layerSearchPanel.getRootNode().removeAll();
		var xmlFile = layerSearchXmlUrl; 
		var xmlDoc = createXmlDoc(xmlFile);
		if(!xmlDoc){
			return false;
		}
		var folderNodes;
		if (window.ActiveXObject) { // IE
			folderNodes = xmlDoc.documentElement.getElementsByTagName("Folders");
		} else { // 非IE
			folderNodes = xmlDoc.getElementsByTagName("Folders");
		}
		var folderArr = [];
		folderArr.push(folderNodes[0]);
		var rootNode = Ext.getCmp('layerSearchPanel').getRootNode();
		loadTree(rootNode,folderArr);
		if (rootNode.childNodes.length > 0) {
			rootNode.childNodes[0].expand();
		}
	}
	
	// 递归加载树节点
	function loadTree(parentTreeNode,folderArr){
		for(var i=0;i<folderArr.length;i++){
			var folderNode = folderArr[i];
			var childNodes = folderNode.childNodes;
			var name = null;
			var longitude = null;
			var latitude = null;
			var altitude = null;
			var heading = null;
			var refLayer = null;
			var leaf = true;
			var icon = null;
			var childFolderIndexArr = [];
			for(var j=0;j<childNodes.length;j++){
				var childNode = childNodes[j];
				var nodeName = childNode.nodeName;
				if(nodeName == 'name'){
					name = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'Folder' || nodeName == 'Layer'){
					childFolderIndexArr.push(j);
					leaf = false;
				}else if(nodeName == 'Icon'){
					var iconChildNodes = childNode.childNodes;
					for(var k=0;k<iconChildNodes.length;k++){
						var nodeName = iconChildNodes[k].nodeName;
						if(nodeName == 'href'){
							icon = imageDir + iconChildNodes[k].childNodes[0].nodeValue;
							break;
						}
					}
				}else if(nodeName == 'refLayer'){
					refLayer = childNode.childNodes[0].nodeValue;
				}else if(nodeName == 'Camera'){
					var cameraNodes = childNode.childNodes;
					for(var k=0;k<cameraNodes.length;k++){
						var cameraNodeName = cameraNodes[k].nodeName;
						if(cameraNodeName == 'longitude'){
							longitude = cameraNodes[k].childNodes[0].nodeValue;
						}else if(cameraNodeName == 'latitude'){
							latitude = cameraNodes[k].childNodes[0].nodeValue;
						}else if(cameraNodeName == 'altitude'){
							altitude = cameraNodes[k].childNodes[0].nodeValue;
						}else if(cameraNodeName == 'heading'){
							heading = cameraNodes[k].childNodes[0].nodeValue;
						}
					}
				}
			}
			var childTreeNode = parentTreeNode.insertChild(i,{
				name:name,
				icon:icon,
				leaf:leaf,
				longitude:longitude,
				latitude:latitude,
				altitude:altitude,
				heading:heading,
				refLayer:refLayer,
				checked:true
			});
			var childFolderArr = [];
			for(var k=0;k<childFolderIndexArr.length;k++){
				var childFolderIndex = childFolderIndexArr[k];
				var folderNode = childNodes[childFolderIndex];
				childFolderArr.push(folderNode);
			}
			loadTree(childTreeNode,childFolderArr);
		}
	}
	
});

