class ParallelSymbol extends Phaser.Sprite
{	
	constructor(game,x,y,angle,color,count)
	{
		super(game,x,y);
		this.graphics = new Phaser.Graphics(game,0,0);
		this.count = count;
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

    	for(var i=0;i<this.count;i++){
    		graphics.moveTo(i*10,0);
    		graphics.lineTo(width+i*10,width);
    		graphics.lineTo(i*10,0);
    		graphics.lineTo(width+i*10,-width);	
    	}

    	graphics.endFill();
	}
}