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
/*
	    this.anim1.onComplete.add(function(){
	    	console.log(1);
			this.visible = false;
		}, this);
*/		
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

class MainCog extends Phaser.Sprite
{
	constructor(game)
	{
		var cx = game.world.centerX,
	    	cy = game.world.centerY,
	    	polygonPoints = [],
	    	theta = 0,
	    	delta = 2 * Math.PI / 80,
	    	i = 0;
	    super(game,cx,cy,"cog");
		game.physics.box2d.enable(this);
		
		var radius = (this.width/2) - 25;
		for (theta = 0; theta <= 2 * Math.PI; theta += delta) 
		{
			var newTheta = theta + 0.2,
				radius1 = radius-10,
        		angle1 = newTheta + delta/2;
        	polygonPoints.push((radius * Math.cos(newTheta)));
        	polygonPoints.push((radius * Math.sin(newTheta)));
        	
        	polygonPoints.push((radius1 * Math.cos(angle1)));
        	polygonPoints.push((radius1 * Math.sin(angle1)));
        }
        this.anchor.set(0.5,0.5);
        this.body.setChain(polygonPoints);
        this.body.static = true;

        
		this.radius = radius;
	}

	showFire(x,y)
	{
		console.log(x,y);
		var radius = this.radius;
		//ang = ang-45;
		//this.fireSprite.updateAngle(ang);
		//this.fireSprite.show(x,y);
	}

	update()
	{
		//this.fireSprite.updateAngle(-this.angle);	
	}
}