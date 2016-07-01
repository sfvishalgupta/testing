class LaserLine extends Line
{
	constructor(game,line)
	{
	    super(game,line);
	    this.laserOn = false;
	    this._lineWidth = 1;
	    this._color = 0xcccccc;
	    this._onTime = global_config.Config.LaserLineOffTime;
	    this._offTime = global_config.Config.LaserLineOffTime;
	    this._initDelay = global_config.Config.LaserLineInitDelay;
	    this.laserGraphics = new Phaser.Graphics(game,0,0);
	    this.addChild(this.laserGraphics);
		this.drawBody();

		if(line.laserDelay){
			this._initDelay = line.laserDelay;
		}

		if(line.laserTimes.onTime){
			this._onTime = line.laserTimes.onTime;
		}

		if(line.laserTimes.onTime){
			this._offTime = line.laserTimes.onTime;
		}
		if(this.symbol) this.symbol.alpha = 0.5;
		setTimeout(this.switchLaserState.bind(this),this._initDelay);
		//this.drawLine();
	}

	switchLaserState()
	{
		this.laserOn = !this.laserOn;

		if(this.laserOn){
			this.skin.sensor = false;
			this.laserGraphics.visible = true;
			if(this.symbol) this.symbol.alpha = 1;
			setTimeout(this.switchLaserState.bind(this),this._offTime);
		}else{
			this.skin.sensor = true;
			this.laserGraphics.visible = false;
			if(this.symbol) this.symbol.alpha = 0.5;
			setTimeout(this.switchLaserState.bind(this),this._onTime);
		}
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