/**
 * @desc canvas game
 * @author zhaoming.me#gmail.com
 * @date 2014-08-28
 */
(function () {
    var ctx = null;

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setInterval(callback, 1000 / 60);
            };
    })();

    var Game = {
        canvas : document.getElementById('game'),
        setUp : function () {
            if(this.canvas.getContext){
                ctx = this.canvas.getContext('2d');

                this.width = this.canvas.width;
                this.height = this.canvas.height;

                this.init();
                Ctrl.init();
            }
        },
        animate : function () {
            Game.play = requestAnimFrame(Game.animate);
            Game.draw();
        },
        init : function () {
            Background.init();
            Ball.init();
            Paddle.init();
            Bricks.init();

            this.animate();
        },
        draw : function () {
            ctx.clearRect(0, 0, this.width, this.height);

            Background.draw();
            Ball.draw();
            Paddle.draw();
            Bricks.draw();
        }
    };

    var Background = {
        init : function () {
            this.ready = false;
            this.img = new Image();
            this.img.src = 'bg.jpg';

            this.img.onload = function () {
                Background.ready = true;
            }
        },
        draw : function () {
            if(this.ready) {
                ctx.drawImage(this.img, 0, 0);
            }
        }
    };
    var Bricks = {
        init : function () {},
        draw : function () {}
    };
    var Ball = {
        init : function () {},
        draw : function () {}
    };
    var Paddle = {
        init : function () {},
        draw : function () {}
    };

    var Ctrl = {
        init : function () {}
    };

    window.onload = function () {
        Game.setUp();
    };
})();
