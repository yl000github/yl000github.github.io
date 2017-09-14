var magicCubeTpl='<section class="cube-container"><div class="cube {0}"><figure class="front {1}"></figure><figure class="back"></figure><figure class="right {2}"></figure><figure class="left"></figure><figure class="top  {3}"></figure><figure class="bottom"></figure></div></section>';
var colorObj={
	"1":"blue",
	"2":"red",
	"3":"green",
	"4":"orange",
	"5":"yellow",
	"6":"white",
}
var MagicCube=function(){
	var edgesArr=["1-5","2-5","3-5","4-5","1-2","2-3","3-4","4-1","1-6","2-6","3-6","4-6",];
	var anglesArr=["1-2-5","2-3-5","3-4-5","4-1-5","1-6-2","2-6-3","3-6-4","4-6-1",];//逆时针
	var edges=new Array();
	var angles=new Array();
	edgesArr.forEach(function(item){
		var colors=item.split("-");
		edges.push(new Edge(colors[0],colors[1]));
	})
	anglesArr.forEach(function(item){
		var colors=item.split("-");
		angles.push(new Angle(colors[0],colors[1],colors[2]));
	})
	/**
	 * 返回html代码
	 */
	this.randomEdgeRender=function(){
		//随机选取棱块，每块颜色随机，返回棱块数组
		edges.shuffle();
		edges.forEach(function(item){
			item.shuffle();
		})
		var html=edges.map(function(item){
			return item.render();
		});
		return html;
	}
	this.randomAngleRender=function(){
		//随机选取棱块，每块颜色随机，返回棱块数组
		angles.shuffle();
		angles.forEach(function(item){
			item.shuffle();
		})
		var html=angles.map(function(item){
			return item.render();
		});
		return html;
	}
}
var Edge=function(color1,color2){
	this.color1=color1;
	this.color2=color2;
	this.shuffle=function(){
		if(Math.random()>0.5){
			console.log("shuffle")
			var t=this.color2;
			this.color2=this.color1;
			this.color1=t;
		}
	}
	this.render=function(){
		var paramList=["edge",colorObj[this.color1],"",colorObj[this.color2]];
	/*	console.log(paramList)*/
		return TxtService.replace(magicCubeTpl,paramList,"g");
	}
}
var Angle=function(color1,color2,color3){
	this.color1=color1;
	this.color2=color2;
	this.color3=color3;
	//相对顺序不变
	this.shuffle=function(){
		var r=parseInt(Math.random()*3);
		if(r==0){
			
		}else if(r==1){
			var t=this.color1;
			this.color1=this.color2;
			this.color2=this.color3;
			this.color3=t;
		}else{
			var t=this.color1;
			this.color1=this.color3;
			this.color3=this.color2;
			this.color2=t;
		}
	}
	this.render=function(){
		var paramList=["angle",colorObj[this.color1],colorObj[this.color2],colorObj[this.color3]];
	/*	console.log(paramList)*/
		return TxtService.replace(magicCubeTpl,paramList,"g");
	}
}
//乱序
Array.prototype.shuffle = function() {
    for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
};