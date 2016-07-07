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
		game.physics.box2d.enable(this);
		var body = this.body;
	    body.setCircle(20);
	    body.bullet = true;
	    body.static = false;
	    body.velocity.x = 10;
	    body.velocity.y = 10;
	    this.scale.set(0.6,0.6);
	    this.anchor.set(0.5,0.5);


	    this.gameEnd = false;

		game.onGameStart.addOnce(function(){
	    	this.startGame();
	    },this);

	    game.onGameEnd.addOnce(function(){
	    	this.body.destroy();
	    	this.health = 0;
	    },this);
	}

	updateHealth()
	{
		this.health -= 5;
		if(this.health<=0){
			this.game.onItziDestroy.dispatch();
		}
	}

	update()
	{
		if(this.gameEnd){
			if(this.scale.x <=0 ){
				this.gameEnd = false;
				super.destroy();
			}
		}
		this.body.angle = 0;//Math.max(Math.min(this.body.angle, 30), -30);
	}

	destroy()
	{
		this.gameEnd = true;
		this.body.destroy();
	}

	startGame()
	{
		this.body.static = false;
	}
}