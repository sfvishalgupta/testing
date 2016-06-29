class GoldFly extends Fly
{
	constructor(game,config)
	{
		super(game,config.x,config.y,"goldFly");
		this.config = config;
	}
}