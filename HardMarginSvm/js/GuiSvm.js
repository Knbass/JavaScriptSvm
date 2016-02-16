var GuiSvm = function(){

    var constructor, addDomEvents, drawGuiSvmCanvas, 
        teacherData, guiSvmArea, guiSvmCanvas, guiSvmCanvasCtx, 
        svm, svmLoopFunction, svmLoop, 
        isFirstSvm = true
    ;
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    addDomEvents = function(){
        
        var addButton = $('.button#addButton'),
            numberInput1 = $('.numberInput#num1'),
            numberInput2 = $('.numberInput#num2')
        ;
        
        numberInput1.val(1);
        numberInput2.val(1);
        
        addButton.click(function(){
            
            console.log(numberInput2.val());
            if((numberInput1.val() >= 0) && (numberInput2.val() >= 0)){
                teacherData.create(Math.floor(numberInput1.val()), Math.floor(numberInput2.val()));
            }else{
                alert('0以下の数は入力できません．');
            }
        });
    };
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    drawGuiSvmCanvas = function(){  
        
        var init, drawHyperplane, getHyperplaneX;
        
        init = function(){
            guiSvmCanvasCtx.fillStyle = '#a1d7ff';
            guiSvmCanvasCtx.fillRect(0, 0, guiSvmCanvasCtx.canvas.width, guiSvmCanvasCtx.canvas.height);
        };
        ///////////////////////////////////////////////
        ///////////////////////////////////////////////
        getHyperplaneX = function(y, data){
            return -(data.w[1]*y + data.b) / data.w[0];
        };
        ///////////////////////////////////////////////
        ///////////////////////////////////////////////
        drawHyperplane = function(d){
            
            var upperX, lowerX,
                MARGIN = 300,
                upperY = 0 - MARGIN,
                lowerY = guiSvmCanvas[0].height + MARGIN
            ;
            
            init();
            
            upperX = getHyperplaneX(upperY, d);
            lowerX = getHyperplaneX(lowerY, d);
            
            guiSvmCanvasCtx.strokeStyle = 'rgba(20, 20, 20, 1.0)';
            guiSvmCanvasCtx.lineWidth = 5;
            
            guiSvmCanvasCtx.beginPath();
            guiSvmCanvasCtx.moveTo(upperX, upperY);
            guiSvmCanvasCtx.lineTo(lowerX, lowerY);
            guiSvmCanvasCtx.stroke();
            guiSvmCanvasCtx.closePath();
            
            // console.log(upperX);
            // console.log(lowerX);
            
        };
        
        return {drawHyperplane:drawHyperplane};
    };
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    constructor = function(guiSvmAreaC, guiSvmCanvasC){
                
        guiSvmArea = guiSvmAreaC;
        guiSvmCanvas = guiSvmCanvasC;
        guiSvmCanvasCtx = guiSvmCanvas[0].getContext('2d');
        addDomEvents();
        
        teacherData = GuiSvm.TeacherData();
        teacherData.constructor(guiSvmArea, 20);
        teacherData.onTeacherDataRendered(function(data){
            // console.log(data);
            
            console.log('start learning !');
            if(isFirstSvm){
                
                isFirstSvm = false;
        
                svm = GuiSvm.SupportVectorMachine();
                svm.constructor(data, 2);
                svm.onLearned(function(svmData){
                    // console.log(svmData);
                    drawGuiSvmCanvas().drawHyperplane(svmData);
                });    
                
                svm.onFinalLearned(function(){
                    console.log('learned !');
                    clearInterval(svmLoop);
                });
                
                //svmLoopFunction = function(){
                    //svm.learningBasedOnSmo();
                    //svmLoop = requestAnimationFrame(svmLoopFunction); 
                //};
                svmLoop = setInterval(svm.learningBasedOnSmo, 10);                
                // svm.learningBasedOnSmo();                
            
            }else{
                svm.initLagrangeAlphaAndOld_w();
                svmLoop = setInterval(svm.learningBasedOnSmo, 10);                
                // svm.learningBasedOnSmo();
            }
        });
        
        teacherData.onTeacherDataMoved(function(data){
            // console.log(data);
            svmLoop = setInterval(svm.learningBasedOnSmo, 10); 
        });
        
        teacherData.create(10, 10);
        
    };
    
    return {constructor:constructor};
};