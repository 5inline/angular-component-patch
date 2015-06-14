'use strict';

/**
 * Grunt Tasks
 * @param  {object} grunt
 * @return {none}
 */
function tasks (grunt)
{

	// Show elapsed build time
	require('time-grunt')(grunt);

	// Load grunt tasks dynamically
	require('jit-grunt')(grunt,
	{
	});


	//
	// Configurations
	//
	var	time = (new Date()).getTime(),
		config = {
			src		: 'src',
			dist		: 'dist',
			temp		: '.tmp',
			release		: 'releases'
		};

	//
	// Initialize Grunt
	//
	grunt.initConfig({

		config : config,

		pkg: grunt.file.readJSON('package.json'),


		/**
		 * Uglify
		 *
		 * Compression and minification of files.
		 */
		uglify: {
			dist: {
				options: {				
					mangle: false,
					compress: true
				},
				files: [
					{
						expand: true,
						cwd: '<%= config.src %>',
						dest: '<%= config.dist %>',
						src: ['*.js'],
						ext: '.min.js'
					}
				]
			},
			release: {
				options: {
					mangle: false,
					compress: true
				},
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= config.src %>',
						dest: '<%= config.release %>/<%= pkg.version %>',
						src: [
							'*.js'
						],
						ext: '.min.js'
					}
				]
			}
		},


		/**
		 * Clean
		 *
		 * Clean files and folders.
		 */
		clean: {
			dist: [
				'<%= config.temp %>',
				'<%= config.dist %>'
			],
			release: [
				'<%= config.release %>/<%= pkg.version %>'
			]
		},


		/**
		 * Copy
		 *
		 * Copy files to various positions.
		 */
		copy: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= config.src %>',
						dest: '<%= config.dist %>',
						src: ['*.js']
					}
				]
			},
			release: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= config.src %>',
						dest: '<%= config.release %>/<%= pkg.version %>',
						src: ['*.js']
					}
				]
			}
		},

		/**
		 * Replace
		 *
		 * Replace string content in files.
		 */
		'string-replace': {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= config.dist %>',
						dest: '<%= config.dist %>',
						src: ['*.js']
					}
				],
				options: {
					replacements: [
						{
							pattern: /\$VERSION/ig,
							replacement: '<%= pkg.version %>'
						}
					]
				}
			},
			release: {
				files: [
					{
						expand: true,
						cwd: '<%= config.release %>/<%= pkg.version %>',
						dest: '<%= config.release %>/<%= pkg.version %>',
						src: ['*.js']
					}
				],
				options: {
					replacements: [
						{
							pattern: /\$VERSION/ig,
							replacement: '<%= pkg.version %>'
						}
					]
				}
			}
		}

	});


	/**
	 * Build application files to be production ready.
	 * @param  {string} target
	 * @return {none}
	 */
	function build (target)
	{
		var tasks = [];

		switch( target ) {
			case 'release':
				tasks.push('clean:release');
				tasks.push('uglify:release');
				tasks.push('copy:release');
				tasks.push('string-replace:release');
				break;
			default:
				tasks.push('clean:dist');
				tasks.push('uglify:dist');
				tasks.push('copy:dist');
				tasks.push('string-replace:dist');
				break;
		}

		grunt.task.run(tasks);
	}
	grunt.registerTask('build', 'Builds production-ready application', build);
}

module.exports = tasks;