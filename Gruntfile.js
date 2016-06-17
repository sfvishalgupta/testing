path = require('path');
var deploydir = "./build";
var srcdir = "./scripts";

module.exports = function(grunt) {
    grunt.util.linefeed = '\n';
    grunt.initConfig({
        deploydir : deploydir,
        srcdir:srcdir,
        tsc : {
            ts_to_js : {
                options : {
                    target : "es6",
                    declaration:false
                },
                files : [
                    {
                        expand : true,
                        dest : deploydir,
                        ext : ".js",
                        src : "**/*.ts",
                        cwd : srcdir
                    }
                ]
            }
        },
        watch: {
            scripts: {
                files: ['**/*.ts'],
                tasks: ['tsc']
            },
            options: {
                spawn: false,
                debounceDelay: 250,
            },
        }
    });
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-tsc");
    grunt.event.on('watch', function(action, filepath){
        var newPath = filepath.split(path.sep).slice(1).join(path.sep);
        if(path.extname(filepath) === ".ts"){
            grunt.config(['tsc', 'ts_to_js', 'files'], 
            [
                {
                            expand : true,
                            dest : deploydir,
                            ext : ".js",
                            cwd : srcdir,
                            src : newPath
                }
            ]);
        }
    });
}

//git archive --remote=git@bitbucket.org:mangahigh/mangahigh-javascript-game-api.git HEAD:dist mangahigh-game-api.min.js |  tar -x
