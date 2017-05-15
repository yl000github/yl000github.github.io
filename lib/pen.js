VerletJS.prototype.pen=function(origin){
	var composite=new this.Composite();
	var head=new Particle(new Vec2(origin.x,origin.y));
	var tail=new Particle(head.pos.add(new Vec2(-10,-20)));
	
	var constraint=new DistanceConstraint(head, tail, 1);
	composite.particles.push(head);
	composite.particles.push(tail);
	composite.head=head;
	composite.tail=tail;
	composite.name="pen";
	composite.constraints.push(constraint);
	this.composites.push(composite);
	return composite;
}
VerletJS.prototype.move=function(){
	var pen=this.composites[0];
	var web=this.composites[1];
	log("pen.constraints.length",pen.constraints.length)
	log("web.curDest",web.curDest)
	log("pen.head.pos",pen.head.pos)
	if(pen.head.pos.sub(web.curDest.pos).length()<30){
//		log("web.curDest before",web.curDest)
		web.curDest=web.nextDest();
//		log("web.curDest after",web.curDest)
	}
	if(pen.constraints.length>2){
		pen.constraints.splice(1,1);
	}
	var constraint=new DistanceConstraint(pen.head, web.curDest, 1, 0);
	log("move constraint",constraint)
	web.curDest.arrive=true;
	pen.constraints.push(constraint);
}
/**
 * 
 * @param origin
 * @param width
 * @param height
 * @param wNum 块数
 * @param hNum
 * @returns
 */
VerletJS.prototype.web = function(origin, width, height, wNum,hNum) {
	var stiffness = 0.6;
// 		张量
	var tensor = 0.3;
	var widthPiece=width/wNum;//宽每一块的长度
	var heightPiece=height/hNum;//高每一块的长度
	var startX=origin.x-width/2;
	var startY=origin.y-height/2;
	var pWNum=wNum+1;//节点数
	var pHNum=hNum+1;
	var composite = new this.Composite();
	//挂载属性
	composite.width=width;
	composite.height=height;
	composite.wNum=wNum;
	composite.hNum=hNum;
	composite.pWNum=pWNum;
	composite.pHNum=pHNum;
	composite.widthPiece=widthPiece;
	composite.heightPiece=heightPiece;
	log("origin.x",origin.x)
	log("origin.y",origin.y)
	var pinArray=new Array();
	var particleI=0;
	// particles
	//wN宽的piece数 hN高的piece数
	for (var hN = 0; hN < pHNum; hN++) {
		for (var wN = 0; wN < pWNum; wN++) {
			var x=startX+wN*widthPiece;
			var y=startY+hN*heightPiece;
			composite.particles.push(new Particle(new Vec2(x,y)));
			if(wN==0||hN==0||wN==pWNum-1||hN==pHNum-1) pinArray.push(particleI);
			particleI++;
		}
	}
	//pin
	pinArray.forEach(function(i){
		composite.pin(i);
	})
	//constrants
	for (var i = 0; i < particleI; i++) {
		var wNext=i+1;
		var hNext=i+pWNum;
		if((wNext%pWNum)!=0){
			composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[wNext], stiffness));
		}
		if(Math.floor(hNext/pWNum)!=pHNum){
			composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[hNext], stiffness));
		}
	}
	
	for (c in composite.constraints)
		composite.constraints[c].distance *= tensor;

	//格子转换为坐标
	composite.get=function(x,y){
		var particle=composite.particles[y*pWNum+x];
		return particle;
	}
	composite.name="web";
	//网记住路径
	composite.paths=genDaoPaths(composite);
//	composite.paths=genPaths(composite);
	composite.curDest=composite.paths[0];
	composite.curIndex=0;
	composite.nextDest=function(){
		if(composite.curIndex<composite.paths.length-1) composite.curIndex++;
//		composite.curDest=composite.paths[curIndex];
//		return composite.curDest;
		log("composite.curIndex",composite.curIndex)
		return composite.paths[composite.curIndex];
	}
	this.composites.push(composite);
	return composite;
}
/**
 * 返回网的粒子数组
 */
function genPaths(web){
	var paths=[];
	var x=parseInt(web.pWNum/2);
	for (var i = 0; i < web.pHNum; i++) {
		paths.push(web.get(x,i));
	}
	log("产生的路径为",paths);
	return paths;
}
function genDaoPaths(web){
	robotPosList;//一系列数据转换
	var h2=768,w2=1366;
	var h1=web.height,w1=web.width,
	h1Num=web.hNum,w1Num=web.wNum;
	var h1Piece=web.heightPiece;
	var w1Piece=web.widthPiece;
	var posList=robotPosList.map(function(pos){
		//坐标转换
		return {
			x:w1/w2*pos.x,
			y:h1/h2*pos.y,
		}
	}).map(function(pos){
		//返回具体的格子坐标
		return {
			x:parseInt(pos.x/w1Piece),
			y:parseInt(pos.y/h1Piece),
		}
	});

	//相邻相同坐标合并
	var rsArr=[];
	var curPos=null;
	posList.forEach(function(pos){
		if(!curPos) {
			curPos=pos;
			rsArr.push(new Vec2(pos.x,pos.y));
		}else{
			if(curPos.x==pos.x&&curPos.y==pos.y){
				return;
			}else{
				curPos=pos;
				rsArr.push(new Vec2(pos.x,pos.y));
			}
		}
	});
	log("rsArr",rsArr);
	//网坐标转换为particles
	var paths=rsArr.map(function(vec2){
		return web.get(vec2.x,vec2.y);
	});
	log("产生的路径为",paths);
	return paths;
}