class DebugText extends Phaser.Text
{
	constructor(game,point,text)
	{
		var style = {fill:'#FFFFFF',font: "bold 20px Arial"};
		super(game,400,300,text,style);
		this.pivot.x = -point.b.x;
		this.pivot.y = -point.b.y;
		var angle = Phaser.Point.angle(
				new Phaser.Point(point.a.x,point.a.y),
				new Phaser.Point(point.b.x,point.b.y)
		);
		this.angle = angle;
		this.anchor.set(0.5,0.5);
	}
}