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
		var a1 = angle1,
			a2 = angle2,
			diff = (Math.abs(a1) - Math.abs(a2))/2,
			angle =  (angle1 > 0 ? 3.14/2 + angle1 : angle1) - diff,
			radius = global_config.Config.angleTextboxRadius,
			x = init.x + radius*Math.sin(angle),
			y = init.y + radius*Math.cos(angle);
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

	static getStageNumber(stage)
	{
		return stage.substring(1,stage.length);
	}

	static getLevelNumber(level){
		var level = level.substring(1,level.length);	
		return parseInt(level);
	}

	static getTranslatedString(str,args)
	{
		for(var i in args){
			str = str.replace("{0}",args[i]);
		}
		return str;	
	}

	static setGameData(data){
		if(!data.gameData.stage){
			data.gameData.stage = {};
			data.gameData.stage["S1"] = {};
			data.gameData.stage["S1"]["L1"] = {"score":-1};
		}else{
			for(var i in data.gameData.stage){
				var stage = data.gameData.stage[i],
					level = stage["L"+Object.keys(stage).length];
				if(level.score > -1){
					data.gameData.stage[i]["L"+(Object.keys(stage).length+1)] = {score:-1};
				}
			}
		}
		
		global_config.gameData = data;
	}

	static getRank(ranks,score){
		var style = {fill:'#000000', font: "bold 20px Arial",stroke : '#000000',strokeThickness: 2},
			rank = "--";
		if(score >= ranks.c && score < ranks.b){
			rank = "C";
			style.fill = "#07EFFD";
		}else if(score >= ranks.b && score < ranks.a){
			rank = "B";
			style.fill = "#8DD70B";
		}else if(score >= ranks.a && score < ranks.s){
			rank = "A";
			style.fill = "#F3AD00";
		}else if(score >= ranks.s){
			rank = "S";
			style.fill = "#FB3008";
		}
		return {rank:rank, style : style};
	}

	static getUserTotalScore()
	{
		var gameData = global_config.gameData.gameData,
			totalScore = 0;
		for(var i in gameData.stage){
			for(var j in gameData.stage[i]){
				var score = gameData.stage[i][j]["score"];
				if(score>0){
					totalScore += score;	
				}
			}
		}
		return totalScore;
	}

	static getUserStageScore()
	{
		var stage = global_config.stage || "S1",
			gameData = global_config.gameData.gameData.stage[stage],
			totalScore = 0;
		for(var j in gameData){
			var score = gameData[j]["score"];
			if(score>0){
				totalScore += score;	
			}
		}

		return totalScore;
	}

	static addSeperater(txt)
	{
		var rgx = /(\d+)(\d{3})/;
    	while (rgx.test(txt)) {
        	txt = txt.toString().replace(rgx, '$1' + global_config.Config.separator + '$2');
    	}
    	return txt;
	}
}

var Phaser = Phaser || {},
	global_config = global_config || {};

