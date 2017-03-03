var formValidate = InitValidateForm($('#uploadForm'));

//商品类型
$("#isVirtue").on('change', function() {
    var $this = $(this);
    if ($this.val() == 0) {
        $("#cartDiscount").removeClass('hide');
    } else {
        $("#cartDiscount").addClass('hide');
    }
});

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

//点击提交按钮
$('#submit').bind('click', function() {

    if (formValidate.validnew()) {
        var _postData = $.extend({}, formValidate.serializeObject());
        if ($('[name="goodsImg"]').val() == '' || $('[name="goodsDetailImg"]').val() == '') {
            var _msg = ($('[name="goodsImg"]').val() == '' ? '请上传商品图片' : '请上传商品详情图片');
            layer.alert(_msg);
            return;
        };
        var formData = new FormData($("#uploadForm")[0]);
        $.ajax({
            url: InterfaceUrl.addDepotGoods,
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
