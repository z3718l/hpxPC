/// <binding BeforeBuild='build' ProjectOpened='default' />
// 引入 gulp
var gulp = require('gulp');

// 引入组件
var concat = require('gulp-concat'),    //文件合并
    connect = require('gulp-connect')   //server

gulp.task('default', function () {
    // 监听文件变化
    gulp.watch(['www/assets/js/*/*'], ['build']);
});

gulp.task('build', function () {
    gulp.src('www/assets/js/controller/*.js')
        .pipe(concat('angular-controller.js'))
        .pipe(gulp.dest('www/assets/js'));

    gulp.src('www/assets/js/directive/*.js')
        .pipe(concat('angular-directive.js'))
        .pipe(gulp.dest('www/assets/js'));

    gulp.src('www/assets/js/service/*.js')
        .pipe(concat('angular-service.js'))
        .pipe(gulp.dest('www/assets/js'));
});

//创建watch任务去检测html文件,其定义了当html改动之后，去调用一个Gulp的Task
gulp.task('watch', function () {
    gulp.watch(['./www/*.html', './www/assets/js/**/*.js'], ['reload']);
});

gulp.task('reload', function () {
    gulp.src('www/assets/js/controller/*.js')
        .pipe(concat('angular-controller.js'))
        .pipe(gulp.dest('www/assets/js'));

    gulp.src('www/assets/js/directive/*.js')
        .pipe(concat('angular-directive.js'))
        .pipe(gulp.dest('www/assets/js'));

    gulp.src('www/assets/js/service/*.js')
        .pipe(concat('angular-service.js'))
        .pipe(gulp.dest('www/assets/js'));

    gulp.src('./www/*.html')
        .pipe(connect.reload());
});

//使用connect启动一个Web服务器
gulp.task('connect', function () {
    connect.server({
        root: 'www',
        port: 8090,
        livereload: true
    });
});

//运行Gulp时，默认的Tas k
gulp.task('server', ['connect', 'watch']);