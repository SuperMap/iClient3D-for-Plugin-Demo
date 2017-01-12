function _IncludeScript(inc){
  var script='<'+'script type="text/javascript" src="demo_version2.0/lib/lib_Realspace/'+inc+'"'+'><'+'/script>'; 
	document.writeln(script); 
}

function _Include2DScript(inc){
	var script='<'+'script type="text/javascript" src="demo_version2.0/lib/lib_Ajax/'+inc+'"'+'><'+'/script>'; 
	document.writeln(script); 
}

if(!Function.__typeName)
{    
    _Include2DScript('MicrosoftAjax.js'); 

	_Include2DScript('SuperMap-7.1.1-12316.js');

    _IncludeScript('SuperMap.Web.Realspace.js');  
	
}
