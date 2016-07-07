class GameFail extends BasePanel
{
	constructor(game, x, y)
	{
		super(game, x, y);
		this.game = game;
		this.updateTitle();
		this.drawPanelAssets();
	}

	drawPanelAssets()
	{
		var game = this.game,
			style = {fill:'#000000',font: "bold 25px Arial"},
			txt1 = new Phaser.Text(game, 0 , 10, global_config.Language.level_failed_total_score,style),
			txt2 = new Phaser.Text(game, 0, 40, "000000",style);

		this.startPalePanel = new Phaser.Image(game,0,-50,'over_pale_panel');
		this.startPalePanel.anchor.set(0.5,0);
		this.baseImage.addChild(this.startPalePanel);

		this.tryAgainBtn = this.addButton(0,40,global_config.Language.btn_try_again);
		this.selectBtn = this.addButton(0,90,global_config.Language.btn_level_select);
		this.quitBtn = this.addButton(0,140,global_config.Language.btn_quit);

		txt1.anchor.set(0.5,0);
		txt2.anchor.set(0.5,0);

		this.startPalePanel.addChild(txt1);
		this.startPalePanel.addChild(txt2);

	}

	updateTitle()
	{
		var game = this.game,
			title = global_config.Language.level_failed;
		this.titleText.text = title;
	}

	toggle(msg)
	{
		this.subTitleText.text = msg;
		super.toggle();
	}
}