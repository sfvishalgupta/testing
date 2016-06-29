class StageButton extends Phaser.Button
{
	constructor(game,x,y,txt)
	{
		super(game,x,y);
		this.index = txt;
		this.game = game;
		this.drawText();
		this.inputEnabled = true;
		this.input.useHandCursor = true;
	}

	drawText()
	{
		var game = this.game,
			style1 = {fill:'#FFFFFF',font: "bold 14px Arial",stroke : '#000000',strokeThickness :  7},
			style2 = {fill:'#FFFFFF',font: "bold 25px Arial",stroke : '#000000',strokeThickness :  7};
		this.textLabel1 = new Phaser.Text(game,0,0,"STAGE",style1);
		this.textLabel1.anchor.set(0.5,0.5);
		this.addChild(this.textLabel1);

		this.textLabel2 = new Phaser.Text(game,0,30,this.index,style2);
		this.textLabel2.anchor.set(0.5,0.5);
		this.addChild(this.textLabel2);
	}

	enableClick()
	{
		var game = this.game,
			style1 = {fill:'#FF0000',font: "bold 14px Arial",stroke : '#000000',strokeThickness :  7},
			style2 = {fill:'#FF0000',font: "bold 25px Arial",stroke : '#000000',strokeThickness :  7};
		this.textLabel1.setStyle(style1);
		this.textLabel2.setStyle(style2);
	}

	disableClick()
	{
		var game = this.game,
			style1 = {fill:'#FFFFFF',font: "bold 14px Arial",stroke : '#000000',strokeThickness :  7},
			style2 = {fill:'#FFFFFF',font: "bold 25px Arial",stroke : '#000000',strokeThickness :  7};
		this.textLabel1.setStyle(style1);
		this.textLabel2.setStyle(style2);
	}
}