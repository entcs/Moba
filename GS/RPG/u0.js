//utility functions
var uX={
	deg:function(an){
		return an*180/Math.PI
	},
	rad:function(rad){
		return rad*Math.PI/180
	},
	getan:function(p1,p2){
		var x=p1.x-p2.x,
			y=p1.y-p2.y,
			an=Math.atan(x/y)
			
		if(y==0) an=-Math.PI/2
		
		if(x<=0 && y>=0){
			an=-an-Math.PI
		} else if (x<=0 && y<=0){
			an=-an
		} else if (x>=0 && y<=0){
			an=-an
		} else {
			an=Math.PI-an
		}
		return an
	},
	turnan:function(an1,an2,speed){
		var dif=an1-an2			
		dif%=Math.PI*2			
		if(dif){					
			if(dif>Math.PI) {
				dif-=Math.PI*2
			} else if (dif<-Math.PI) {
				dif+=Math.PI*2
			}
			
			var adif=Math.abs(dif)
			if(speed){
				if(adif<speed) {
					speed=adif
				}			
			} else {
				speed=adif
			}			
			
			if(dif>0) {
				speed=-speed
			}
		} else {
			speed=0
		}
		return speed
	},
	turn:function(obj,tar,speed){
		var oan=obj.getRotation()
			tan=u.getan(obj.getPosition(),tar.getPosition()),
			an=u.turnan(oan,tan,speed)
		obj.rotate(an)
	},
	getvec:function(pos,an,len){
		if (an<0) an+=Math.PI*2
		var	x=len*Math.sin(an),
			y=len*Math.cos(an)

		if(an<=Math.PI/2){//90
			x=x
			y=-y
		} else if (an<=Math.PI){//180
			x=x
			y=-y
		} else if (an<=Math.PI*1.5){//270
			x=x
			y=-y			
		} else {
			x=x
			y=-y			
		}			
		return {x:-x,y:-y}
	},
	dist:function(p1,p2){
		var dx=p1.x-p2.x,
			dy=p1.y-p2.y,
			dist=Math.sqrt(dx*dx+dy*dy)
		return dist
	},
	follow:function(obj,tar,speed,turn){
		var pos=obj.getPosition(),
			tpos=tar.getPosition(),
			an=u.getan(pos,tpos),
			dist=u.dist(pos,tpos)
		if(dist!=0){	
			if(turn && an>turn) an=turn		
			u.turn(obj,tar,turn)
			if(dist<speed) speed=dist		
			var vec=u.getvec(pos,obj.getRotation(),speed)
			obj.setPosition(pos.x+vec.x,pos.y+vec.y)		
		}
	},
	orbit:function(obj,tar,odist,speed,turn){
		var dist=u.dist(obj.getPosition(),tar.getPosition())
		if(dist>odist) {
			u.follow(obj,tar,speed,turn)
		} else {
			var opos=obj.getPosition(),
				tpos=tar.getPosition(),
				an=u.getan(opos,tpos)+Math.PI/2
				
			obj.rotate(turn)
			var vec=u.getvec(opos,obj.getRotation(),5)
			obj.setPosition(opos.x+vec.x,opos.y+vec.y)
		}
	},
	normalize:function(arr){
		var a=arr.slice(),
			min=Math.abs(a.sort()[0])
			max=Math.abs(a.reverse()[0])
		min>max?max=min:max=max
		if(max!=0){
			loop(arr,function(i,e){
				arr[i]=e/max
			})
		}
		return arr
	}
}