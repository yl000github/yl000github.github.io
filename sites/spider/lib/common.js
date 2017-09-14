function log(flag,obj){
	var str=null;
	if(obj instanceof Vec2){
		str=obj.x+","+obj.y;
	}else if(obj instanceof Particle){
		log(flag,obj.pos);return;
	}else if(obj instanceof Array){
		str=JSON.stringify(obj);
	}else {
		try {
			str=JSON.stringify(obj);
		} catch (e) {
			str=obj.toString();
		}
	}
	if(!str) str=obj;
	console.log("===="+flag+"===="+str);
}


//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
//洗牌，数组乱序
function shuffle(o) { //v1.0
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}