loadScriptFile([   
    "../../resources/js/pageloading.js",
    "../../resources/js/jQuery-2.2.0.min.js",  
    "../../resources/thirdparty/layer/layer.js", 
    "../../resources/js/variable.js", 
    "../../resources/js/public.js"
]);

function loadScriptFile(filearry) {
    for (var i = 0, l = filearry.length; i < l; i++) {
        var _file = filearry[i];
        document.write('<script language=javascript src="' + _file + '"></script>');
    };
}; 
