var gulp = require('gulp');
var firebase = require('firebase-tools');
//var security = require('./security.json');
var clean = require('gulp-clean');
var filelist = require('gulp-filelist');
var ga = require('gulp-ga');
var sequence = require('run-sequence');
var env = require('./env.json');
var availableEnvironments = {
    dev: "DEV",
    prod: "PROD"
};

var currentEnv = availableEnvironments.dev;

/*
gulp.task('deploy', function () {
    firebase.deploy({
        project: '<project-name>',
        token: security.FIREBASE_TOKEN
    }).then(function() {
        console.log('Rules have been deployed!');
        process.exit(0);
    }).catch(function(err) {
        process.exit(1);
    });
});

*/

gulp.task('copyBuild', function () {
    return gulp.src('tmp/**/*')
        .pipe(gulp.dest('build'));
});

gulp.task('copyTmp', function () {
    return gulp.src('src/**/*')
        .pipe(gulp.dest('tmp'));
});

gulp.task('clean', function () {
    return gulp.src('build', {
        read: false
    })
        .pipe(clean());
});

gulp.task('indexRules', function () {
    return gulp.src('src/data/rules/*').pipe(filelist('rules.json', {
        flatten: true
    })).pipe(gulp.dest('src/data'));
});

gulp.task('ga', function(){
    var gaEnv = "GA_" + currentEnv;
    gulp.src('src/index.html')
        .pipe(ga({url: 'auto', uid: env[gaEnv], anonymizeIp: false, sendPageView: true}))
        .pipe(gulp.dest('tmp'));
});

gulp.task('cleanup', function () {
    return gulp.src('tmp', {
        read: false
    })
        .pipe(clean());
});

gulp.task('build', function() {
    return sequence('clean', 'indexRules', 'copyTmp', 'ga', 'copyBuild', /*'deploy',*/ 'cleanup');
});

gulp.task('deployDEV', function() {
    currentEnv = availableEnvironments.dev;
    return sequence('build');
});

gulp.task('deployPROD', function() {
    currentEnv = availableEnvironments.prod;
    return sequence('build');
});