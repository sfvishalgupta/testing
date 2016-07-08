class StageButton extends Phaser.Button
{
	constructor(game,x,y,txt)
	{
		super(game,x,y);
		this.index = txt;
		this.game = game;
		this.inputEnabled = true;
		this.input.useHandCursor = true;
		this.defaultStyle1 = JSON.parse(JSON.stringify(global_config.Styles.MenuScreen.worldButtonStage));
		this.defaultStyle2 = JSON.parse(JSON.stringify(global_config.Styles.MenuScreen.worldButtonStageNum));
		this.drawText();
		this.onInputOver.add(function(sprite){
			var game = this.game,
				style1 = this.defaultStyle1,
				style2 = this.defaultStyle2;
			style1.fill = style2.fill = "#ffe400";
			this.textLabel1.setStyle(style1);
			this.textLabel2.setStyle(style2);
		},this);

		this.onInputOut.add(function(sprite){
			if(this.isClicked){
				this.enableClick()
			}else{
				this.disableClick();
			}
		},this);
	}

	drawText()
	{
		var game = this.game,
			style1 = this.defaultStyle1,
			style2 = this.defaultStyle2,
			txt = global_config.Language.worldbtn_stage,
			stageIndex = global_config.Language["num_"+this.index];
		this.textLabel1 = new Phaser.Text(game,0,0,txt,style1);
		this.textLabel1.anchor.set(0.5, 0.5);
		this.addChild(this.textLabel1);

		this.textLabel2 = new Phaser.Text(game, 0, 30, stageIndex, style2);
		this.textLabel2.anchor.set(0.5, 0.5);
		this.addChild(this.textLabel2);
	}

	enableClick()
	{
		var game = this.game,
			style1 = this.defaultStyle1,
			style2 = this.defaultStyle2;
		style1.fill = style2.fill = "#FF0000";
		this.textLabel1.setStyle(style1);
		this.textLabel2.setStyle(style2);
		this.isClicked = true;
	}

	disableClick()
	{
		var game = this.game,
			style1 = this.defaultStyle1,
			style2 = this.defaultStyle2;
		style1.fill = style2.fill = "#FFFFFF";
		this.textLabel1.setStyle(style1);
		this.textLabel2.setStyle(style2);
		this.isClicked = false;
	}
}