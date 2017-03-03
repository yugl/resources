/**
 * Created by whx on 2017/2/17.
 */

var mytable;
$(function() {

    var moduleOperates = '';  

    AjaxGetModuleByPid(location.href.split('?id=')[1], function(data) {
        moduleOperates = data.join(','); 
        /*获取表格列表*/
        mytable = InitDataTable({
            $el: $('#list'), //表格dom选择器
            url: InterfaceUrl.goodsList, //表格列表数据
            sourceKey: 'depotList',
            tableOpts: {
                data: {
                    "goodsNo": { title: "商品编号" },
                    "goodsName": { title: "商品名称" },
                    "goodsProperty": {
                        title: "商品属性",
                        render: function(data, type, row, meta) {
                            return (data == 0 ? '虚拟商品' : '实体商品');
                        }
                    },
                    "marketPrice": {
                        title: "市场价格",
                        render: function(data, type, row, meta) {
                            return (data ? data : '');
                        }
                    },
                    "createTime": { title: "添加时间" }
                },
                operate: {
                    "title": '操作', //自定义操作列
                    render: function(data, type, row, meta) { 
                        var _id = row.id;
                        var str = '';
                        
                        if( moduleOperates.indexOf( 'delDepot' ) > -1 ){ 
                            str += ' <span elID="' + _id + '" class="btn btn-xs btn-danger" onclick="delPro( this )">删除</span>'    
                        }; 

                        if( moduleOperates.indexOf( 'editDepot' ) > -1 ){ 
                            str += ' <span elID="' + _id + '" onclick="editHref( this )" class="btn btn-xs btn-info btn-primary">编辑</span>';    
                        };  
                        return str;
                    }
                }
            }
        });
    });


    /*重新加载表格*/
    function reloadTableData(obj) {
        var _data = $('#submit_form').serialize();
        data = (decodeURIComponent(_data, true)).replace(/\+/g, " ");
        var paramsData = conveterParamsToJson(data);
        var postData = $.extend({}, paramsData, obj);
        mytable.reloadByParam(postData);
    }

    /*点击搜索*/
    $('#searchBtn').bind('click', function() {
        reloadTableData({ "pageNum": '1' });
    });
    /*点击清除*/
    $('#delBtn').bind('click', function() {
        $("input").val('');
        $("select").val('');
    });
});


/*删除商品*/
function delPro(el) {
    var _id = $(el).attr("elID");
    layer.open({
        type: 1,
        title: '',
        // icon:1,
        area: ['420px', '235px'], //宽高
        content: '<div class="dele-layer"><h4>你是否确认删除这项内容</h4><p>本条数据将同步在各个平台上面也会删除</p><p>烦请谨慎操作！</p><p>该商品已被应用在：</p><p>太保评驾、爱评驾、欧尚评驾</p></div>',
        btn: ['确定', '取消'],
        yes: function(index) {
            layer.close(index);
            //ajax请求
            $.ajax({
                url: InterfaceUrl.delDepotGoods + _id,
                dataType: 'json',
                type: 'get',
                success: function(res) {
                    if (res.status) {
                        layer.msg('删除成功！', { icon: 1 });
                        mytable.refresh();
                    } else {
                        layer.msg(res.message, { icon: 2 });
                    }
                    console.log(res);

                },
                error: function(res) {
                    layer.msg('删除失败！', { icon: 2 });
                }
            });
        }
    });

}
/*编辑信息*/
function editHref(el) {
    var _id = $(el).attr("elID");
    HrefTo("editDepot.html?id=" + _id);


}


//表单序列化后转成对象
function conveterParamsToJson(paramsAndValues) {
    var jsonObj = {};
    var param = paramsAndValues.split("&");
    for (var i = 0; param != null && i < param.length; i++) {
        var para = param[i].split("=");
        jsonObj[para[0]] = para[1];
    }
    return jsonObj;
}

/*将日期对象输出成指定格式的字符串*/
function DateFormat(sdate, format) {
    var format;
    var date = {
        "M+": sdate.getMonth() + 1,
        "d+": sdate.getDate(),
        "h+": sdate.getHours() - 8,
        "m+": sdate.getMinutes(),
        "s+": sdate.getSeconds(),
        "q+": Math.floor((sdate.getMonth() + 3) / 3),
        "S+": sdate.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (sdate.getFullYear() + '').substr(4 - RegExp.$1.length));
    };
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        };
    };
    return format;
};
$(function() {
    // 时间设置
    $('#active_time').datetimepicker({

        language: 'zh-CN',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1

    }).on("hide", function(ev) {
        var _sdate = DateFormat(ev.date, 'yyyy-MM-dd hh:mm');
        //            $("#insuranceNo").val('');

        $('#active_finish_time').datetimepicker('setStartDate', _sdate);
    });
    $('#active_finish_time').datetimepicker({

        language: 'zh-CN',
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        forceParse: 0,
        showMeridian: 1

    });
    $("#clearBtime").on("click", function() {
        //            $('#active_time').datetimepicker('hide');
        $('#active_time').val('');

    })
    $("#clearEtime").on("click", function() {
        //            $('#active_finish_time').datetimepicker('hide');
        $('#active_finish_time').val('');
    })
});
