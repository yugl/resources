loadCssFile([  
	"../../resources/css/public/bootstrap.min.css",
    "../../resources/css/public/font-awesome.min.css",
    "../../resources/css/public/AdminLTE.min.css",   
    "../../resources/css/public/skins/_all-skins.min.css", 
    "../../resources/css/public/bootstrap.min.btn.css",
    "../../resources/css/style/style.css"
]); 

function loadCssFile(filearry) {
    for (var i = 0, l = filearry.length; i < l; i++) {
        var _file = filearry[i];
        document.write('<link rel="stylesheet" href="' + _file + '">');
    };
}; 
