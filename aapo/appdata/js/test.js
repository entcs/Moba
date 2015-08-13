var categories=[
	{
		name:'Administratiivtöö'
	},
	{
		name:'Avalik sektor'
	},
	{
		name:'Ehitus / kinnisvara'
	},
	{
		name:'Elektroonika / telekommunikatsioonid:'
	},
	{
		name:'Energeetika / elekter (14)'
	},
	{
		name:'Finants / raamatupidamine (59)'
	},
	{
		name:'Haridus / teadus (20)'
	},
	{
		name:'Infotehnoloogia (203)'
	},
	{
		name:'Juhtimine (81)'
	},
	{
		name:'Kaubandus (86)'
	},
	{
		name:'Kolmas sektor / MTÜ-d (1)'
	},
	{
		name:'Korrakaitse / päästeteenistus (14)'
	},
	{
		name:'Kultuur / kunst / meelelahutus (13)'
	},
	{
		name:'Meedia / avalikud suhted (22)'
	},
	{
		name:'Müük (156)'
	},
	{
		name:'Pangandus / kindlustus (17)'
	},
	{
		name:'Personalijuhtimine (15)'
	},
	{
		name:'Praktika (4)'
	},
	{
		name:'Põllumajandus / keskkonnakaitse (8)'
	},
	{
		name:'Teenindus (170)'
	},
	{
		name:'Tehnika (53)'
	},
	{
		name:'Tervishoid / sotsiaaltöö (26)'
	},
	{
		name:'Tootmine / töötlemine (77)'
	},
	{
		name:'Transport / logistika (43)'
	},
	{
		name:'Turism / hotellindus / toitlustamine (34)'
	},
	{
		name:'Turundus / reklaam (49)'
	},
	{
		name:'Õigusabi (17)'
	}
]
var tar=d.find('#content .wrap'),
	cats=tar.r('div class=categories'),
	cat

console.log('tar',tar)
loop(categories,function(i,item){
	cat=cats.r('div class=item cols')
		.s('border-radius:6px margin:5px 0px cursor:pointer')
	cat.r('div')
		.h(item.name)
		.s('font-size:18px padding:10px font-weight:bold')
	cat.r('div').h('last activities and stuff like that')
		.s('color:#999 font-size:18px text-align:right vertical-align:middle')
})