/**
 * 太阳特效
 */

Ext.onReady(function() {
	
	var sunClass;
	
	//Ext.define('AlwaysVisibleTip', {    extend: 'Ext.slider.Tip',    init: function(slider) {        var me = this;        me.callParent(arguments);        slider.removeListener('dragend', me.hide);        slider.on({            scope: me,            change: me.onSlide,            afterrender: function() {                setTimeout(function() {                    me.onSlide(slider, null, slider.thumbs[0]);                }, 100);            }        });    }});
	
	var splayMode_store = Ext.create('Ext.data.Store',{
		fields:['text','value'],
		data:[{text:'按时间(分)',value:'按时间(分)'},
			  {text:'按日期(天)',value:'按日期(天)'}]
	});

	var sunEffectsPanel = Ext.create('Ext.panel.Panel',{
		id:'sunEffectsPanel',
		layout:'anchor',
		bodyPadding:5,
		border:0,
		defaults:{
			labelWidth:150
		},
		items:[{
			id:'sunEffects_playMode',
			xtype:'combo',
			fieldLabel:'播放模式',
			queryMode:'local',
			displayField:'text',
			valueField:'value',
			triggerAction:'all',
			store:splayMode_store,
			value:'按时间(分)',
			editable:false,
			hidden:true
		},{
			bodyPadding:5,
			bodyStyle:'border-color:#EBEBEB',
			defaults:{
				border:0,
				labelWidth:145,
				style:{
					marginTop:'5px'
				}
			},
			items:[{
				id:'sunEffects_slider',
				xtype:'slider',
				width:300,
//				plugins: [Ext.create('AlwaysVisibleTip',{
//			        getText: function(thumb) {
//			            var currentTime = Ext.getCmp('sunEffects_currentTime').getValue();
//						var hour = currentTime.getHours();
//						var minute = currentTime.getMinutes();
//						var second = currentTime.getSeconds();
//						hour = hour<10?'0'+hour:hour;
//						minute = minute<10?'0'+minute:minute;
//						second = second<10?'0'+second:second;
//						return hour + ':' + minute + ':' + second;
//			        }
//			    })],
				useTips:true,
				tipText:function(){
					var currentTime = Ext.getCmp('sunEffects_currentTime').getValue();
					var hour = currentTime.getHours();
					var minute = currentTime.getMinutes();
					var second = currentTime.getSeconds();
					hour = hour<10?'0'+hour:hour;
					minute = minute<10?'0'+minute:minute;
					second = second<10?'0'+second:second;
					return hour + ':' + minute + ':' + second;
				}
			},{
				id:'sunEffects_slider_date',
				xtype:'slider',
				hidden:true,
				useTips: false,
				width:240
			},{
				layout:'hbox',
				items:[{
					xtype:'tbtext',
					text:'00:00:00'
				},{
					xtype:'tbtext',
					text:'23:59:59',
					style:{
						marginLeft:'195px'	
					}
				}]
			},{
				layout:'hbox',
				style:{
					marginTop:'10px'
				},
				items:[{
					id:'sunEffects_localTime',
					xtype:'button',
					iconCls:'icon_time',
					text:'本地日期'
				},{
					id:'sunEffects_openAdvancedSettings',
					xtype:'button',
					text:'高级设置',
					iconCls:'icon_options',
					style:{
						marginLeft:'10px'					
					}
				},{
					id:'sunEffects_closeAdvancedSettings',
					xtype:'button',
					text:'高级设置',
					iconCls:'icon_options',
					hidden:true,
					style:{
						marginLeft:'10px'					
					}
				}]
			}]
		},{
			id:'sunEffects_advancedSettingsPanel',
			bodyPadding:5,
			bodyStyle:'border-color:#EBEBEB',
			collapsed:true,
			header:false,
			defaults:{
				border:0,
				labelWidth:145
			},
			items:[{
				id:'sunEffects_currentTime',
				fieldLabel:'当前场景时间',
				xtype:'zc_form_DatetimeField',
				value:new Date()
				
			},{
				id:'sunEffects_startTime',
				fieldLabel:'开始时间',
				xtype:'zc_form_DatetimeField',
				allowBlank:false
			},{
				id:'sunEffects_endTime',
				fieldLabel:'结束时间',
				xtype:'zc_form_DatetimeField',
				allowBlank:false
			},{
				id:'sunEffects_speedMin',
				xtype:'numberfield',
				fieldLabel:'速度(分/秒)',
				vtype:'positiveOrZero',
				allowBlank:false,
				value:0,
				readOnly:true
			},{
				id:'sunEffects_speedDay',
				xtype:'numberfield',
				fieldLabel:'速度(天/秒)',
				vtype:'positiveOrZero',
				allowBlank:false,
				hidden:true,
				decimalPrecision:4,
				value:0,
				readOnly:true
			},{
				id:'sunEffects_often',
				xtype:'numberfield',
				fieldLabel:'播放时长(秒)',
				vtype:'positive',
				allowBlank:false,
				decimalPrecision:4,
				value:20
			}],
			tbar:[{
				id:'sunEffects_play',
				iconCls:'icon_play',
				text:'播放'
			},{
				id:'sunEffects_stop',
				iconCls:'icon_stop',
				text:'停止',
				disabled:true
			}]
		}],
		tbar:[{
			id:'sunEffects_sunVisible',
			iconCls:'icon_sunVisible',
			text:'可见'
		}]
	});
	
	Ext.getCmp('sunEffectsPanel').addListener('added',init);
	Ext.getCmp('sunEffects_sunVisible').addListener('click',sunVisibleChange);
	Ext.getCmp('sunEffects_currentTime').addListener('change',currentTimeChange);
	Ext.getCmp('sunEffects_playMode').addListener('change',playModeChange);
	Ext.getCmp('sunEffects_startTime').addListener('change',timeChange);
	Ext.getCmp('sunEffects_endTime').addListener('change',timeChange);
	Ext.getCmp('sunEffects_often').addListener('change',timeChange);
	Ext.getCmp('sunEffects_play').addListener('click',play);
	Ext.getCmp('sunEffects_stop').addListener('click',stop);
	Ext.getCmp('sunEffects_slider').addListener('change',sliderChange);
	Ext.getCmp('sunEffects_slider_date').addListener('change',sliderDateChange);
	Ext.getCmp('sunEffects_localTime').addListener('click',getLocalTime);
	Ext.getCmp('sunEffects_openAdvancedSettings').addListener('click',openAdvancedSettingsClick);
	Ext.getCmp('sunEffects_closeAdvancedSettings').addListener('click',closeAdvancedSettingsClick);
	//Ext.getCmp('sunEffects_speedMin').addListener('change',speedMinChange);
	//Ext.getCmp('sunEffects_speedDay').addListener('change',speedDayChange);
	
	// 打开高级设置点击事件
	function openAdvancedSettingsClick(){
		setFocus();
		Ext.getCmp('sunEffects_openAdvancedSettings').hide();
		Ext.getCmp('sunEffects_closeAdvancedSettings').show();
		Ext.getCmp('sunEffects_advancedSettingsPanel').expand(true);
	}
	
	// 关闭高级设置点击事件
	function closeAdvancedSettingsClick(){
		setFocus();
		Ext.getCmp('sunEffects_openAdvancedSettings').show();
		Ext.getCmp('sunEffects_closeAdvancedSettings').hide();
		Ext.getCmp('sunEffects_advancedSettingsPanel').collapse(true);
	}
	
	// 本地日期按钮点击事件
	function getLocalTime(){
		setFocus();
		var now = new Date();
		Ext.getCmp('sunEffects_currentTime').setValue(now);
	}
	
	// 根据日期和播放模式,设置时间滚动条
	function setSliderByTime(mode,date){
		if(mode == '按时间(分)'){
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var seconds = date.getSeconds();
			var timeTemp = hours*3600+minutes*60+seconds;
			Ext.getCmp('sunEffects_slider').setValue(timeTemp);
		}else if(mode == '按日期(天)'){
			var maxValue = validLeapYear(date.getFullYear())?367:366;
			Ext.getCmp('sunEffects_slider_date').setMaxValue(maxValue);
			var dayTemp = getWhichDay(date);
			Ext.getCmp('sunEffects_slider_date').setValue(dayTemp);
		}
	}
	
	// 界面初始化
	function init(){
		sunClass = new SuperMap.Web.UI.Action3Ds.SunClass(sceneControl);
		var date = new Date();
		scene.get_sun().set_dateTime(date);
		var mode = Ext.getCmp('sunEffects_playMode').getValue();
		var maxValue = 24*3600-1;
		Ext.getCmp('sunEffects_slider').setMaxValue(maxValue);
		setSliderByTime(mode,date);
		Ext.getCmp('sunEffects_startTime').setValue(date);
		date.setHours(23, 59, 59);
		Ext.getCmp('sunEffects_endTime').setValue(date);
	}
	
	// 时间滚动条改变
	function sliderChange(){	
		var sliderValue = Ext.getCmp('sunEffects_slider').getValue();
		var hours = parseInt(sliderValue/3600);
		var minutes = parseInt((sliderValue%3600)/60);
		var seconds = parseInt((sliderValue%3600)%60);
		var date = new Date();
		date.setHours(hours);
		date.setMinutes(minutes);
		date.setSeconds(seconds);
		Ext.getCmp('sunEffects_currentTime').setValue(date);
	}
	
	// 日期滚动条改变
	function sliderDateChange(){
		var currentTime = Ext.getCmp('sunEffects_currentTime').getValue();
		var sliderValue = Ext.getCmp('sunEffects_slider_date').getValue();
		var date = getDateByDayNum(currentTime.getFullYear(),sliderValue);
		var newDate = new Date();
		newDate.setFullYear(date.getFullYear());
		newDate.setMonth(date.getMonth());
		newDate.setDate(date.getDate()-1);
		newDate.setHours(currentTime.getHours());
		newDate.setMinutes(currentTime.getMinutes());
		newDate.setSeconds(currentTime.getSeconds());
		Ext.getCmp('sunEffects_currentTime').setValue(newDate);
	}
	
	// 播放模式改变
	function playModeChange(){
		var playMode = Ext.getCmp('sunEffects_playMode').getValue();
		if(playMode == '按时间(分)'){
			Ext.getCmp('sunEffects_slider').show();
			Ext.getCmp('sunEffects_slider_date').hide();
			Ext.getCmp('sunEffects_speedMin').show();
			Ext.getCmp('sunEffects_speedDay').hide();
			timeChange();
			var time = Ext.getCmp('sunEffects_currentTime').getValue();
			var minValue = 0;
			var maxValue = 24*3600-1;
			Ext.getCmp('sunEffects_slider').setMinValue(minValue);
			Ext.getCmp('sunEffects_slider').setMaxValue(maxValue);
			setSliderByTime(playMode,time);
		}else if(playMode == '按日期(天)'){
			Ext.getCmp('sunEffects_slider').hide();
			Ext.getCmp('sunEffects_slider_date').show();
			Ext.getCmp('sunEffects_speedMin').hide();
			Ext.getCmp('sunEffects_speedDay').show();
			timeChange();
			var time = Ext.getCmp('sunEffects_currentTime').getValue();
			var minValue = 2;
			var maxValue = validLeapYear(time.getFullYear())?367:366;
			Ext.getCmp('sunEffects_slider_date').setMinValue(minValue);
			Ext.getCmp('sunEffects_slider_date').setMaxValue(maxValue);
			setSliderByTime(playMode,time);
		}
	}
	
	// 播放按钮点击事件
	function play(){
		setFocus();
		var startTime = Ext.getCmp('sunEffects_startTime').getValue();
		var endTime = Ext.getCmp('sunEffects_endTime').getValue();
		var often = Ext.getCmp('sunEffects_often').getValue();
		var text = Ext.getCmp('sunEffects_play').getText();
		if(text == '播放'){
			Ext.getCmp('sunEffects_stop').setDisabled(false);
			Ext.getCmp('sunEffects_play').setIconCls('icon_pause');
			Ext.getCmp('sunEffects_play').setText('暂停');
			setDisabled(true,'play');
			sunClass.move(startTime,endTime,often,playCallback);
		}else if(text == '暂停'){
			sunClass.pause();
			Ext.getCmp('sunEffects_play').setIconCls('icon_play');
			Ext.getCmp('sunEffects_play').setText('播放');
		}
		
	}
	
	// 播放结束回调函数
	function playCallback(){
		var startTime = Ext.getCmp('sunEffects_startTime').getValue();
		Ext.getCmp('sunEffects_currentTime').setValue(startTime);
		scene.get_sun().set_dateTime(startTime);
		setDisabled(false,'play');
		Ext.getCmp('sunEffects_play').setIconCls('icon_play');
		Ext.getCmp('sunEffects_play').setText('播放');
		Ext.getCmp('sunEffects_stop').setDisabled(true);
	}
	
	// 停止按钮点击事件
	function stop(){
		setFocus();
		var startTime = Ext.getCmp('sunEffects_startTime').getValue();
		Ext.getCmp('sunEffects_currentTime').setValue(startTime);
		scene.get_sun().set_dateTime(startTime);
		setDisabled(false,'play');
		Ext.getCmp('sunEffects_play').setIconCls('icon_play');
		Ext.getCmp('sunEffects_play').setText('播放');
		Ext.getCmp('sunEffects_stop').setDisabled(true);
		sunClass.stop();
	}
	
	// 速度(天/秒)改变
	function speedDayChange(){
		var startTimeValid = Ext.getCmp('sunEffects_startTime').isValid();
		var endTimeValid = Ext.getCmp('sunEffects_endTime').isValid();
		var speedDayValid = Ext.getCmp('sunEffects_speedDay').isValid();
		alert(!startTimeValid);
		if(!startTimeValid || !endTimeValid || !speedDayValid){
			return;
		}
		var speedDay = Ext.getCmp('sunEffects_speedDay').getValue();
		var startTime = Ext.getCmp('sunEffects_startTime').getValue();
		var endTime = Ext.getCmp('sunEffects_endTime').getValue();
		var differ = endTime - startTime;
		var often = differ/(60000*60*24)/speedDay;
		Ext.getCmp('sunEffects_often').setValue(often);
	}
	
	// 速度(分/秒)改变
	function speedMinChange(){
		var startTimeValid = Ext.getCmp('sunEffects_startTime').isValid();
		var endTimeValid = Ext.getCmp('sunEffects_endTime').isValid();
		var speedMinValid = Ext.getCmp('sunEffects_speedMin').isValid();
		if(!startTimeValid || !endTimeValid || !speedMinValid){
			return;
		}
		var speedMin = Ext.getCmp('sunEffects_speedMin').getValue();
		var startTime = Ext.getCmp('sunEffects_startTime').getValue();
		var endTime = Ext.getCmp('sunEffects_endTime').getValue();
		var differ = endTime - startTime;
		var often = differ/60000/speedMin;
		Ext.getCmp('sunEffects_often').setValue(often);
	}
	
	// 开始时间、结束时间改变
	function timeChange(){
		var startTimeValid = Ext.getCmp('sunEffects_startTime').isValid();
		var endTimeValid = Ext.getCmp('sunEffects_endTime').isValid();
		var oftenValid = Ext.getCmp('sunEffects_often').isValid();
		if(!startTimeValid || !endTimeValid || !oftenValid){
			return;
		}
		var often = Ext.getCmp('sunEffects_often').getValue();
		var startTime = Ext.getCmp('sunEffects_startTime').getValue();
		var endTime = Ext.getCmp('sunEffects_endTime').getValue();
		var differ = endTime - startTime;
		var speedMin = (differ/60000)/often;
		var speedDay = (differ/(60000*60*24))/often;
		if(!Ext.getCmp('sunEffects_speedMin').isHidden()){
			Ext.getCmp('sunEffects_speedMin').setValue(speedMin);
		}
		else{
			Ext.getCmp('sunEffects_speedDay').setValue(speedDay);
		}
	}
	
	// 当前时间改变
	function currentTimeChange(){
		var time = Ext.getCmp('sunEffects_currentTime').getValue();
		scene.get_sun().set_dateTime(time);
		var date = new Date(time);
		var mode = Ext.getCmp('sunEffects_playMode').getValue();
		setSliderByTime(mode,date);
	}
	
	// 设置组件可见度
	function setDisabled(diabled,func){
		if(func == 'sunVisibleChange'){
			Ext.getCmp('sunEffects_play').setDisabled(diabled);
		}else{
			Ext.getCmp('sunEffects_sunVisible').setDisabled(diabled);
		}
		Ext.getCmp('sunEffects_openAdvancedSettings').setDisabled(diabled);
		Ext.getCmp('sunEffects_closeAdvancedSettings').setDisabled(diabled);
		Ext.getCmp('sunEffects_playMode').setDisabled(diabled);
		Ext.getCmp('sunEffects_currentTime').setDisabled(diabled);
		Ext.getCmp('sunEffects_startTime').setDisabled(diabled);
		Ext.getCmp('sunEffects_endTime').setDisabled(diabled);
		Ext.getCmp('sunEffects_speedMin').setDisabled(diabled);
		Ext.getCmp('sunEffects_speedDay').setDisabled(diabled);
		Ext.getCmp('sunEffects_often').setDisabled(diabled);
		Ext.getCmp('sunEffects_localTime').setDisabled(diabled);
		Ext.getCmp('sunEffects_slider').setDisabled(diabled);
		Ext.getCmp('sunEffects_slider_date').setDisabled(diabled);
	}
	
	// 太阳可见改变
	function sunVisibleChange(){
		setFocus();
		var visible = scene.get_sun().get_isVisible();
		if(visible){
			scene.get_sun().set_isVisible(false);
			setDisabled(true,'sunVisibleChange');
			Ext.getCmp('sunEffects_sunVisible').setIconCls('icon_sunNoVisible');
		}else{
			scene.get_sun().set_isVisible(true);
			setDisabled(false,'sunVisibleChange');
			Ext.getCmp('sunEffects_sunVisible').setIconCls('icon_sunVisible');
		}
	}
	
});