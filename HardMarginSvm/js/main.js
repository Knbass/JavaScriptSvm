
$(function main(){
    
    var guiSvm1 = null,
        guiSvmArea1 = $('#guiSvmArea1'),
        guiSvmCanvas1 = $('#guiSvmCanvas1')
    ;
    
    guiSvm1 = GuiSvm();
    guiSvm1.constructor(guiSvmArea1, guiSvmCanvas1);
    
 });
