class MenuState extends Phaser.State
{
	constructor()
	{
		super();
		this.stageBtns = [];
		this.levelButtons = [];
	}

	create()
	{
		var game = this.game,
			clock = global_config.Images.ClockOpen,
			posx = global_config.Positions.StageButton.x,
			posY = global_config.Positions.StageButton.y;

		game.add.image(0,0,"menu");
		game.add.image(clock.x, clock.y, clock.frame, clock.frameName);
		this.drawArrow();
		this.drawBanners();

		for(var i=1;i<=6;i++)
		{
			var btn = new StageButton(game,posx[i-1],posY[i-1],i);
			btn.scale.set(0.8,0.8);
			this.add.existing(btn);
			btn.onInputUp.add(function(event){
				for(var i in this.stageBtns){
					this.stageBtns[i].disableClick();
				}
				event.enableClick();
				var stage = event.index;
				global_config.stage = "S"+stage;
				global_config.world = "world0"+stage;
				this.deleteLevelButtons();
				this.drawSeleceButtons();
				this.sideArrow.position.set(30,event.position.y);
				this.updateUserData(stage);
    		}.bind(this));
    		this.stageBtns.push(btn);
    		if(i == 1){
    			btn.enableClick();
    			global_config.stage = "S1";
				global_config.world = "world01";
				this.sideArrow.position.set(50,btn.position.y);
				this.updateUserData(1);
    		}
		}
		this.drawSeleceButtons();
		
	}

	updateUserData(stage)
	{
		this.topBannerText.text = global_config.Language["world_name_"+stage];
	}

	drawBanners()
	{
		var topBanner = this.game.add.sprite(246,0,"top_banner",0),
			bottomBanner = this.game.add.sprite(246,530,"bottom_banner",0),
			
			selectLevelStyle = {fill:'#000000',font: "bold 32px Arial",stroke : '#FFFFFF',strokeThickness : 3},
			selectLevelText = global_config.Language["title_level_select"],
			selectLevel = this.game.add.text(246+topBanner.width/2,10,selectLevelText,selectLevelStyle),
			
			worldStyle = {fill:'#000000',font: "bold 22px Arial",stroke : '#FFFFFF',strokeThickness : 2},
			worldText = global_config.Language["world_name_1"],
			worldLevel = this.game.add.text(246+topBanner.width/2,50,worldText,worldStyle),
			
			stgScoreStyle = {fill:'#000000',font: "bold 14px Arial",stroke : '#FFFFFF',strokeThickness : 2},
			stgScoreText = global_config.Language["lvlselect_worldscore"],
			stgScoreLevel = this.game.add.text(310,bottomBanner.y+15,stgScoreText,stgScoreStyle),
			
			totalScoreStyle = {fill:'#000000',font: "bold 14px Arial",stroke : '#FFFFFF',strokeThickness : 2},
			totalScoreText = global_config.Language["lvlselect_totalscore"],
			totalScoreLevel = this.game.add.text(520, bottomBanner.y+15,totalScoreText,totalScoreStyle);

		selectLevel.anchor.set(0.5,0);
		worldLevel.anchor.set(0.5,0);
		//totalScoreLevel.lineSpacing = -4;
		this.topBannerText = worldLevel;
	}

	drawArrow()
	{
		var game = this.game,
			graphics = new Phaser.Graphics(game,0,0),
			side = 20;
		graphics.clear();
		graphics.lineStyle(2,0x000000);
		graphics.beginFill(0xFE0000);
		graphics.moveTo(0,side);
		graphics.lineTo(0,-side);
		graphics.lineTo(1.71*side,0);
		graphics.endFill();
		
		this.sideArrow = game.add.sprite(0,0);
		var sp = new Phaser.Sprite(game,0,0,graphics.generateTexture());
		sp.tint = 0;
		sp.alpha = .3;
		sp.scale.set(1.3,1.3);
		this.sideArrow.addChild(sp);
		sp = new Phaser.Sprite(game,0,0,graphics.generateTexture());
		this.sideArrow.addChild(sp);
	}

	deleteLevelButtons()
	{
		var len = this.levelButtons.length;
		for(var i=0;i<len;i++){
			var btn = this.levelButtons.pop();
			btn.destroy();
		}
	}

	drawSeleceButtons()
	{
		var game = this.game,
			levels = game.cache.getJSON('level')["levels"][global_config.stage],
			posx = global_config.Positions.LevelButton.x,
			posy = global_config.Positions.LevelButton.y,
			ii = 0;
		var selectBtns = [],
			levelButtons = this.levelButtons;
		
		var fun = function()
		{
			setTimeout(function(){
				if(selectBtns.length>0)
				{
					var btn = selectBtns.pop();
					game.add.tween(btn).to(
						{	x:posx[btn.myxyindex],
							y:posy[btn.myxyindex]
						}, 100, Phaser.Easing.Linear.NONE, true);
					game.add.existing(btn);
					levelButtons.push(btn);
					btn.openBtn();
					fun();
				}
			},50);
		}
		
		for(var i in levels){
			var selectbtn = new SelectButton(game,i);
			selectbtn.position.x = posx[ii];
			selectbtn.position.y = -100;
			selectbtn.myxyindex = ii;
			selectBtns.push(selectbtn);
			if(levels[i].bonus){
				selectbtn.disable();
			}
			ii++;
			selectbtn.onInputUp.add(function(event){
				global_config.level = event.myIndex;
				game.state.add("Play", new PlayState(global_config.level,global_config.stage),true);
			}.bind(this));
		}
		selectBtns.reverse();
		fun();
	}
}