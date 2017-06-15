const gulp 			= require('gulp');
const babel 		= require('gulp-babel');
const sourcemaps 	= require('gulp-sourcemaps');

gulp.task('scripts', () => {
	return gulp.src('src/**/*.js')
	.pipe(sourcemaps.init())
	.pipe(babel())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('build'));
});

gulp.task('baseDir', () => {
	return gulp.src('./startProcess.js')
	.pipe(sourcemaps.init())
	.pipe(babel())
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('build'));
});

gulp.task('watch', ['scripts'], () => {
	gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('watchBase', ['baseDir'], () => {
	gulp.watch('./startProcess.js', ['baseDir']);
});

gulp.task('default', ['watch']);
gulp.task('build', ['watch', 'watchBase']);
