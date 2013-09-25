/** Use buttons instead of the scrollbar.
 **
 ** This was inspired by Samich's answer on stackoverflow.com, here:
 ** http://stackoverflow.com/a/8329376/1378264
 **
 ** Similar plugins:
 ** http://logicbox.net/jquery/simplyscroll/
 ** https://github.com/mikecao/jquery-scrollable
 **
 ** Copyright (c) 2013 Philipp Zedler <philipp@neue-musik.com>
 ** Licensed under the MIT license
 ** 
 **/


(function ($) {

    "use strict";

    var defaults = {
            'up': undefined,
            'down': undefined,
            'velocity': 300, // Pixel per second
            'maxDuration': 2000 // Maximum duration for scrolling
        },
        upButton = '<div style="position: absolute; top: 0px; background-color: #fff; border: 1px solid #000; padding:5px; display: none;">Up</div>',
        downButton = '<div style="position: absolute; bottom: 0px; background-color: #fff; border: 1px solid #000; padding:5px; display: none;">Down</div>',
        ScrollableArea = function ($content, options) {
            this.$content = $content;
            this.$container = $content.parent();
            this.velocity = options.velocity;
            this.maxDuration = options.maxDuration;
            this.setButtons(options);
            this.wrapContent();
            this.setExtraHeight();
            this.$content.data('scroll-buttons-active', true);
            this.$content.data('scrollable-area', this);
        };
    ScrollableArea.prototype = {
        setExtraHeight: function () {
            var extraHeight = this.getContentHeight() - this.$container.height();
            this.extraHeight = extraHeight;
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
            // TODO: This does not work yet.
            //this.activateScrollingForTouchscreens();
        },
        activateScrollingForTouchscreens: function () {
            var thisScrollableArea = this;
            this.$down.bind('touchstart', function () {
                thisScrollableArea.scrollDown();
            });
            this.$down.bind('touched', function () {
                thisScrollableArea.$wrapper.stop();
            });
            this.$up.bind('touchstart', function () {
                thisScrollableArea.scrollUp();
            });
            this.$up.bind('touched', function () {
                thisScrollableArea.$wrapper.stop();
            });
        },
        setButtons: function (options) {
            if (options.up === undefined) {
                this.$up = $(upButton);
                this.$container.append(this.$up);
            } else {
                this.$up = this.$container.find(options.up);
            }
            if (options.down === undefined) {
                this.$down = $(downButton);
                this.$container.append(this.$down);
            } else {
                this.$down = this.$container.find(options.down);
            }
        },
        displayButtons: function () {
            if (this.extraHeight > 0) {
                this.$down.fadeIn();
                this.$up.fadeIn();
            } else {
                this.$down.fadeOut();
                this.$up.fadeOut();
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
                height: this.$container.height(),
                width: this.$container.width() + 20,
                overflow: 'auto',
                position: 'absolute',
                top: 0,
                left: 0
            });
        },
        reload: function () {
            this.setExtraHeight();
            this.displayButtons();
        }
    };
    $.fn.scrollButtons = function (options) {
        if (options === 'reload') {
            if ($(this).data('scroll-buttons-active') === true) {
                $(this).data('scrollable-area').reload();
            }
        } else {
            var settings = $.extend({}, defaults, options),
                scrollableArea = new ScrollableArea($(this), settings);
            scrollableArea.activateScrolling();
            scrollableArea.displayButtons();
        }
        return this;
    };
}(jQuery));
