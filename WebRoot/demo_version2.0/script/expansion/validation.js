/**
 * 自定义验证类型
 */

Ext.apply(Ext.form.VTypes,{
	
	positive:function(val){
		if(val > 0){
			return true;
		}else{
			return false;
		}
	},
	positiveText:'值只能为正数',
	
	positiveOrZero:function(val){
		if(val >= 0){
			return true;
		}else{
			return false;
		}
	},
	positiveOrZeroText:'值只能为正数或0'
	
});