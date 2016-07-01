class CrumblingLine extends Line
{
	constructor(game,line)
	{
	    super(game,line);
	    this.reset();
		this.drawBody();
	}
}