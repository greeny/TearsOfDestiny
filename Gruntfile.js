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
                    'www/assets/css/app.css': ['css/**/*.less']
                }
            }
        },
        uglify: {
            default: {
                options: {
                    banner: banner
                },
                files: {
                    'www/assets/js/app.js': [
                        'js/libs/jquery.js',
                        'js/libs/angular.js',
                        'js/libs/angular-cookies.js',
                        'js/libs/modernizr-touch.js',
                        'js/main.js',
                        'js/app/**/*.js'
                    ]
                }
            }
        },
        watch: {
            default: {
                files: ['css/**/*.less', 'js/**/*.js'],
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
