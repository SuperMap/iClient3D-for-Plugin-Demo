/**
 * 工具类js
 */

/**
 * 屏蔽backspace
 * 
 * @param {}
 *            e
 * @return {Boolean}
 */
document.onkeydown = function(e) {
	var code;
	if (!e) {
		var e = window.event;
	}
	if (e.keyCode) {
		code = e.keyCode;
	} else if (e.which) {
		code = e.which;
	}
	// BackSpace 8;
	if ((event.keyCode == 8)
			&& ((event.srcElement.type != "text"
					&& event.srcElement.type != "textarea" && event.srcElement.type != "password") || event.srcElement.readOnly == true)

	) {

		event.keyCode = 0;
		event.returnValue = false;
	}
	return true;
};

/**
 * 判断是否是闰年
 * 
 * @param {}
 *            year 年份(2014)
 * @return {Boolean} true:闰年,false:平年
 */
function validLeapYear(year) {
	if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
		return true;
	} else {
		return false;
	}
}

/**
 * 根据日期计算是当年的第几天
 * 
 * @param {}
 *            time 日期(Date)
 * @return {}
 */
function getWhichDay(time) {
	var datetime = new Date(), gap = 0;
	if (time) {
		datetime = time instanceof Date ? time : new Date(time);
		gap = 1;
	}
	var day_MillSeconds = 24 * 3600 * 1000, // 一天的秒数
	year = datetime.getFullYear(), firstDay = new Date(year, 0, 1); // 新年第一天
	var dayOfYear = (datetime - firstDay) / day_MillSeconds + gap;
	return Math.ceil(dayOfYear);
}

/**
 * 根据年份的天数计算日期
 * 
 * @param {}
 *            dayNum 天数(200)
 * @return {} Date(YYYY-mm-dd 或 YYYY-mm-dd HH:mm:ss)
 */
function getDateByDayNum(year, dayNum) {
	var now = new Date(year, 0, 1);
	var newdate = new Date();
	var newtimems = now.getTime() + ((dayNum - 1) * 24 * 60 * 60 * 1000);
	newdate.setTime(newtimems);
	return newdate;
}

// 设置焦点，防止窗口消失(针对IE)
function setFocus() {
	setTimeout(function() {
				document.getElementById('test').focus();
			}, 100);
}

/**
 * 读取xml文件并生成xml对象
 * 
 * @param {}
 *            xmlFile
 */
function createXmlDoc(xmlFile) {
	var xmlDoc;
	try{
		if (window.ActiveXObject) {
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); // IE浏览器
			xmlDoc.async = false;
			xmlDoc.load(xmlFile);
			if(!xmlDoc.documentElement){
				return false;
			}
		} else if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) { // 火狐浏览器
			xmlDoc = document.implementation.createDocument('', '', null);
			xmlDoc.load(xmlFile);
		} else { // 谷歌浏览器
			var xmlhttp = new window.XMLHttpRequest();
			xmlhttp.open("GET", xmlFile, false);
			xmlhttp.send(null);
			if (xmlhttp.readyState == 4) {
				xmlDoc = xmlhttp.responseXML.documentElement;
			}
		}
	}catch(e){
		return false;
	}
	return xmlDoc;
}

/**
 * 获得浏览器类型
 */
function getBrowser(){
	var browserName;
	if (window.ActiveXObject) {
		browserName = 'IE';	
	} else if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) { // 火狐浏览器
		browserName = 'FIREFOX';
	} else { // 谷歌浏览器
		browserName = 'OTHER';
	}
	return browserName;
}

/**
 * xml对象转换成对象
 * 
 * @param {}
 *            xml
 * @return {}
 */
