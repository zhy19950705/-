const gulp = require('gulp')
const rename = require('gulp-rename')
const del = require('del')

const through = require('through2')
const colors = require('ansi-colors')
const log = require('fancy-log')
const argv = require('minimist')(process.argv.slice(2))

const postcss = require('gulp-postcss')
const pxtorpx = require('postcss-px2rpx')
const base64 = require('postcss-font-base64')

const htmlmin = require('gulp-htmlmin')
const sass = require('gulp-sass')
const jsonminify = require('gulp-jsonminify')
const combiner = require('stream-combiner2')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const cssnano = require('gulp-cssnano')
const runSequence = require('run-sequence')
const sourcemaps = require('gulp-sourcemaps')
const filter = require('gulp-filter')
const jdists = require('gulp-jdists')

const src = './client';
const dist = './dist';
// 判断 gulp --type prod 命名 type 是否是生产打包
let isProd = process.env.NODE_ENV === 'prod';


const handleError = (err) => {
    console.log('\n');
    log(colors.red('Error!'));
    log('fileName:' + colors.red(err.fileName));
    log('lineNumber:' + colors.red(err.lineNumber));
    log('message:' + err.message);
    log('plugin:' + colors.yellow(err.plugin))
}

gulp.task('wxml', () => {
    return gulp.src(`${src}/**/*.wxml`)
        .pipe(
            isProd ? htmlmin({
                collapseWhitespace: true,
                removeComments: true,
                keepClosingSlash: true
            }) : through.obj()
        )
        .pipe(gulp.dest(dist))
})

gulp.task('wxss', () => {
    const combined = combiner.obj([
        gulp.src(`${src}/**/*.{wxss,scss}`),
        sass().on('error', sass.logError),
        postcss([pxtorpx(), base64()]),
        isProd ? cssnano({
            autoprefixer: false,
            discardComments: {
                removeAll: true
            }
        }) : through.obj(),
        rename((path) => (path.extname = '.wxss')),
        gulp.dest(dist)
    ])
    combined.on('error', handleError)
})

gulp.task('images', () => {
    return gulp.src(`${src}/images/**`).pipe(gulp.dest(`${dist}/images`));
})

gulp.task('json', () => {
    return gulp.src(`${src}/**/*.json`).pipe(gulp.dest(dist))
})

gulp.task('wxs', () => {
    return gulp.src(`${src}/**/*.wxs`).pipe(gulp.dest(dist))
})

gulp.task('js', () => {
    const f = filter((file) => !/(mock|bluebird)/.test(file.path))
    gulp.src(`${src}/**/*.js`).pipe(sourcemaps.init())
        .pipe(
            isProd ? f : through.obj()
        )
        // 如果是 prod，则触发 jdists 的 prod trigger
        // 否则则为 dev trigger
        .pipe(
            isProd ? jdists({
                trigger: 'prod'
            }) : jdists({
                trigger: 'dev'
            })
        )
        // 如果是 prod，则传入空的流处理方法，不生成 sourcemap
        .pipe(isProd ? through.obj() : sourcemaps.init())
        .pipe(
            babel({
                presets: ['env']
            })
        )
        // 如果是 prod，则使用 uglify 压缩 js
        .pipe(isProd ? uglify({
            compress: true
        }) : through.obj())
        .pipe(isProd ? through.obj() : sourcemaps.write('./'))
        .pipe(gulp.dest(dist))
})

gulp.task('watch',()=>{
    ;['wxml','wxss','js','json','wxs'].forEach((v)=>{
        gulp.watch(`${src}/**/*.${v}`,[v])
    })
    gulp.watch(`${src}/images/**`,['images'])
    gulp.watch(`${src}/**/*.scss`,['wxss'])
})

gulp.task('clean',()=>{
    return del(['./dist/**'])
})

gulp.task('dev',['clean'],()=>{
    runSequence('json', 'images', 'wxml', 'wxss', 'js', 'wxs', 'cloud', 'watch')
})

gulp.task('build',['clean','set-env::production'],()=>{
    console.log(isProd)
    runSequence('json', 'images', 'wxml', 'wxss', 'js', 'wxs', 'cloud')
})

const cloudPath='./server/cloud-functions';
gulp.task('cloud',()=>{
    return gulp
    .src(`${cloudPath}/**`)
    .pipe(isProd?jdists({trigger:'prod'}):jdists({trigger:'dev'}))
    .pipe(gulp.dest(`${dist}/cloud-functions`))
});
gulp.task('watch:cloud',()=>{
    gulp.watch(`${cloudPath}/**`,['cloud']);
});
gulp.task('cloud:dev',()=>{
    runSequence('cloud','watch:cloud')
})

gulp.task('set-env::production',()=>{
    isProd=true
    process.env.NODE_ENV='prod'
    console.log(process.env.NODE_ENV)
    return Promise.resolve(true)
})