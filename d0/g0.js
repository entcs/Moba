//g0.js webgl lib
var loop=function(obj,fn){
	if(obj){
		if(fn===undefined){
			var count=0
			while(obj(count)!==false) count+=1		
		} else if(typeof(obj)=='number'){
			for(var nr=0;nr<obj;nr++) if(fn(nr)===false) break		
		} else if(obj.length){		
			for(var nr=0;nr<obj.length;nr++) if(obj.hasOwnProperty(nr)) if(fn(nr,obj[nr])===false) break					
		} else {
			for(var key in obj) if(fn(key,obj[key])===false) break		
		}	
	}
}

//prototype ext
Number.prototype.round=function(nr){	
	var dec,res
	if(nr){
		dec=Math.pow(10,nr)
		res=Math.round(this*dec)/dec
	} else {
		res=Math.round(this)
	}
	return res
}
String.prototype.nr=function(nr){	
	var val=parseFloat(this),
		res=val.round(nr)
	return res
}


a=5.55555
console.log(a.round())
console.log(a.round(1))
console.log(a.round(4))
var gl={
	ver:1,	
	extend:function(o,t){
		loop(t,function(k,v){
			o[k]=v
		})
		return o
	},
	pos:function(){
		this.type='pos'
		this.x=0
		this.y=0
		this.z=0
	},
	obj:function(){
		gl.extend(this,new gl.pos())
		this.type='obj'
		this.name='new object'	
	}	
}

var LIBS={
  degToRad: function(angle){
    return(angle*Math.PI/180);
  },
  
  get_projection: function(angle, a, zMin, zMax) {
    var tan=Math.tan(LIBS.degToRad(0.5*angle)),
        A=-(zMax+zMin)/(zMax-zMin),
          B=(-2*zMax*zMin)/(zMax-zMin);
    
    return [
      .5/tan, 0 ,   0, 0,
      0, .5*a/tan,  0, 0,
      0, 0,         A, -1,
      0, 0,         B, 0
    ];
  },
  
  get_I4: function() {
    return [1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1];
  },
  
  set_I4: function(m) {
    m[0]=1, m[1]=0, m[2]=0, m[3]=0,
      m[4]=0, m[5]=1, m[6]=0, m[7]=0,
        m[8]=0, m[9]=0, m[10]=1, m[11]=0,
          m[12]=0, m[13]=0, m[14]=0, m[15]=1;
  },
  
  rotateX: function(m, angle) {
    var c=Math.cos(angle);
    var s=Math.sin(angle);
    var mv1=m[1], mv5=m[5], mv9=m[9];
    m[1]=m[1]*c-m[2]*s;
    m[5]=m[5]*c-m[6]*s;
    m[9]=m[9]*c-m[10]*s;
    
    m[2]=m[2]*c+mv1*s;
    m[6]=m[6]*c+mv5*s;
    m[10]=m[10]*c+mv9*s;
  },
  
  rotateY: function(m, angle) {
    var c=Math.cos(angle);
    var s=Math.sin(angle);
    var mv0=m[0], mv4=m[4], mv8=m[8];
    m[0]=c*m[0]+s*m[2];
    m[4]=c*m[4]+s*m[6];
    m[8]=c*m[8]+s*m[10];
    
    m[2]=c*m[2]-s*mv0;
    m[6]=c*m[6]-s*mv4;
    m[10]=c*m[10]-s*mv8;
  },
  
  rotateZ: function(m, angle) {
    var c=Math.cos(angle);
    var s=Math.sin(angle);
    var mv0=m[0], mv4=m[4], mv8=m[8];
    m[0]=c*m[0]-s*m[1];
    m[4]=c*m[4]-s*m[5];
    m[8]=c*m[8]-s*m[9];
    
    m[1]=c*m[1]+s*mv0;
    m[5]=c*m[5]+s*mv4;
    m[9]=c*m[9]+s*mv8;
  },
  
  translateZ: function(m, t){
    m[14]+=t;
  }
}



if ( !window.requestAnimationFrame ) {
  window.requestAnimationFrame = ( function() {
    return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame;
  } )();
};

