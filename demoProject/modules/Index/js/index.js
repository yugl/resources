$(function() {
    if (!getChannelId()) {
        setChannelId('pj_9999');
    };

    //获取channelId
    /*AjaxjsonGet(InterfaceUrl.authInfo, function(res) { 
        window.localStorage.setItem("channelId", res["accountChannelId"]);
    });*/

    //请求app列表数据
    AjaxjsonGet(InterfaceUrl.appList, function(res) {
        renderDropApplist(res.appList);
    });

    //点击登出 
    $('#loginOut').bind('click', function() {
        localStorage.removeItem('token');
        HrefTo('login.html');
    });

    //计算高度
    $(window).on('resize', function() {
        setTimeout(function() {
            calcHeight();
        }, 1000);
    });

    calcHeight();
});

function renderDropApplist(data) {
    var _html = '';
    var _text = '';
    var $orgText = $('#orgText');
    var $orgTree = $('#orgTree');
    var $orgLi = $orgTree.parent('li');

    for (var i = 0, l = data.length; i < l; i++) {
        var _d = data[i];
        if (_d.organ_channel_id == getChannelId()) {
            _text = _d.app_name;
            _html += '<li class="active" data-id="' + _d.organ_channel_id + '">' + _d.app_name + '</li>';
            continue;
        };
        _html += '<li data-id="' + _d.organ_channel_id + '">' + _d.app_name + '</li>';
    };
    $orgTree.html('<ul>' + _html + '</ul>');
    $orgText.html(_text);

    $orgLi.bind('click', function() {
        $orgTree.removeClass('hide');
    });

    $orgLi.find('li').bind('click', function() {
        var $this = $(this);
        if ($this.hasClass('active')) {
            return;
        };
        setChannelId($this.attr('data-id'));
        location.reload(true);
    });
    $orgLi.bind('mouseleave', function() {
        $orgTree.addClass('hide');
    });
};
/*======== 自适应布局 ========*/
function calcHeight() {
    var _height = $('html,body').height() - 50;
    $('iframe').height(_height);
};
