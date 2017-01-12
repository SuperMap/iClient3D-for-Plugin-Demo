/**
 * poi搜索
 */

Ext.onReady(function() {
	
	Ext.Ajax.cors = true;
	Ext.Ajax.useDefaultXhrHeader = false;

	var pageSize = 5;
	var pageNum = 1;
	var poiSign = [];
	
	Ext.define('model', {
        extend: 'Ext.data.Model',
        fields: ['name','address','location','score','telephone','uid']
    });
	
	var store = Ext.create('Ext.data.Store', {
        model: 'model',
        pageSize: pageSize,
        proxy: {
            type: 'ajax',
            url: poiUrl,
            reader: {
                root: 'poiInfos',
                totalProperty: 'totalHits'
            }
        }
    });
    
    var provinceStore = Ext.create('Ext.data.Store', {
    	fields: ['id', 'name'],
    	data : []
    });
    
    var cityStore = Ext.create('Ext.data.Store', {
	    fields: ['id', 'name'],
	    data : []
	});
    
	var pagingToolbar = Ext.create('Ext.PagingToolbar', {
		  border:0,
	      emptyMsg:"没有数据",
	      displayInfo:true,
	      store:store,
	      pageSize: pageSize
	 });
	 
	 function renderImg(value, p, record, rowIndex) {
		var pictureName;
    	switch(rowIndex){
    	case 0:
    		pictureName = 'a.png';
    		break;
    	case 1:
    		pictureName = 'b.png';
    		break;
    	case 2:
    		pictureName = 'c.png';
    		break;
    	case 3:
    		pictureName = 'd.png';
    		break;
    	case 4:
    		pictureName = 'e.png';
    		break;
    	default:
    		break;
    	}
    	var pictureurl = tomcatUrl + webName + imageDir + 'poiSearch/' + pictureName;
        return '<img src='+pictureurl+'></img>';
    }
	
	 function renderName(value, p, record) {
		var address = record.get('address');
		var telephone = record.get('telephone');
		if(telephone == null){
			telephone = '';
		}
		if(address == null){
			address = '';
		}
        return '<div title='+address+'><a href="#" style="color : #0066FF ;text-decoration : none;">'+value+'</a></br>'+'地址：'+address+'</br>电话：'+telephone+'</div>';
    }

	
	var poiSearchPanel_grid = Ext.create('Ext.grid.Panel', {
		border:0,
        header: false,
        hideHeaders:true,
        store: store,
        collapsible: false,
        collapsed:true,
        columns:[{
            width:40,
            renderer: renderImg
        },{
        	width:250,
            dataIndex: 'name',
            sortable: false,
            renderer: renderName
        }],
        bbar: pagingToolbar,
        style:{
        	marginTop:'10px'
        }
    });
	
	var poiSearchPanel_Top = Ext.create('Ext.panel.Panel',{
		id:'poiSearchPanel_Top',
		items: [{
			id: 'poiSearch_keywords',
	        xtype: 'textfield',
	        fieldLabel: '兴趣点',
	        allowBlank:false
	    },{
	    	id:'poiSearch_province',
	        xtype: 'combo',
	        value:'北京',
	        store: provinceStore,
	        queryMode: 'local',
	        displayField: 'name',
	        valueField: 'id',
	        fieldLabel: '省&nbsp&nbsp&nbsp份',
	        allowBlank:false
    	},{
    		id: 'poiSearch_city',
	        xtype: 'combo',
	        value:'北京',
	        store: cityStore,
	        queryMode: 'local',
	        displayField: 'name',
	        valueField: 'id',
	        fieldLabel: '城&nbsp&nbsp&nbsp市',
	        allowBlank:false
    	},{
	        xtype: 'button',
	        text: '搜索',
	        handler: poiSearch
	    }]   
	});
	
	var poiSearchPanel = Ext.create('Ext.panel.Panel',{
		id:'poiSearchPanel',
		bodyPadding:5,
		border:0,
		items: [poiSearchPanel_Top,poiSearchPanel_grid]
	});
	
	poiSearchPanel.on('added',init);
	pagingToolbar.on('beforechange',pagingToolbarBeforechange);
	store.on('beforeload',storeBeforeload);
	store.on('load',storeLoad);
	poiSearchPanel_grid.on('itemclick',gridItemclick);
	Ext.getCmp('poiSearch_province').on('select',provinceSelect);
	Ext.getCmp('poiSearch_province').on('change',provinceChange);
	
	// 界面初始化事件
	function init(){
		var provinceArr = loadProviceArr();
		provinceStore.add(provinceArr);
	}
	
	// 省份选择事件
	function provinceSelect(combo,records, eOpts){
		cityStore.removeAll();
		var cityArr = loadCityArr(combo.getValue());
		cityStore.add(cityArr);
    	Ext.getCmp('poiSearch_city').setValue(cityStore.getAt(0));
	}
	
	// 省份改变事件
	function provinceChange(t, newValue, oldValue, eOpts){
		var record = t.findRecordByDisplay(newValue);
		if(!record){
			return;
		}
		cityStore.removeAll();
		var id = record.get('id');
		var cityArr = loadCityArr(id);
		cityStore.add(cityArr);
    	Ext.getCmp('poiSearch_city').setValue(cityStore.getAt(0));
	}
	
	// 分页工具值改变前的事件
	function pagingToolbarBeforechange(toolbar,page){
		pageNum = page;
	}
	
	// grid行点击事件
	function gridItemclick(t, record, item, index, e, eOpts){
		setFocus();
		var x = record.get('location').x;
    	var y = record.get('location').y;
		var lookAt = new SuperMap.Web.Realspace.LookAt(x,y,5000);
    	lookAt.set_tilt(45);
    	scene.set_lookat(lookAt);
    	var point3D = new SuperMap.Web.Core.Point3D(x,y,0);
    	var bubbleClass = new SuperMap.Web.UI.Action3Ds.BubbleClass(sceneControl);
    	bubbleClass.createBubble(point3D,document.getElementById('poiDiv'),'poiInfo.html',record.get('name'),record.get('address'),record.get('telephone'));
	}
	
	// store加载完成的事件
	function storeLoad(t, records, successful, eOpts){
		setFocus();
		if(records == null){
			alert('查询结果为空');
			return;
		}
		document.getElementById('poiDiv').style.display = 'none';
		sceneControl.get_bubbles().removeAll();
		poiSearchPanel_grid.expand();
		var trackingLayer = scene.get_trackingLayer3D();
		var length = poiSign.length;
		for(var i=0;i<length;i++){
			var index = poiSign[i];
			trackingLayer.removeAt(index);
		}
		trackingLayer.refresh();
		poiSign = [];
		for(var i=0;i<records.length;i++){
			setPoiSign(records[i],i);
		}
	}
	
	// store加载前的事件
	function storeBeforeload(store, operation, eOpts){
		var keywords = Ext.getCmp('poiSearch_keywords').getValue();
	    var city = Ext.getCmp('poiSearch_city').getValue();
        var new_params = {  
	        pageSize:pageSize,
			pageNum:pageNum,
			keywords:keywords,
			city:city
	    };
        Ext.apply(store.proxy.extraParams, new_params);
	}

	// 搜索按钮点击事件
	function poiSearch(){
		setFocus();
		if(!Ext.getCmp('poiSearch_keywords').isValid()||!Ext.getCmp('poiSearch_city').isValid()){
			return;
		}
		store.load();
    }
    
    // 设置兴趣点标识
    function setPoiSign(record,i){
    	var name = record.get('name');
    	var address = record.get('address');
    	var telephone = record.get('telephone');
    	var x = record.get('location').x;
    	var y = record.get('location').y;
    	var z = 0;
    	var pictureName;
    	switch(i){
    	case 0:
    		pictureName = 'a.png';
    		break;
    	case 1:
    		pictureName = 'b.png';
    		break;
    	case 2:
    		pictureName = 'c.png';
    		break;
    	case 3:
    		pictureName = 'd.png';
    		break;
    	case 4:
    		pictureName = 'e.png';
    		break;
    	default:
    		break;
    	}
    	//创建placemark中的feature3D
    	var point3D = new SuperMap.Web.Core.Point3D(x,y,z);
    	var geometry = new SuperMap.Web.Core.GeoPoint3D(point3D);
        var feature3D = new SuperMap.Web.Core.Feature3D();
        //设置feature3D中的style3D属性
        var style = new SuperMap.Web.Core.Style3D();
		var pictureurl = tomcatUrl + webName + imageDir + 'poiSearch/' + pictureName;
        style.set_markerFile(pictureurl);       	   
        style.set_altitudeMode(SuperMap.Web.Realspace.AltitudeMode.ABSOLUTE);
      	style.set_markerScale(2);
      	style.set_iconAnchorPoint(new SuperMap.LonLat(0.5,1));
      	 //创建Geoplacemark
        var geoPlacemark = new SuperMap.Web.Core.GeoPlacemark();
        geoPlacemark.set_geometry(geometry);
        feature3D.set_geometry(geoPlacemark);
		feature3D.set_style3D(style);
        var trackingLayer = scene.get_trackingLayer3D();
        var index = trackingLayer.add(feature3D, name+','+address+','+telephone);
        poiSign.push(index);
        trackingLayer.refresh();
        if(i == 0){
        	var lookAt = new SuperMap.Web.Realspace.LookAt(x,y,5000);
        	lookAt.set_tilt(45);
        	scene.set_lookat(lookAt);
        }
        var myAction = new SuperMap.Web.UI.Action3Ds.poiSearchActionClass(sceneControl,document.getElementById('poiDiv'),'poiInfo.html');
        sceneControl.set_sceneAction(myAction);
    }
	
});