$(function() {
    var $thead = $('#uploadForm thead');
    var $tbody = $('#uploadForm tbody');
    var $theadChk = $thead.find('[type="checkbox"]');

    $theadChk.change(function() { //勾选表头上的checkbox

        var $tbodyCheckbox = $tbody.find('[type="checkbox"]');
        if ($tbodyCheckbox.length == 0) {
            return;
        };
        if (this.checked) {
            $tbodyCheckbox.prop('checked', 'checked');
        } else {
            $tbodyCheckbox.prop('checked', false);
        };
    });
    $tbody.on('change', '[type="checkbox"]', function() {
        if (this.checked) {
            var $tbodyCheckbox = $tbody.find('[type="checkbox"]');

            if ($tbodyCheckbox.length == $tbodyCheckbox.filter(':checked').length) {
                $theadChk.prop('checked', 'checked');
            };
        } else {
            $theadChk.prop('checked', false);
        };
    });
    $tbody.on('focus', '[type="text"],[type="file"]', function() { 
    	var $this = $(this);
    	$this.parents('.form-group').removeClass('has-error');
    	if( this.type == 'file'){
    		$this.parent('.file-btn').siblings('.text-red').remove();
    	}else{
    		$this.siblings('.text-red').remove();
    	}; 
    }).on('blur', '[type="text"],[type="file"]', function() { 
    	var $this = $(this);
    	if( $this.val() == '' && $this.attr('required')){
    		$this.parents('.form-group').addClass('has-error');
    		$this.after('<span class="text-red">必填</span>');
    	}; 
    });
    $('#submit').bind('click', function() {
        var $tr = $tbody.find('tr');
        var postData = [];

        $tr.each(function(i, e) {
            var _obj = {};
            var $goodsImgInput = $(e).find('[data-name="goodsImg"]');
            var $goodsImg = $goodsImgInput.siblings('.img-box').find('img');
            var $goodsDetailImgInput = $(e).find('[data-name="goodsDetailImg"]');
            var $goodsDetailImg = $goodsDetailImgInput.siblings('.img-box').find('img');
            var _goodsImg = [];
            var _goodsDetailImg = [];

            _obj.goodsName = validateForm( $(e).find('[name="goodsName"]') );
            _obj.marketPrice = validateForm( $(e).find('[name="marketPrice"]') );
            _obj.goodsDescrible = validateForm( $(e).find('[name="goodsDescrible"]') ); 
            _obj.instruction = validateForm( $(e).find('[name="instruction"]') ); 
            _obj.goodsProperty = validateForm( $(e).find('[name="goodsProperty"]') ); 



            for (var j1 = 0, l1 = $goodsImg.length; j1 < l1; j1++ ) {
                _goodsImg.push($goodsImg[j1].src);
            };
            _obj.goodsImg = _goodsImg; 
            if( _goodsImg.length == 0 && !$goodsImgInput.parent('.form-group').hasClass('has-error') ){ 
            	$goodsImgInput.parent('.form-group').addClass('has-error'); 
            	$goodsImgInput.after('<span class="text-red">请选择</span>');
            };

            for (var j2 = 0, l2 = $goodsDetailImg.length; j2 < l2; j2++) {
                _goodsDetailImg.push($goodsDetailImg[j2].src);
            };
            _obj.goodsDetailImg = _goodsDetailImg;
            if( _goodsDetailImg.length == 0 && !$goodsDetailImgInput.parent('.form-group').hasClass('has-error')){
            	$goodsDetailImgInput.parent('.form-group').addClass('has-error');
            	$goodsDetailImgInput.after('<span class="text-red">请选择</span>');
            };
            postData.push( _obj );  
        }); 
 		if( $tbody.find('.has-error').length > 0 ){
 			return;
 		};
        Ajaxjson(InterfaceUrl.addMultiGoods, postData, function(res) {  
        	layer.alert(res.message, {
                icon: 1,
                yes: function( index ) { 
                    HrefTo('depotList.html');
                }
            });
	    });
    });
});
/*======== 验证输入的有效性 ========*/
function validateForm( $el ){  
	var _val = $el.val();
	var $parent = $el.parents('.form-group');

	if( _val == '' && $el.attr('required') && !$parent.hasClass('has-error') ){
		$parent.addClass('has-error');
		$el.after('<span class="text-red">必填</span>');
	};
	return _val;
};
/*======== 删除选中的商品 ========*/
function removeTr() {
    var $tbody = $('#uploadForm tbody');
    var $tr = $tbody.find('[type="checkbox"]:checked').parents('tr');
    $tr.remove();
};
/*======== 添加一件商品 ========*/
function addOne(el) {
    var $tr = $(el).parent().parent().siblings('.hide').clone(true).removeAttr('class');
    $tr.appendTo($('tbody'));
};
/*========= 添加批量商品 ========*/
function addMulti(data) { 
    var _len = data.length;
    if (_len == 0) {
        return;
    };
    var $tfoot = $('#uploadForm tfoot');
    var $tbody = $('#uploadForm tbody');
    var _trHtml = '';
    for (var i = 0; i < _len; i++) {
        var _d = data[i];
        var _d_goodsName = _d["goodsName"];
        var _d_marketPrice = _d["marketPrice"];
        var _d_goodsDescrible = _d["goodsDescrible"];
        var _d_instruction = _d["instruction"];
        var _d_goodsProperty = _d["goodsProperty"];

        if( !_d_goodsName || !_d_marketPrice || !_d_goodsDescrible || !_d_instruction || !_d_goodsProperty ){
        	continue;
        };
        var _goodsName = (_d_goodsName == '' ? 
        	'<div class="form-group"><input class="form-control" type="text" name="goodsName"></div>' : 
        	'<input type="hidden" name="goodsName" value="'+ _d_goodsName +'">' + _d_goodsName);
        var _marketPrice = (_d_marketPrice == '' ? 
        	'<div class="form-group"><input class="form-control" type="text" name="marketPrice"></div>' : 
        	'<input type="hidden" name="marketPrice" value="'+ _d_marketPrice +'">' + _d_marketPrice);
        var _classDescrible = (_d_goodsDescrible == '' ? 
        	'<div class="form-group"><textarea class="form-control" name="goodsDescrible"></textarea></div>' : 
        	'<input type="hidden" name="goodsDescrible" value="'+ _d_goodsDescrible +'">' + _d_goodsDescrible);
        var _instruction = (_d_instruction == '' ? 
        	'<div class="form-group"><textarea class="form-control" name="instruction"></textarea></div>' : 
        	'<input type="hidden" name="instruction" value="'+ _d_instruction +'">' + _d_instruction);
        var _goodsStatus = '';

        if (_d["goodsProperty"] == 0) { 
            _goodsStatus = '<input type="hidden" name="goodsProperty" value="0">虚拟商品';
        }else if (_d["goodsProperty"] == 1) { 
            _goodsStatus = '<input type="hidden" name="goodsProperty" value="1">实体商品';
        }else{
        	_goodsStatus = '<div class="form-group"><select class="form-control" name="goodsProperty">' +
            '<option value="1">实体商品</option>' +
            '<option value="0">虚拟商品</option>' +
            '</select></div>';
        }; 

        _trHtml += ('<tr><td><input type="checkbox"></td><td>' + _goodsName + '</td>' +
            '<td>' + _marketPrice + '</td>' +
            '<td>' + _classDescrible + '</td>' +
            '<td>' + _instruction + '</td>' +
            '<td>' + _goodsStatus + '</td>' +
            '<td>' + $tfoot.find('[data-name="goodsImg"]').parents('td').html() + '</td>' +
            '<td>' + $tfoot.find('[data-name="goodsDetailImg"]').parents('td').html() + '</td></tr>');
    };
    $tbody.append(_trHtml);
};
/*======== 上传excel文件 ========*/
function uploadExcel(el) {
    if (el.files[0].name.indexOf('xls') < 0) {
        layer.alert('请上传excel文件!', { icon: 1 });
        return;
    };
    var formData = new FormData($("#excelForm")[0]);
    var $loading = $('<div name="aa" class="modal fade in modal-ajax" style="display: block;"><i class="fa fa-refresh fa-spin"></i></div>');
    $loading.appendTo('body');
    $.ajax({
        url: InterfaceUrl.addGoodsByFile,
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
            addMulti(res.goodsList);
        },
        error: function(res) {
            $loading.remove();
            layer.alert(res.message, { icon: 0 });
        }
    });
};
/*======== 渲染上传之后的图片 ========*/
function renderUploadImg(el) {
    var $parent = $(el).parent();
    var $imgBox = $parent.siblings('.img-box');
    var $uploadfileBox = $parent.parent('.uploadfile-box');
    var $form = $uploadfileBox.parent('form');
    var $input = $(el).parents('td').children('input');
    var maxNum = 5; //最多允许上传的图片个数
    var fileLen = el.files.length;

    $imgBox.html('');

    if (fileLen === 0 || fileLen > 5) {
        var _msg = (fileLen === 0 ? '您没有选择图片' : '您最多可上传五张图片');
        layer.alert(_msg, { icon: 0 });

        $uploadfileBox.addClass('no-img');
        return;
    };
    if ($form.length == 0) {
        $uploadfileBox.wrap('<form></form>');
        $form = $uploadfileBox.parent('form');
    };

    AjaxjsonForm(InterfaceUrl.uploadFtpServer, new FormData($form[0]), function(res) {

        var _data = res.goodsImg;
        if (_data.length == 0) {
            return;
        };
        $uploadfileBox.removeClass('no-img');
        $input.val(_data.join(','));
        for (var i = 0, l = _data.length; i < l; i++) {
            $imgBox.append('<img src="' + _data[i] + '" >');
        };
    });

};
