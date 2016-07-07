class CanvasObjects extends Phaser.Sprite
{
	constructor(game)
	{
		super(game,0,0);
		this.game = game;
		this.addBeeCounter();
		this.addHealtBar();
		this.addTimer();
		this.addActionButtons();
	}

	// Bee Counter UI
	addBeeCounter()
	{
		var game = this.game;

		this.blueBeeCounter = new BlueBeeCounter(game);
		this.addChild(this.blueBeeCounter);

		this.goldBeeCounter = new GoldBeeCounter(game);
		this.addChild(this.goldBeeCounter);
	}

	updateBeeCounter(blueFliesCount,goldFliesCount)
	{
		this.blueBeeCounter.setTotalBeeCount(blueFliesCount);
		this.goldBeeCounter.setTotalBeeCount(goldFliesCount);
	}

	updateBeeCollected(count1,count2)
	{
		this.blueBeeCounter.updateBeeCollected(count1);
		this.goldBeeCounter.updateBeeCollected(count2);	
	}

	// Adding HealthBar UI
	addHealtBar()
	{
		var game = this.game;
		this.healthBar = new HealthBar(game);
		this.addChild(this.healthBar);
	}

	updateEnergy(health)
	{
		this.healthBar.setEnergy(health);
	}

	// Adding Timer UI
	addTimer()
	{
		var game = this.game;
		this.timer = new Timer(game);
		this.addChild(this.timer);
	}

	// Adding Action Buttons
	addActionButtons()
	{
		var game = this.game,
			pauseCnf = global_config.Images.GamePause,
			helpCnf = global_config.Images.GameHelp,
			replayCnf = global_config.Images.GameReplay;

		this.pauseButton = new Phaser.Button(game, pauseCnf.x, pauseCnf.y, pauseCnf.frame);
		this.pauseButton.inputEnabled = true;
		this.pauseButton.input.useHandCursor = true;
		this.addChild(this.pauseButton);

		this.helpButton = new Phaser.Button(game, helpCnf.x, helpCnf.y, helpCnf.frame);
		this.helpButton.inputEnabled = true;
		this.helpButton.input.useHandCursor = true;
		this.addChild(this.helpButton);

		this.replayButton = new Phaser.Button(game, replayCnf.x, replayCnf.y, replayCnf.frame);
		this.replayButton.inputEnabled = true;
		this.replayButton.input.useHandCursor = true;
		this.addChild(this.replayButton);

		this.pauseButton.onInputUp.add(function(event){
			this.loadMenuScreen();
		},this);
	}

	loadMenuScreen()
	{
		this.game.state.add("Menu", new MenuState(),true);
		//window.location.reload();
	}
}