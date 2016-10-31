var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var gulpif = require('gulp-if');
var revReplace = require('gulp-rev-replace');
var useref = require('gulp-useref');
var rev = require('gulp-rev');
var htmlmin = require('gulp-htmlmin');

// delete everything in the www folder
gulp.task('clean-dist', function () {
    return del([
        'dist/**/*'
    ]);
});

// copy over images, fonts and 3rd party css html
gulp.task('copy-files', function() {
    var imgs = gulp.src('app/assets/**/*.{png,ico,svg}')
        .pipe(gulp.dest('dist/assets'));

    // copy over css files
    var cssFiles = ['app/assets/app.css'];

    var css = gulp.src(cssFiles)
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/assets'));

    var templateFiles = ['app/class-filter/class-filter.component.html', 'app/randomizer/randomizer.component.html',
        'app/schedule/schedule.component.html', 'app/schedule-display/schedule-display.component.html', 'app/shell/shell.component.html'];
    var templates = gulp.src(templateFiles, {base: './app/'})
        .pipe(htmlmin({removeComments: true, collapseWhitespace: true, conservativeCollapse: true}))
        .pipe(gulp.dest('dist'));

    return merge(imgs, css, templates);
});


gulp.task('build-html', function () {

    var condition = function(file) {
        var filesToRev = {
            'vendor.css': true,
            'app.js': true,
            'vendor.js': true,
            'app.css': true
        };
        return filesToRev[file.basename];
    };

    // concatenate, annotate, minify our vendor js files
    // concatenate, annotate, minify our js files
    return gulp.src("app/index.html")
        .pipe(useref())      // Concatenate with gulp-useref
        .pipe(gulpif('app/*.js',ngAnnotate()))
        .pipe(gulpif('app/*.js',uglify()))
        .pipe(gulpif('css/*.css', minifyCss())) // Minify vendor CSS sources
        .pipe(gulpif(condition, rev()))                // Rename the concatenated files
        .pipe(revReplace())         // Substitute in new filenames
        //.pipe(htmlmin({removeComments: true}))
        .pipe(gulp.dest('dist'));
});



gulp.task('minify-index-html', function() {
    return gulp.src('dist/index.html')
        .pipe(htmlmin({removeComments: true}))
        .pipe(gulp.dest('dist'));
});



gulp.task('build', function(callback) {
    runSequence('clean-dist',
        ['copy-files'],
        'build-html', 'minify-index-html',
        callback);
});
