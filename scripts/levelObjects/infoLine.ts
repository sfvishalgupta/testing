class InfoLine extends Line
{
	constructor(game,line)
	{
	    super(game,line);
	    this._lineWidth = 1;
	    this._color = 0xcccccc;
		this.drawLine();
	}
	update(){}
}