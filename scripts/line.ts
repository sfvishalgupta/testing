class Line extends Phaser.Sprite
{
	constructor(game,config)
	{
		super(game,game.world.centerX,game.world.centerY);
		this.graphics = new Phaser.Graphics(game,0,0);
		this._color = 0xffffff;
		this.x = game.world.centerX;
		this.y = game.world.centerY;
		this.game = game;
		this.skin = null;
		this.config = config;
		this.name = config.id;
		this._updateLine();
		this.reset();
		this.drawBody();
		this.anchor.set(0.5,0.5);
		this.addChild(this.graphics);
	}

	reset()
	{
		this._lineWidth = 2;
		this.drawLine();
	}

	drawLine()
	{
		var game = this.game,
			config = this.config,
			graphics = this.graphics,
			color = this._color,
			lineWidth = this._lineWidth;

		graphics.key = "texture";
		graphics.clear();
		graphics.beginFill(color);
    	graphics.lineStyle(lineWidth, color);
    	graphics.moveTo(config["points"][0],config["points"][1]);
    	graphics.lineTo(config["points"][2],config["points"][3]);
    	graphics.endFill();
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
		this._color = color;
		this.drawLine();
	}
	
	triggerDisable()
	{
		this.alpha = 1;
		this.skin.sensor = false;
	}

	enbaleTriggerClick()
	{
		this.alpha = 0.5;
		this.skin.sensor = true;
		setTimeout(this.triggerDisable.bind(this),2000);
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
}

class SimpleLine extends Line
{
	constructor(game,line)
	{
	    super(game,line);
	}
}