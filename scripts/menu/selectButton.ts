class SelectButton extends Phaser.Button
{
	constructor(game,level){
		var cnf = global_config.Images.MenuLock;
		super(game,0,0,cnf.frame,cnf.frameName);
		this.game = game;
		this.myIndex = level;
		this.currentState = global_config.Objects.SelectBtn.State_Lock;
		this.onInputOver.add(this.onHover.bind(this));
		this.onInputOut.add(this.onOut.bind(this));
		this.inputEnabled = true;
		this.input.useHandCursor = true;
		this.draw();
	}

	onOut()
	{
		if(this.currentState == global_config.Objects.SelectBtn.State_Open){
			var cnf = global_config.Images.MenuDown;
			this.key = cnf.frame;
			this.frame = 0;
		}
	}

	onHover()
	{
		if(this.currentState == global_config.Objects.SelectBtn.State_Open){
			var cnf = global_config.Images.MenuUp;
			this.key = cnf.frame;
			this.frame = 0;
		}
	}

	draw()
	{
		var game = this.game,
			style1 = {fill:'#cccccc',font: "bold 18px Arial"};
		this.labelText = new Phaser.Text(game,32,8,this.myIndex.substring(1),style1);
		this.addChild(this.labelText);
	}

	openBtn()
	{
		this.currentState = global_config.Objects.SelectBtn.State_Open;
		var cnf = global_config.Images.MenuDown;
		this.key = cnf.frame;
		this.frame = 0;
	}
}