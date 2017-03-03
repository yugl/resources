var classListData = [];
var mytable;
$(function() {
    var moduleOperates;

    AjaxGetModuleByPid(location.href.split('?id=')[1], function(data) {
        moduleOperates = data.join(',');
        mytable = InitDataTable({
            $el: $('#tableList'), //表格dom选择器
            url: InterfaceUrl.productList, //表格列表数据  
            checkbox: true,
            valKey: 'id',
            sourceKey: 'goodsList',
            ajaxdata: { "pageNum": 1, "channelId": getChannelId() },
            tableOpts: {
                data: {
                    "goodsNo": { title: "商品编号" },
                    "goodsName": { title: "商品名称" },
                    "marketPrice": { title: "市场价格" },
                    "needIntegral": { title: "兑换积分" },
                    "needMoney": {
                        title: "兑换金额",
                        render: function(data, type, row, meta) {
                            return (!data ? '' : data);
                        }
                    },
                    "goodsProperty": {
                        title: "商品属性",
                        render: function(data, type, row, meta) {
                            return (data == 0 ? '虚拟商品' : '实体商品');
                        }
                    },
                    "className": {
                        title: "商品分类"
                    },
                    "goodsStatus": {
                        title: "商品状态",
                        render: function(data, type, row, meta) {
                            if (moduleOperates.indexOf('changeStatus') < 0) {
                                return '';
                            };
                            var _status0 = '',
                                _status1 = '',
                                _status2 = '',
                                _html = '';
                            switch (data) {
                                case 0:
                                    _status0 = 'selected = "selected"';
                                    break;
                                case 1:
                                    _status1 = 'selected = "selected"';
                                    break;
                                case 2:
                                    _status2 = 'selected = "selected"';
                                    break;
                            };
                            _html = ('<select onChange="changeStatus(this, ' + row.id + ')"><option ' + _status0 + ' value="0">初始化状态</option>' +
                                '<option ' + _status1 + ' value="1">上架</option>' +
                                '<option ' + _status2 + ' value="2">下架</option></select>');

                            return _html;
                        }
                    },
                    "isTop": {
                        title: "是否置顶",
                        render: function(data, type, row, meta) {
                            if (moduleOperates.indexOf('changeTop') < 0) {
                                return '';
                            };
                            return (data == 0 ? '<a onClick="changeTop(this, ' + row.id + ')" data-val="1" class="btn btn-xs btn-success"><i class="fa fa-arrow-up"></i> 置顶</a>' :
                                '<a onClick="changeTop(this, ' + row.id + ')" data-val="0" class="btn btn-xs btn-default"><i class="fa fa-arrow-down"></i> 取消置顶</a>');
                        }
                    }
                },
                operate: {
                    "title": '操作', //自定义操作列 
                    render: function(data, type, row, meta) {
                        var _btnfh = '';
                        if (moduleOperates.indexOf('delGoods') > -1) {
                            _btnfh += "<a class='btn btn-xs btn-danger' onclick='removeRecord(" + row.id + ")'>删除</a> ";
                        };
                        if (moduleOperates.indexOf('editGoods') > -1) {
                            _btnfh += "<a onclick='editLayer(" + row.id + ")' class='btn btn-xs btn-info'>编辑</a> ";
                        };
                        return _btnfh;
                    }
                }
            }
        });
    });

    /*==== 点击搜索按钮 ====*/
    $('#searchBtn').bind('click', function() {
        mytable.reloadByParam(getSearchData());
    });
    /*==== 点击清除按钮 ====*/
    $('#clearBtn').bind('click', function() {
        $('#submit_form')[0].reset();
        mytable.reloadByParam(getSearchData());
    });

    /*======== 请求商品分类数据 ========*/
    Ajaxjson(InterfaceUrl.classList, { "pageNum": 1, "channelId": getChannelId() }, function(res) {
        classListData = res.classList;
        $('[name="classId"]').append(renderClassList(res.classList));
    });
});

