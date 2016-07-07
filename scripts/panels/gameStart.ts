class GameStart extends BasePanel
{
	constructor(game, x, y)
	{
		super(game, x, y);
		this.game = game;
		this.updateTitle();
		this.drawPanelAssets();
		this.drawLevelInfo();
	}

	drawLevelInfo()
	{
		var game = this.game,
			allLevels = game.cache.getJSON('level')["levels"],
			stage = allLevels[global_config.stage],
			level = stage[global_config.level],
			style = {fill:'#000000',font: "bold 25px Arial"},
			time = parseInt(level.time/60)+":0"+(level.time%60),
			blueFlyLength = typeof level.blueFlies != "undefined" ? level.blueFlies.length : 0,
			pinkFlyLength = typeof level.pinkFlies != "undefined" ? level.pinkFlies.length : 0,
			
			img1 = new Phaser.Image(game, -70, 10, 'icon_clock'),
			img2 = new Phaser.Image(game, -75, 60, 'icon_fly_blue'),
			img3 = new Phaser.Image(game, -75, 100, 'icon_fly_yellow'),
			
			txt1 = new Phaser.Text(game, 40 , 10, time,style),
			txt2 = new Phaser.Text(game, 40, 60, ""+blueFlyLength,style),
			txt3 = new Phaser.Text(game, 40, 100, ""+pinkFlyLength,style);

			txt1.anchor.set(0.5,0);
			txt2.anchor.set(0.5,0);
			txt3.anchor.set(0.5,0);
		
		this.startPalePanel.addChild(img1);
		this.startPalePanel.addChild(img2);
		this.startPalePanel.addChild(img3);

		this.startPalePanel.addChild(txt1);
		this.startPalePanel.addChild(txt2);
		this.startPalePanel.addChild(txt3);
	}

	drawPanelAssets()
	{
		var game = this.game;
		this.startPalePanel = new Phaser.Image(game,0,-50,'start_pale_panel');
		this.startPalePanel.anchor.set(0.5,0);
		this.baseImage.addChild(this.startPalePanel);

		this.startBtn = this.addButton(0,120,global_config.Language.btn_play_level);
	}

	updateTitle()
	{
		var game = this.game,
			stageNum = global_config.Language["num_"+Utils.getStageNumber(global_config.stage)],
			stage = Utils.getTranslatedString(global_config.Language.lvlintro_world, [stageNum]),
			lvlNum = global_config.Language["num_"+Utils.getLevelNumber(global_config.level)],
			lvl = Utils.getTranslatedString(global_config.Language.lvlintro_level, [lvlNum]);

		this.titleText.text = stage;
		this.subTitleText.text = lvl;
	}
}