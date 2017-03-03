$(function() {

    $("body").keyup(function(e) {
        if (e.keyCode == 13) {
            login();
        };
    });


    $('#account_name, #pwd').bind('focus', function() {
        var $this = $(this);
        $this.parents('.form-group').removeClass('has-error');
        $this.siblings('.text-red').remove();
    }).on('blur', function() {
        var $this = $(this);
        if ($this.val() == '' && $this.attr('required')) {
            $this.parents('.form-group').addClass('has-error');
            $this.after('<span class="text-red">必填</span>');
        };
    });


    //提交表单
    $('#submit').bind('click', function() {
        login();
    });

});

function login() {
    var account_name = validateForm($('#account_name'));
    var pwd = validateForm($('#pwd'));
    pwd = newHexMd5(pwd);
    var requestData = {
        "account_name": account_name,
        "password": pwd
    };
    if ($('#login_form').find('.has-error').length > 0) {
        return;
    };
    $.ajax({
        url: InterfaceUrl.login,
        type: "POST",
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(requestData),
        success: function(data, status, xhr) {
            window.localStorage.setItem("token", data["X-TokenAccess"]);
            if (data.status == 0) {
                $('#login_form').reset();
                return;
            };
            HrefTo('index.html');
        }
    });
};

/*======== 验证输入的有效性 ========*/
function validateForm($el) {
    var _val = $el.val();
    var $parent = $el.parents('.form-group');

    if (_val == '' && $el.attr('required') && !$parent.hasClass('has-error')) {
        $parent.addClass('has-error');
        $el.after('<span class="text-red">必填</span>');
    };
    return _val;
};
