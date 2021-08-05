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
            if(_historyOn === false){
                _historyOn = true
            }else if(_historyOn === true){
                _historyOn = false
            }
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
