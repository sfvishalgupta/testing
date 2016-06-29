class MenuState
{
	constructor()
	{
		this.stageBtns = [];
		this.levelButtons = [];
	}

	create()
	{
		var game = this.game,
			clock = global_config.Images.ClockOpen,
			y = 500;
		game.add.image(0,0,"menu");
		game.add.image(clock.x, clock.y, clock.frame, clock.frameName);

		for(var i=1;i<=6;i++)
		{
			var btn = new StageButton(game,125,y,i);
			this.add.existing(btn);
			y -= 73;
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
    		}.bind(this));
    		this.stageBtns.push(btn);
    		if(i ==1){
    			btn.enableClick();
    			global_config.stage = "S1";
				global_config.world = "world01";
    		}
		}
		this.drawSeleceButtons();
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
			posx = [
						220,315,410,505,600,695,
						220,315,410,505,600,695,
						220,315,410,505,600,695,
						220,315,410,505,600,695
					],
			posy = [
						80,80,80,80,80,80,
						193,193,193,193,193,193,
						306,306,306,306,306,306,
						419,419,419,419,419,419
				   ],
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