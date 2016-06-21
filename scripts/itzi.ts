class Itzi extends Phaser.Sprite
{
	constructor(game,config)
	{
		var cx = game.world.centerX,
			cy = game.world.centerY,
			x = cx + config.x*global_config.scale,
			y = cy + config.y*global_config.scale;
		super(game,x,y,"itzi");

		this.skin = new Phaser.Physics.Box2D.Body(game, null, x, y, 2);
	    this.skin.setCircle(20);
	    this.skin.bullet = true;
	    this.scale.set(0.6,0.6);
	    this.anchor.set(0.5,0.5);
	    this.gameEnd = false;
	}

	update()
	{
		if(this.gameEnd){
			if(this.scale.x <=0 ){
				this.gameEnd = false;
				super.destroy();
			}else{
				var scale = this.scale.x - .005;
				this.scale.set(scale,scale);
				this.angle -= 10;
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
}