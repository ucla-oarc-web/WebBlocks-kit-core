$(document).addBlocksMethod('processFormRequired', function(){
                
    var markControls = function(){

            var $control = $(this),
                $inputs = $control.find('input,textarea,select');

                if($inputs.filter(function(){ return !$(this).val().length }).length > 0){
                    $control.addClass('required');
                }else{
                    $control.removeClass('required');
                }

        },
        addAriaAlert = function(){
            $(this).attr('role', $(this).hasClass('required') ? 'alert' : null);
        }

    $(this).find('form.form .control[data-required="true"]').each(function(){

        var $control = $(this).closest('.control'),
            $inputs = $control.find('input,textarea,select');

        $inputs.change(function(){
            markControls.call($control);
            addAriaAlert.call($control);
        })

        markControls.call($control);
        $control.find('.required-pass, .required-fail').attr('data-required', 'ready')

    })

    $(this).find('form.form').submit(function(e){

        var $form = $(this),
            $controls = $form.find('.control').filter(function(){ return $(this).hasClass('required') }),
            $formRequiredFail = $form.find('.form-required-fail');

        if(!$controls.length)
            return;

        e.preventDefault();

        $controls.each(function(){
            addAriaAlert.call(this);
        })

        $form.addClass('form-required-failure');
        $formRequiredFail.attr('role', 'alert');
    })

});