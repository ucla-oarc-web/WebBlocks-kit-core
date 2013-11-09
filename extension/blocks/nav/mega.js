/**
 * NAVIGATION SUB-MENU TOGGLE
 * 
 * When a link in the navigation is clicked, it should cause the associated
 * sub-menu to be toggled.
 */

if(typeof WebBlocks == 'undefined') WebBlocks = {}

WebBlocks.navMegaMenu = function(){
    
    $(this).find('nav.mega > ul > li :not(ul) a').click(function(e){
        var liEle = $(this).closest('li'),
            dropdownEle = liEle.children('ul'),
            show = !liEle.hasClass('active');
        
        if(!dropdownEle.length) // if no sub-menu, exit early to allow click
            return;
        
        e.preventDefault();
        
        // hide any open submenus
        $('nav.mega > ul > li').removeClass('active')
        
        // if sub-menu was not already showing, show it
        if(show)
            liEle.addClass('active')
        
        // recompute dropdown spacer if need be
        setDropdownSpacer($(liEle).closest('nav.mega'));
    });
    
    /**
     * This function sets the height of #site-header-navigation to the height 
     * of the menu items plus the height of the dropdown. This is required 
     * because dropdown list items are floated and thus do not affect the 
     * height of #site-header-navigation.
     * 
     * @todo compute height rather than assume 26px (known from CSS)
     * @returns null
     */
    var setDropdownSpacer = function(navEle){
        
        // Don't do anything if dropdown is not floated, as height already
        // considers dropdown list items
        if(!isFloated(navEle))
            return;

        // Selects the currently open sub-menu
        var active = navEle.find('.active'),
            visible = active.find('ul:visible'),
            base = navEle.children('ul');
        
        if(visible.length) // if open sub-menu, set height as sum of sub-menu and top-level menu
            $(navEle).css('height', (visible.outerHeight()+base.outerHeight()+10)+'px')
        else // if no sub-menu open, set height to height of top-level menu
            $(navEle).css('height', base.outerHeight()+'px')

    }

    /**
     * This fuction returns true if navigation items are floated. A true value 
     * implies that sub-menu list items do not affect the height of 
     * #site-header-navigation and thus setDropdownSpacer() should be called to 
     * define an explicit height for #site-header-navigation.
     * 
     * @returns bool
     */
    var isFloated = function(navEle){
        var floatVal = navEle.children('ul').children('li').first().css('float')
        return floatVal == 'left' || floatVal == 'right';
    }
    
    /**
     * This function sets an explicit height if the dropdown sub-menu is
     * floated, or else the height is part of auto computation, so it sets
     * height to auto.
     * 
     * @todo compute height rather than assume 26px (known from CSS)
     * @returns null
     */
    var handleDropdownSpacing = function(navEle){
        $(navEle).css('height','auto');
        setDropdownSpacer($(navEle));
    }
    
    $(window).resize(function(){
        $('nav.mega').each(function(){
            handleDropdownSpacing(this);
        });
    });
    
}

$(document).ready(function(){
    WebBlocks.navMegaMenu.call(this);
});