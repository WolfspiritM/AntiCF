// ==UserScript==
// @name       Anti Canvas Fingerprint
// @version    0.1
// @description  Changes Images prior to Export via DataURL or getImageData.
// @match      *://*/*
// @run-at document-start
// @copyright  2014+, AB
// ==/UserScript==


(function(){
    
   console.log("Script");
    
    CanvasRenderingContext2D.prototype.getImageData = function(a) {
      return function() {
        console.log("Context");
        spoofFromContext(this,a);
        return a.apply(this, arguments);
      };
    }(CanvasRenderingContext2D.prototype.getImageData);
    
    
    HTMLCanvasElement.prototype.toDataURL=(function(){
        var original = HTMLCanvasElement.prototype.toDataURL;
        return function() {
            console.log(123);
            spoof(this);
            return original.apply(this,arguments);
        };
    })();


    function spoof(canvas){
        	var ctx = canvas.getContext("2d");
            spoofFromContext(ctx);    
    }
    
    function spoofFromContext(ctx,a){        
        	if(!a) a = ctx.getImageData;
        	console.log(ctx.canvas.width);
        	console.log(ctx.canvas.height);
 			var data = a.call(ctx,0, 0, ctx.canvas.width, ctx.canvas.height);
            for(var c=0; c<data.data.length; c=c+4){
                var r = data.data[c];
                var g = data.data[c+1];
                var b = data.data[c+2];
                var a = data.data[c+3];
                
                if(a!=0){
                    data.data[c]=r-Math.random();
                    data.data[c+1]=g-Math.random();
                    data.data[c+2]=b-Math.random();
                    data.data[c+3]=a-Math.random();
                }                               
         	}   
            ctx.putImageData(data, 0, 0);   
            console.log("Spoofed");     
    }
       
    

    
    
})();