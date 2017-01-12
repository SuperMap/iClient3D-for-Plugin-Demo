/**
 * 太阳特效类
 * @param {} sceneControl
 */

SuperMap.Web.UI.Action3Ds.SunClass = function(sceneControl){
	this.sceneControl = sceneControl;
	this.count = 0;
	this.timer = null;
};

var SunClass_this;

SuperMap.Web.UI.Action3Ds.SunClass.prototype = {
	
	/**
	 * 太阳阴影移动
	 * @param {} startTime	开始时间
	 * @param {} endTime	结束时间
	 * @param {} duration	持续时间(秒)
	 * @param {} callback	回调函数
	 */
	move:function(startTime,endTime,duration,callback){
		var diff = endTime - startTime;
		var interval = 30;
		var times = duration*1000/interval;
		var per = diff/times;
		SunClass_this = this;
		this.setDateTime(startTime,times,per,interval,callback);
	},
	
	/**
	 * 暂停太阳阴影移动
	 */
	pause:function(){
		clearTimeout(this.timer);
	},
	
	/**
	 * 停止太阳阴影移动
	 */
	stop:function(){
		clearTimeout(this.timer);
		this.count=0;
	},
	
	setDateTime:function(startTime,times,per,interval,callback){
		var timeTemp = startTime.getTime()+this.count*per;
		var date = new Date();
		date.setTime(timeTemp);
		this.sceneControl.get_scene().get_sun().set_dateTime(date);
		this.count++;
		if(this.count >= times){
			this.count=0;
			callback();
			return;
		}
		this.timer = setTimeout(function(){SunClass_this.setDateTime(startTime,times,per,interval,callback)},interval);
	}
	
};