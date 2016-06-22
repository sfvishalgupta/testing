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
		this._updateLine();;
		this.anchor.set(0.5,0.5);
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
    	graphics.moveTo(config.b.x,config.b.y);
    	graphics.lineTo(config.a.x,config.a.y);
    	graphics.endFill();
    	this.addChild(this.graphics);
	}

	drawBody()
	{
		var game = this.game,
			x = this.x,
			y = this.y,
			config = this.config,
			body = new Phaser.Physics.Box2D.Body(game, null,x, y, 100);
			body.setChain([
				config.b.x,config.b.y,config.a.x,config.a.y
			]);
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
			scale = global_config.Config.scale;
		config.a.x *= scale;
		config.a.y *= scale;
		config.b.x *= scale;
		config.b.y *= scale;
		this.config = config;
	}
}

class SimpleLine extends Line
{
	constructor(game,line)
	{
	    super(game,line);
	    this.reset();
		this.drawBody();
	}
}

class InfoLine extends Line
{
	constructor(game,line)
	{
	    super(game,line);
	    this._lineWidth = 1;
	    this._color = 0xcccccc;
		this.drawLine();
	}
	update(){}
}

class LaserLine extends Line
{
	constructor(game,line)
	{
	    super(game,line);
	    this.laserOn = false;
	    this._lineWidth = 1;
	    this._color = 0xcccccc;
	    this.laserGraphics = new Phaser.Graphics(game,0,0);
	    this.addChild(this.laserGraphics);
		this.drawBody();
		this.switchLaserState();
		this.drawLine();
	}

	switchLaserState()
	{
		this.laserOn = !this.laserOn;
		if(this.laserOn){
			this.skin.sensor = false;
			this.laserGraphics.visible = true;
		}else{
			this.skin.sensor = true;
			this.laserGraphics.visible = false;
		}
		setTimeout(this.switchLaserState.bind(this),3000);
	}

	updateLaserGraphics()
	{
		if(this.laserOn){
			var color = Utils.getRandomElement(global_config.LaserLineColors),
				config = this.config;
			this.laserGraphics.clear();
			this.laserGraphics.beginFill(color);
    		this.laserGraphics.lineStyle(5, color);
    		this.laserGraphics.moveTo(config.b.x,config.b.y);
    		this.laserGraphics.lineTo(config.a.x,config.a.y);
    		this.laserGraphics.drawCircle(config.a.x,config.a.y,5);
    		this.laserGraphics.endFill();
		}
	}

	update()
	{
		super.update();
		this.updateLaserGraphics();
	}
}