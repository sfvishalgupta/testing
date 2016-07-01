

class ImageLine extends Phaser.Sprite
{
	constructor(game,x,y,len,cnfImage)
	{
		super(game,x,y);
		this.len = len;
		this.pad = new Phaser.Sprite(game,0,0,cnfImage.frame);
		this.pad.scale.set(4,4);
		if(cnfImage.frameName){
			this.pad.frameName = cnfImage.frameName;
		}
		
		var graphics = new Phaser.Graphics(game,0,0);
		graphics.clear();
		graphics.beginFill(0x0000FF);
    	graphics.drawRect(0,0,len,global_config.Config.lineWidth);
    	graphics.endFill();
    	this.addChild(graphics);
    	this.addChild(this.pad);
    	this.pad.mask = graphics;
    	this.pad.anchor.set(0.5,0.5);
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
		this._updateLine();
		this.anchor.set(0.5,0.5);
		if(config.parallelSymbol>0){
			this._addParallelSymbol();
		}

		if(config.equalLengthSymbol>0){
			this._addEqualLenghtSymbol();	
		}
	}

	reset()
	{
		this._lineWidth = global_config.Config.lineWidth;
		this.drawImageLine();
	}

	drawImageLine()
	{
		var game = this.game,
			config = this.config,
			cnfImage = global_config.Images.LineTexture,
			width = Utils.getDistanceBetweenPoints(config.a.x,config.a.y, config.b.x, config.b.y),
			angle = Utils.getLineAngle(config.a.x,config.a.y, config.b.x, config.b.y);

		this.imageBody = new ImageLine(game, config.a.x, config.a.y,width,cnfImage);
		this.imageBody.angle = angle;
		this.addChild(this.imageBody);
	}

	drawLine()
	{
		var game = this.game,
			config = this.config,
			graphics = this.graphics,
			color = this._color,
			lineWidth = this._lineWidth;
		graphics.clear();
		graphics.beginFill(color);
    	graphics.lineStyle(lineWidth, color);
    	graphics.moveTo(config.b.x,config.b.y);
    	graphics.lineTo(config.a.x,config.a.y);
    	graphics.endFill();
    	this.addChild(this.graphics);

    	if(config.parallelSymbol || config.equalLengthSymbol){
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
	}

	updateLineTriggered(color)
	{
		this.canTriggerd = true;
		this._color = color;
		this.removeChild(this.imageBody);
		this.drawLine();
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

	_addEqualLenghtSymbol()
	{
		var game = this.game,
			config = this.config,
			x = (config.b.x+config.a.x)/2,
			y = (config.b.y+config.a.y)/2,
			line = new Phaser.Line(config.a.x,config.a.y, config.b.x, config.b.y),
			angle = Phaser.Math.radToDeg(line.angle),
			signDiff = 40;

		var symbol = new EqualSymbol(game,x,y,angle,this._color,config.equalLengthSymbol);
		this.symbol = symbol;
		this.addChild(symbol);
	}

	_addParallelSymbol()
	{
		var game = this.game,
			config = this.config,
			x = (config.b.x+config.a.x)/2,
			y = (config.b.y+config.a.y)/2,
			line = new Phaser.Line(config.a.x,config.a.y, config.b.x, config.b.y),
			angle = Phaser.Math.radToDeg(line.angle),
			signDiff = 10;

		var symbol = new ParallelSymbol(game,x,y,angle,this._color);
		this.symbol = symbol;
		this.addChild(symbol);
	}
}