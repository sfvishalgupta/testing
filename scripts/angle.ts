class Angle extends Phaser.Button
{
	constructor(game,config,lines,color){
		var cx = game.world.centerX,
			cy = game.world.centerY;
		super(game,cx,cy);
		
		this.config = config;
		this.oLines = lines;
		this.color = color;
		this.game = game;
		this.triggeredLine = this.config.triggeredLine;
		this._lineWidth = 2;
		this._draw();
		this._addLabel();
	}

	triggerDisable()
	{
		this.alpha = 1;
	}
	enbaleTriggerClick()
	{
		this.alpha = 0.5;
		setTimeout(this.triggerDisable.bind(this),2000);
	}

	update()
	{
		this.textLabel.angle = -this.angle;
	}

	_draw()
	{
		var oAngle = this.config,
			game = this.game,
			cx = game.world.centerX,
			cy = game.world.centerY,
			aLine1 = oAngle.lineA.split("."),
			aLine2 = oAngle.lineB.split("."),
			line1 = this.oLines[aLine1[0]],
			line2 = this.oLines[aLine2[0]],
			pt1 = line1.config[aLine1[1]],
			pt2 = line2.config[aLine2[1]],
			pts1 = new Phaser.Point(pt1.x,pt1.y),
			pts2 = new Phaser.Point(pt2.x,pt2.y),
			inter = Phaser.Line.intersectsPoints(
				new Phaser.Point(line1.config.a.x,line1.config.a.y),
				new Phaser.Point(line1.config.b.x,line1.config.b.y),
				new Phaser.Point(line2.config.a.x,line2.config.a.y),
				new Phaser.Point(line2.config.b.x,line2.config.b.y)
			),
			from = Phaser.Point.subtract(pts1,inter),
			to = Phaser.Point.subtract(pts2,inter),
			startAngle = Phaser.Point.angle(from,new Phaser.Point()),
			endAngle = Phaser.Point.angle(to,new Phaser.Point()),
			max = oAngle.interactive ? 50 : 45,
			initX = inter.x*global_config.scale,
			initY = inter.y*global_config.scale;

		this.graphics = new Phaser.Graphics(game, initX, initY);
		this.graphics.clear();
		this.graphics.beginFill(this.color);

		for(var i=0;i<max;i++){
			this.graphics.arc(0,0, i, startAngle,endAngle, false);
		}
		this.graphics.endFill(); 
		this.addChild(this.graphics);
	}

	_addLabel()
	{
		var label = "x",
			game = this.game,
			oAngle = this.config,
			ranges = oAngle.value.range,
			random = 0,
			style = {fill:'#FF0000',font: "bold 16px Arial"},
			x = 0,
			y = 0

		if(!oAngle.interactive){
			random = ranges[Math.floor(Math.random()*ranges.length)];
			label = random;
		}

		this.textLabel = new Phaser.Text(game,x/2,y/2,label,style);
		this.textLabel.anchor.set(0.5,0.5);
		this.addChild(this.textLabel);
	}
}