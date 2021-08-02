export let versionSingleton = (function () {
    let objInstance; 
    function create() { 
        let _version = 'version_4';
        const _versionArray = ['version_1', 'version_2', 'version_3', 'version_4'];
        let _otherVersionArray = ['version_1', 'version_2', 'version_3'];

        let _versionDict = {
            'Story Version 1' : 'version_1',
            'Story Version 2' : 'version_2',
            'Story Version 3' : 'version_3',
            'Story Version 4' : 'version_4',
        }
    
        let changeVersion = function(versionLabel){
            _version = _versionDict[versionLabel];
            _otherVersionArray = _versionArray.filter(f => f != _versionDict[versionLabel]);
        }
        let currentVersion = function(){
            return _version;
        }
        let otherVersions = function(){
            return _otherVersionArray;
        }
        let allVersions = function(){
            return _versionArray;
        }

        return{
            otherVersions : otherVersions,
            currentVersion : currentVersion,
            changeVersion : changeVersion,
            allVersions : allVersions
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
