import math,random

sides=20
dices=10
roll=0
r1=0
rolls=[0]*dices
count=1000
for tnr in range(count):
    for nr in range(dices):
        roll=0
        for nr1 in range(nr+1):
            r1=int(random.random()*sides)+1
            if r1>roll:
                roll=r1
        rolls[nr]+=roll

want=5
sides=20
dices=5
for want in [5,10,12,14,15,16,17,18,19,20]:
    print 'roll',want,'+',1-math.pow(want-1,dices)/math.pow(sides,dices)
    
