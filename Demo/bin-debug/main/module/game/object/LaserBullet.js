/**
 *
 * 激光
 *
 */
var LaserBullet = (function (_super) {
    __extends(LaserBullet, _super);
    function LaserBullet($controller) {
        _super.call(this, $controller);
    }
    var d = __define,c=LaserBullet,p=c.prototype;
    p.init = function (id, creater, moveData) {
        _super.prototype.init.call(this, id, creater, moveData);
        AnchorUtil.setAnchor(this, 0);
        this.state = 0;
        this.speed = 0;
        var info = this.bulletData.info;
        this.readyTime = info.readyTime;
        this.releaseTime = info.releaseTime;
        this.displayTime = info.displayTime;
        this.readyCd = this.readyTime;
        this.setReadyImg(info.ready);
        this.setImg(this.bulletData.img);
        this.readyImg.scaleX = this.readyImg.scaleY = 0.5;
        this.createrX = this.creater.x;
        this.createrY = this.creater.y;
        this.alpha = 1;
    };
    p.setReadyImg = function (img) {
        if (this.readyImg == null) {
            this.readyImg = new egret.Bitmap;
            this.addChild(this.readyImg);
            AnchorUtil.setAnchor(this.readyImg, 0.5);
        }
        this.readyImg.texture = RES.getRes(img);
        this.readyImg.x = this.readyImg.width / 2;
    };
    p.setImg = function (img) {
        if (this.img == null) {
            this.img = new egret.Bitmap;
            this.addChild(this.img);
            AnchorUtil.setAnchorY(this.img, 0.5);
        }
        this.img.texture = RES.getRes(img);
        this.img.scale9Grid = new egret.Rectangle(100, 0, 200, this.img.height);
        this.img.width = 0;
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
        if (this.creater.GetState() == HeroState.Die) {
            this.remove();
        }
        this.x += this.creater.x - this.createrX;
        this.y += this.creater.y - this.createrY;
        this.createrX = this.creater.x;
        this.createrY = this.creater.y;
        var t = time / 1000;
        switch (this.state) {
            case 0:
                this.readyCd -= t;
                if (this.readyCd > 0) {
                    if (this.readyImg.scaleX == 1) {
                        this.readyImg.scaleX = this.readyImg.scaleY = 0.5;
                    }
                    else {
                        this.readyImg.scaleX = this.readyImg.scaleY = 1;
                    }
                }
                else {
                    this.state = 1;
                    this.img.scaleY = this.readyImg.scaleX = this.readyImg.scaleY = 0.5;
                    this.img.x = this.readyImg.x + this.readyImg.width * this.readyImg.scaleX * 0.23 - 5;
                    this.creater.Release(this.releaseTime);
                    this.creater.ResetGun();
                }
                break;
            case 1:
                this.img.scaleY = this.readyImg.scaleX = this.readyImg.scaleY += (0.5 / this.releaseTime) * t;
                this.img.x = this.readyImg.x + this.readyImg.width * this.readyImg.scaleX * 0.23 - 5;
                this.img.width += (this.bulletData.width / this.releaseTime) * t;
                if (this.img.scaleY >= 1) {
                    this.state = 2;
                }
                break;
            case 2:
                this.img.scaleY = this.readyImg.scaleX = this.readyImg.scaleY -= (0.9 / this.displayTime) * t;
                this.img.x = this.readyImg.x + this.readyImg.width * this.readyImg.scaleX * 0.23 - 5;
                if (this.img.scaleY <= 0.1) {
                    this.remove();
                }
                break;
        }
    };
    p.hitHero = function (heroes) {
        _super.prototype.hitHero.call(this, heroes);
        for (var i = 0; i < heroes.length; i++) {
            this.ignoreHeroes.push(heroes[i]);
        }
    };
    d(p, "rect"
        ,function () {
            if (this.state == 0) {
                return (new Rect(-10000, -10000, 0, 0, this.rotation));
            }
            var width = this.img.width;
            var height = this.img.height * this.img.scaleY;
            var rect;
            if (this.scaleX == 1) {
                rect = new Rect(this.x + this.img.x + width / 2, this.y, width, height, this.rotation);
            }
            else {
                rect = new Rect(this.x - this.img.x - width / 2, this.y, width, height, this.rotation);
            }
            return rect;
        }
    );
    p.GetDangerArea = function (targetX, time) {
        var arr = [];
        if (this.readyCd < time) {
            var min = this.y - this.width / 2;
            var max = this.y + this.width / 2;
            arr = [min, max];
        }
        return arr;
    };
    return LaserBullet;
}(Bullet));
egret.registerClass(LaserBullet,'LaserBullet');
