export let versionSingleton = (function () {
    let objInstance; 
    function create() { 
        let _version = 'version_1';
        const _versionArray = ['version_1', 'version_2', 'version_3', 'version_4'];
        let _otherVersionArray = ['version_2', 'version_3', 'version_4'];
    
        let changeVersion = function(version){
            _version = version;
            _otherVersionArray = _versionArray.filter(f => f != version);
        }
        let currentVersion = function(){
            return _version;
        }
        let otherVersions = function(){
            return _otherVersionArray;
        }

        return{
            otherVersions : otherVersions,
            currentVersion : currentVersion,
            changeVersion : changeVersion,
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
