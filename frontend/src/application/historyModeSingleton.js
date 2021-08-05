import * as d3 from "d3";
/**
 * Create an example of a JavaScript Singleton.
 * After the first object is created, it will return additional 
 * references to itself
 */

 export let hisBoolSingleton = (function () {
    let objInstance; //private variable
    function create() { //private function to create methods and properties
        let _historyOn = false;
    
        let changeHistoryBool = function(){
            if(!_historyOn){
                _historyOn = true
            }else{
                _historyOn = false
                d3.selectAll('.main').attr('opacity', 1);
            }
            console.log('is this working',_historyOn)
        }

        let isHistoryOn = function(){
            return _historyOn;
        }
   
        return{
            isHistoryOn : isHistoryOn,
            changeHistoryBool : changeHistoryBool
        }
    }
    return {
        getInstance: function(){
            if(!objInstance){
                objInstance = create();
            }
            return objInstance;
        }
    };
})();
