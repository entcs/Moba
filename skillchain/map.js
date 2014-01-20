var sh=d.dss.new('map-styles')
sh.new('body',
	'margin:0px'
)
sh.new('#container',
	'border:1px solid red',
	'box-sizing:border-box'
)
sh.show()


var stage = new Kinetic.Stage({
	container: 'container',
	width: window.innerWidth-2,
	height: window.innerHeight-2
});

var layer = new Kinetic.Layer();

var rect = new Kinetic.Rect({
	x: 239,
	y: 75,
	width: 100,
	height: 50,
	fill: 'green',
	stroke: 'black',
	strokeWidth: 4
})

// add the shape to the layer
layer.add(rect);

// add the layer to the stage
stage.add(layer);

window.onresize=function(e){
	console.log('resize')
	var c=d.find('canvas')
	c.width=window.innerWidth-2
	c.height=window.innerHeight-2	
}