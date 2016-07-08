class MainCog extends Phaser.Sprite
{
	constructor(game)
	{
		var cx = game.world.centerX,
	    	cy = game.world.centerY,
	    	polygonPoints = [],
	    	theta = 0,
	    	delta = 2 * Math.PI / 80,
	    	i = 0;
	    super(game,cx,cy,"cog");
		game.physics.box2d.enable(this);
		
		var radius = (this.width/2) - 25;
		for (theta = 0; theta <= 2 * Math.PI; theta += delta) 
		{
			var newTheta = theta + 0.2,
				radius1 = radius-10,
        		angle1 = newTheta + delta/2;
        	polygonPoints.push((radius * Math.cos(newTheta)));
        	polygonPoints.push((radius * Math.sin(newTheta)));
        	
        	polygonPoints.push((radius1 * Math.cos(angle1)));
        	polygonPoints.push((radius1 * Math.sin(angle1)));
        }
        this.anchor.set(0.5,0.5);
        this.body.setChain(polygonPoints);
        this.body.static = true;

        
		this.radius = radius;
	}
}