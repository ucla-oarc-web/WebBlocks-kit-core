/**
 * jQuery.ariaMapper
 * 
 * Author:
 * 
 *      Eric Bollens
 *      - Twitter: @ericbollens
 *      - GitHub: @ebollens
 * 
 * License:
 * 
 *      BSD 3-clause License
 * 
 * For more:
 * 
 *      https://github.com/ebollens/jQuery.ariaMapper
 * 
 */

/**
 * $.fn.ariaMapperHelper
 */

;(function ( $, window, document, undefined ) {
    
    var pluginName = 'ariaMapperHelper',
        headerElements = ['header','hgroup','h1','h2','h3','h4','h5','h6'];

    function Plugin( ) {
        this._name = pluginName;
    }
    
    Plugin.prototype.resolveLabeledBy = function(searchMethod, labelSelectors){
        
        var ele = this;
        
        if(!labelSelectors)
            labelSelectors = headerElements;
        
        if(!searchMethod)
            searchMethod = 'children'
        
        if(typeof labelSelectors != 'array')
            labelSelectors = [labelSelectors]
        
        if(!ele.attr('aria-labeledby')){
            var children = $(labelSelectors).filter(function(){ return ele[searchMethod](this.toString()).length > 0 }).get()
            if(children.length > 0){
                ele[pluginName]('setLabeledBy', ele[searchMethod](children[0]).first());
            }
        }
    }
    
    Plugin.prototype.setLabeledBy = function(label){
        if(this.attr('aria-labeledby'))
            return;
        if(label.attr('id') == undefined)
            label.attr('id', "aria-"+Math.random().toString(36).substring(2));
        this.attr('aria-labeledby',label.attr('id'))
    }
    
    $.fn[pluginName] = function ( operation ) {
        var args = Array.prototype.slice.call(arguments).slice(1);
        return this.each(function () {
            (new Plugin)[operation].apply($(this), args);
        });
    }
    

})( jQuery, window, document );

/**
 * $.fn.ariaMapper
 */

;(function ( $, window, document, undefined ) {
    
    var pluginName = 'ariaMapper';
    
    var sectionElements = ['article','section','nav','aside','h1','h2','h3','h4','h5','h6','header','footer','main'];
    
    var regionRoles = ['alert','alertdialog','application','article','banner','complementary','contentinfo','directory','form','grid','list','log','main','navigation','region','search','status','tabpanel','tablist','timer','treegrid'];
        
        // Default options
    var defaults = {
            "polyfill": true,
            "roles": {
                "polyfill":null,
                "polyfills": {
                    "selectors": {
                        "banner": "header:not("+sectionElements.join(' header):not(')+" header)",
                        "contentinfo": "footer:not("+sectionElements.join(' footer):not(')+" footer)",
                        "main": "main",
                        "article": "article",
                        "complementary": "aside:not(main aside)",
                        "navigation": "nav",
                        "region": "section"
                    },
                    "callbacks": {
                    },
                    "filters": {},
                    "exclusions": []
                },
                "selectors": {},
                "filters": {},
                "callbacks": {},
                "exclusions": []
            },
            "labeledby": {
                "roles": {}, // values filled in below
                "selectors": {}
            }
        };
        
    $(regionRoles).each(function(){
        defaults.labeledby.roles[this.toString()] = true;
    })

    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( true, {}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
    }

    Plugin.prototype.run = function () {
        
        var plugin = this,
            element = this.element,
            options = this.options,
            
            roles = {},
            
            onlyOnceWithRole = ['banner','contentinfo','main'],
            selected,
            
            roleFilters = $.extend({}, options.roles.polyfills.filters, options.roles.filters),
            roleCallbacks = $.extend({}, options.roles.polyfills.callbacks, options.roles.callbacks),
            labeledbySelectors = options.labeledby.selectors;
    
        jQuery.each(options.roles.selectors, function(k, v){
            roles[k] = jQuery.isArray(v) ? v : [v] 
        });
        
        if(options.roles.polyfill || options.polyfill && options.roles.polyfill !== false){
            
            jQuery.each(options.roles.polyfills.selectors, function(k,v){ 
                if(options.roles.polyfills.exclusions.indexOf(k) < 0){
                    if(!roles[k]){
                        roles[k] = jQuery.isArray(v) ? v : [v]
                    }else{
                        jQuery.merge(roles[k], jQuery.isArray(v) ? v : [v]) 
                    }
                }
            });
            
        }
        
        // add labeledby roles to selector list
        $.each(options.labeledby.roles, function(role,included){
            if(included)
                labeledbySelectors['[role="'+role+'"]'] = true
        })
        
        $.each(roles, function(name, selectors){
            
            if(options.roles.exclusions.indexOf(name) < 0){
                
                selected = $(element).find(selectors.join(', ')).filter(function(){ return $(this).attr('role') === undefined })
                
                if(roleFilters[name])
                    selected = selected.filter(function(){ 
                        var ele = $(this);
                        ele.super = function(){
                            if(options.roles.polyfill || options.polyfill && options.roles.polyfill !== false)
                                if(options.roles.polyfills.filters[name] && options.roles.polyfills.exclusions.indexOf(name) < 0)
                                    return options.roles.polyfills.filters[name].call(ele);
                        }
                        return roleFilters[name].call(ele) 
                    });
                
                if(onlyOnceWithRole.indexOf(name) >= 0 && (selected.length + $(element).find('[role="'+name+'"]').length > 1))
                    return;
                
                selected.attr('role',name);
                
                if(roleCallbacks[name])
                    $('[role="'+name+'"]').each(function(){
                        var ele = $(this);
                        ele.super = function(){
                            if(options.roles.polyfill || options.polyfill && options.roles.polyfill !== false)
                                if(options.roles.polyfills.callbacks[name] && options.roles.polyfills.exclusions.indexOf(name) < 0)
                                    options.roles.polyfills.callbacks[name].call(ele);
                        }
                        roleCallbacks[name].call(ele)
                    })
            }
        })
        
        $.each(labeledbySelectors, function(selector, operation){
            if(operation === true) // use default operation
                operation = function(){ this.ariaMapperHelper('resolveLabeledBy') };
            operation.call($(element).find(selector))
        })
        
    };
    
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            (new Plugin(this, options)).run();
        });
    }
    

})( jQuery, window, document );

/**
 * $.fn.ariaWebBlocksMapper
 */

;(function ( $, window, document, undefined ) {
    
    var facadeName = 'ariaWebBlocksMapper',
        pluginName = 'ariaMapper',
        headerElements = ['header','hgroup','h1','h2','h3','h4','h5','h6'],
        
        // Default options
        defaults = {
            "roles": {
                "selectors": {
                    "alert": [ 
                        ".message.error", 
                        ".message.danger", 
                        ".message.important", 
                        ".message.required" 
                    ],
                    "search": [ "nav.search" ],
                    "status": [ 
                        ".message.highlight", 
                        ".message.success", 
                        ".message.warning", 
                        ".message.info" 
                    ]
                },
                "filters": {
                    "navigation": function(){ return !this.hasClass('search') }
                },
                "callbacks": {
                },
                "exclusions": []
            },
            "labeledby": {
                "selectors": {
                    "form.form div.control label input": function(){
                        var label = this.closest('div.control').children('label').first();
                        if(label.find('input').length == 0)
                            this.ariaMapperHelper('setLabeledBy', label)
                    }
                }
            }
        };
    
    $.fn[facadeName] = function ( options ) {
        return this[pluginName]($.extend( true, {}, defaults, options));
    }
    

})( jQuery, window, document );