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
		var pen=sim.pen(new Vec2(width/2,height/2));
		var web=sim.web(new Vec2(width/2,height/2), width, height, 40, 40);
		
		web.drawParticles = function(ctx, composite) {
			var i;
			for (i in composite.particles) {
				var point = composite.particles[i];
				ctx.beginPath();
				if(point.arrive) {
					ctx.arc(point.pos.x, point.pos.y, 4, 0, 2*Math.PI);
					ctx.fillStyle = "#000";
				}else{
					ctx.arc(point.pos.x, point.pos.y, 1.3, 0, 2*Math.PI);
					ctx.fillStyle = "#2dad8f";
				}
				ctx.fill();
			}
		}
//		web.drawConstraints = function(ctx, composite) {
//			var i;
//			for (i in composite.constraints) {
//				var constraint = composite.constraints[i];
//				if (constraint instanceof DistanceConstraint) {
//					
//					var startPoint=constraint.a.pos;
//					var endPoint=constraint.b.pos;
//					ctx.moveTo(startPoint.x,startPoint.y);
//					ctx.moveTo(endPoint.x,endPoint.y);
////				ctx.fillStyle = "#2dad8f";
//					ctx.strokeStyle = "#000";
//					ctx.lineWidth = 15;
//					ctx.stroke();
//				}
//			}
//		}
		pen.drawParticles = function(ctx, composite) {
			var i;
			for (i in composite.particles) {
				var point = composite.particles[i];
				ctx.beginPath();
				if(i==0){
					ctx.arc(point.pos.x, point.pos.y, 6, 0, 2*Math.PI);
				}else{
					ctx.arc(point.pos.x, point.pos.y, 9, 0, 2*Math.PI);
				}
				ctx.fillStyle = "#f00";
//				ctx.fillStyle = "#000";
				ctx.fill();
			}
		}
		pen.drawConstraints = function(ctx, composite) {
//			log("pen.drawConstraints",composite.name)
//			log("composite.constraints",composite.constraints)
			var i;
			for (i in composite.constraints) {
				var constraint = composite.constraints[i];
				if (constraint instanceof DistanceConstraint) {
					var startPoint=constraint.a.pos;
					var endPoint=constraint.b.pos;
					ctx.save();
					ctx.beginPath();
					ctx.moveTo(startPoint.x,startPoint.y);
					ctx.lineTo(endPoint.x,endPoint.y);
					ctx.strokeStyle = "#f00";
					ctx.lineWidth = 9;
					ctx.stroke();
					ctx.restore();
				}
			}
		}
		// animation loop
		var loop = function() {
			sim.move();
			sim.frame(16);
			sim.draw();
			requestAnimFrame(loop);
		};

		loop();
	};
	

		
		
	
	
