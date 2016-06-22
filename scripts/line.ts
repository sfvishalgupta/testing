class ParallelSymbol extends Phaser.Sprite
{	
	constructor(game,x,y,angle,color)
	{
		super(game,x,y);
		this.graphics = new Phaser.Graphics(game,0,0);
		this.draw(color);
    	this.addChild(this.graphics);
    	this.angle = 180+angle;
	}

	draw(color)
	{
		this.color = color;
		var lineWidth = 2,
			width = 12;
		var graphics = this.graphics;
		graphics.clear();
		graphics.beginFill(this.color);
    	graphics.lineStyle(lineWidth, this.color);
    	graphics.moveTo(0,0);
    	graphics.lineTo(width,width);
    	graphics.moveTo(0,0);
    	graphics.lineTo(width,-width);
    	graphics.endFill();
	}
}

class ConveyorSprite extends Phaser.Sprite
{
	constructor(game,x,y,len)
	{
		super(game,x,y);
		this.len = len;
		this.pad = new Phaser.Sprite(game,0,0,"conveyor");
		this.addChild(this.pad);
		var graphics = new Phaser.Graphics(game,0,0);
		graphics.clear();
		graphics.beginFill(0x0000FF);
    	graphics.drawRect(0,0,len,5);
    	graphics.endFill();
    	this.addChild(graphics);
    	this.pad.mask = graphics;
    	this.pad.anchor.set(0.5,0.5);
	}
	update()
	{
		
		this.pad.x += 1;
		if(this.pad.x > this.len){
			this.pad.x = 0;
		}
	}
}


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
		if(config.parallelSymbol){
			this._addParallelSymbol();
		}
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

    	if(config.parallelSymbol){
			this.symbol.draw(this._color);
		}
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
		if(this.config.parallelSymbol){
			//this.symbol.angle +=1;
		}
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

	_addParallelSymbol()
	{
		var game = this.game,
			config = this.config,
			x = (config.b.x+config.a.x)/2,
			y = (config.b.y+config.a.y)/2,
			line = new Phaser.Line(config.a.x,config.a.y, config.b.x, config.b.y),
			angle = Phaser.Math.radToDeg(line.angle),
			symbol = new ParallelSymbol(game,x,y,angle,this._color);
		this.symbol = symbol;
		this.addChild(symbol);
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

class ConveyorLine extends Line
{
	constructor(game,line)
	{
		super(game,line);
	    this._speed = 1;//this.config.conveyorSpeed
		this.addPad();
		this.drawBody();
		this._color = 0x00FF00;
		//this.reset();
	}

	addPad()
	{
		console.log(this.config);
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
		//this.angle +=1;
		/*
		
		*/
	}
}