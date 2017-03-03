var mytable;
var classListData;
var $depotList = $('#depotList');
var $productList = $('#productList'); 
$(function() { 
    mytable = InitDataTable({
        $el: $depotList, //表格dom选择器
        url: InterfaceUrl.goodsDepotList, //表格列表数据  
        checkbox: true,
        valKey: 'id',
        sourceKey: 'goodsList',
        ajaxdata: { "pageNum": 1, "channelId": getChannelId() },
        tableOpts: {
            data: {
                "goodsNo": {
                    title: "商品编号",
                    render: function(data, type, row, meta) {
                        var _html = '<input type="hidden" name="goodsNo" value="'+ row.goodsNo +'" />'+ data;
                        return _html;
                    }
                },
                "goodsName": { title: "商品名称" }
            }
        }
    });

    $('#searchBtn').bind('click', function(){ //搜索按钮
        var _val = $('#searchInfo').val();
        var _postData = {};
        if( _val == "" ){
            return;
        };
        _postData = $.extend( mytable.getAjaxData(), {pageNum: 1, searchInfo: _val} ); 
        mytable.reloadByParam( _postData ); 
    });

    $('#clearBtn').bind('click', function(){ //清除按钮 
        var _postData = $.extend( mytable.getAjaxData(), {pageNum: 1, searchInfo: ''} );
        mytable.reloadByParam( _postData ); 
    });

    /*编辑表单的时候,校验输入有效性*/
    $('#productForm').on('focus', 'input', function(){ 
        $(this).siblings('.text-red').remove();
        $(this).parent('.form-group').removeClass('has-error'); 

    }).on('blur', 'input', function(){
        var $this = $(this);

        if( this.value == '' ){  
            $this.parent('.form-group').addClass('has-error'); 
            $this.after('<span class="text-red">必填</span>');
            return;
        };  
        
        if( this.name == "needIntegral"){
            if(!/^[0-9]*$/.test( this.value )){
                $this.parent('.form-group').addClass('has-error'); 
                $this.after('<span class="text-red">请填数字</span>');
            };
            return;
        };
        if(!/^[0-9.]*$/.test( this.value )){
            $this.parent('.form-group').addClass('has-error'); 
            $this.after('<span class="text-red">请填数字</span>');
        };
    });
});

/*======== 点击保存按钮 ========*/
function save(){
    var formArry = $('#productForm').serializeArray();
    var _const = 5;
    var _obj = {};
    var formData = [];
    var $required = $('#productForm').find('[required]');

    if( $required.length == 0 ){
        layer.alert('请选择要添加的商品');
        return;
    }; 

    if( !validateForm( $required )){ //输入不有效
        return;
    };

    for( var i = 0; i < formArry.length; i++ ){
        var _name = formArry[i].name;
        var _val = formArry[i].value;
        _obj[ _name ] = _val;

        if( i % _const == ( _const - 1 ) ){
            formData.push( _obj );
            _obj = {}; 
        }; 
    };   

    formData.channelId = getChannelId();
    Ajaxjson(InterfaceUrl.addGoods, formData, function(res) { 
        location.href = 'productList.html'; 
    }); 
};

/*======== 表单校验 ========*/
function validateForm( $input ){
    var _flag = true;
    $input.each(function( i, el ){
        var $el = $(el); 
        if( el.value == '' ){ 
            _flag = false;
            $el.parent('.form-group').addClass('has-error'); 
            $el.after('<span class="text-red">必填</span>');
        }; 
    }); 
    return _flag; 
};
 
/*======== 添加商品 ========*/
function addProduct() {
    var $checkedTr = $depotList.find('tbody [type="checkbox"]:checked').parent().parent();

    if( $checkedTr.length == 0 ){
        layer.alert('请选择要添加的商品');
        return;
    };

    $checkedTr.find('[type="checkbox"]').attr('checked', false);
    $checkedTr.append(productTrHtml()).appendTo($productList.find('tbody'));

    if (!classListData) {
        /*== 请求商品分类数据 ==*/
        Ajaxjson(InterfaceUrl.classList, { "pageNum": 1, "channelId": getChannelId() }, function(res) {
            classListData = res.classList;
            $productList.find('[name="classId"]').html(renderClassList(res.classList));
            setTableParam();
            mytable.refresh();
        });
    } else {
        setTableParam();
        mytable.refresh();
    }; 
};

/*======== 删除商品 ========*/
function removeProduct() {
    var $checkedTr = $productList.find('[type="checkbox"]:checked').parent().parent();

    if( $checkedTr.length == 0 ){
        layer.alert('请选择要删除的商品');
        return;
    };
    $checkedTr.remove();
    setTableParam();
    mytable.refresh();
};

/*======== 向产品列表里面添加列 ========*/
function productTrHtml() {
    var _classListSelect = '<select class="form-control" name="classId"></select>';
    if (classListData) {
        _classListSelect = '<select class="form-control" name="classId">' + renderClassList(classListData) + '</select>';
    };

    var _payTypeList = '<select class="form-control" onChange="changePayType(this)" name="payType">' + renderPayType() + '</select>';
    var _html = '<td>' + _classListSelect + '</td><td>' + _payTypeList + '</td>'+
    '<td><div class="form-group"><input type="text" readonly="readonly" name="needMoney" class="form-control" /></div></td>'+
    '<td><div class="form-group"><input type="text" name="needIntegral" class="form-control" required /></div></td>';

    return _html;
};

/*======== 切换支付方式的时候操作table的可编辑选项 ========*/
function changePayType(el) {
    var $tds = $(el).parent().siblings('td');
    var $needIntegral = $tds.find('[name="needIntegral"]'); //积分
    var $needMoney = $tds.find('[name="needMoney"]'); //金额

    switch (el.value) {
        case "1": //积分
            $needIntegral.removeAttr('readonly'); 
            $needIntegral.attr('required', true); 
            $needMoney.prop('readonly', 'readonly');
            $needMoney.removeAttr('required'); 
            $needMoney.val('');
            break;
        case "2": //现金
            $needIntegral.prop('readonly', 'readonly');
            $needIntegral.removeAttr('required'); 
            $needIntegral.val('');
            $needMoney.removeAttr('readonly');
            $needMoney.attr('required', true);
            break;
        case "3": //积分+现金
            $needMoney.removeAttr('readonly');
            $needMoney.attr('required', true);
            $needIntegral.removeAttr('readonly');
            $needIntegral.attr('required', true); 
            break;
    };
};
/*======== 渲染支付方式下拉选择框 ========*/
function renderPayType() {
    var data = PayTypeList;
    var _html = '';
    for (var i = 0, l = data.length; i < l; i++) {
        var _d = data[i];
        _html += '<option value="' + _d.id + '">' + _d.className + '</option>';
    };
    return _html;
};

/*======== 渲染商品分类下拉选项列表 ========*/
function renderClassList(data) {
    var _html = '';
    for (var i = 0, l = data.length; i < l; i++) {
        var _d = data[i];
        _html += '<option value="' + _d.id + '">' + _d.className + '</option>';
    };
    return _html;
};

/*======== 商品库列表的过滤参数 ========*/
function setTableParam() {
    var $trs = $productList.find('tbody tr');
    var idArry = [];
    var _currentParam = mytable.getAjaxData();
    var _newParam = {};

    $trs.each(function(i, el) {
        idArry.push($(el).attr('data-id'));
    });
    _newParam = $.extend({}, _currentParam, {
        idStr: idArry.join(',')
    });
    mytable.setAjaxData(_newParam);
};
