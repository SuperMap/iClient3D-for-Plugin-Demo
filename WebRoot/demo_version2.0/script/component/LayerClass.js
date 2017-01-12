/**
 * 图层编辑类
 */

var layerClass_this;

SuperMap.Web.UI.Action3Ds.LayerClass = function(){
	this.dataUrl = null;
	this.attributes = null;
	this.attributeValues = null;
	this.style3D = null;
};

SuperMap.Web.UI.Action3Ds.LayerClass.prototype = {
	
	/**
	 * 保存图层
	 * @param {} scene		三维场景类	
	 * @param {} dataUrl	数据服务地址
	 * @param {} style3D	三维要素风格类
	 */
	submit:function(scene,dataUrl,style3D){
		this.style3D = style3D;
		var trackingLyr3d = scene.get_trackingLayer3D();
	    var count = trackingLyr3d.get_count();
	    var geo2d = new Array(count);
	    for(var i=0; i<count; i++){
	        var geo3d = trackingLyr3d.get_item(i).get_geometry();
	        geo2d[i] = this.convertObject3dTo2d(geo3d);
	    }
	    this.addObjects(geo2d,dataUrl);
	    trackingLyr3d.removeAll();
	},
	
	/**
	 * 编辑图层
	 * @param {} scene		三维场景类
	 * @param {} layer3D	三维图层累
	 * @param {} objectID	选择的对象Id
	 */
	edit:function(scene,layer3D,objectID){
        var feature3D = layer3D.findFeature3DByID(objectID);
        var feature = new SuperMap.Web.Core.Feature3D();
        feature.set_geometry(feature3D.get_geometry().clone());
        var trackingLayer = scene.get_trackingLayer3D();
        trackingLayer.add(feature, "object");
        trackingLayer.set_isEditable(true);
        feature3D.set_isVisible(false);
        //layer3D.set_isVisible(false);
        layer3D.refresh();
	},
	
	/**
	 * 删除图层对象
	 * @param {} dataUrl		数据服务地址
	 * @param {} selectId		选择的对象Id
	 * @param {} style3D		三维要素风格类
	 */
	remove:function(dataUrl,selectId,style3D){
	    this.style3D = style3D;
	    var ids = [selectId];
	    var editFeatureParameter = new SuperMap.REST.EditFeaturesParameters({
			IDs: ids,
	        editType: SuperMap.REST.EditType.DELETE
	    });
	    this.submitEditFeatureService(editFeatureParameter,dataUrl);
	},
	
	/**
	 * 修改图层属性
	 * @param {} selectId			选择的对象Id
	 * @param {} selection3D		三维选择集类
	 * @param {} style3D			三维要素风格类
	 * @param {} dataServiceUrl		数据集服务地址
	 * @param {} dataUrl			数据服务地址
	 * @param {} attributes			图层属性名数组
	 * @param {} attributeValues	图层属性值数组
	 */
	updateProperties:function(selectId,selection3D,style3D,dataServiceUrl,dataUrl,attributes,attributeValues){
		this.dataUrl = dataUrl;
		this.attributes = attributes;
		this.attributeValues = attributeValues;
		this.style3D = style3D;
		layerClass_this = this;
		var filter="SMID="+selectId;
        var objInLayer3D = selection3D.get_layer3D();
        this.queryFeatureById(dataServiceUrl, filter,objInLayer3D.get_name());
	},
	
	addObjects:function(object2d,dataUrl){
	    var features = new Array();
	    for(var i=0; i<object2d.length; i++){
	        var feature = {fieldNames:[],fieldValues:[], geometry:object2d[i]};
	        features.push(feature);
	    }
	    var editFeatureParameter = new SuperMap.REST.EditFeaturesParameters({
	        features: features,
	        editType: SuperMap.REST.EditType.ADD,
	        returnContent:false
	    });
	    this.submitEditFeatureService(editFeatureParameter,dataUrl);
	},
	
	submitEditFeatureService:function(parameter,dataUrl){
		layerClass_this = this;
	    var editFeatureService = new SuperMap.REST.EditFeaturesService(dataUrl, {
	        eventListeners: {
	            "processCompleted": this.addFeaturesProcessCompleted,
	            "processFailed": this.processFailed
	        }
	    });
	    editFeatureService.processAsync(parameter);
	},
	
	addFeaturesProcessCompleted:function(editFeaturesEventArgs){
	    var addResultIds = editFeaturesEventArgs.result.IDs,
	        resourceInfo = editFeaturesEventArgs.result.resourceInfo;
	    if(addResultIds === null && resourceInfo === null) return;
	
	    if((addResultIds && addResultIds.length > 0) || (resourceInfo && resourceInfo.succeed)) {
	    	layerClass_this.style3D.updateData();
	    }else {
	        alert("新增地物失败");
	    }
	},
	
	processFailed:function(e) {
	    alert(e.error.errorMsg);
	},
	
	convertObject3dTo2d:function(geo3d){
	    var geoType = geo3d.get_type();
	    switch (geoType){
	        case 101: //SRGEOPOINT3D
	            var x = geo3d.get_x();
	            var y = geo3d.get_y();
	            return new SuperMap.Geometry.Point(x, y);
	            break;
	        case 103: //SRGEOLINE3D
	            var pt2ds = this.getPointsInGeometry(geo3d);
	            return new SuperMap.Geometry.LineString(pt2ds);
	            break;
	        case 105: //SRGEOREGION3D
	            var pt2ds = this.getPointsInGeometry(geo3d);
	            var linearRings = new SuperMap.Geometry.LinearRing(pt2ds);
	            return new SuperMap.Geometry.Polygon([linearRings]);
	            break;
	        default :
	            break;
   	 	}
	},
	
	getPointsInGeometry:function(geo3d){
	    var pt2ds = new Array();
	    for(var i=0; i<geo3d.get_partCount(); i++){
	        var pt3ds = geo3d.getPart(i);
	        for(var j=0; j<pt3ds.get_count(); j++){
	            var x = pt3ds.get_item(j).x;
	            var y = pt3ds.get_item(j).y;
	            var point = new SuperMap.Geometry.Point(x, y);
	            pt2ds.push(point);
	        }
	    }
	    return pt2ds;
	},
	
	queryFeatureById:function(url, attributeFilter,layerName){
        var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
		
        getFeatureParam = new SuperMap.REST.FilterParameter({
            name: layerName,
            attributeFilter: attributeFilter
        });
        var splitStr = layerName.split("@");
        var datasetName = splitStr[1]+":"+splitStr[0];
        getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
            queryParameter: getFeatureParam,
            datasetNames:[datasetName]
        });
        getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
            eventListeners: {"processCompleted": this.getFeaturesBySQLService_processCompleted, "processFailed": this.processFailed}});
        getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },

   	getFeaturesBySQLService_processCompleted:function(getFeaturesEventArgs) {
        var features, result = getFeaturesEventArgs.result;
        if (result && result.features) {
            features = result.features;
            layerClass_this.updateObjectsAttribute(features[0],layerClass_this.dataUrl,layerClass_this.attributes,layerClass_this.attributeValues);
        }
    },
	
	updateObjectsAttribute:function(fea,url,attributes,attrValues){
	    var editFeatureParameter,
	    feature = {
	        fieldNames:attributes,
	        fieldValues:attrValues,
	        geometry:fea.geometry
	    };
	    feature.geometry.id = fea.fid;
	    editFeatureParameter = new SuperMap.REST.EditFeaturesParameters({
	        features: [feature],
	        editType: SuperMap.REST.EditType.UPDATE
	    });
	    this.submitEditFeatureService(editFeatureParameter,url);
	}
	
};
