class InfoCircle extends Phaser.Sprite
{
	constructor(game,cnf)
	{
		var cx = game.world.centerX,
			cy = game.world.centerY;
		super(game,cx,cy);
		this.game = game;
		this.cnf = cnf;
		this.drawCircle();
	}

	drawCircle()
	{
		var game = this.game,
			radius = this.cnf.radius* global_config.Config.scale,
			startAngle = 0,
			endAngle = 2*3.14,
			graphics = new Phaser.Graphics(game,0,0);

		graphics.clear();
    	graphics.lineStyle(1, 0xcccccc);
		graphics.arc(0,0,radius,startAngle,endAngle, false);
    	graphics.endFill();
    	this.addChild(graphics);
	}
}