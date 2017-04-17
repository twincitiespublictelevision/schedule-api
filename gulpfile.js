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

gulp.task('watch', ['scripts'], () => {
	gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('default', ['watch']);