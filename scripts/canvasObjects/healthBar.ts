class HealthBar extends Phaser.Sprite
{
	constructor(game)
	{
		var config = global_config.Images.HealthBar;
		super(game, config.x, config.y, config.frame);
		if(config.frameName)
		{
			this.frame = config.frameName;
		}
		this.config = config;
		this.game = game;
		this.drawEnergy();
	} 

	setEnergy(percentage)
	{
		var newWidth = this.energyBar.width * percentage/100,
			cnf = global_config.Images.Energy;
		this.maskSprite.clear();
		this.maskSprite.beginFill(0xFFFFFF, 1);						
		this.maskSprite.drawRect(cnf.x, cnf.y, newWidth, this.energyBar.height);
		this.maskSprite.endFill();
	}

	drawEnergy()
	{
		var cnf = global_config.Images.Energy,
			game = this.game;
		this.energyBar = new Phaser.Sprite(game, cnf.x, cnf.y, cnf.frame);
		if(cnf.frameName){
			this.energyBar.frameName = cnf.frameName;
		}
		this.maskSprite = new Phaser.Graphics(game,0,0);
		
		this.energyBar.mask = this.maskSprite;
	
		this.addChild(this.energyBar);
		this.addChild(this.maskSprite);
		this.setEnergy(100);
	}
}

