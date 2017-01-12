var scene = null;
var sceneControl = null;
var selection3D = null;
var layer3DWMS = null;
var pathName = window.location.pathname.substring(1);
var webName = pathName == '' ? '' : pathName;

//iserver服务地址
var iserverUrl = 'http://www.isupermap.com/';
//场景服务地址
var sceneUrl = iserverUrl + 'realspace/services/realspace-Demo1/rest/realspace';
//兴趣点服务地址
var poiUrl = 'http://182.92.150.115:8291/iserver/services/localsearch/rest/searchdatas/China/poiinfos.rjson';

//场景名
var sceneName = 'scene';

//tomcat服务地址
var tomcatUrl = 'http://www.isupermap.com/';
//var tomcatUrl = 'http://localhost:8080/';

//飞行路线目录
var flyRoutesDir = tomcatUrl + '/'+webName+'/demo_version2.0/xml/';
//图片目录
var imageDir = 'demo_version2.0/images/';
//模型目录
var modelDir = tomcatUrl + '/'+webName+'/demo_version2.0/model/';
//图层导览xml存放地址
var layerGuideXmlUrl = 'demo_version2.0/xml/camera.xml';
//图层查询xml存放地址
var layerSearchXmlUrl = 'demo_version2.0/xml/layers.xml';
//场景服务列表xml存放地址
var sceneListXmlUrl = 'demo_version2.0/xml/sceneList.xml';
// 水面效果ID
var waterIDGlobal = 100;
// 倾斜数据压平图层
var flatGlobal = '紫金';
// 倾斜数据矢量图层
var vectorGlobal = '建筑物@DOM1';
// 倾斜数据专题图层
var themeGlobal = '建筑物@DOM1$1';
// 当前地名
var placeNameGlobal = '紫金';

Ext.useShims=true;
Ext.QuickTips.init();