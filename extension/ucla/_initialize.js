$(document).ready(function(){

    /**
     * This makes a webpage accessible to screen readers if one follows 
     * proper HTML and WebBlocks conventions.
     */

    $('body').ariaWebBlocksMapper();

    /**
     * This takes all forms in the DOM and processes data-required="true" on the
     * controls.
     */

    $('body').blocks().processFormRequired();

});