var jshint = require('gulp-jshint');
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var run = require('gulp-run');
var gulpBabel = require('gulp-babel');
var gulpWebpack = require('gulp-webpack');

// lint

gulp.task('lint-discovery', function () {
    return gulp.src('./src/discovery.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint-player', function () {
    return gulp.src('./src/player.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint-journey', function () {
    return gulp.src('./src/journey.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint', ['lint-discovery', 'lint-player', 'lint-journey']);

// module events

gulp.task('module-events-babel', function () {
    return gulp.src('./src/module-events.js')
        .pipe(gulpBabel())
        .pipe(gulp.dest('./es5'));
});


// discovery

gulp.task('discovery-babel', function () {
    return gulp.src('./src/{discovery,discovery-loader}.js')
        .pipe(gulpBabel())
        .pipe(gulp.dest('./es5'));
});

gulp.task('discovery-webpack', ['discovery-babel', 'module-events-babel'], function () {
    return gulp.src('./es5/{discovery,discovery-loader,module-events}.js')
        .pipe(gulpWebpack({
            output: {
                filename: 'efl-discovery.js'
            }
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('discovery-release', ['discovery-webpack'], function () {
    return gulp.src('./dist/efl-discovery.js')
        .pipe(rename('efl-discovery.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

// player

gulp.task('player-babel', function () {
    return gulp.src('./src/{player,player-loader}.js')
        .pipe(gulpBabel())
        .pipe(gulp.dest('./es5'));
});

gulp.task('player-webpack', ['player-babel', 'module-events-babel'], function () {
    return gulp.src('./es5/{player,player-loader,module-events}.js')
        .pipe(gulpWebpack())
        .pipe(rename('efl-player.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('player-release', ['player-webpack'], function () {
    return gulp.src(['./dist/efl-player.js', './bower_components/epub.js/build/epub.min.js', './bower_components/jszip/dist/jszip.min.js'])
        .pipe(concat('efl-player.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

// journey

gulp.task('journey-babel', function () {
    return gulp.src('./src/{journey,journey-loader}.js')
        .pipe(gulpBabel())
        .pipe(gulp.dest('./es5'));
});

gulp.task('journey-webpack', ['journey-babel'], function () {
    return gulp.src('./es5/{journey,journey-loader}.js')
        .pipe(gulpWebpack())
        .pipe(rename('efl-journey.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('journey-release', ['journey-webpack'], function () {
    return gulp.src(['./dist/efl-journey.js', './bower_components/es6-promise-polyfill/promise.min.js'])
        .pipe(concat('efl-journey.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

// build

gulp.task('copy-dependencies', function () {
    return gulp.src([
        './bower_components/epub.js/build/epub.min.js',
        './bower_components/jszip/dist/jszip.min.js',
        './bower_components/es6-promise-polyfill/promise.min.js'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['webpack', 'copy-dependencies']);

// release

gulp.task('release', ['discovery-release', 'player-release', 'journey-release']);

// watch

gulp.task('watch', function () {
    return gulp.watch('./src/**/*.js', ['lint']);
});

// babel

gulp.task('babel', ['discovery-babel', 'player-babel', 'journey-babel']);

// webpack

gulp.task('webpack', ['discovery-webpack', 'player-webpack', 'journey-webpack']);

// tests

gulp.task('test-babel', function () {
    return gulp.src(['./src/discovery.js', './src/player.js', './src/journey.js', './src/test-api-loader.js', './src/module-events.js'])
        .pipe(gulpBabel())
        .pipe(gulp.dest('./es5'));
});

gulp.task('test-webpack', ['test-babel'], function () {
    return gulp.src(['./es5/discovery.js', './es5/player.js', './es5/journey.js', './es5/test-api-loader.js'])
        .pipe(gulpWebpack())
        .pipe(rename('test-api-loader.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('mocha', function () {
    return gulp
        .src('./tests/mocha/**/*.js', {read: false})
        .pipe(mocha({
                reporter: 'nyan'
            }
        ));
});

gulp.task('phantom', function () {
    return gulp
        .src('tests/phantom/test-runner.html')
        .pipe(mochaPhantomJS({
            reporter: 'nyan'
        }));
});

gulp.task('test', ['test_epub', 'test-webpack', 'copy-dependencies'], function () {
    return gulp.start('mocha', 'phantom');
});

gulp.task('test_epub_dependencies', ['discovery-webpack'], function () {
    return gulp.src('./dist/efl-discovery.js')
        .pipe(gulp.dest('./tests/epub_samples/test_epub/OPS'));
});

gulp.task('test_epub', ['test_epub_dependencies'], function () {
    return run('sh zip_script').exec();
});

// example

gulp.task('example', ['build', 'test_epub']);

// clean

gulp.task('clean', function () {
    return del([
        './dist/**/*',
        './es5/**/*',
        './demo/**/*',
        './examples_dist/**/*'
    ]);
});

// examples module

gulp.task('examples_scripts', ['build'], function () {
    return gulp.src(['./dist/{efl-journey,efl-player,epub.min,jszip.min,promise.min}.js'])
        .pipe(gulp.dest('./examples_dist/scripts'));
});

gulp.task('examples_epub_dependencies', ['discovery-webpack'], function () {
    return gulp.src('./dist/efl-discovery.js')
        .pipe(gulp.dest('./examples_src/exampleModule/OPS'));
});

gulp.task('examples_epubs', ['examples_epub_dependencies'], function () {
    return run('sh zip_script_examples').exec();
});

gulp.task('examples', ['examples_scripts', 'examples_epubs'], function () {
    return gulp.src(['./examples_src/index.html'])
        .pipe(gulp.dest('./examples_dist'));
});

// demo

gulp.task('demo_scripts', ['build'], function () {
    return gulp.src(['./dist/{efl-journey,efl-player,epub.min,jszip.min,promise.min}.js'])
        .pipe(gulp.dest('./demo/scripts'));
});

gulp.task('demo_epubs', ['test_epub'], function () {
    return gulp.src(['./tests/epub_samples/test_epub*.epub'])
        .pipe(gulp.dest('./demo/epub'));
});

gulp.task('demo', ['demo_scripts', 'demo_epubs'], function () {
    return gulp.src(['./tests/testpage.html'])
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./demo'));
});

// module tester

gulp.task('module-tester-copy-player', ['player-release'], function () {
    return gulp.src(['./dist/efl-player.min.js'])
        .pipe(gulp.dest('./modules_tester'));
});

gulp.task('module-tester-babel', function () {
    return gulp.src(['./modules_tester_src/tester.js', './src/module-events.js'])
        .pipe(gulpBabel())
        .pipe(gulp.dest('./es5'));
});

gulp.task('module-tester-scripts', ['module-tester-babel'], function () {
    return gulp.src(['./es5/tester.js', './es5/module-events.js'])
        .pipe(gulpWebpack())
        .pipe(rename('tester.js'))
        .pipe(gulp.dest('./modules_tester'));
});

gulp.task('module-tester', ['module-tester-copy-player', 'module-tester-scripts'], function () {
    return gulp.src(['./modules_tester_src/tester.html'])
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./modules_tester'));
});

// default

gulp.task('default', ['build']);