function xmlToJson(xmlObj) {
	// Create the return object
	var obj = {};
	if (xmlObj.nodeType == 1) { // element
		// do attributes
		if (xmlObj.attributes.length > 0) {
			obj["@attributes"] = {};
			for (var j = 0; j < xmlObj.attributes.length; j++) {
				var attribute = xmlObj.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xmlObj.nodeType == 3) { // text
		obj = xmlObj.nodeValue;
	}

	// do children
	if (xmlObj.hasChildNodes()) {
		for (var i = 0; i < xmlObj.childNodes.length; i++) {
			var item = xmlObj.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].length) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};

/**
 * 鼠标进入右侧窗口事件
 */
function workspaceWindowMouseenter(){
	Ext.getCmp('workspaceWindow').setX(Ext.getBody().getWidth()-80,true);
}

/**
 * 鼠标离开右侧窗口事件
 */
function workspaceWindowMouseleave(){
	Ext.getCmp('workspaceWindow').setX(Ext.getBody().getWidth()-5,true);
}

/**
 * 相机飞行
 * @param {} fromCamera
 * @param {} toCamera
 * @return {}
 */
function fly(fromCamera,toCamera){
	var flyTime = 0;
	var current_altitude = fromCamera.get_altitude();
	if(current_altitude < 1000000){
		current_altitude = 5000000;
		fromCamera.set_tilt(0);
		fromCamera.set_altitude(current_altitude);
		scene.get_flyingOperator().flyTo(fromCamera,500,10);
		flyTime+=300;
	}
	setTimeout(function(){
		var tempCamera = new SuperMap.Web.Realspace.Camera(toCamera.get_longitude(), toCamera.get_latitude(), current_altitude);
		tempCamera.set_tilt(0);
		scene.get_flyingOperator().flyTo(tempCamera,1000,10);
		setTimeout(function(){
			scene.get_flyingOperator().flyTo(toCamera,1000,10);
		},800);
	},flyTime);
	return flyTime + 1800;
}

/**
 * 获得省份数组
 * @return {}
 */
function loadProviceArr(){
	var provinceArr = [
	        {"id":"0", "name":"安徽"},
	        {"id":"1", "name":"北京"},
	        {"id":"2", "name":"重庆"},
	        {"id":"3", "name":"福建"},
	        {"id":"4", "name":"甘肃"},
	        {"id":"5", "name":"广东"},
	        {"id":"6", "name":"广西"},
	        {"id":"7", "name":"贵州"},
	        {"id":"8", "name":"海南"},
	        {"id":"9", "name":"河北"},
	        {"id":"10", "name":"河南"},
	        {"id":"11", "name":"黑龙江"},
	        {"id":"12", "name":"湖北"},
	        {"id":"13", "name":"湖南"},
	        {"id":"14", "name":"江苏"},
	        {"id":"15", "name":"江西"},
	        {"id":"16", "name":"吉林"},
	        {"id":"17", "name":"辽宁"},
	        {"id":"18", "name":"内蒙古"},
	        {"id":"19", "name":"宁夏"},
	        {"id":"20", "name":"青海"},
	        {"id":"21", "name":"上海"},
	        {"id":"22", "name":"山东"},
	        {"id":"23", "name":"山西"},
	        {"id":"24", "name":"陕西"},
	        {"id":"25", "name":"四川"},
	        {"id":"26", "name":"天津"},
	        {"id":"27", "name":"新疆"},
	        {"id":"28", "name":"西藏"},
	        {"id":"29", "name":"云南"},
	        {"id":"30", "name":"浙江"}
	];
	return provinceArr;
}

/**
 * 根据省份ID获得城市数组
 * @param {} provinceId
 */
function loadCityArr(provinceId){
	var cityArr;
	switch(provinceId){
	case "0":
		cityArr = [{'id':'合肥','name':'合肥'},{'id':'淮北','name':'淮北'},
		                    {'id':'淮南','name':'淮南'},{'id':'黄山','name':'黄山'},
		                    {'id':'安庆','name':'安庆'},{'id':'蚌埠','name':'蚌埠'},
		                    {'id':'巢湖','name':'巢湖'},{'id':'池州','name':'池州'},
		                    {'id':'滁州','name':'滁州'},{'id':'六安','name':'六安'},
		                    {'id':'马鞍山','name':'马鞍山'},{'id':'宣城','name':'宣城'},
		                    {'id':'宿州','name':'宿州'},{'id':'铜陵','name':'铜陵'},
		                    {'id':'芜湖','name':'芜湖'},{'id':'阜阳','name':'阜阳'},
		                    {'id':'亳州','name':'亳州'}];
		break;
	case "1":
		cityArr = [{'id':'北京','name':'北京'}];
		break;
	case "2":
		cityArr = [{'id':'重庆','name':'重庆'}];
		break;
	case "3":
		cityArr = [{'id':'福州','name':'福州'},{'id':'龙岩','name':'龙岩'},
		                    {'id':'南平','name':'南平'},{'id':'宁德','name':'宁德'},
		                    {'id':'莆田','name':'莆田'},{'id':'泉州','name':'泉州'},
		                    {'id':'三明','name':'三明'},{'id':'厦门','name':'厦门'},
		                    {'id':'漳州','name':'漳州'}];
		break;
	case "4":
		cityArr = [{'id':'兰州','name':'兰州'},{'id':'甘南藏族自治州','name':'甘南藏族自治州'},
		                    {'id':'定西地区','name':'定西地区'},{'id':'白银','name':'白银'},
		                    {'id':'嘉峪关','name':'嘉峪关'},{'id':'金昌','name':'金昌'},
		                    {'id':'酒泉','name':'酒泉'},{'id':'临夏回族自治州','name':'临夏回族自治州'},
		                    {'id':'陇南地区','name':'陇南地区'},{'id':'平凉','name':'平凉'},
		                    {'id':'庆阳','name':'庆阳'},{'id':'天水','name':'天水'},
		                    {'id':'武威','name':'武威'},{'id':'张掖','name':'张掖'}];
		break;
	case "5":
		cityArr = [{'id':'广州','name':'广州'},{'id':'佛山','name':'佛山'},
		                    {'id':'惠州','name':'惠州'},{'id':'东莞','name':'东莞'},
		                    {'id':'江门','name':'江门'},{'id':'揭阳','name':'揭阳'},
		                    {'id':'潮州','name':'潮州'},{'id':'茂名','name':'茂名'},
		                    {'id':'梅州','name':'梅州'},{'id':'清远','name':'清远'},
		                    {'id':'汕头','name':'汕头'},{'id':'汕尾','name':'汕尾'},
		                    {'id':'深圳','name':'深圳'},{'id':'韶关','name':'韶关'},
		                    {'id':'阳江','name':'阳江'},{'id':'河源','name':'河源'},
		                    {'id':'云浮','name':'云浮'},{'id':'中山','name':'中山'},
		                    {'id':'珠海','name':'珠海'},{'id':'湛江','name':'湛江'},
		                    {'id':'肇庆','name':'肇庆'}];
		break;
	case "6":
		cityArr = [{'id':'南宁','name':'南宁'},{'id':'防城港','name':'防城港'},
		                    {'id':'北海','name':'北海'},{'id':'百色','name':'百色'},
		                    {'id':'贺州','name':'贺州'},{'id':'桂林','name':'桂林'},
		                    {'id':'来宾','name':'来宾'},{'id':'柳州','name':'柳州'},
		                    {'id':'崇左','name':'崇左'},{'id':'钦州','name':'钦州'},
		                    {'id':'贵港','name':'贵港'},{'id':'梧州','name':'梧州'},
		                    {'id':'河池','name':'河池'},{'id':'玉林','name':'玉林'}];
		break;
	case "7":
		cityArr = [{'id':'贵阳','name':'贵阳'},{'id':'毕节地区','name':'毕节地区'},
		                    {'id':'遵义','name':'遵义'},{'id':'安顺','name':'安顺'},
		                    {'id':'六盘水','name':'六盘水'},{'id':'黔东南苗族侗族自治州','name':'黔东南苗族侗族自治州'},
		                    {'id':'黔南布依族苗族自治州','name':'黔南布依族苗族自治州'},{'id':'黔西南布依族苗族自治','name':'黔西南布依族苗族自治'},
		                    {'id':'铜仁地区','name':'铜仁地区'}];
		break;
	case "8":
		cityArr = [{'id':'海口','name':'海口'},{'id':'三亚','name':'三亚'}];
		break;
	case "9":
		cityArr = [{'id':'石家庄','name':'石家庄'},{'id':'邯郸','name':'邯郸'},
		                    {'id':'邢台','name':'邢台'},{'id':'保定','name':'保定'},
		                    {'id':'张家口','name':'张家口'},{'id':'沧州','name':'沧州'},
		                    {'id':'承德','name':'承德'},{'id':'廊坊','name':'廊坊'},
		                    {'id':'秦皇岛','name':'秦皇岛'},{'id':'唐山','name':'唐山'},
		                    {'id':'衡水','name':'衡水'}];
		break;
	case "10":
		cityArr = [{'id':'郑州','name':'郑州'},{'id':'开封','name':'开封'},
		                    {'id':'驻马店','name':'驻马店'},{'id':'安阳','name':'安阳'},
		                    {'id':'焦作','name':'焦作'},{'id':'洛阳','name':'洛阳'},
		                    {'id':'濮阳','name':'濮阳'},{'id':'漯河','name':'漯河'},
		                    {'id':'南阳','name':'南阳'},{'id':'平顶山','name':'平顶山'},
		                    {'id':'新乡','name':'新乡'},{'id':'信阳','name':'信阳'},
		                    {'id':'许昌','name':'许昌'},{'id':'商丘','name':'商丘'},
		                    {'id':'三门峡','name':'三门峡'},{'id':'鹤壁','name':'鹤壁'},
		                    {'id':'周口','name':'周口'},{'id':'济源','name':'济源'}];
		break;
	case "11":
		cityArr = [{'id':'哈尔滨','name':'哈尔滨'},{'id':'大庆','name':'大庆'},
		                    {'id':'大兴安岭地区','name':'大兴安岭地区'},{'id':'鸡西','name':'鸡西'},
		                    {'id':'佳木斯','name':'佳木斯'},{'id':'牡丹江','name':'牡丹江'},
		                    {'id':'齐齐哈尔','name':'齐齐哈尔'},{'id':'七台河','name':'七台河'},
		                    {'id':'双鸭山','name':'双鸭山'},{'id':'绥化','name':'绥化'},
		                    {'id':'伊春','name':'伊春'},{'id':'鹤岗','name':'鹤岗'},
		                    {'id':'黑河','name':'黑河'}];
		break;
	case "12":
		cityArr = [{'id':'武汉','name':'武汉'},{'id':'黄冈','name':'黄冈'},
		                    {'id':'黄石','name':'黄石'},{'id':'恩施土家族苗族自治州','name':'恩施土家族苗族自治州'},
		                    {'id':'鄂州','name':'鄂州'},{'id':'荆门','name':'荆门'},
		                    {'id':'荆州','name':'荆州'},{'id':'孝感','name':'孝感'},
		                    {'id':'十堰','name':'十堰'},{'id':'襄樊','name':'襄樊'},
		                    {'id':'咸宁','name':'咸宁'},{'id':'宜昌','name':'宜昌'},
		                    {'id':'随州','name':'随州'}];
		break;
	case "13":
		cityArr = [{'id':'长沙','name':'长沙'},{'id':'怀化','name':'怀化'},
		                    {'id':'郴州','name':'郴州'},{'id':'常德','name':'常德'},
		                    {'id':'娄底','name':'娄底'},{'id':'邵阳','name':'邵阳'},
		                    {'id':'湘潭','name':'湘潭'},{'id':'湘西土家族苗族自治州','name':'湘西土家族苗族自治州'},
		                    {'id':'衡阳','name':'衡阳'},{'id':'永州','name':'永州'},
		                    {'id':'益阳','name':'益阳'},{'id':'岳阳','name':'岳阳'},
		                    {'id':'株洲','name':'株洲'},{'id':'张家界','name':'张家界'}];
		break;
	case "14":
		cityArr = [{'id':'南京','name':'南京'},{'id':'淮安','name':'淮安'},
		                    {'id':'常州','name':'常州'},{'id':'连云港','name':'连云港'},
		                    {'id':'南通','name':'南通'},{'id':'徐州','name':'徐州'},
		                    {'id':'苏州','name':'苏州'},{'id':'无锡','name':'无锡'},
		                    {'id':'盐城','name':'盐城'},{'id':'扬州','name':'扬州'},
		                    {'id':'镇江','name':'镇江'},{'id':'泰州','name':'泰州'},
		                    {'id':'宿迁','name':'宿迁'}];
		break;
	case "15":
		cityArr = [{'id':'南昌','name':'南昌'},{'id':'抚州','name':'抚州'},
		                    {'id':'赣州','name':'赣州'},{'id':'吉安','name':'吉安'},
		                    {'id':'景德镇','name':'景德镇'},{'id':'九江','name':'九江'},
		                    {'id':'萍乡','name':'萍乡'},{'id':'新余','name':'新余'},
		                    {'id':'上饶','name':'上饶'},{'id':'鹰潭','name':'鹰潭'},
		                    {'id':'宜春','name':'宜春'}];
		break;
	case "16":
		cityArr = [{'id':'长春','name':'长春'},{'id':'白城','name':'白城'},
		                    {'id':'白山','name':'白山'},{'id':'吉林','name':'吉林'},
		                    {'id':'辽源','name':'辽源'},{'id':'四平','name':'四平'},
		                    {'id':'松原','name':'松原'},{'id':'通化','name':'通化'},
		                    {'id':'延边朝鲜族自治州','name':'延边朝鲜族自治州'}];
		break;
	case "17":
		cityArr = [{'id':'沈阳','name':'沈阳'},{'id':'大连','name':'大连'},
		                    {'id':'阜新','name':'阜新'},{'id':'抚顺','name':'抚顺'},
		                    {'id':'本溪','name':'本溪'},{'id':'鞍山','name':'鞍山'},
		                    {'id':'丹东','name':'丹东'},{'id':'锦州','name':'锦州'},
		                    {'id':'朝阳','name':'朝阳'},{'id':'辽阳','name':'辽阳'},
		                    {'id':'盘锦','name':'盘锦'},{'id':'铁岭','name':'铁岭'},
		                    {'id':'营口','name':'营口'},{'id':'葫芦岛','name':'葫芦岛'}];
		break;
	case "18":
		cityArr = [{'id':'呼和浩特','name':'呼和浩特'},{'id':'阿拉善盟','name':'阿拉善盟'},
		                    {'id':'巴彦淖尔盟','name':'巴彦淖尔盟'},{'id':'包头','name':'包头'},
		                    {'id':'赤峰','name':'赤峰'},{'id':'兴安盟','name':'兴安盟'},
		                    {'id':'乌兰察布盟','name':'乌兰察布盟'},{'id':'乌海','name':'乌海'},
		                    {'id':'锡林郭勒盟','name':'锡林郭勒盟'},{'id':'呼伦贝尔盟','name':'呼伦贝尔盟'},
		                    {'id':'伊克昭盟','name':'伊克昭盟'},{'id':'通辽','name':'通辽'}];
		break;
	case "19":
		cityArr = [{'id':'银川','name':'银川'},{'id':'固原','name':'固原'},
		                    {'id':'石嘴山','name':'石嘴山'},{'id':'吴忠','name':'吴忠'},
		                    {'id':'中卫','name':'中卫'}];
		break;
	case "20":
		cityArr = [{'id':'西宁','name':'西宁'},{'id':'海东地区','name':'海东地区'},
		                    {'id':'海南藏族自治州','name':'海南藏族自治州'},{'id':'海北藏族自治州','name':'海北藏族自治州'},
		                    {'id':'黄南藏族自治州','name':'黄南藏族自治州'},{'id':'果洛藏族自治州','name':'果洛藏族自治州'},
		                    {'id':'玉树藏族自治州','name':'玉树藏族自治州'},{'id':'海西蒙古族藏族自治州','name':'海西蒙古族藏族自治州'}];
		break;
	case "21":
		cityArr = [{'id':'上海','name':'上海'}];
		break;
	case "22":
		cityArr = [{'id':'济南','name':'济南'},{'id':'东营','name':'东营'},
		                    {'id':'滨州','name':'滨州'},{'id':'淄博','name':'淄博'},
		                    {'id':'德州','name':'德州'},{'id':'济宁','name':'济宁'},
		                    {'id':'聊城','name':'聊城'},{'id':'临沂','name':'临沂'},
		                    {'id':'莱芜','name':'莱芜'},{'id':'青岛','name':'青岛'},
		                    {'id':'日照','name':'日照'},{'id':'威海','name':'威海'},
		                    {'id':'泰安','name':'泰安'},{'id':'潍坊','name':'潍坊'},
		                    {'id':'烟台','name':'烟台'},{'id':'菏泽','name':'菏泽'},
		                    {'id':'枣庄','name':'枣庄'}];
		break;
	case "23":
		cityArr = [{'id':'太原','name':'太原'},{'id':'大同','name':'大同'},
		                    {'id':'晋城','name':'晋城'},{'id':'晋中','name':'晋中'},
		                    {'id':'长治','name':'长治'},{'id':'临汾','name':'临汾'},
		                    {'id':'吕梁地区','name':'吕梁地区'},{'id':'忻州','name':'忻州'},
		                    {'id':'朔州','name':'朔州'},{'id':'阳泉','name':'阳泉'},
		                    {'id':'运城','name':'运城'}];
		break;
	case "24":
		cityArr = [{'id':'西安','name':'西安'},{'id':'宝鸡','name':'宝鸡'},
		                    {'id':'安康','name':'安康'},{'id':'商洛','name':'商洛'},
		                    {'id':'铜川','name':'铜川'},{'id':'渭南','name':'渭南'},
		                    {'id':'咸阳','name':'咸阳'},{'id':'延安','name':'延安'},
		                    {'id':'汉中','name':'汉中'},{'id':'榆林','name':'榆林'}];
		break;
	case "25":
		cityArr = [{'id':'成都','name':'成都'},{'id':'达川','name':'达川'},
		                    {'id':'甘孜藏族自治州','name':'甘孜藏族自治州'},{'id':'自贡','name':'自贡'},
		                    {'id':'阿坝藏族羌族自治州','name':'阿坝藏族羌族自治州'},{'id':'巴中','name':'巴中'},
		                    {'id':'德阳','name':'德阳'},{'id':'广安','name':'广安'},
		                    {'id':'广元','name':'广元'},{'id':'凉山彝族自治州','name':'凉山彝族自治州'},
		                    {'id':'乐山','name':'乐山'},{'id':'攀枝花','name':'攀枝花'},
		                    {'id':'南充','name':'南充'},{'id':'内江','name':'内江'},
		                    {'id':'泸州','name':'泸州'},{'id':'绵阳','name':'绵阳'},
		                    {'id':'遂宁','name':'遂宁'},{'id':'雅安','name':'雅安'},
		                    {'id':'宜宾','name':'宜宾'},{'id':'眉山','name':'眉山'},
		                    {'id':'资阳','name':'资阳'}];
		break;
	case "26":
		cityArr = [{'id':'天津','name':'天津'}];
		break;
	case "27":
		cityArr = [{'id':'乌鲁木齐','name':'乌鲁木齐'},{'id':'喀什地区','name':'喀什地区'},
		                    {'id':'克孜勒苏柯尔克孜自治','name':'克孜勒苏柯尔克孜自治'},{'id':'克拉玛依','name':'克拉玛依'},
		                    {'id':'阿克苏地区','name':'阿克苏地区'},{'id':'阿勒泰地区','name':'阿勒泰地区'},
		                    {'id':'巴音郭楞蒙古自治州','name':'巴音郭楞蒙古自治州'},{'id':'哈密地区','name':'哈密地区'},
		                    {'id':'博尔塔拉蒙古自治州','name':'博尔塔拉蒙古自治州'},{'id':'昌吉回族自治州','name':'昌吉回族自治州'},
		                    {'id':'塔城地区','name':'塔城地区'},{'id':'吐鲁番地区','name':'吐鲁番地区'},
		                    {'id':'和田地区','name':'和田地区'},{'id':'石河子','name':'石河子'},
		                    {'id':'伊犁哈萨克自治州','name':'伊犁哈萨克自治州'}];
		break;
	case "28":
		cityArr = [{'id':'拉萨','name':'拉萨'},{'id':'阿里地区','name':'阿里地区'},
		                    {'id':'昌都','name':'昌都'},{'id':'林芝地区','name':'林芝地区'},
		                    {'id':'那曲地区','name':'那曲地区'},{'id':'山南地区','name':'山南地区'},
		                    {'id':'日喀则地区','name':'日喀则地区'}];
		break;
	case "29":
		cityArr = [{'id':'昆明','name':'昆明'},{'id':'大理白族自治州','name':'大理白族自治州'},
		                    {'id':'昭通','name':'昭通'},{'id':'保山','name':'保山'},
		                    {'id':'德宏傣族景颇族自治州','name':'德宏傣族景颇族自治州'},{'id':'迪庆藏族自治州','name':'迪庆藏族自治州'},
		                    {'id':'楚雄彝族自治州','name':'楚雄彝族自治州'},{'id':'临沧地区','name':'临沧地区'},
		                    {'id':'丽江','name':'丽江'},{'id':'怒江傈僳族自治州','name':'怒江傈僳族自治州'},
		                    {'id':'曲靖','name':'曲靖'},{'id':'思茅地区','name':'思茅地区'},
		                    {'id':'西双版纳傣族自治州','name':'西双版纳傣族自治州'},{'id':'文山壮族苗族自治州','name':'文山壮族苗族自治州'},
		                    {'id':'红河哈尼族彝族自治州','name':'红河哈尼族彝族自治州'},{'id':'玉溪','name':'玉溪'}];
		break;
	case "30":
		cityArr = [{'id':'杭州','name':'杭州'},{'id':'嘉兴','name':'嘉兴'},
		                    {'id':'金华','name':'金华'},{'id':'衢州','name':'衢州'},
		                    {'id':'丽水','name':'丽水'},{'id':'宁波','name':'宁波'},
		                    {'id':'绍兴','name':'绍兴'},{'id':'台州','name':'台州'},
		                    {'id':'温州','name':'温州'},{'id':'湖州','name':'湖州'},
		                    {'id':'舟山','name':'舟山'}];
		break;
	default:
		break;
	}
	return cityArr;
}
