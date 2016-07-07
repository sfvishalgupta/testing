class BlueFly extends Fly
{
	constructor(game,config)
	{
		super(game,config.x,config.y,"blueFly");
		this.config = config;
	}
}