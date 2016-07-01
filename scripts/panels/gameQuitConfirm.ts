class GameQuitConfirm extends BasePanel
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
		this.startBtn = this.addButton(0,20,global_config.Language.btn_level_select);
		this.startBtn = this.addButton(0,100,global_config.Language.btn_quit);
	}

	updateTitle()
	{
		var game = this.game,
			title = "",
			subTitle = global_config.Language.confirm_quit_to_mainmenu;

		this.titleText.text = title;
		this.subTitleText.text = subTitle;
		this.subTitleText.wordWrapWidth = this.baseImage.width-30;
		this.subTitleText.wordWrap = true;
		this.subTitleText.align = "center";
	}
}