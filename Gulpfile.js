/**
* Dependencies
*/
const gulp = require('gulp');
const include = require('gulp-include');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');

/**
* Configuration
*/

const sourceDest = 'src/stylesheets/**/*.scss';
const scssMain = 'src/stylesheets/main.scss';
const cssOutput = sourceDest + '/css';
const productionDest = './public';

/**
* SCSS Compilation
*/

const sass = require('gulp-sass')
gulp.task('sass-autoprefixer', function() {
    const postcss = require('gulp-postcss');
    const sourcemaps = require('gulp-sourcemaps');
    const autoprefixer = require('autoprefixer');

    return gulp.src(scssMain)
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(cssOutput))
        .pipe(browserSync.stream());
});

/**
* Javascript Compiling
*/

gulp.task('scripts', function() {
    return gulp.src([
            'src/js/**/*.js'
        ])
      .pipe(concat({ path: 'main.js'}))
      .pipe(browserSync.reload({stream:true}))
      .pipe(gulp.dest(productionDest + '/js'));
  });

/**
* HTML <3 PUG
*/

const pug = require('gulp-pug');

gulp.task('pages', function buildHTML() {
 return gulp.src('src/pages/*.pug')
    .pipe(pug())
    .pipe(gulp.dest(productionDest));
});

/**
 * Image Minification
*/

const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

gulp.task('img', function() {
    return gulp.src('src/img/**/*')
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        verbose: true,
        quality: "50",
        use: [pngquant()]
      }))
      .pipe(gulp.dest(productionDest + '/img'));
  });

/**
* Watchers - See All
*/

gulp.task('watch', function() {
    gulp.watch(sourceDest, ['sass-autoprefixer']).on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    gulp.watch('src/js/**/*.js', ['scripts']).on('change', browserSync.reload);

    // Watch nunjuck templates and reload browser if change
    gulp.watch('src/pages/*.pug', ['pages']).on('change', browserSync.reload);

});

/**
* Static Server with Browser Reload
*/

gulp.task('browser-sync', function() {
    browserSync.init({
      server: {
        baseDir: productionDest
      }
    });
  });

/**
* Default Task
*/

gulp.task('default', ['sass-autoprefixer', 'pages', 'img', 'scripts',   'watch', 'browser-sync']);