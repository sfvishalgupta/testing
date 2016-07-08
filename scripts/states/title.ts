class TitleState extends Phaser.State
{
	constructor()
	{
		super();
	}

	create()
	{
		var game = this.game;
		game.add.image(0,0,"menu");
	}
}