class SelectButton extends Phaser.Button
{
	constructor(game,level){
		var gameData = global_config.gameData.gameData,
			levelGameData = gameData["stage"][global_config.stage]["L"+Utils.getLevelNumber(level)];
		super(game,0,0);
		this.game = game;
		this.myIndex = level;
		this.currentState = global_config.Objects.SelectBtn.State_Lock;
		this.inputEnabled = true;
		this.input.useHandCursor = true;
		this.levelGameData = levelGameData;
		if(this.levelGameData){
			this.drawOpneBtn();
			this.onInputOver.add(this.onHover.bind(this));
			this.onInputOut.add(this.onOut.bind(this));
		}else{
			this.drawLockedBtn();
		}
		
		var style1 = {fill:'#000000',font: "bold 18px Arial", stroke : '#FFFFFF',strokeThickness: 2};
		this.labelText = new Phaser.Text(game,32,8,this.myIndex.substring(1),style1);
		this.addChild(this.labelText);
	}

	onOut()
	{
		if(this.currentState == global_config.Objects.SelectBtn.State_Open){
			var style1 = {fill:'#000000',font: "bold 18px Arial", stroke : '#FFFFFF',strokeThickness: 2};
			this.body.alpha = 0.9;
			this.labelText.setStyle(style1);
		}
	}

	onHover()
	{
		if(this.currentState == global_config.Objects.SelectBtn.State_Open){
			var style1 = {fill:'#FEE300',font: "bold 19px Arial", stroke: '#000000',strokeThickness: 2};
			this.body.alpha = 1;
			this.labelText.setStyle(style1);
		}
	}

	drawLockedBtn()
	{
		var cnf = global_config.Images.MenuLock,
			game = this.game,
			lock = new Phaser.Image(game,0,0,'lock_close');
		this.body = new Phaser.Image(game,0,0,cnf.frame,cnf.frameName);
		lock.anchor.set(0.5, 0.5);
		lock.position.x = this.body.width/2;
		lock.position.y = 13+this.body.height/2;
		this.body.addChild(lock);
		this.addChild(this.body);

	}

	drawOpneBtn()
	{
		var cnf = global_config.Images.MenuUp,
			game = this.game,
			bstStl = {fill:'#000000',font: "bold 14px Arial"};
		this.currentState = global_config.Objects.SelectBtn.State_Open;
		this.body = new Phaser.Image(game,0,0,cnf.frame,cnf.frameName);
		this.body.alpha = 0.9;
		this.addChildAt(this.body,0);

		var textBest = new Phaser.Text(game,0,40,"BEST",bstStl);
		textBest.anchor.set(0.5, 0.5);
		textBest.position.x = this.body.width/2;
		this.addChild(textBest);

		var txtRank = new Phaser.Text(game,0,90,"Rank",bstStl);
		txtRank.anchor.set(0.5, 0.5);
		txtRank.position.x = (this.body.width/2) -10;
		this.addChild(txtRank);

		if(this.levelGameData.score >-1){
			var txtScore = new Phaser.Text(game,0,60,this.levelGameData.score,bstStl);
			txtScore.anchor.set(0.5, 0.5);
			txtScore.position.x = this.body.width/2;
			this.addChild(txtScore);	
		}

		var allLevels = this.game.cache.getJSON('level')["levels"],
			stage = allLevels[global_config.stage],
			ranks = stage[this.myIndex].ranks,
			rankObj = Utils.getRank(ranks,this.levelGameData.score),
			txtRank1 = new Phaser.Text(game,0,90,rankObj.rank,rankObj.style);

		txtRank1.anchor.set(0.5, 0.5);
		txtRank1.position.x = 20+this.body.width/2;
		this.addChild(txtRank1);
	}
}