/*======== 渲染商品分类下拉选项列表 ========*/
function renderClassList(data) {
    var _html = '';
    for (var i = 0, l = data.length; i < l; i++) {
        var _d = data[i];
        _html += '<option value="' + _d.id + '">' + _d.className + '</option>';
    };
    return _html;
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

/*======== 批量上下架 ========*/
function manySale(el) {
    var _postData = {
        idStr: mytable.getSelected(),
        goodsStatus: $(el).attr('data-val'),
        channelId: getChannelId()
    };
    Ajaxjson(InterfaceUrl.manySale, _postData, function(res) {

        layer.msg(res.message, {
            icon: 1,
            time: 800,
            end: function() {
                mytable.reloadByParam(getSearchData());
            }
        });
    });
};
/*======== 商品置顶 ========*/
function changeTop(el, id) {
    var _postData = {
        isTop: $(el).attr('data-val'),
        id: id,
        channelId: getChannelId()
    };

    Ajaxjson(InterfaceUrl.changeTop, _postData, function(res) {

        layer.msg(res.message, {
            icon: 1,
            time: 800,
            end: function() {
                mytable.reloadByParam(getSearchData());
            }
        });

    });
};

/*======== 修改商品状态 ========*/
function changeStatus(el, id) {
    var _postData = {
        goodsStatus: el.value,
        id: id,
        channelId: getChannelId()
    };
    Ajaxjson(InterfaceUrl.changeStatus, _postData, function(res) {

        layer.msg(res.message, {
            icon: 1,
            time: 800,
            end: function() {
                mytable.reloadByParam(getSearchData());
            }
        });

    });
};

/*======== 删除记录 ========*/
function removeRecord(id) {
    layer.confirm('<p>您是否确认删除这项内容？<br>烦请谨慎操作！</p>', {
        icon: 2,
        btn: ['确定', '取消'] //按钮
    }, function() {
        Ajaxjson(InterfaceUrl.delGoods, { "goodsId": id, "channelId": getChannelId() }, function(res) {

            layer.msg(res.message, {
                icon: 1,
                time: 800,
                end: function() {
                    mytable.reloadByParam(getSearchData());
                }
            });

        });
    });
};

/*======== 保存编辑信息 ========*/
function editGoods(data) {
    data.channelId = getChannelId();
    Ajaxjson(InterfaceUrl.editGoods, data, function(res) {
        layer.msg(res.message, {
            icon: 1,
            time: 800,
            end: function() {
                mytable.reloadByParam(getSearchData());
            }
        });
    });
};

/*======== 编辑记录弹窗 ========*/
function editLayer(id) {

    Ajaxjson(InterfaceUrl.getGoodsById, { "goodsId": id, "channelId": getChannelId() }, function(res) {

        layer.open({
            title: '商品信息编辑',
            area: ['420px', '280px'], //宽高
            btn: ['确定', '取消'], //按钮
            content: '<form class="layer-form">' +
                '<label class="form-group">兑换积分：<input type="text" name="needIntegral" class="form-control" placeholder="请输入兑换积分"></label>' +
                '<label class="form-group">兑换金额：<input type="text" name="needMoney" class="form-control" placeholder="请输入兑换金额"></label>' +
                '<label>商品分类：<select name="classId" class="form-control" placeholder="请选择商品分类">' + renderClassList(classListData) + '</select></label>' +
                '<label>支付方式：<select name="payType" onChange="changePayType( this )" class="form-control" placeholder="请选择支付方式">' + renderPayType() + '</select></label>' +
                '</form>',
            yes: function(index, elem) {
                var _data = serializeFormData(elem.find('form'));
                var _postData = $.extend({}, res.goodsInfo, _data);
                var $error = elem.find('form').find('.has-error');

                if ($error.length > 0) {
                    return;
                };
                editGoods(_postData);
            },
            success: function(elem) { //成功弹出弹窗后的回调方法  
                var $form = elem.find('form');
                AssignForm($form, res.goodsInfo);

                /*编辑表单的时候,校验输入有效性*/
                $form.on('focus', 'input', function() {
                    $(this).siblings('.text-red').remove();
                    $(this).parent('.form-group').removeClass('has-error');

                }).on('blur', 'input', function() {
                    var $this = $(this);

                    if (this.value == '') {
                        $this.parent('.form-group').addClass('has-error');
                        $this.after('<span class="text-red">必填</span>');
                        return;
                    };

                    if (this.name == "needIntegral") {
                        if (!/^[0-9]*$/.test(this.value)) {
                            $this.parent('.form-group').addClass('has-error');
                            $this.after('<span class="text-red">请填数字</span>');
                        };
                        return;
                    };
                    if (!/^[0-9.]*$/.test(this.value)) {
                        $this.parent('.form-group').addClass('has-error');
                        $this.after('<span class="text-red">请填数字</span>');
                    };
                });

                changePayType(elem.find('[name="payType"]')[0]);
            }
        });

    });
};

function changePayType(el) {
    var val = el.value;
    var $needIntegral = $(el).parent().siblings().find('[name="needIntegral"]');
    var $needMoney = $(el).parent().siblings().find('[name="needMoney"]');

    switch (val) {
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
