let project_folder = 'docs';
let source_folder = 'src';
let fs = require('fs');
let path = {
  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    img: project_folder + '/img/dest/',
    fonts: project_folder + '/fonts/',
  },
  src: {
    html: source_folder + '/*.html',
    css: source_folder + '/less/style.less',
    js: source_folder + '/js/script.js',
    img:
      source_folder +
      '/img/src/*.{jpg,png,svg,gif,ico,webp,JPG,jpeg,JPEG,gif,png,svg}',
    fonts: source_folder + '/fonts/*.ttf',
  },
  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/less/**/*.less',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/src/*.{jpg,png,svg,gif,ico,webp}',
  },
  clean: './' + project_folder + '/',
};
let { dest, src } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  del = require('del'),
  less = require('gulp-less'),
  cssbeautify = require('gulp-cssbeautify'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  cleancss = require('gulp-clean-css'),
  gcmq = require('gulp-group-css-media-queries'),
  uglify = require('gulp-uglify-es').default,
  imagecomp = require('compress-images'),
  webp = require('gulp-webp'),
  webpHTML = require('gulp-webp-for-html'),
  webpcss = require('gulp-webpcss'),
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2');

function browserSync(params) {
  browsersync.init({
    server: { baseDir: './' + project_folder + '/' },
    notify: false,
    online: true,
  });
}
function scripts() {
  return src(path.src.js)
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(concat('script.min.js'))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function fonts() {
  src(path.src.fonts)
    .pipe(dest(path.build.fonts))
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts));
  return src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
}
function images() {
  imagecomp(
    path.src.img,
    path.build.img,
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: 'mozjpeg', command: ['-quality', '60'] } },
    { png: { engine: 'pngquant', command: ['--quality=20-50', '-o'] } },
    { svg: { engine: 'svgo', command: '--multipass' } },
    {
      gif: { engine: 'gifsicle', command: ['--colors', '64', '--use-col=web'] },
    },
    function (err, completed) {
      if (completed === true) {
      }
    }
  );
  return src(path.src.img)
    .pipe(
      webp({
        quality: 90,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function html() {
  return src(path.src.html)
    .pipe(webpHTML(['.jpg', '.png'])) //не работает если есть тег <fugure>
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}
function styles() {
  return src(path.src.css)
    .pipe(less())
    .pipe(cssbeautify())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        grid: true,
        cascade: true,
      })
    )
    .pipe(gcmq())
    .pipe(webpcss({ webpClass: '.webp', noWebpClass: '.no-webp' }))
    .pipe(dest(path.build.css))
    .pipe(
      cleancss({
        level: { 1: { specialComments: 0 } },
      })
    )
    .pipe(concat('style.min.css'))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}
function fontsStyle(params) {
  let file_content = fs.readFileSync(source_folder + '/less/fonts.less');
  if (file_content == '') {
    fs.writeFile(source_folder + '/less/fonts.less', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(
              source_folder + '/less/fonts.less',
              '.font("' + fontname + '", "' + fontname + '", 400, normal);\r\n',
              cb
            );
          }
          c_fontname = fontname;
        }
      }
    });
  }
}

function cb() {}
function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], styles);
  gulp.watch([path.watch.js], scripts);
  gulp.watch([path.watch.img], images);
}
function clean(params) {
  return del(path.clean);
}
let build = gulp.series(
  clean,
  gulp.parallel(scripts, styles, html, images, fonts),
  fontsStyle
);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.scripts = scripts;
exports.styles = styles;
exports.build = build;
exports.html = html;
exports.watch = watch;
exports.default = watch;
