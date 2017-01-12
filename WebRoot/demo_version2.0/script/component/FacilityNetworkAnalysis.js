/**
 * 设施网络分析类
 */

SuperMap.Web.UI.Action3Ds.FacilityNetworkAnalysis = function(scene){
	this._scene = scene;
	this._callback = null;
};

var FacilityNetworkAnalysis_this;

SuperMap.Web.UI.Action3Ds.FacilityNetworkAnalysis.prototype = {
	
	/**
	 * 查找给定弧段或节点的上游中的关键设施结点，返回关键结点 ID 数组及其下游弧段 ID 数组
	 * @param {} analysisService_url		三维数据集URL
	 * @param {} sourceNodeIDs 				节点数组
	 * @param {} edgeID						弧段ID
	 * @param {} nodeID						节点ID
	 * @param {} isUncertainDirectionValid	不确定流向时是否继续分析
	 * @param {} callback					回调函数
	 */
	facilityAnalystUpstream:function(analysisService_url,sourceNodeIDs,edgeID,nodeID,isUncertainDirectionValid,callback){
		this._callback = callback;
		FacilityNetworkAnalysis_this = this;
		var parameter = new SuperMap.REST.FacilityAnalystUpstream3DParameters({
			sourceNodeIDs: sourceNodeIDs,
			edgeID: edgeID,
			nodeID: nodeID,
			isUncertainDirectionValid: isUncertainDirectionValid
		});
		var facilityAnalystUpstream3DService = new SuperMap.REST.FacilityAnalystUpstream3DService(analysisService_url, {
			eventListeners: { "processCompleted": this.facilityAnalystUpstream_processCompleted }
		});
		facilityAnalystUpstream3DService.processAsync(parameter);
	},
	
	facilityAnalystUpstream_processCompleted:function(facilityAnalystUpstream3DEventArgs) {
		var result = facilityAnalystUpstream3DEventArgs.result;
		FacilityNetworkAnalysis_this._callback(result);
	},
	
	/**
	 * 查找给定弧段或节点的下游，返回下游包含的弧段、结点及总耗费
	 * @param {} analysisService_url		三维数据集URL
	 * @param {} edgeID						弧段ID
	 * @param {} nodeID						节点ID
	 * @param {} weightName					权值
	 * @param {} isUncertainDirectionValid	不确定流向时是否继续分析
	 * @param {} callback					回调函数
	 */
	facilityAnalystTracedown:function(analysisService_url,edgeID,nodeID,weightName,isUncertainDirectionValid,callback){
		this._callback = callback;
		FacilityNetworkAnalysis_this = this;
		var parameter = new SuperMap.REST.FacilityAnalystTracedown3DParameters({
			edgeID: edgeID,
			nodeID: nodeID,
			weightName: weightName,
			isUncertainDirectionValid: isUncertainDirectionValid
		});
		var facilityAnalystTracedown3DService = new SuperMap.REST.FacilityAnalystTracedown3DService(analysisService_url, {
			eventListeners: { "processCompleted": this.facilityAnalystTracedown_processCompleted }
		});
		facilityAnalystTracedown3DService.processAsync(parameter);
	},
	
	facilityAnalystTracedown_processCompleted:function(facilityAnalystTracedown3DEventArgs) {
		var result = facilityAnalystTracedown3DEventArgs.result;
		FacilityNetworkAnalysis_this._callback(result);
	},
	
	/**
	 * 执行sql查询
	 * @param {} queryServiceUrl
	 * @param {} datasources
	 * @param {} datasets
	 * @param {} attributeFilter
	 * @param {} fromIndex
	 * @param {} toIndex
	 */
	getSourceNodeIDs:function(queryServiceUrl,datasources,datasets,attributeFilter,fromIndex,toIndex,callback){
		var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
	    getFeatureParam = new SuperMap.REST.FilterParameter({
	        name:datasets+'@'+datasources,
	        attributeFilter: attributeFilter
	    });
	    getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
	        queryParameter: getFeatureParam,
	        datasetNames: [datasources+':'+datasets],
	        fromIndex:fromIndex,
	        toIndex:toIndex
	    });
	    getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(queryServiceUrl, {
	        eventListeners: {"processCompleted": callback, "processFailed": this.processFailed}});
	    getFeatureBySQLService.processAsync(getFeatureBySQLParams);
	},
	
	processFailed:function(e) {
	    alert(e.error.errorMsg);
	}
	
};