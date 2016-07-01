class SpringPad extends Phaser.Sprite
{
	constructor(game, config)
	{
		var cx = game.world.centerX,
			cy = game.world.centerY,
			x = config.pos.x*global_config.Config.scale*game.isFlipped,
			y = config.pos.y*global_config.Config.scale;
		super(game, cx, cy);
		this.xx = x;
		this.yy = y;
		this.game = game;
		this.config = config;
		this.pivot.x = -x;
		this.pivot.y = -y;
		this.isActive = true;
		this.rechargeTime = 5000;
		this.anchor.set(0.5,0.5);
		this.addSpringPad();
		this.addSkin();
	}

	addSpringPad()
	{
		var config = this.config,
			game = this.game,
			imageCnf = global_config.Images.SpringPad,
			spring = new Phaser.Sprite(game,0,-67/2,imageCnf.frame);

		spring.frame = 1;
		spring.anchor.set(0.5,0.5);
		spring.angle = config.angle;
		var up = spring.animations.add('up',[0,1,2,3,4,5,6,7],20);
		spring.animations.add('down',[0,1,2,3,4,5,6,7].reverse(),20);
		
		this.addChild(spring);
		this.body = spring;

		spring.events.onAnimationComplete.add(function(e){
			if(this.body.animations.currentAnim.name == "up"){
				spring.animations.play("down");
			}else if(this.body.animations.currentAnim.name == "down"){
				this.isActive = false;
				this.frame = 0;
				setTimeout(function(){
					this.isActive = true;
					this.frame = 1;
				}.bind(this),this.rechargeTime);
			}
		}, this);
	}

	activate()
	{
		if(this.isActive){
			this.isActive = false;
			this.body.animations.play("up");

		}
	}

	addSkin()
	{
		var config = this.config,
			game = this.game,
			cx = game.world.centerX,
			cy = game.world.centerY,
			h = 2,
			w = this.body.width,
			skin = new Phaser.Physics.Box2D.Body(game, null,cx, cy, 100);

    	skin.setRectangle(w,h,this.xx,this.yy+5-this.body.frame*8.8);
    	skin.static = true;
    	this.skin = skin;
    	skin.sprite = this.body;
	}

	update()
	{
		var currentAnim = this.body.animations.currentAnim;
		if(currentAnim.isPlaying){
			this.skin.setRectangle(67,5,this.xx,this.yy-currentAnim.frame*8.8);
		}
	}
}