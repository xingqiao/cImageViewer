var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var minifyCss = require("gulp-minify-css");
var gulpSequence = require("gulp-sequence");
var connect = require('gulp-connect');
var gulpif = require("gulp-if");
var argv = require("yargs").argv;
var del = require("del");
var cp = require('child_process');

var paths = {
    js: ["src/*.core.js", "src/*.js"],
    css: ["src/*.css"],
    img: ["src/images/*"],
    dest: "dest/",
    bundle: "cimageviewer.js"
};

gulp.task("clean", function () {
    del([
        paths.dest,
    ]).then(paths => {
        console.log("Files and folders that would be deleted:\n", paths.join("\n"));
    });
    console.log("清理编译文件")
});

gulp.task("jshint", function () { });

gulp.task("js", ["jshint"], function () {
    return gulp
        .src(paths.js, { base: "src" })
        .pipe(concat(paths.bundle))
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(gulpif(argv.p, uglify({
            compress: {
                drop_debugger: true
            }
        })))
        .pipe(gulp.dest(paths.dest))
        .pipe(connect.reload());
});

gulp.task("css", function () {
    return gulp
        .src(paths.css, { base: "src" })
        .pipe(gulpif(argv.p, minifyCss()))
        .pipe(gulp.dest(paths.dest));
});

gulp.task("image", function () {
    return gulp
        .src(paths.img, { base: "src" })
        .pipe(gulp.dest(paths.dest));
});

//本地服务器  支持自动刷新页面
gulp.task('connect', function() {
    console.log(__dirname)
    connect.server({
        root: __dirname,
        port: 8008,
        livereload: true
    });
    if (!argv.p) {
        cp.exec("start http://localhost:8008/example/index.html"); // 启动服务后，打开demo页面
    }
});

//监控文件变更
gulp.task("watch", function () {
    gulp.watch(["./src/**/*.*"], ["watchlist"]);
});

gulp.task("watchlist", ["clean"], function () {
    setTimeout(function () {
        gulpSequence("js", "css", "image")();
    }, 300)
});

gulp.task("default", ["clean"], function () {
    setTimeout(function () {
        if (argv.p) {
            gulpSequence("js", "css", "image")();
        } else {
            gulpSequence("js", "css", "image", "watch", "connect")();
        }
    }, 300)
});