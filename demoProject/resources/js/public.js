/*===============================================================
 * 读取input[file]上传之后的图片地址
 * obj: files[i]
 * call: function( src ); 获取地址的回调，参数为img的地址  
 **/
function readImgfileURL(obj, call) {
    var oFile = obj;
    var oFReader = new FileReader(),
        rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

    oFReader.onload = function(oFREvent) {
        if (call) {
            call(oFREvent.target.result);
        };
    };
    if (!rFilter.test(oFile.type)) {
        return;
    };
    oFReader.readAsDataURL(oFile);
};

/*=====================================================
 * 获取缓存的token
 */
function getToken() {
    return window.localStorage.getItem("token");
};
/*=====================================================
 * 缓存ChannelId
 */
function setChannelId(val) {
    window.localStorage.setItem("channelId", val);
};
/*=====================================================
 * 获取缓存的ChannelId
 */
function getChannelId() {
    return window.localStorage.getItem("channelId");
};
/*=================================================
 * 给指定表单赋值
 */
function AssignForm(formSelector, data) {
    var _$form = formSelector;

    for (var i in data) {
        var $input = _$form.find('[name="' + i + '"]');
        if ($input.length > 0) {
            var _val = data[i];

            $input.val(_val);
        };
    };
};
/*==================================================
 * 返回搜索表单值
 */
function getSearchData() {
    var _postdata = $.extend({}, serializeFormData($('#submit_form')));
    _postdata.pageNum = 1;
    return _postdata;
};

/*==================================================
 * 序列化表单，返回json格式的表单数据  
 */
function serializeFormData($el) {
    var _formdata = $el.serializeArray();
    var _postdata = {};

    for (var i = 0, l = _formdata.length; i < l; i++) {
        var _d = _formdata[i];
        var _name = _d.name;
        _postdata[_name] = _d.value;
    };
    return _postdata;
};

/*=======================================================================
 * 页面跳转
 */
function HrefTo(url) {
    top.location.href = url;
};

/*====================================================================
 * 给指定字符串进行md5加密
 */
function newHexMd5(val) {
    return hex_md5(val + 'md5');
};

/*==========================================================
 * post方式发的ajax请求
 */
function Ajaxjson(_url, _data, call) {
    var $loading = $('<div class="modal fade in modal-ajax" style="display: block;"><i class="fa fa-refresh fa-spin"></i></div>');
    $loading.appendTo('body');

    $.ajax({
        url: _url + '?X-TokenAccess=' + getToken(),
        type: "POST",
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(_data),
        success: function(res) {
            $loading.remove();

            if (res.status == 0) { //操作失败
                layer.msg(res.message, { icon: 0, time: 1000 });
                return;
            };
            if (call) {
                call(res);
            };
        },
        error: function(res) {
            $loading.remove();
            layer.alert('请求失败');
        }

    });
};

/*=============================================================
 * get方式发的ajax
 */
function AjaxjsonGet(_url, call) {
    var $loading = $('<div class="modal fade in modal-ajax" style="display: block;"><i class="fa fa-refresh fa-spin"></i></div>');
    $loading.appendTo('body');

    $.ajax({
        url: _url + '?X-TokenAccess=' + getToken(),
        type: "GET",
        success: function(res) {
            $loading.remove();

            if (res.status == 0) { //操作失败
                layer.msg(res.message, { icon: 0, time: 1000 });
                return;
            };

            if (call) {
                call(res);
            };
        },
        error: function( res ) { 
            $loading.remove();
            layer.alert('请求失败');
        }

    });
};

/*=============================================================
 * 获取该模块可操作的按钮,先给操作按钮按res的值指定data-module属性，
 * 并添加hide样式；如果该按钮可被操作，则删除hide属性
 */
function AjaxGetModuleByPid(id, call) {
    var $loading = $('<div class="modal fade in modal-ajax" style="display: block;"><i class="fa fa-refresh fa-spin"></i></div>');
    $loading.appendTo('body');

    $.ajax({
        url: InterfaceUrl.getModuleByPid + '?id='+ id +'&X-TokenAccess=' + getToken(),
        type: "GET",
        success: function(res) {
            $loading.remove();

            if (res.status == 0) { //操作失败
                layer.msg(res.message, { icon: 0, time: 1000 });
                return;
            };

            if (call) {
                var _descData = [];
                var _srcData = res.moduleList;
                for(var i = 0, l = _srcData.length; i < l; i++){
                    var _key = _srcData[i].module_matched_key;
                    var $el = $('[data-module="'+ _key +'"]');
                    if( $el.length > 0 ){
                        $el.removeClass('hide');
                    };
                    _descData.push( _key );
                };  
                call( _descData );
            };
        },
        error: function( res ) { 
            $loading.remove();
            layer.alert('请求失败');
        }

    });
};
/*=============================================================
 * form方式发的ajax
 */
function AjaxjsonForm(_url, formData, call) {
    var $loading = $('<div class="modal fade in modal-ajax" style="display: block;"><i class="fa fa-refresh fa-spin"></i></div>');
    $loading.appendTo('body');

    $.ajax({
        url: _url + '?X-TokenAccess=' + getToken(),
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(res) {
            $loading.remove();
            if (res.status == 0) {
                layer.alert(res.message, { icon: 0 });
                return;
            };
            if (call) {
                call(res);
            };
        },
        error: function(res) {
            $loading.remove();
            layer.alert(res.message, { icon: 0 });
        }
    });
};
