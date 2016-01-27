var timeout;
var Home    =   function() {
    is_editing  =   false;
    id          =   null;
    index       =   null;
};

Home.prototype.send     =   function(method, data)
{
    var _this   =   this;
    $.ajax({
        cache: false,
        type: method,
        url: '/',
        dataType: 'json',
        data: data,
        error: function(jXhr) {
            if(jXhr.status == 400 || jXhr.status == 500)
                _this.showError(jXhr.msg);
        },
        success: function(data) {
            $('#form_modal').modal('hide');
            $('#alert_info').html(data.msg).show();
            setTimeout(function(){ location.reload(); }, 2000);
        }
    });
};

Home.prototype.showError    =   function(msg)
{
    if(typeof timeout != 'undefined')
        clearTimeout(timeout);

    $('#js_error').html(msg).css('visibility', 'visible');
    timeout    =    setTimeout(function(){ $('#js_error').css('visibility', 'hidden'); }, 4000);
};

Home.prototype.showForm     =   function()
{
    this.is_editing  =   false;
    $('#form_container input[type="text"]').val('');
    $('.form-group').removeClass('has-error');
    $('#user_action').html('Add');
    $('#form_modal').modal('show');
};

$(document).ready(function()
{
    var home    =   new Home();

    $('.jsBtnAdd').on('click', function(e)
    {
        e.preventDefault();
        $('#form_container #content_type option[value="' + $(this).data('content_type')+ '"]').prop('selected', true);
        $('#form_container #content_type').prop('disabled', true).hide();
        home.showForm();
    });

    $('#jsBtnAdd').on('click', function(e)
    {
        e.preventDefault();
        $('#form_container #content_type option:eq(0)').prop('selected', true);
        $('#custom_name').val('').parents('#container_custom').hide();
        $('#form_container #content_type').prop('disabled', false).show();
        home.showForm();
    });

    $('#content_type').on('change', function(e)
    {
        e.preventDefault();

        if($(this).val() == 'Custom')
            $('#custom_name').val('').parents('#container_custom').show();
        else
            $('#custom_name').val('').parents('#container_custom').hide();
    });

    $('.jsDelete').on('click', function(e)
    {
        e.preventDefault();
        var $this   =   $(this);
        var id = $this.parent().data('id'), index = $this.parent().data('index');

        $.ajax({
            cache: false,
            type: 'DELETE',
            url: '/',
            dataType: 'json',
            data: {
                'id': id,
                'index': index
            },
            error: function(jXhr) {
                if(jXhr.status == 400 || jXhr.status == 500)
                    home.showError(jXhr.msg);
            },
            success: function(data) {
                $this.parent().remove();
                $('#alert_info').html(data.msg).show();

                if(typeof timeout != 'undefined')
                    clearTimeout(timeout);

                timeout     =   setTimeout(function () {
                    $('#alert_info').html('').hide();
                }, 4000);
            }
        });
    });

    $('.jsEdit').on('click', function(e)
    {
        e.preventDefault();

        home.id      =   $(this).parent().data('id'), home.index = $(this).parent().data('index');
        var name    =   $(this).parent().data('name'), address = $(this).parent().data('address');

        $('#form_container #content_type option[value="' + $(this).data('content_type')+ '"]').prop('selected', true);
        $('#form_container #content_type').prop('disabled', true).hide();
        $('#container_custom').hide();
        $('#website_name').val(name);
        $('#website_addr').val(address);
        $('.form-group').removeClass('has-error');
        home.is_editing  =   true;
        $('#user_action').html('Edit');
        $('#form_modal').modal('show');
    });

    $('#btn_submit').on('click', function(e)
    {
        e.preventDefault();
        $('.form-group').removeClass('has-error');

        var regex   =   new RegExp(/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i);
        try {
            if($('#custom_name').is(':visible') && ! $('#custom_name').val().length)
                throw {msg: 'Name is Empty', elt: '#custom_name'};
            if( ! $('#website_name').val().length)
                throw {msg: 'Name for the Website is Empty', elt: '#website_name'};
            if( ! $('#website_addr').val().length)
                throw {msg: 'Url for the Website is Empty', elt: '#website_addr'};
            if( ! $('#website_addr').val().match(regex))
                throw {msg: 'Invalid URI', elt: '#website_addr'};

            var content_type    =   $('#content_type').val() == 'Custom'
                                        ? $.trim($('#custom_name').val())
                                        : $('#content_type').val();
            if(home.is_editing) {
                home.send('PUT', {
                    'id'          : home.id,
                    'index'       : home.index,
                    'content_type': content_type,
                    'website_name': $.trim($('#website_name').val()),
                    'website_addr': $.trim($('#website_addr').val())
                });
            }
            else {
                home.send('POST', {
                    'content_type': content_type,
                    'website_name': $.trim($('#website_name').val()),
                    'website_addr': $.trim($('#website_addr').val())
                });
            }

        } catch (e) {
            if(e.elt)
                $(e.elt).parents('.form-group').addClass('has-error');

            home.showError(e.msg);
        }
    });
});
