SuperMap.Web.UI.Action3Ds.MeasureHeightCustom = function (sceneControl) {

    SuperMap.Web.UI.Action3Ds.MeasureHeightCustom.initializeBase(this);
    this._name = 'MeasureHeightCustom';
    this._sceneControl = sceneControl;
    this._type = SuperMap.Web.UI.Action3Ds.SceneActionType.MEASUREHEIGHT;
    this._height = -1;
    this._stopMove = false;
    this._index = -1;

    //设置鼠标提示停止移动
    this.set_StopMove = function (stopMoveFlag) {
        this._stopMove = stopMoveFlag;
    }
    //设置总距离
    this.set_height = function (disVaule) {
        if (this._height == disVaule) {
        }
        else {
            this._height = disVaule;
        }
    }

};

SuperMap.Web.UI.Action3Ds.MeasureHeightCustom.prototype =
{
    dispose: function () {
        var scene = this._sceneControl.get_scene();
        scene.get_trackingLayer3D().removeAll();
        this._sceneControl = null;
    },

    onMouseDown: function (e) {

    },

    onMouseUp: function (e) {

    },

    onMouseMove: function (e) {
        if (!this._stopMove) {
            var scene = this._sceneControl.get_scene();
            var trackingLayer3D = scene.get_trackingLayer3D();
            trackingLayer3D.removeAt(trackingLayer3D.indexOf('pos'));
            var feature3D = new SuperMap.Web.Core.Feature3D();
            var geoText3D = new SuperMap.Web.Core.GeoText3D();
            var point3D = new SuperMap.Web.Core.Point3D(e.get_longitude(), e.get_latitude());
            var textPart3D = new SuperMap.Web.Core.TextPart3D('高度：' + this._height + '米', point3D);
            var textStyle3D = new SuperMap.Web.Core.TextStyle3D();
            geoText3D.addPart(textPart3D);
            textStyle3D.set_fontScale(0.8);
            textStyle3D.set_opaqueRate(100);
            textStyle3D.set_foreColor(new SuperMap.Web.Core.Color(255, 255, 255, 255));
            feature3D.set_geometry(geoText3D);
            feature3D.set_textStyle3D(textStyle3D);
            this._index = trackingLayer3D.add(feature3D, 'pos');
        }
    }
};

SuperMap.Web.UI.Action3Ds.MeasureHeightCustom.registerClass('SuperMap.Web.UI.Action3Ds.MeasureHeightCustom', SuperMap.Web.UI.Action3Ds.SceneAction, Sys.IDisposable);