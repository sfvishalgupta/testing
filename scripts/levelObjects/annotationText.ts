class AnnotationText extends Phaser.Sprite
{
	constructor(game,cnf)
	{
		var cx = game.world.centerX,
			cy = game.world.centerY;
		super(game,cx,cy);
		this.game = game;
		this.cnf = cnf;
		this.drawAnotationText();
		this.game.onGameEnd.add(this.onGameEnd,this);
	}

	drawAnotationText()
	{
		var game = this.game,
			style = {fill:'#FFFFFF',font: "bold 18px Arial"},
			x = this.cnf.pos.x*global_config.Config.scale,
			y = this.cnf.pos.y*global_config.Config.scale;
		
		this.textLabel = new Phaser.Text(game,x,y,this.cnf.text,style);
		this.textLabel.anchor.set(0.5,0.5);
		this.addChild(this.textLabel);
	}

	update()
	{
		this.textLabel.angle = -this.angle;
	}

	onGameEnd()
	{
		
	}


}