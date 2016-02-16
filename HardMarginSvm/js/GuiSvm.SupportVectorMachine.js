GuiSvm.SupportVectorMachine = function(){
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    var constructor, Karnels, learningBasedOnSmo, initLagrangeAlphaAndOld_w,
        onLearned_callback, onLearned, onFinalLearned_callback, onFinalLearned,
        isSameArray,
        dataSet, dimension,
        lagrangeAlpha, // ラグランジュ乗数格納用配列
        old_w, 
        old_b = 0
    ; 
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    Karnels = function(){
        
        var linear, poly,
            k = 0 
        ;
        
        // todo: 引数に カーネルのモード，x1, x2 を取るようにし，k の計算を一本化する
        
        linear = function(x1, x2){ //線形カーネル．SMO の計算簡略化に用いる，
            
            for(var i in x1){
                k += x1[i] * x2[i];
            }
            return k;
        };
        //////////////////////////////////////////////
        //////////////////////////////////////////////
        poly = function(x1, x2){ // 多項式カーネル
            for(var i in x1){
                k += Math.pow((x1[i] * x2[i]), dimension);
            }
            return k;
        };
        
        return {linear:linear, poly:poly};
    };
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    learningBasedOnSmo = function(){

        var phase1, phase2;
        
        phase1 = function(){
            
            var i;
            
            for( i = 0; i < dataSet.length; i++){
                
                var smoUpperSigmaCalc,
                    n = Math.floor(Math.random() * dataSet.length), // データ数()の範囲内で整数の数値をランダムに生成し
                                                                    // 2 つの学習データを選択する．
                    delta = null,
                    m = null,
                    knn = null,
                    knm = null,
                    kmm = null
                ;

                do {
                    m = Math.floor(Math.random() * dataSet.length);  // 1つめのデータと同じデータを避ける．
                } while(m == n);

                knn = Karnels().linear(dataSet[n].x, dataSet[n].x); // SMO 更新式内 カーネル計算
                knm = Karnels().linear(dataSet[n].x, dataSet[m].x); //     ,, 
                kmm = Karnels().linear(dataSet[m].x, dataSet[m].x); //     ,,

                // 引数 j は SMO 更新式 Σ 計算の y
                smoUpperSigmaCalc = function(y){  // SMO 更新式内 Σ計算

                    var result = null, i;

                    result = -dataSet[y].y;

                    for(i = 0; i < dataSet.length; i++){
                        result += lagrangeAlpha[i] * dataSet[i].y * Karnels().linear(dataSet[y].x, dataSet[i].x);
                    };

                    return result;
                };

                delta = (dataSet[m].y * (smoUpperSigmaCalc(n) - smoUpperSigmaCalc(m))) / (knn + kmm - 2 * knm); // SMO 更新式計算

                if(lagrangeAlpha[m]+ delta < 0) { // SMO ∂制約条件の 3つ目?
                    delta = -lagrangeAlpha[m];
                }

                if(lagrangeAlpha[n] - dataSet[n].y * dataSet[m].y * delta < 0) { // SMO ∂制約条件の 1つ目?
                    delta = dataSet[n].y * dataSet[m].y * lagrangeAlpha[n];
                }

                lagrangeAlpha[m] += delta; // SMO 更新式より
                lagrangeAlpha[n] -= dataSet[n].y * dataSet[m].y * delta; // SMO 制約条件より
            }
        };
        ///////////////////////////////////////////////
        ///////////////////////////////////////////////  
        phase2 = function(){
            
            var w = new Array(dimension), // 重みベクトル w. 2次元の場合 ax + by + c = 0 における a, b に相当．
                i, j,
                b = 0,
                num_sv = 0
            ;
            
            // console.log(dimension);
            
            // 7.13 式に対応
            for(i = 0; i < dimension; i++) {
                w[i] = 0;
                for(j = 0; j < dataSet.length; j++) {
                    w[i] += lagrangeAlpha[j] * dataSet[j].y * dataSet[j].x[i];
                }
            }
            
            for(i = 0; i < dataSet.length; i++){
                if(lagrangeAlpha[i] < 1E-20){ // 1*10^(-20)
                    // data[i].p.setAttribute('fill', 'white');
                }else{
                    // data[i].p.removeAttribute('fill');
                    b += dataSet[i].y - Karnels().linear(w, dataSet[i].x);
                    num_sv++;
                }
            }
            
            b /= num_sv;
            
            if(old_b == b){
                                
                if(isSameArray(w, old_w) == true){
                    if(onFinalLearned_callback){
                        // onFinalLearned_callback();
                    }
                }
                return {w:w, b:b};
            }
            
            old_b = b;
            for(var i = 0; i < old_w.length; i++){
                old_w[i] = w[i];
            }
            
            return {w:w, b:b};
        };

        phase1();
        onLearned_callback(phase2());
    };
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////  
    isSameArray = function(array1, array2){
        
        var sameElementCounter = 0;
        
        try{
            for(var i = 0; i < array1.length; i++){   
                if(array1[i] == array2[i]){
                    sameElementCounter++;
                }
            }
            
            if(sameElementCounter == array1.length){
                return true;   
            }else{
                return false;   
            }
        
        }catch(e){
            console.error(e);
        }
    };
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////  
    initLagrangeAlphaAndOld_w = function(){
        
        //lagrangeAlpha = [dataSet.length];
        lagrangeAlpha = new Array(dataSet.length);
        old_w = new Array(dimension);
        
        for(var i = 0; i < lagrangeAlpha.length; i++){
            lagrangeAlpha[i] = 0;
        }
        
        for(var i = 0; i < old_w.length; i++){
            old_w[i] = 0;
        }        
        // console.log(lagrangeAlpha);
    };
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////        
    onLearned = function(callback){
        onLearned_callback = callback;
    };
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////        
    onFinalLearned = function(callback){
        onFinalLearned_callback = callback;
    };
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////    
    constructor = function(dataSetC, dimentionC){
        dataSet = dataSetC;
        dimension = dimentionC;
        initLagrangeAlphaAndOld_w();
        // console.log(dataSet);
    };
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////  
    return {constructor:constructor, onLearned:onLearned, onFinalLearned:onFinalLearned, 
            learningBasedOnSmo:learningBasedOnSmo, initLagrangeAlphaAndOld_w:initLagrangeAlphaAndOld_w
           }
    ;
};