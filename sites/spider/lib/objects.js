//点
VerletJS.prototype.point = function(pos) {
	var composite = new this.Composite();
	composite.particles.push(new Particle(pos));
	this.composites.push(composite);
	return composite;
}
//线
VerletJS.prototype.lineSegments = function(vertices, stiffness) {
	var i;
	
	var composite = new this.Composite();
	
	for (i in vertices) {
		composite.particles.push(new Particle(vertices[i]));
		if (i > 0)
			composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[i-1], stiffness));
	}
	
	this.composites.push(composite);
	return composite;
}
//布
VerletJS.prototype.cloth = function(origin, width, height, segments, pinMod, stiffness) {
	
	var composite = new this.Composite();
	
	var xStride = width/segments;
	var yStride = height/segments;
	
	var x,y;
	for (y=0;y<segments;++y) {
		for (x=0;x<segments;++x) {
			var px = origin.x + x*xStride - width/2 + xStride/2;
			var py = origin.y + y*yStride - height/2 + yStride/2;
			composite.particles.push(new Particle(new Vec2(px, py)));
			
			if (x > 0)
				composite.constraints.push(new DistanceConstraint(composite.particles[y*segments+x], composite.particles[y*segments+x-1], stiffness));
			
			if (y > 0)
				composite.constraints.push(new DistanceConstraint(composite.particles[y*segments+x], composite.particles[(y-1)*segments+x], stiffness));
		}
	}
	
	for (x=0;x<segments;++x) {
		if (x%pinMod == 0)
		composite.pin(x);
	}
	
	this.composites.push(composite);
	return composite;
}
//轮胎 多边形
VerletJS.prototype.tire = function(origin, radius, segments, spokeStiffness, treadStiffness) {
	var stride = (2*Math.PI)/segments;
	var i;
	
	var composite = new this.Composite();
	
	// particles
	for (i=0;i<segments;++i) {
		var theta = i*stride;
		composite.particles.push(new Particle(new Vec2(origin.x + Math.cos(theta)*radius, origin.y + Math.sin(theta)*radius)));
	}
	
	var center = new Particle(origin);
	composite.particles.push(center);
	
	// constraints
	for (i=0;i<segments;++i) {
		composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[(i+1)%segments], treadStiffness));
		composite.constraints.push(new DistanceConstraint(composite.particles[i], center, spokeStiffness))
		composite.constraints.push(new DistanceConstraint(composite.particles[i], composite.particles[(i+5)%segments], treadStiffness));
	}
		
	this.composites.push(composite);
	return composite;
}

