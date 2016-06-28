class Utils
{
	static getQueryParams(){
		var match,
			queryParams = {},
			pl = /\+/g,  // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			decode = function (s) {
				return decodeURIComponent(s.replace(pl, " "));
			},
			query = window.location.search.substring(1);
			while (match = search.exec(query)) {
				queryParams[decode(match[1])] = decode(match[2]);
			}
		return queryParams;
	}

	static getLevel(level){
		if(typeof level == "undefined") return "01";
		return level.length < 2 ? "0"+level : level;
	}

	static getRandomElement(arr){
		if(typeof arr == "undefined") return null;
		return arr[Math.floor(Math.random()*arr.length)];
	}

	static merge_objects(obj1, obj2)
	{
		var obj3 = {},
		attrname;
		for(attrname in obj1) 
		{ 
			obj3[attrname] = obj1[attrname]; 
		}
		for(attrname in obj2)
		{ 
			obj3[attrname] = obj2[attrname]; 
		}
		return obj3;
	}

	static getDistanceBetweenPoints(x1,y1,x2,y2)
	{
		return Phaser.Math.distance(x1, y1, x2, y2);
	}

	static getLineAngle(x1,y1,x2,y2)
	{
		var line = new Phaser.Line(x1, y1, x2, y2);
		return Phaser.Math.radToDeg(line.angle);
	}

	static getRadialPosition(init, angle1, angle2){
		console.log(angle1,angle2);
		var a1 = angle1,
			a2 = angle2,
			diff = (Math.abs(a1) - Math.abs(a2))/2,
			angle =  angle1 > 0 ? 3.14/2 + angle1 : angle1 ,
			angle = angle - diff,
			radius = 80,//global_config.Config.angleTextboxRadius,
			x = init.x + radius*Math.sin(angle),
			y = init.y + radius*Math.cos(angle);
		console.log(a2 - a1,diff);
		if(a2 - a1 > 0){

		}else{
			//return {x:x,y:-y};
		}
		return {x:x,y:y};
	}

	static getIntersactionPoint(line1, line2)
	{
		var x1 = line1.config.a.x,
			x2 = line1.config.b.x,
			x3 = line2.config.a.x,
			x4 = line2.config.b.x,
			y1 = line1.config.a.y,
			y2 = line1.config.b.y,
			y3 = line2.config.a.y,
			y4 = line2.config.b.y,
			inter = Phaser.Line.intersectsPoints(
				new Phaser.Point(x1, y1),
				new Phaser.Point(x2, y2),
				new Phaser.Point(x3, y3),
				new Phaser.Point(x4, y4)
			)
		return inter;
	}

	static getKeycodeValue(code)
	{
		return code%48;
	}

	static getHashColor(color){
		return "#"+color.substring(2,color.length);
	}
}

var Phaser = Phaser || {},
	global_config = global_config || {};
