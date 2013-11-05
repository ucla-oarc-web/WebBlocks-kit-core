WebBlocks.Blocks.addBlock({
    
    'name': 'Message',
    
    'test': function(element){
        return $(element).hasClass('message');
    },
    
    'definition': function(){
        
        var COLOR_CLASSES = $.merge($.merge([],WebBlocks.Blocks.Color.COLORS),WebBlocks.Blocks.Color.FLAVORS);
        
        this.tag = 'aside';

        this.initialize = function(){
            this.addClass('message');
        }

        this.attributes = {
            'header': {
                'set': function(value){
                    this.unsetHeader();
                    this.prepend('<header>'+value+'</header>');
                },
                'unset': function(){
                    this.getHeader().remove();
                },
                'get': function(){
                    return this.children('header');
                }
            },
            'content': {
                'set': function(value){
                    this.unsetContent();
                    this.append($(document.createElement('div')).html(value));
                },
                'unset': function(){
                    this.getContent().remove();
                },
                'get': function(){
                    return this.children(':not(header)');
                }
            },
            'color': {
                'set': function(value){
                    this.unsetColor();
                    this.addClass(value);
                    return this;
                },
                'unset': function(){ // requires WebBlocks.Blocks.Color
                    if(WebBlocks.Blocks.Color)
                        this.removeClass(COLOR_CLASSES.join(' '));
                },
                'get': function(){
                    var classes = []
                    $.each(this.attr('class').split(' '), function(){
                        if($.inArray(this.toString(), COLOR_CLASSES) >= 0)
                            classes.push(this.toString());
                    })
                    return classes;
                }
            }
        }

    }
    
});