class GamePause extends BasePanel
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
		var game = this.game;
		this.resumeBtn = this.addButton(0,0,global_config.Language.btn_resume);
		this.lvlSelectBtn = this.addButton(0,60,global_config.Language.btn_level_select);
		this.quitBtn = this.addButton(0,120,global_config.Language.btn_quit);
	}

	updateTitle()
	{
		var game = this.game,
			title = global_config.Language.game_paused,
			subTitle = "";

		this.titleText.text = title;
		this.subTitleText.text = subTitle;
	}
}