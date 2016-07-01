class Itzi extends Phaser.Sprite
{
	constructor(game,config)
	{
		var cx = game.world.centerX,
			cy = game.world.centerY,
			x = cx + config.x*global_config.Config.scale*game.isFlipped,
			y = cy + config.y*global_config.Config.scale;
		super(game,x,y,"itzi");

		this.health = 100;
		this.skin = new Phaser.Physics.Box2D.Body(game, null, x, y, 2);
	    this.skin.setCircle(20);
	    this.skin.bullet = true;
	    this.skin.static = true;
	    this.scale.set(0.6,0.6);
	    this.anchor.set(0.5,0.5);


	    this.gameEnd = false;

	    var sprite1 = new Phaser.Sprite(game,0,0,global_config.Images.OuterCircleParticle.frame,4);
	    this.anim1 = sprite1.animations.add('outerCircle');
	    this.addChild(sprite1);
	    sprite1.scale.set(1.5,1.5);
	    sprite1.anchor.set(0.5,0.5);
	    sprite1.position.x = -100;
	    
	    var sprite2 = new Phaser.Sprite(game,0,0,global_config.Images.OuterCircleParticle.frame,4);
	    this.anim2 = sprite2.animations.add('outerCircle');
	    this.addChild(sprite2);
	    sprite2.scale.set(1.5,1.5);
	    sprite2.rotation = Phaser.Math.degToRad(140);
	    sprite2.position.x = 180;
	    sprite2.position.y = 0;
	    sprite1.visible = false;
	    sprite2.visible = false;

	    this.sprite2 = sprite2;
	    this.sprite1 = sprite1;

	    this.skin.sprite = this;
	    
	    this.skin.velocity.x = 10;
	    this.skin.velocity.y = 10;

	    //var force = (radius - distance) / mass;
		//object.body.velocity.x += Math.cos(angle) * force;
		//object.body.velocity.y += Math.sin(angle) * force;

		game.onGameStart.add(function(){
	    	this.startGame();
	    },this);
	}

	playOuterCircleTouch()
	{

		this.sprite1.visible = true;
	    this.sprite2.visible = true;

		this.anim1.play(10,false);
		this.anim2.play(10,false);
		this.health -= 1;
		this.anim1.onComplete.add(function(){
			this.sprite1.visible = false;
	    	this.sprite2.visible = false;
		}, this);
	}

	update()
	{
		if(this.gameEnd){
			if(this.scale.x <=0 ){
				this.gameEnd = false;
				super.destroy();
			}
		}else{
			this.position.x = this.skin.x;
			this.position.y = this.skin.y;
		}
	}

	destroy()
	{
		this.gameEnd = true;
		this.skin.destroy();
	}

	startGame()
	{
		this.skin.static = false;
	}
}