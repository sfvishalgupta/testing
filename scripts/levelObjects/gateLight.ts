class GateLight extends Phaser.Sprite
{
	constructor(game)
	{
		super(game,0,0, "GateLight");
		this.maxFrame = 7;
		this.frame = this.maxFrame -1 ;
		this.anchor.set(0.5, 0.5);
	}

	openLight()
	{
		this.frame = this.maxFrame-2;
	}
}