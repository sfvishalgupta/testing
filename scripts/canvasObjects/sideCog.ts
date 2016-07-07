class SideCog extends Phaser.Sprite
{
	constructor(game)
	{
		super(game,0,0);
		this.game = game;
		this.drawSideCogWheel();
	}

	drawSideCogWheel()
	{
		var game = this.game,
			currentStage = global_config.stage,
			cnf = global_config.Positions.SmallCog[currentStage],
			sprite = null;

		switch(currentStage)
		{
			case "S2":
				sprite = new Phaser.Sprite(game,cnf.cogX,cnf.cogY,'side_cog_gear',0);
				sprite.anchor.set(0.5,0.5);
				sprite.animations.add('play');
				this.addChild(sprite);
				this.cog = sprite;

				this.chainSprite = new Phaser.TileSprite(game,cnf.chainX,cnf.chainY,16,350,
					"cog_chain_long");
				this.chainSprite.anchor.set(0.5,0);
				this.addChild(this.chainSprite);
			break;
			case "S5":
			break;
			case "S3":
			case "S1":
			default:
				sprite = new Phaser.Sprite(game,cnf.cogX,cnf.cogY,'cog_small');
				sprite.anchor.set(0.5,0.5);		
				this.addChild(sprite);
				this.cog = sprite;
			break;
		}
		if(global_config.stage == "S4" || global_config.stage == "S6"){
			this.chainSprite1 = new Phaser.TileSprite(game,cnf.chainX+25,cnf.chainY,16,350,
					"cog_chain_long");
			this.chainSprite1.anchor.set(0.5,0);
			this.addChildAt(this.chainSprite1,0);

			this.chainSprite2 = new Phaser.TileSprite(game,cnf.chainX-15,cnf.chainY,16,350,
					"cog_chain_long");
			this.chainSprite2.anchor.set(0.5,0);
			this.addChildAt(this.chainSprite2,1);
		}
	}

	updateAngle(angularSpeed)
	{
		var speed = (angularSpeed * 20 / 3);
		switch(global_config.stage)
		{
			case "S2":
				if(this.angle != this.angle-speed){
					this.cog.animations.play("play",30,false);
					this.chainSprite.tilePosition.y += speed;
				}
			break;
			case "S4":
			case "S6":
				if(this.angle != this.angle-speed){
					this.cog.angle -= speed;
					this.chainSprite1.tilePosition.y -= speed;
					this.chainSprite2.tilePosition.y += speed;
				}
			break;
			case "S5":
			break;
			default:
				this.cog.angle -= speed;
			break;
		}
	}
}

