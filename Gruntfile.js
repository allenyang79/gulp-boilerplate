var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
	var path=require('path');
	console.log("mount:"+path.resolve(dir));
	return connect.static(path.resolve(dir));
};



module.exports = function(grunt) {
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n',
    // Task configuration.
		compass:{
			options:{
				force:true,
				environment:'development',
				outputStyle:'nested',
				sassDir:'src/scss',
				cssDir:'src/c',
				imagesDir:'src/i',
				relativeAssets:true,
				require:['rgbapng','susy']
			},
			dev:{
				options:{
					environment:'development'
				}
			},
			dist:{
				options:{
					environment:'production',
					outputStyle:'compressed'
				}
			},
			clean:{
				options:{
					clean:true
				}
			}
		},

		connect:{
			server:{
				options:{
					port:8080,
					middleware:function(connect,options){
						return [lrSnippet, mountFolder(connect, 'src')]
					}
				}
			}
		},
		open:{
			livereload:{
				path:'http://localhost:8080'
			}
		},
		watch:{
			compass:{
				files:['src/scss/*.scss','src/i/*.jpg','src/i/*.png'],
				tasks:['compass:dev'],
				interrupt:true,//中斷前面的工作，重新開始
				options:{
					livereload:true,
					debounceDelay:250
				}
			},
			html:{
				files:['src/**/*.html'],
				interrupt:true,
				options:{
					livereload:true
				}
			},
			php:{
				files:'src/**/*.php',
				options:{
					livereload:true
				}
			}
		},
		/*
		requirejs:{
			compile: {
    		options: {
      		baseUrl: "src/j",
					name:"main",
      		mainConfigFile: "src/j/main.js",
      		out: "dist/j/main.js",
					optimize:'none',
					done: function(done, output) {
						console.log("REQUIRE OPTIMIZE DONE!!");
					},
					paths:{
						jquery: "empty:"
					}
    		}
  		}
		}
		*/
	});
	//require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask('default', ['compass:clean','compass:dev']);
	grunt.registerTask('dist', ['compass:dist']);
	grunt.registerTask('server',function(target){
		console.log('server:'+target);
		grunt.task.run(['connect:server','open','watch']);
	});
	/*
	grunt.registerTask('default',function(){
		console.log("grunt default job");
	});
	*/
};
