/*global module:true */
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                reporter: 'checkstyle',
                reporterOutput: 'build/reports/checkstyle/jshint_checkstyle.xml',
                jshintrc: '.jshintrc'
            },
            files: ['./src/*.js']
        },
        jsbeautifier: {
            files: ["./src/*.js"],
            options: {
                js: {
                    braceStyle: "collapse",
                    breakChainedMethods: false,
                    e4x: false,
                    evalCode: false,
                    indentChar: " ",
                    indentLevel: 0,
                    indentSize: 4,
                    indentWithTabs: false,
                    jslintHappy: false,
                    keepArrayIndentation: false,
                    keepFunctionIndentation: false,
                    maxPreserveNewlines: 10,
                    preserveNewlines: true,
                    spaceBeforeConditional: true,
                    spaceInParen: false,
                    unescapeStrings: false,
                    wrapLineLength: 0
                }
            }
        },
        yuidoc: {
            all: {
                options: {
                    paths: './src',
                    outdir: 'docs/yuidoc'
                },
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>'
            }
        },
        watch: {
            js: {
                files: '<%= jshint.files %>',
                tasks: ['jshint'],
                options: {
                    interrupt: true,
                    livereload: true
                }
            },
            options: {
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('default', ['jsbeautifier', 'jshint', 'yuidoc']);

};
