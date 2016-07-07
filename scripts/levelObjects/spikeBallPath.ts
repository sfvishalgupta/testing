class SpikeBallPath extends Phaser.Sprite
{
	constructor(game,config){
		super(game,game.world.centerX,game.world.centerY);
		this.config = config;
		this.game = game;
		this.type = config.type;
		this.graphics = new Phaser.Graphics(game,0,0);
		this.anchor.set(0.5,0.5);
		switch(config.type){
			case global_config.Objects.SpikeBall.Type_Line:
				this.drawLine();
			break;
			case global_config.Objects.SpikeBall.Type_Circle:
				this.drawCircle();
			break;
			default:
			break;
		}
		this.addChild(this.graphics);
	}
	
	drawLine()
	{
		var game = this.game,
			graphics = this.graphics,
			config = this.config,
			path = config.path,
			x1 = path.a.x * global_config.Config.scale*game.isFlipped,
			y1 = path.a.y * global_config.Config.scale,
			x2 = path.b.x * global_config.Config.scale*game.isFlipped,
			y2 = path.b.y * global_config.Config.scale;

		graphics.clear();
		graphics.beginFill(0xcccccc);
    	graphics.lineStyle(1, 0xcccccc);
    	graphics.moveTo(x1,y1);
    	graphics.lineTo(x2, y2);
    	graphics.endFill();
	}

	drawCircle()
	{
		var game = this.game,
			graphics = this.graphics,
			path = this.config.path,
			x = path.pos.x * global_config.Config.scale*game.isFlipped,
			y = path.pos.y * global_config.Config.scale,
			radius = path.pathRadius * global_config.Config.scale,
			startAngle = Phaser.Math.degToRad(path.pathArcStart),
			endAngle = Phaser.Math.degToRad(path.pathArcEnd);

		graphics.clear();
    	graphics.lineStyle(1, 0xcccccc);
		graphics.arc(x,y,radius,startAngle,endAngle, false);
    	graphics.endFill();
	}
}

