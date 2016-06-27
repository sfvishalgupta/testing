class Timer extends Phaser.Sprite
{
	constructor(game)
	{
		var cnf = global_config.Images.Timer;
		super(game,cnf.x,cnf.y,cnf.frame);
		if(cnf.frameName){
			this.frame = frameName;
		}
	}
}