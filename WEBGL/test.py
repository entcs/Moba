import math,random,time,sys

end=time.time()
start=time.time()
sum=0
count=0

## while 1:
    ## big=0
    ## for nr in range(5):
        ## val=int(random.random()*19.99999999)+1        
        ## if val>big:
            ## big=val    
    ## sum+=big
    ## count+=1.0
    ## val=sum/count
    ## if time.time()-start>1:
        ## start=time.time()        
        ## print val
    ## if time.time()-end>3:
        ## #sys.exit()
        ## pass
    
def bestof(nr):
    big=0
    for nr in range(nr):
        val=int(random.random()*19.99999999)+1        
        if val>big:
            big=val    
    return big

dam=0
for nr in range(10):
    n1=bestof(10)
    n2=bestof(2)    
    if n2-n1<0:
        dam+=n2-n1
        print 'round:',nr+1,n1,n2,n2-n1,'dam:',dam
    else:
        print 'miss'