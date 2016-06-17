class Angle extends Phaser.Sprite
{
	constructor(game,config,lines,color){
		var cx = game.world.centerX,
			cy = game.world.centerY;
		super(game,cx,cy);
		this.config = config;
		this.oLines = lines;
		this.color = color;
		this.game = game;
		this._draw();
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
			endAngle = Phaser.Point.angle(to,new Phaser.Point());

		var graphics1 = new Phaser.Graphics(game, inter.x*global_config.scale, inter.y*global_config.scale);
		graphics1.clear();
		graphics1.beginFill(this.color);
		for(var i=0;i<50;i++){
			graphics1.arc(0,0, i, startAngle,endAngle, false);
		}
		graphics1.endFill(); 
		this.addChild(graphics1);
	}
}