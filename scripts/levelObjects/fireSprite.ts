class FireSprite extends Phaser.Sprite
{
	constructor(game)
	{
		super(game,0,0);

		var sp = new Phaser.Sprite(game,0,0);
		this.anchor.set(0.5,0.5);
		sp.anchor.set(0.5,0.5);
		this.addChild(sp);
		
	    this.fireSprite = new Phaser.Sprite(game,0,0,global_config.Images.OuterCircleParticle.frame,0);
	    this.fireSprite.anchor.set(1,1);
	    
	    this.fireSprite1 = new Phaser.Sprite(game,0,0,global_config.Images.OuterCircleParticle.frame,0);
	    this.fireSprite1.anchor.set(1,1);
	    
	    this.anim1 = this.fireSprite.animations.add('fly');
	    this.fireSprite1.animations.add('fly');

	    this.fireSprite1.angle = 180;

	    sp.addChild(this.fireSprite);
	    sp.addChild(this.fireSprite1);
	    sp.angle = -45;
	    this.sp = sp;
	    this.visible = false;		
	}

	show(x,y,a)
	{
		this.visible = true;
		this.position.x = x;
		this.position.y = y;
		this.angle = a+100;
		this.fireSprite.animations.play('fly',10,true);
	    this.fireSprite1.animations.play('fly',10,true);
	    setTimeout(function(){
	    	this.visible = false;
	    }.bind(this),250);
	}
}