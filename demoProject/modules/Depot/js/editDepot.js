var _id = location.href.split('id=')[1];
var formValidate = InitValidateForm($('#uploadForm'));
//请求商品信息数据 
AjaxjsonGet(InterfaceUrl.getDepotGoodsById + _id, function(res) {
    var data = res.depotInfo; 
    $('#goodsId').val( _id );
    $("#goodsName").val(data.goodsName);
    $("#marketPrice").val(data.marketPrice);
    $("#goodsDescrible").val(data.goodsDescrible);
    $("#instruction").val(data.instruction);
    $("#isVirtue").val(data.goodsProperty);

    initUploadBox('goodsDetailImg', data.goodsDetailImg );
    initUploadBox('goodsImg', data.goodsImg ); 

    if ( !data.goodsProperty ) {
        $("#cartDiscount").removeClass('hide');
    };
});
/*======== 初始化上传区域 ========*/
function initUploadBox( str, data ){
    if( data.length == 0){
        return;
    };
    var $el = $('[name="'+ str +'"]');
    var $parent = $el.parent();
    var $imgBox = $parent.siblings('.img-box');
    var $textInfo = $parent.siblings('.text-info');
    var $uploadfileBox = $parent.parent('.uploadfile-box');

    $textInfo.html('');
    $uploadfileBox.removeClass('no-img');

    for(var i = 0, l = data.length; i < l; i++){ 
        $imgBox.append('<img src="' + data[i] + '" >');
    };
};
/*渲染选择上传之后的图片列表*/
function renderUploadImg(el) {
    var $parent = $(el).parent();
    var $imgBox = $parent.siblings('.img-box');
    var $textInfo = $parent.siblings('.text-info');
    var $uploadfileBox = $parent.parent('.uploadfile-box');
    var maxNum = 5; //最多允许上传的图片个数
    var fileLen = el.files.length;

    $imgBox.html('');

    if (fileLen === 0 || fileLen > 5) {
        var _msg = (fileLen === 0 ? '您没有选择图片' : '您最多可上传五张图片');
        layer.alert(_msg, { icon: 0 });

        $uploadfileBox.addClass('no-img');
        $textInfo.html('最多上传' + maxNum + '张图');
        return;
    };

    $textInfo.html('已经上传' + fileLen + '张图');
    $uploadfileBox.removeClass('no-img');

    for (var i = 0, l = fileLen; i < l; i++) {
        readImgfileURL(el.files[i], function(src) {
            $imgBox.append('<img src="' + src + '" >');
        });
    };

};
//商品类型
$("#isVirtue").on('change', function() {
    var $this = $(this); 
    if ($this.val() == 0) {
        $("#cartDiscount").removeClass('hide');
    } else {
        $("#cartDiscount").addClass('hide');
    }
});
//点击提交按钮
$('#submit').bind('click', function() {
    if (formValidate.validnew()) {
        var _postData = $.extend({}, formValidate.serializeObject());
        if ($('[name="goodsImg"]').parent().siblings('.img-box').find('img').length == 0 || $('[name="goodsDetailImg"]').parent().siblings('.img-box').find('img').length == 0) {
            var _msg = ($('[name="goodsImg"]').val() == '' ? '请上传商品图片' : '请上传商品详情图片');
            layer.alert(_msg);
            return;
        };
        var formData = new FormData($("#uploadForm")[0]); 
        $.ajax({
            url: InterfaceUrl.editDepotGoods,
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status == 0) {
                    layer.alert(res.message, { icon: 0 });
                    return;
                };
                layer.alert(res.message, {
                    icon: 1,
                    yes: function( index ) { 
                        HrefTo('depotList.html');
                    }
                });
            },
            error: function(res) {
                layer.alert(res.message, { icon: 0 });
            }
        });
    };
});
