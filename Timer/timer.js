var Timer={
	intervals:[],
	dotime: 4,
	chilltime: 2,
	exercises:[
		'SQUATS JACKS',
		'PLANK JACKS',
		'JUMPJACKS',
				
		'LOW SIDESTEPS',
		'BACKPLANK HANDLIFT',
		'FLYING JACKS',
		
		'LUNGE + 2xKICK',
		'MOUNTAIN CLIMBERS',
		'HIGH KNEES'		
	],
	drawexercises: function(){
		var exercise,
			ele
		for(var x=0;x<Timer.exercises.length;x++){
			exercise=Timer.exercises[x]
			
			ele = document.createElement('div')
			ele.textContent = exercise
			ele.classList='item exercise'
			document.querySelector('#exercises').append(ele)
			
			ele = document.createElement('div')
			ele.textContent = 'CHILL'
			ele.classList='item chill'
			document.querySelector('#exercises').append(ele)
			
			
		}		
	},
	startingtime:'',
	interval:'',
	start:function(){
		Timer.startingtime = new Date().getTime()
		function run(){
			Timer.interval=setTimeout(function(){
				//do stuff				
				timerun = (new Date().getTime()-Timer.startingtime)/1000
				var step = Timer.dotime+Timer.chilltime,
					val = timerun / step,					
					items = document.querySelectorAll('.item'),
					index = parseInt(val),
					remainder = val - index,
					ele
				

				if(items.length<(index*2-1)){
					
				} else {				
					if(remainder<Timer.dotime/step){
						//exercise
						ele = items[index*2]
						ele.classList='item exercise doit'
					} else {
						//chill
						ele = items[index*2+1]
						ele.classList='item exercise doit'
					}
					run()
				}
				console.log('run',index,remainder)
				
			},1000)
		}
		run()
	}
}
Timer.drawexercises()