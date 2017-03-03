 var mytable;
 $(function() {
     var moduleOperates = '';
     AjaxGetModuleByPid(location.href.split('?id=')[1], function(data) {
         moduleOperates = data.join(',');

         mytable = InitDataTable({
             $el: $('#tableList'), //表格dom选择器
             url: InterfaceUrl.classList, //表格列表数据   
             sourceKey: 'classList',
             ajaxdata: { "pageNum": 1, "channelId": getChannelId() },
             tableOpts: {
                 data: {
                     "id": { title: "商品分组编号" },
                     "className": { title: "商品分组名称" },
                     "classDescrible": { title: "商品分组描述" }
                 },
                 operate: {
                     "title": '操作', //自定义操作列 
                     render: function(data, type, row, meta) {
                         var _btnfh = '';
                         if (moduleOperates.indexOf('delClass') > -1) {
                             _btnfh += "<a class='btn btn-xs btn-danger' onclick='removeRecord(" + row.id + ")'>删除</a> ";
                         };
                         if (moduleOperates.indexOf('editClass') > -1) {
                             _btnfh += "<a onclick='editLayer(" + row.id + ")' class='btn btn-xs btn-info'>编辑</a> ";
                         };
                         return _btnfh;
                     }
                 }
             }
         });
     });
 });

 /*======== 删除商品分类 ========*/
 function removeRecord(id) {
     layer.confirm('<p>确定要删除该条商品分类信息?</p>', {
         title: '删除商品分类',
         icon: 2,
         btn: ['确定', '取消'] //按钮
     }, function() {

         Ajaxjson(InterfaceUrl.delClass, { "classId": id, "channelId": getChannelId() }, function(res) {

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
 function editClass(data) {
     data.channelId = getChannelId();
     Ajaxjson(InterfaceUrl.editClass, data, function(res) {
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

     Ajaxjson(InterfaceUrl.getClassById, { "classId": id, "channelId": getChannelId() }, function(res) {
         layer.open({
             title: '商品分类信息编辑',
             area: ['420px', '210px'], //宽高
             btn: ['确定', '取消'], //按钮
             content: '<form class="layer-form">' +
                 '<label>名称：<input type="text" name="className" class="form-control" placeholder="请输入分类名称"></label>' +
                 '<label>描述：<textarea name="classDescrible" class="form-control" placeholder="请输入分类描述"></textarea></label>' +
                 '</form>',
             yes: function(index, elem) {
                 var _data = serializeFormData(elem.find('form'));
                 var _postData = $.extend({}, res.classInfo, _data);
                 editClass(_postData);
             },
             success: function(elem) { //成功弹出弹窗后的回调方法 
                 AssignForm(elem.find('form'), res.classInfo);
             }
         });

     });
 };

 /*======== 添加商品分类 ========*/
 function addClass(data) {
     data.channelId = getChannelId();
     Ajaxjson(InterfaceUrl.addClass, data, function(res) {
         layer.msg(res.message, {
             icon: 1,
             time: 800,
             end: function() {
                 mytable.reloadByParam(getSearchData());
             }
         });
     });
 };

 /*======== 添加商品分类弹窗 ========*/
 function addLayer() {
     layer.open({
         title: '添加商品分类',
         area: ['420px', '210px'], //宽高
         btn: ['确定', '取消'], //按钮
         content: '<form class="layer-form">' +
             '<label>名称：<input type="text" name="className" class="form-control" placeholder="请输入分类名称"></label>' +
             '<label>描述：<textarea name="classDescrible" class="form-control" placeholder="请输入分类描述"></textarea></label>' +
             '</form>',
         yes: function(index, elem) {
             var _postData = $.extend({}, serializeFormData(elem.find('form')));
             addClass(_postData);
         }
     });
 };
