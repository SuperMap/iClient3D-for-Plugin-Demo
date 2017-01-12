//==========================================================================
// SuperMap Realspace 客户端程序，版权所有，北京超图软件股份有限公司，2000-2009。
// 本程序只能在有效的授权许可下使用。未经许可，不得以任何手段擅自使用或传播。
// 作者：			SuperMap WebClient Team
// 修改：
// 文件名：			SuperMap.Web.Realspace.NodeNodeAnimationState
// 功能：			节点动画信息
// 最后修改时间：
//==========================================================================
Type.registerNamespace('SuperMap.Web.Realspace');

SuperMap.Web.Realspace.NodeAnimation = function () {
    ///<returns type="SuperMap.Web.Realspace.NodeAnimation"></returns>
    SuperMap.Web.Realspace.NodeAnimation.initializeBase(this);

    //this._innerNodeAnimation = SuperMap.Web.Realspace.Utility._SceneControl._get_innerObjectManager().CreateNodeAnimation();
    this._innerNodeAnimation = null;
};
SuperMap.Web.Realspace.NodeAnimation.prototype = {

    dispose: function () {
        ///<returns type="void">析构函数</returns>
        this._innerNodeAnimation = null;
    },
    /*
     *innerNodeAnimation对象，不对外开放
     */
    _get_innerNodeAnimation: function () {

        if (this._innerNodeAnimation == null) {
            return null;
        }
        return this._innerNodeAnimation;
    },

    _set_innerNodeAnimation: function(innerNodeAnimation) {
        if (innerNodeAnimation == null) {
            return null;
        }
        this._innerNodeAnimation = innerNodeAnimation;
    },


    get_length: function () {
        ///<value type="Number">动画长度</value>
        if (this._innerNodeAnimation == null) {
            return null;
        }
        return this._innerNodeAnimation.Length;
    },
    set_length: function (length) {
        if (this._innerNodeAnimation == null) {
            return;
        }
        var n_length = parseFloat(length);
        if (!isNaN(n_length)) {
            this._innerNodeAnimation.Length = n_length;
        }
    },

    get_isEnabled: function () {
        ///<value type="Boolean">是否可用</value>
        return this._innerNodeAnimation.IsEnabled;
    },
    set_isEnabled: function (bEnabled) {
        this._innerNodeAnimation.IsEnabled = bEnabled;
    },

    get_playMode: function () {
        ///<value type="Number">播放模式</value>
        if (this._innerNodeAnimation == null) {
            return null;
        }
        return this._innerNodeAnimation.PlayMode;
    },
    set_playMode: function (playMode) {
        if (this._innerNodeAnimation == null) {
            return;
        }
        var n_playMode = parseFloat(playMode);
        if (!isNaN(n_playMode)) {
            this._innerNodeAnimation.PlayMode = n_playMode;
        }
    },

    get_timePosition: function () {
        ///<value type="Number">动画所处的时间位置</value>
        if (this._innerNodeAnimation == null) {
            return null;
        }
        return this._innerNodeAnimation.TimePosition;
    },
    set_timePosition: function (timePosition) {
        if (this._innerNodeAnimation == null) {
            return;
        }
        var n_timePosition = parseFloat(timePosition);
        if (!isNaN(n_timePosition)) {
            this._innerNodeAnimation.TimePosition = n_timePosition;
        }
    },

    get_position: function () {
        ///<value type="Number">获取空间位置</value>
        if (this._innerNodeAnimation == null) {
            return null;
        }
        var innerpt = this._innerNodeAnimation.Position;
		var pt = new SuperMap.Web.Core.Point3D(innerpt.X,innerpt.Y,innerpt.Z);
		return pt;
    },

    get_direction: function () {
        ///<value type="Number">前进方向</value>
        if (this._innerNodeAnimation == null) {
            return null;
        }
        return this._innerNodeAnimation.Direction;
    },

    get_pitch: function () {
        ///<value type="Number">倾斜角</value>
        if (this._innerNodeAnimation == null) {
            return null;
        }
        return this._innerNodeAnimation.Pitch;
    },

    setTrack: function (geoline) {
        ///<value type="Boolean">获取运动轨迹</value>
        if (this._innerNodeAnimation == null) {
            return null;
        }
        this._innerNodeAnimation.SetTrack(geoline._get_innerGeometry()  );
    }

};
SuperMap.Web.Realspace.NodeAnimation.registerClass('SuperMap.Web.Realspace.NodeAnimation', Sys.Component);