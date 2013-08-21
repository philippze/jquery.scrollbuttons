/** Use buttons instead of the scrollbar
 **
 ** This was inspired by Samich's answer on stackoverflow.com, here:
 ** http://stackoverflow.com/a/8329376/1378264
 **
 ** Similar plugins:
 ** http://logicbox.net/jquery/simplyscroll/
 **
 ** 
 **/


(function ($) {

    "use strict";

    var defaults = {
            'up': '.up',
            'down': '.down',
            'velocity': 300, // Pixel per second
            'maxDuration': 2000 // Maximum duration for scrolling
        },
        ScrollableArea = function ($content, options) {
            this.$content = $content;
            this.$container = $content.parent();
            this.velocity = options.velocity;
            this.maxDuration = options.maxDuration;
            this.$up = this.$container.find(options.up);
            this.$down = this.$container.find(options.down);
            this.wrapContent();
            this.setExtraHeight();
        };
    ScrollableArea.prototype = {
        setExtraHeight: function () {
            this.extraHeight = this.getContentHeight() - this.$container.height();
        },
        getContentHeight: function () {
            return this.$wrapper.prop('scrollHeight');
            /** TODO: Check if this works OK on firefox, see here:
             ** http://stackoverflow.com/a/15033226/1378264
             **/
        },
        getScrollUpDuration: function () {
            var scrollLength = this.$wrapper.prop('scrollTop');
            return this.getScrollDuration(scrollLength);
        },
        getScrollDownDuration: function () {
            var scrollLength = this.getContentHeight() - this.$wrapper.prop('scrollTop');
            return this.getScrollDuration(scrollLength);
        },
        getScrollDuration: function (scrollLength) {
            var scrollDuration = scrollLength / this.velocity * 1000;
            return Math.min(scrollDuration, this.maxDuration);
        },
        activateScrolling: function () {
            var thisScrollableArea = this;
            if (this.extraHeight > 0) {
                this.$down.hover(function () {
                    thisScrollableArea.scrollDown();
                }, function () {
                    thisScrollableArea.$wrapper.stop();
                });
                this.$up.hover(function () {
                    thisScrollableArea.scrollUp();
                }, function () {
                    thisScrollableArea.$wrapper.stop();
                });
            }
        },
        scrollDown: function () {
            this.scrollTo(this.extraHeight, this.getScrollDownDuration());
        },
        scrollUp: function () {
            this.scrollTo(0, this.getScrollUpDuration());
        },
        scrollTo: function (position, duration) {
            this.$wrapper.animate({scrollTop: position}, duration);
        },
        wrapContent: function () {
            this.$content.wrap('<div class="scroll-buttons-wrapper" />');
            this.$wrapper = this.$content.parent();
            this.$container.css({overflow: 'hidden', position: 'relative' });
            this.$wrapper.css({
                height: this.$container.height() + 20,
                width: this.$container.width() + 20,
                overflow: 'auto',
                position: 'absolute',
                top: 0,
                left: 0
            });
        }
    };
    $.fn.scrollButtons = function (options) {
        var settings = $.extend(defaults, options),
            scrollableArea = new ScrollableArea($(this), settings);
        scrollableArea.activateScrolling();
        return this;
    };
}(jQuery));
