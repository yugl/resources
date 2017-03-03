var MenuDataInit = {
    122: { icon: 'fa-shopping-bag' },
    127: { icon: 'fa-shopping-bag' },
    'index': { icon: 'fa-home' }
}; 
AjaxjsonGet(InterfaceUrl.menuList, function(res) {
    var menudata = [{ module_id: 'index', module_name: "首页", module_url: "main.html" }].concat(res.menuList);
    sidebarMenu( menudata ); 
});

/*======== 绑定菜单点击事件 ========*/
$('#sidebarMenu').on('click', 'a', function() {
    var $this = $(this);
    var $sibUl = $this.siblings('ul');
    var $parentLi = $this.parent('li');
    var $active = $('#sidebarMenu').find('.active');

    if ($sibUl.length > 0) {
        if ($sibUl.css('display') == 'none') {
            $sibUl.slideDown();
            $active.find('.treeview-menu').slideUp();
            $active.removeClass('active');
            $parentLi.addClass('active');
        } else {
            $sibUl.slideUp();
            $parentLi.removeClass('active');
        };
        return false;
    };

    $active.removeClass('active');
    $parentLi.parents('li').addClass('active');
    $parentLi.addClass('active');  
});
/*======== 渲染菜单 =========*/
function sidebarMenu(data) {
    var menuData = data;
    var _dHtml = '';

    for (var i = 0, l = menuData.length; i < l; i++) {
        var _d = menuData[i];
        var _id = _d["module_id"];
        var _child = _d.menu_two;

        var _faIcon = (MenuDataInit[_id].icon && MenuDataInit[_id].icon != "" ? '<i class="fa ' + MenuDataInit[_id].icon + '"></i> ' : '');
        var _faAngle = (_child && _child.length > 0 ? '<i class="fa fa-angle-left pull-right"></i>' : '');

        var _aHtml = ( _d.module_url && _d.module_url != "" ? '<a href="' + _d.module_url + '" target="mainFrame">' : '<a>')
        _dHtml += '<li class="treeview">';

        _dHtml += ('<li>' + _aHtml +
            '<span>' + _faIcon + _d.module_name + '</span>' + _faAngle +
            '</a>');

        if (_child && _child.length > 0) {
            var _childHtml = '<ul class="treeview-menu">';

            for (var j = 0, jl = _child.length; j < jl; j++) {
                var _jData = _child[j];

                _childHtml += ('<li>' +
                    '<a href="..' + _jData.module_url + '?id='+ _jData.module_id +'" target="mainFrame">' +
                    '<i class="fa fa-circle-o"></i>' +
                    _jData.module_name +
                    '</a>' +
                    '</li>');
            };
            _childHtml += '</ul>';
            _dHtml += _childHtml;
        };
        _dHtml += '</li>';
    };
    $('#sidebarMenu').html(_dHtml);
};
