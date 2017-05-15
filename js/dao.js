window.onload = function() {
		var canvas = document.getElementById("scratch");

		// canvas dimensions
		var width = parseInt(canvas.style.width);
		var height = parseInt(canvas.style.height);

		// retina
		var dpr = window.devicePixelRatio || 1;
		canvas.width = width*dpr;
		canvas.height = height*dpr;
		canvas.getContext("2d").scale(dpr, dpr);

		// simulation
		var sim = new VerletJS(width, height, canvas);
		
		// entities
		//TODO
		var spiderweb=sim.spiderweb(new Vec2(width/2,height/2), width, height, 40, 40);
		var spider = sim.spider(new Vec2(width/2,0));    
//		var paths=getPaths(spiderweb);
		var paths=getPaths(width, height, 20, 20);
		log("paths",paths)
		
		// animation loop
		var legIndex = 0;
		var curPathIndex=0;
		var loop = function() {
			log("当前蜘蛛位置",spider.thorax.pos)
			log("当前目标点",paths[curPathIndex])
//			if (Math.floor(Math.random()*4) == 0) {
			if (true) {
				sim.crawl(((legIndex++))%8,paths[curPathIndex]);
//				sim.crawl(((legIndex++)*3)%8,paths[curPathIndex]);
				if(checkArrive(spider.particles[0].pos, paths[curPathIndex])){
					if(curPathIndex<paths.length-1)
					curPathIndex++;
					log("走下一个格子",paths[curPathIndex]);
				}
			}
			sim.frame(16);
			sim.draw();
			requestAnimFrame(loop);
		};

		loop();
	};
/**
 * 产生行走路径
 * @param width
 * @param height
 * @param wNum
 * @param hNum
 */
//function getPaths(spiderweb){
	function getPaths(width, height, wNum,hNum){
	var widthPiece=width/wNum;//宽每一块的长度
	var heightPiece=height/hNum;//高每一块的长度
	var paths=[];
	for (var i = 0; i < hNum; i++) {
		paths.push(new Vec2(wNum*widthPiece/2,(hNum-i)*heightPiece));
	}
	for (var i = 0; i < wNum; i++) {
		paths.push(new Vec2(i*widthPiece,hNum*heightPiece/2));
	}
	console.log("paths");
	console.log(paths)
	return paths;
//	return robotPosList.map(function(pos){
//		return new Vec2(pos.x,pos.y);
//	});
//	return robotPosList;
}
/**
 * 两点之间的距离小于某个值就算作到达
 * @param spiderLoc
 * @param dest
 */
function checkArrive(spiderLoc,dest){
//	console.log("checkArrive start")
	var rs=spiderLoc.sub(dest).length();
//	console.log("checkArrive end "+rs)
	return rs<20;
}