//games
var g={
	init: function(){
		var CANVAS=document.getElementById('canvas')
		CANVAS.width=window.innerWidth
		CANVAS.height=window.innerHeight
		this.canvas=CANVAS
		
  /*========================= CAPTURE MOUSE EVENTS ========================= */
  
  var AMORTIZATION=0.95;
  var drag=false;
  
  
  var old_x, old_y;
  
  var dX=0, dY=0;
  var mouseDown=function(e) {
    drag=true;
    old_x=e.pageX, old_y=e.pageY;
    e.preventDefault();
    return false;
  }
  
  var mouseUp=function(e){
    drag=false;
  }
  
  var mouseMove=function(e) {
    if (!drag) return false;
    dX=(e.pageX-old_x)*2*Math.PI/CANVAS.width,
      dY=(e.pageY-old_y)*2*Math.PI/CANVAS.height;
    THETA+=dX;
    PHI+=dY;
    old_x=e.pageX, old_y=e.pageY;
    e.preventDefault();
  }
  
  CANVAS.addEventListener("mousedown", mouseDown, false);
  CANVAS.addEventListener("mouseup", mouseUp, false);
  CANVAS.addEventListener("mouseout", mouseUp, false);
  CANVAS.addEventListener("mousemove", mouseMove, false);
  
  /*========================= GET WEBGL CONTEXT ========================= */
  try {
    var GL = CANVAS.getContext("experimental-webgl", {antialias: true});
  } catch (e) {
    alert("You are not webgl compatible :(") ;
    return false;
  } ;
  
  /*========================= SHADERS ========================= */
  
  var shader_vertex_source="\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec3 color; //the color of the point\n\
varying vec3 vColor;\n\
void main(void) { //pre-built function\n\
gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
vColor=color;\n\
}";
  
  var shader_fragment_source="\n\
precision mediump float;\n\
varying vec3 vColor;\n\
void main(void) {\n\
gl_FragColor = vec4(vColor, 1.);\n\
}";
  
  var get_shader=function(source, type, typeString) {
    var shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert("ERROR IN "+typeString+ " SHADER : " + GL.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  };
  
  var shader_vertex=get_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
  var shader_fragment=get_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");
  
  var SHADER_PROGRAM=GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  GL.attachShader(SHADER_PROGRAM, shader_fragment);
  
  GL.linkProgram(SHADER_PROGRAM);
  
  var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
  var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
  var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");
  
  var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
  var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
  
  GL.enableVertexAttribArray(_color);
  GL.enableVertexAttribArray(_position);
  
  GL.useProgram(SHADER_PROGRAM);
  
  /*========================= THE CUBE ========================= */
  //POINTS :
  var cube_vertex=[
    -1,-1,-1,     1,1,0,
    1,-1,-1,     1,1,0,
    1, 1,-1,     1,1,0,
    -1, 1,-1,     1,1,0,
    
    -1,-1, 1,     0,0,1,
    1,-1, 1,     0,0,1,
    1, 1, 1,     0,0,1,
    -1, 1, 1,     0,0,1,
    
    -1,-1,-1,     0,1,1,
    -1, 1,-1,     0,1,1,
    -1, 1, 1,     0,1,1,
    -1,-1, 1,     0,1,1,
    
    1,-1,-1,     1,0,0,
    1, 1,-1,     1,0,0,
    1, 1, 1,     1,0,0,
    1,-1, 1,     1,0,0,
    
    -1,-1,-1,     1,0,1,
    -1,-1, 1,     1,0,1,
    1,-1, 1,     1,0,1,
    1,-1,-1,     1,0,1,
    
    -1, 1,-1,     0,1,0,
    -1, 1, 1,     0,1,0,
    1, 1, 1,     0,1,0,
    1, 1,-1,     0,1,0
    
  ];
  
  var CUBE_VERTEX= GL.createBuffer ();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER,
                new Float32Array(cube_vertex),
                GL.STATIC_DRAW);
  
  //FACES :
  var cube_faces = [
    0,1,2,
    0,2,3,
    
    4,5,6,
    4,6,7,
    
    8,9,10,
    8,10,11,
    
    12,13,14,
    12,14,15,
    
    16,17,18,
    16,18,19,
    
    20,21,22,
    20,22,23
    
  ];
  var CUBE_FACES= GL.createBuffer ();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(cube_faces),
                GL.STATIC_DRAW);
  
  /*========================= MATRIX ========================= */
  
  PROJMATRIX=LIBS.get_projection(40, CANVAS.width/CANVAS.height, 1, 100);
  var MOVEMATRIX=LIBS.get_I4();
  var VIEWMATRIX=LIBS.get_I4();
  
  LIBS.translateZ(VIEWMATRIX, -6);
  var THETA=0,
      PHI=0;
  
  /*========================= DRAWING ========================= */
  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);
  GL.clearColor(0.0, 0.0, 0.0, 0.0);
  GL.clearDepth(1.0);
  
  var time_old=0;
  var fps_time=0;
  var fps_frames=0;
  var dom_counter=document.getElementById("fps_counter");  
  var animate=function(time) {
    var dt=time-time_old;
    if (!drag) {
      dX*=AMORTIZATION, dY*=AMORTIZATION;
      THETA+=dX, PHI+=dY;
    }
    LIBS.set_I4(MOVEMATRIX);
    LIBS.rotateY(MOVEMATRIX, THETA);
    LIBS.rotateX(MOVEMATRIX, PHI);
    time_old=time;
    fps_time+=dt;
    fps_frames++;
    if (fps_time>100) {
      
      var fps=1000 * fps_frames/fps_time;                
	  dom_counter.innerHTML="FPS:"+fps.round(1)
      
      fps_time = fps_frames = 0;
    }	
    
    GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
    GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
    GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
    GL.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false,4*(3+3),0) ;
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false,4*(3+3),3*4) ;
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
    GL.drawElements(GL.TRIANGLES, 6*2*3, GL.UNSIGNED_SHORT, 0);
    
    GL.flush();
    
    window.requestAnimationFrame(animate);
  }
  animate(0);
		
		
		
		
		window.onresize=function(){
			console.log('resize')
			CANVAS.width=window.innerWidth
			CANVAS.height=window.innerHeight
						
			PROJMATRIX=LIBS.get_projection(40, CANVAS.width/CANVAS.height, 1, 100)
			GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
		}		
		this.addevents()
	},	
	addevents:function(){
		
	}
}
window.onload = function(e){
	console.log('loaded',e,document.readyState)
	if(document.readyState=='complete'){
		g.init()
	}
}

