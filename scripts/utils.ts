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
}