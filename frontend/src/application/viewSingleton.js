/**
 * Create an example of a JavaScript Singleton.
 * After the first object is created, it will return additional 
 * references to itself
 */

 export let viewSingleton = (function () {
    let objInstance; //private variable
    function create() { //private function to create methods and properties
        //let _segNumber = 1;
        let _view = 'human-machine';
    
        let changeView = function(view){
            _view = view;
        }

        let currentView = function(){
            return _view;
        }
   
        return{
            changeView : changeView,
            currentView : currentView
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
