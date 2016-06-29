class Fly extends Phaser.Sprite
{
	constructor(game,x,y,frameName)
	{
		var cx = game.world.centerX,
			cy = game.world.centerY,
			x = x*global_config.Config.scale*game.isFlipped,
			y = y*global_config.Config.scale;

		super(game,cx,cy);
		this.anchor.set(0.5,0.5);
    	this.pivot.x = -x;
    	this.pivot.y = -y;

    	var skin = new Phaser.Physics.Box2D.Body(game, null,cx, cy, 100);
    	skin.setCircle(25,x,y);
    	skin.static = true;
    	skin.sensor = true;
    	this.skin = skin;
    	this.skin.sprite = this;

    	this.body = new Phaser.Sprite(game,0,0,frameName);
    	this.body.anchor.set(0.5,0.5);
    	this.addChild(this.body);
    	this.body.animations.add('fly', [0, 1, 2, 3, 4], 100, true);
		this.startFly();
	}

	startFly()
	{
		this.body.animations.play("fly");
	}

	update()
	{
		this.skin.angle = this.angle;
		this.body.angle = -this.angle;
	}
}

class BlueFly extends Fly
{
	constructor(game,config)
	{
		super(game,config.x,config.y,"blueFly");
		this.config = config;
	}
}

class GoldFly extends Fly
{
	constructor(game,config)
	{
		super(game,config.x,config.y,"goldFly");
		this.config = config;
	}
}