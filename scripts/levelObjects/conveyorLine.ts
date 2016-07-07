class ConveyorLine extends Line
{
	constructor(game,line)
	{
		super(game,line);
	    this._speed = this.config.conveyorSpeed;
		this.addPad();
		this.drawBody();
		this._color = 0x00FF00;
	}

	addPad()
	{
		var game = this.game,
			config = this.config,
			cx = game.world.centerX,
			cy = game.world.centerY,
			line = new Phaser.Line(config.a.x,config.a.y, config.b.x, config.b.y),
			width = Phaser.Math.distance(config.a.x,config.a.y, config.b.x, config.b.y),
			angle = Phaser.Math.radToDeg(line.angle);

		this.pad = new ConveyorSprite(game, config.a.x, config.a.y,width);
		
		this.addChild(this.pad);
		this.pad.angle = angle;
		//this.pad.anchor.set(0.5,0.5);

	}
	update(){
		this.pad.update();
	}
}