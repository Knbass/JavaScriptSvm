GuiSvm.TeacherData = function(){
    
    var constructor, create, render, setPositionToDataSet,
        sameProcessingBetweenPosNumAndNegNum, teacherDataDebug, 
        onTeacherDataRendered_callback, onTeacherDataMoved_callback,
        onTeacherDataRendered, onTeacherDataMoved,
        TEACHER_DATA_SIZE = 0,
        applyElement = null,
        teacherDataObjCounter = 0,
        dataSet = [],
        util = GuiSvm.utility()
    ;
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    create = function(posNum, negNum){
        
        var teacherDataObjFactry, i;
        ///////////////////////////////////////////////
        ///////////////////////////////////////////////
        teacherDataObjFactry = function(){
            var teacherDataObj = {
                id:0,
                x:[null, null],
                y:0
            };
            return teacherDataObj;
        };
        ///////////////////////////////////////////////
        ///////////////////////////////////////////////
        sameProcessingBetweenPosNumAndNegNum = function(d){
            d.x[1] = applyElement.height() * Math.random();
            d.id = teacherDataObjCounter;
            dataSet.push(data);
            render(d);
            teacherDataObjCounter++
        };
        
        for(i = 0; i < posNum; i++){
            var data = teacherDataObjFactry();   
            data.y = 1;
            data.x[0] = Math.random() * (applyElement.width() / 2-20); // 12/7 positive と negative の値を逆にした．
            sameProcessingBetweenPosNumAndNegNum(data);
        }

        for(i = 0; i < negNum; i++){
            var data = teacherDataObjFactry();   
            data.y = -1;
            data.x[0] = applyElement.width() - Math.random() * (applyElement.width() / 2 - 20);
            sameProcessingBetweenPosNumAndNegNum(data);
        }
               
        if(onTeacherDataRendered_callback){
            onTeacherDataRendered_callback(dataSet);
        }
        console.log(dataSet);
        teacherDataDebug();
        
        return dataSet;
    };
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    render = function(obj){
        
        var teacherDataElement;
        
        if(obj.y == 1){   
            teacherDataElement = $('<div class="teacherData positive" id="teacherData' + teacherDataObjCounter + '"></div>');
        }else{
            teacherDataElement = $('<div class="teacherData negative" id="teacherData' + teacherDataObjCounter + '"></div>');            
        }
        
        console.log(teacherDataElement.css('width'));
        
        teacherDataElement
            .css({  'left':(obj.x[0] - (TEACHER_DATA_SIZE / 2)), 
                    'top':(obj.x[1] - (TEACHER_DATA_SIZE / 2)),
                    'height':TEACHER_DATA_SIZE + 'px',
                    'width':TEACHER_DATA_SIZE + 'px'  
                })
            .mouseup(function(){                    
                setPositionToDataSet($(this));
            })
        ;
        util.appendDruggAndDropEvent(teacherDataElement, applyElement);
        applyElement.append(teacherDataElement);
    };
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    onTeacherDataRendered = function(callback){
        onTeacherDataRendered_callback = callback;
    };
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    onTeacherDataMoved = function(callback){
        onTeacherDataMoved_callback = callback;
    };
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    setPositionToDataSet = function(elementSPTD){
        
        var sbstrId = elementSPTD[0].id;
        
        sbstrId = sbstrId.substr(11, sbstrId.length); 
        sbstrId = parseInt(sbstrId);
        // console.log(sbstrId);
        
        dataSet[sbstrId].x[0] = elementSPTD.position().left + (TEACHER_DATA_SIZE / 2);
        dataSet[sbstrId].x[1] = elementSPTD.position().top + (TEACHER_DATA_SIZE / 2);
        
        // console.info('Debug');
        // console.info(dataSet[sbstrId]);
        // console.info('-----'); 
        
        if(onTeacherDataMoved_callback){
            onTeacherDataMoved_callback(dataSet);
        }
        // teacherDataDebug();
        
    };
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    teacherDataDebug = function(){
        console.info('Debug');
        for(var i = 0; i < dataSet.length; i++){
            console.info('id: ' + dataSet[i].id)
            console.info(dataSet[i].x);
            console.info(dataSet[i].y);
        }
        console.info('-----'); 
    };
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    constructor = function(elementC, size){        
        applyElement = elementC;
        TEACHER_DATA_SIZE = size;
    };
    
    return {constructor:constructor, onTeacherDataRendered:onTeacherDataRendered, 
            onTeacherDataMoved:onTeacherDataMoved, create:create
           }
    ;
};