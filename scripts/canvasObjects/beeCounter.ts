class BeeCounter extends Phaser.Sprite
{
	constructor(game,cnf)
	{
		super(game,cnf.x,cnf.y,cnf.frame);
		if(cnf.frameName){
			this.frame = cnf.frameName;
		}
		this.game = game;
		this.totalBee = 0;
		this.collectedBee = 0;
		this.addTexts();
	}

	addBeeImage(image){
		var game = this.game;
		this.addChild(new Phaser.Image(game,20,6,image));
	}

	addTexts()
	{
		var game = this.game,
			style1 = {fill:'#000000',font: "bold 40px Arial"},
			style2 = {fill:'#000000',font: "bold 30px Arial"},
			slashText = new Phaser.Text(game,115,10,"/",style2);

		this.addChild(slashText);
		this.collectedBeeText = new Phaser.Text(game,93,3,"0",style1);
		this.addChild(this.collectedBeeText);

		this.totalBeeText = new Phaser.Text(game,122,10,"0",style2);
		this.addChild(this.totalBeeText);
	}

	setTotalBeeCount(count)
	{
		this.totalBeeText.text = count+"";
	}

	updateBeeCollected(count)
	{
		this.collectedBeeText.text = count+"";
	}
}

class BlueBeeCounter extends BeeCounter
{
	constructor(game)
	{
		var cnf = global_config.Images.BlueBeeCounter;
		super(game,cnf);
		this.addBeeImage("blueBee");
	}
}

class GoldBeeCounter extends BeeCounter
{
	constructor(game)
	{
		var cnf = global_config.Images.GoldBeeCounter;
		super(game,cnf);
		this.addBeeImage("goldBee");
	}
}

