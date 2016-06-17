class Line extends Phaser.Sprite
{
	constructor(game,config)
	{
		super(game,game.world.centerX,game.world.centerY);
		this.graphics = new Phaser.Graphics(game,0,0);
		this.color = 0xffffff;
		this.x = game.world.centerX;
		this.y = game.world.centerY;
		this.game = game;
		this.skin = null;
		this.config = config;
		this.name = config.id;
		this._updateLine();
		this.drawLine();
		this.drawBody();
	}

	_updateLine()
	{
		var config = this.config,
			scale = global_config.scale;
		for(var i in config["points"]){
			if(i%2 == 0){
				config["points"][i] *= scale;
			}else{
				config["points"][i] *= scale;
			}
		}
		this.config = config;
	}

	drawLine()
	{
		var game = this.game,
			config = this.config,
			graphics = this.graphics,
			color = this.color;
		graphics.key = "texture";
		graphics.clear();
		graphics.beginFill(color);
    	graphics.lineStyle(2, color);
    	graphics.moveTo(config["points"][0],config["points"][1]);
    	graphics.lineTo(config["points"][2],config["points"][3]);
    	graphics.endFill();

    	this.addChild(graphics);
    	this.anchor.set(0.5,0.5);
	}

	drawBody()
	{
		var game = this.game,
			x = this.x,
			y = this.y,
			config = this.config,
			body = new Phaser.Physics.Box2D.Body(game, null,x, y, 100);
			body.setChain(config["points"]);
			this.skin = body;
	}

	update()
	{
		this.skin.angle = this.angle;
	}

	updateLineTriggered(color)
	{
		this.canTriggerd = true;
		this.color = color;
		this.drawLine();
	}
}

class SimpleLine extends Line
{
	constructor(game,line)
	{
	    super(game,line);
	}
}