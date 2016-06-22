class LevelShape extends Phaser.Sprite
{
	constructor(game,config)
	{
		var cx = game.world.centerX,
			cy = game.world.centerY,
			x = config.pos.x * global_config.Config.scale,
			y = config.pos.y *global_config.Config.scale,
			color = global_config.Config.shapeDefaultColor;
		super(game,cx,cy);

		var graphics = new Phaser.Graphics(game,-config.size/2,-config.size/2);
		graphics.lineStyle(1, color);
		graphics.beginFill(color);
		graphics.drawRect(0, 0, config.size, config.size);
		graphics.endFill();	
		this.addChild(graphics);
		this.pivot.x = -x;
		this.pivot.y = -y;
	}
}