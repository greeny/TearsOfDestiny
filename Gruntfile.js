module.exports = function (grunt) {
    var banner = '/*! <%= pkg.name %> version <%= pkg.version %>, built <%= grunt.template.today("yyyy-mm-dd") %> */\n';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            default: {
                options: {
                    compress: true,
                    banner: banner
                },
                files: {
                    'app.css': ['src/css/**/*.less']
                }
            }
        },
        uglify: {
            default: {
                options: {
                    banner: banner
                },
                files: {
                    'app.js': [
                        'src/js/libs/jquery.js',
                        'src/js/libs/angular.js',
                        'src/js/libs/angular-cookies.js',
                        'src/js/libs/modernizr-touch.js',
                        'src/js/main.js',
                        'src/js/app/**/*.js'
                    ]
                }
            }
        },
        watch: {
            default: {
                files: ['src/**'],
                tasks: ['build'],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', ['less:default', 'uglify:default']);
    grunt.registerTask('serve', ['build', 'watch:default']);
};
