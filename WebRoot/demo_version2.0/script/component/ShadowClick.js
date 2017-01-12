/**
 * 阴影点击类
 * @param {} sceneControl	三维场景控件
 * @param {} shadowQuery	阴影查询类
 */
SuperMap.Web.UI.Action3Ds.ShadowClick = function (sceneControl,shadowQuery) {
    SuperMap.Web.UI.Action3Ds.ShadowClick.initializeBase(this);
    this._name = "ShadowClick";
    this._sceneControl = sceneControl;
    this.shadowQuery = shadowQuery;
    this.shadowRate = null;
};

SuperMap.Web.UI.Action3Ds.ShadowClick.prototype = {
    dispose: function () {
        this._sceneControl = null;
    },
    onMouseDown: function (e) {
        if(e.get_flagType()%2 == 1)
        {
            var pt = new SuperMap.Pixel(e.get_clientX(), e.get_clientY()); //new SuperMap.Web.Core.Point(e.get_clientX(), e.get_clientY());
            var ratio = this.shadowQuery.getShadowRatio(pt);
            if(ratio != -1){
            	this.shadowRate = parseInt(ratio*100);
            }else{
            	this.shadowRate = "***";
            }
        }
    }
};
SuperMap.Web.UI.Action3Ds.ShadowClick.registerClass('SuperMap.Web.UI.Action3Ds.ShadowClick', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);
