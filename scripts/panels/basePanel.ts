class BasePanel extends Phaser.Sprite
{
	constructor(game,x,y)
	{
		super(game,0,0);
		
		this.uptoY = y;
		this.game = game;
		this.anchor.set(0.5,0);

		this.drawSkin();
		this.drawPanelImage();
		this.drawPanelChains();

		this.addChild(this.chain1);
		this.addChild(this.chain2);
		this.addChild(this.baseImage);

		this.drawTitle();
		this.drawSubTitle();

		this.position.x = game.world.centerX;
		this.position.y = -y;
		this.isVisible = false;


	}

	drawSkin()
	{
		var game = this.game,
			graphics = new Phaser.Graphics(game,0,0);
		graphics.clear();
		graphics.beginFill(0x000000);
		graphics.drawRect(-400,-300,800,600);
		graphics.endFill();
		graphics.inputEnabled = true;
		graphics.alpha = 0.1;
		graphics.visible = false;
		this.addChild(graphics);
		this.graphics = graphics;
	}

	drawPanelImage()
	{
		var game = this.game;
		this.baseImage = new Phaser.Image(game,0,0,'menu_panel');
		this.baseImage.anchor.set(0.5,0.5);
	}

	drawPanelChains()
	{
		var game = this.game;
		this.chain1 = new Phaser.Image(game,-(this.baseImage.width/2)+20,-this.uptoY,'title_chain'),
		this.chain2 = new Phaser.Image(game,(this.baseImage.width/2)-20,-this.uptoY,'title_chain');
		this.chain1.anchor.set(0.5,0.5);
		this.chain2.anchor.set(0.5,0.5);
	}

	drawTitle()
	{
		var game = this.game,
			style = {fill:'#000000',font: "bold 45px Arial", stroke : '#FFFFFF',strokeThickness :  1};


		this.titleText = new Phaser.Text(game,0,20,"Title",style);
		this.titleText.anchor.set(0.5, 0);
		this.baseImage.addChild(this.titleText);
		this.titleText.position.y -= this.baseImage.height/2;
	}

	drawSubTitle()
	{
		var game = this.game,
			style = {fill:'#000000',font: "bold 35px Arial", stroke : '#FFFFFF',strokeThickness :  1};

		this.subTitleText = new Phaser.Text(game,0,80,"Sub Title",style);
		this.subTitleText.anchor.set(0.5, 0);
		this.baseImage.addChild(this.subTitleText);
		this.subTitleText.position.y -= this.baseImage.height/2;
	}

	toggle(cb)
	{
		var game = this.game,
			yUpto = this.isVisible ? -this.uptoY : this.uptoY,
			tween =	game.add.tween(this).to({y:yUpto}, global_config.Config.PanelToggleTime, "Linear",false);
		this.graphics.visible = false;
		tween.onComplete.add(function(){
			this.graphics.visible = true;
			if(cb){cb();}
		},this);
		this.isVisible = !this.isVisible;
		tween.start();
	}

	addButton(x, y, txt)
	{
		var game = this.game,
			startBtn = new Phaser.Sprite(game,x,y,'btn_smallup'),
			style = {fill:'#000000',font: "25px Arial"},
			text = new Phaser.Text(game, 0, 0, txt, style);
		startBtn.anchor.set(0.5,0);
		startBtn.inputEnabled = true;
		startBtn.alpha = .92;
		startBtn.input.useHandCursor = true;

		startBtn.events.onInputOver.add(function(btn){
			btn.alpha = 1;
		});

		startBtn.events.onInputOut.add(function(btn){
			btn.alpha = 0.92;
		});

		text.anchor.set(0.5,0.5);
		text.position.y = startBtn.height/2;
		startBtn.addChild(text);
		this.baseImage.addChild(startBtn);

		return startBtn;
	}
}