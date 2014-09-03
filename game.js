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

                Screen.welcome();
                this.canvas.addEventListener('click', this.runGame, false);
                Ctrl.init();
            }
        },
        runGame: function() {
            Game.canvas.removeEventListener('click', Game.runGame, false);
            setTimeout(function () {
                Game.init();
                Game.animate();
            },1000);
        },
        animate : function () {
            Game.play = requestAnimFrame(Game.animate);
            Game.draw();
        },
        init : function () {
            Background.init();
            Hud.init();
            Ball.init();
            Paddle.init();
            Bricks.init();

            this.animate();
        },
        draw : function () {
            ctx.clearRect(0, 0, this.width, this.height);

            Background.draw();
            Hud.draw();
            Ball.draw();
            Paddle.draw();
            Bricks.draw();
        },
        levelUp: function() {
            Hud.lv += 1;
            Bricks.init();
            Ball.init();
            Paddle.init();
        },
        levelLimit: function(lv) {
            return lv > 5 ? 5 : lv;
        },
        restartGame: function() {
            window.location.reload();
        }
    };

    var Screen = {
        welcome : function () {
            this.text = '打砖块';
            this.subText = '>开始游戏<';
            this.textColor = '#f00';

            this.create();
        },
        create : function () {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, Game.width, Game.height);

            ctx.fillStyle = this.textColor;
            ctx.textAlign = 'center';
            ctx.font = '40px helvetica, arial'; ctx.fillText(this.text, Game.width / 2, Game.height / 2);

            ctx.fillStyle = '#999999';
            ctx.font = '20px helvetica, arial';
            ctx.fillText(this.subText, Game.width / 2, Game.height / 2 + 30);
        },
        gameover: function() {
            this.text = 'Game Over';
            this.subText = '>再来一发<';
            this.textColor = 'red';
            this.create();
            Game.canvas.addEventListener('click', Game.restartGame, false);
        }
    };

    var Hud = {
        init : function () {
            this.lv = 1;
            this.score = 0;
        },
        draw : function () {
            ctx.font = '12px helvetica, arial';
            ctx.fillStyle = '#f00';
            ctx.textAlign = 'left';
            ctx.fillText('得分：' + this.score, 5, Game.height - 5);
            ctx.textAlign = 'right';
            ctx.fillText('第' + this.lv + '关', Game.width - 5, Game.height - 5);
        }
    };
    var Background = {
        init : function () {
            this.ready = false;
            this.img = new Image();
            this.img.src = 'http://www.prototypo.me/demo/canvas-game/bg.jpg';

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
        gap : 2,
        col : 5,
        w : 80,
        h : 15,
        init : function () {
            this.row = Game.levelLimit(Hud.lv) + 2;
            this.total = 0;

            this.count = [this.row];
            for(var i = this.row;i--;) {
                this.count[i] = [this.col];
            }
            console.log(this.count);
        },
        gradient : function (row) {
            switch (row) {
                case 0:
                    return this.gradientPurple ?
                        this.gradientPurple :
                        this.gradientPurple =
                            this.makeGradient(row, '#bd06f9', '#9604c7');
                case 1:
                    return this.gradientRed ?
                    this.gradientRed :
                        this.gradientRed =
                        this.makeGradient(row, '#f9064a', '#c7043b');
                case 2:
                    return this.gradientGreen ?
                    this.gradientGreen :
                        this.gradientGreen =
                        this.makeGradient(row, '#05fa15', '#04c711');
                default:
                    return this.gradientOrange ?
                    this.gradientOrange :
                        this.gradientOrange =
                        this.makeGradient(row, '#faa105', '#c77f04');
            }
        },
        makeGradient : function (row, color1, color2){
            var y = this.y(row);
            var grad = ctx.createLinearGradient(0, y, 0, y + this.h);

            grad.addColorStop(0, color1);
            grad.addColorStop(1, color2);

            return grad;
        },
        draw : function () {
            var i, j;

            for(i = this.row;i--;){
                for(j = this.col; j--;){
                    if(this.count[i][j] !== false) {
                        if(Ball.x >= this.x(j) && Ball.x <= (this.x(j) + this.w) && Ball.y >= this.y(i) && Ball.y <= (this.y(i) + this.h)){
                            this.collide(i, j);
                            continue;
                        }
                        ctx.fillStyle = this.gradient(i);
                        ctx.fillRect(this.x(j), this.y(i), this.w, this.h);
                    }
                }
            }

            if(this.total === (this.row * this.col)){
                Game.levelUp();
            }
        },
        collide : function (i, j) {
            Hud.score++;
            this.total++;
            this.count[i][j] = false;
            Ball.sy = -Ball.sy;
        },
        x : function (row) {
            return (row * this.w) + (row * this.gap);
        },
        y : function (col) {
            return (col * this.h) + (col * this.gap);
        }
    };
    var Ball = {
        r : 10,

        init : function () {
            this.x = 120;
            this.y = 120;
            this.sx = 1 + (0.4 * Hud.lv);
            this.sy = -1.5 - (0.4 * Hud.lv);
        },
        draw : function () {
            this.edges();
            this.collide();
            this.move();

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fillStyle = '#f60';
            ctx.fill();
        },
        edges: function () {
            if(this.y < 1){
                this.y = 1;
                this.sy = - this.sy;
            }else if(this.y > Game.height){
                this.sy = this.sx = 0;
                this.y = this.x = 1000;
                Screen.gameover();
                return;
            }

            if(this.x < 1) {
                this.x = 1;
                this.sx = -this.sx;
            }else if(this.x > Game.width){
                this.x = Game.width - 1;
                this.sx = -this.sx;
            }
        },
        collide: function () {
            if(this.x >= Paddle.x && this.x <= (Paddle.x + Paddle.w) && this.y > Paddle.y && this.y <= (Paddle.y + Paddle.h)){
                this.sx = 7 * ((this.x - (Paddle.x + Paddle.w / 2)) / Paddle.w);
                this.sy = -this.sy;
            }
        },
        move: function () {
            this.x += this.sx;
            this.y += this.sy;
        }
    };
    var Paddle = {
        w : 90,
        h : 20,
        r : 2,
        init : function () {
            this.x = 100;
            this.y = 210;
            this.speed = 4;
        },
        draw : function () {
            this.move();

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.arcTo(this.x + this.w, this.y,
                    this.x + this.w, this.y + this.r, this.r);
            ctx.lineTo(this.x + this.w, this.y + this.h - this.r);
            ctx.arcTo(this.x + this.w, this.y + this.h,
                    this.x + this.w - this.r, this.y + this.h, this.r);
            ctx.lineTo(this.x + this.r, this.y + this.h);
            ctx.arcTo(this.x, this.y + this.h,
                this.x, this.y + this.h - this.r, this.r);
            ctx.lineTo(this.x, this.y + this.r);
            ctx.arcTo(this.x, this.y, this.x + this.r, this.y, this.r);
            ctx.closePath();

            ctx.fillStyle = this.gradient();
            ctx.fill();
        },
        move : function () {
            if (Ctrl.left && (this.x < Game.width - (this.w / 2))) {
                this.x += this.speed;
            }else if(Ctrl.right && this.x > -this.w / 2){
                this.x += -this.speed;
            }
        },
        gradient : function () {
            if(this.gradientCache){
                return this.gradientCache;
            }

            this.gradientCache = ctx.createLinearGradient(this.x, this.y, this.x, this.y + 20);
            this.gradientCache.addColorStop(0, '#eee');
            this.gradientCache.addColorStop(1, '#999');

            return this.gradientCache;
        }
    };

    var Ctrl = {
        init : function () {
            window.addEventListener('keydown', this.keyDown, true);
            window.addEventListener('keyup', this.keyUp, true);
            window.addEventListener('mousemove', this.movePaddle, true);
        },
        keyDown : function (event) {
            switch (event.keyCode){
                case 39 :
                    Ctrl.left = true;
                    break;
                case 37 :
                    Ctrl.right = true;
                    break;
                default :
                    break;
            }
        },
        keyUp : function (event) {
            switch (event.keyCode){
                case 39 :
                    Ctrl.left = false;
                    break;
                case 37 :
                    Ctrl.right = false;
                    break;
                default :
                    break;
            }
        },
        movePaddle : function (event) {
            var mouseX = event.pageX;
            var canvasX = Game.canvas.offsetLeft;

            var paddleMid = Paddle.w / 2;
            if (mouseX > canvasX && mouseX < canvasX + Game.width) {
                var newX = mouseX - canvasX;
                newX -= paddleMid;
                Paddle.x = newX;
            }
        }
    };

    window.onload = function () {
        Game.setUp();
    };
})();
