/**
 *
 * @author
 *
 */
var SceneEffect = (function (_super) {
    __extends(SceneEffect, _super);
    function SceneEffect($controller) {
        _super.call(this, $controller);
    }
    var d = __define,c=SceneEffect,p=c.prototype;
    p.init = function (side, direction) {
        _super.prototype.init.call(this, side);
        this.rotation = direction;
        AnchorUtil.setAnchor(this, 0);
        this.ignoreHeroes = [];
        this.initRail();
        this.initBullets();
    };
    p.initRail = function () {
        if (this.rail == null) {
            this.rail = App.DisplayUtils.createBitmap("se_rail_png");
            AnchorUtil.setAnchor(this.rail, 0.5);
            this.addChild(this.rail);
        }
        this.rail.visible = true;
    };
    p.initBullets = function () {
        if (this.shadows == null) {
            this.shadows = [];
            for (var i = 0; i < 5; i++) {
                var shadow = App.DisplayUtils.createBitmap("se_shadow_png");
                AnchorUtil.setAnchor(shadow, 0.5);
                this.addChild(shadow);
                this.shadows.push(shadow);
            }
            this.bullet = App.DisplayUtils.createBitmap("se_bullet_png");
            AnchorUtil.setAnchor(this.bullet, 0.5);
            this.addChild(this.bullet);
        }
        for (var i = 0; i < this.shadows.length; i++) {
            this.shadows[i].x = -i * this.rail.width - this.rail.width / 2;
        }
        this.bullet.x = -(this.shadows.length) * this.rail.width - this.rail.width / 2;
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
        var t = time / 1000;
        var speed = 1800;
        for (var i = 0; i < this.shadows.length; i++) {
            this.shadows[i].x += speed * t;
        }
        this.bullet.x += speed * t;
        if (this.shadows[this.shadows.length - 1].x > this.rail.width / 2) {
            this.rail.visible = false;
        }
        var hitHeroes = this.gameController.CheckHitHeroByRect(this.rect);
        if (hitHeroes.length > 0) {
            for (var i = 0; i < hitHeroes.length; i++) {
                var hero = hitHeroes[i];
                if (this.ignoreHeroes.indexOf(hero) < 0) {
                    this.ignoreHeroes.push(hero);
                    hero.Hurt(10);
                }
            }
        }
        if (this.bullet.x > this.rail.width / 2) {
            this.destory();
        }
    };
    d(p, "rect"
        ,function () {
            var x = this.x + this.bullet.x * Math.cos(this.rotation / 180 * Math.PI);
            var y = this.y + this.bullet.x * Math.sin(this.rotation / 180 * Math.PI);
            var width = this.bullet.width;
            var height = this.bullet.height;
            return new Rect(x, y, width, height, this.rotation);
        }
    );
    return SceneEffect;
}(BaseGameObject));
egret.registerClass(SceneEffect,'SceneEffect');
