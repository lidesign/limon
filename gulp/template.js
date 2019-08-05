/* eslint-env node */

/**
 * @license
 * Copyright MNF (illvart) All Rights Reserved.
 * https://github.com/illvart
 *
 * This code licensed under the MIT License.
 * LICENSE file at https://github.com/illvart/illvart/blob/master/LICENSE
 */

const { nunjucks } = require('gulp-nunjucks-render');
const nunjucksRender = require('gulp-nunjucks-render');
const sitemap = require('gulp-sitemap');
const { pd } = require('pretty-data');

module.exports = ({ settings, output, config, browserSync, reload, generateId, gulp, debug, inject }) => {
  // nunjucks manageEnv
  const manageEnvironment = (plugin, lol) => {
    /**
     * Nunjucks global:
     * - environment mode
     *
     */
    plugin.addGlobal('mode', process.env.NODE_ENV);

    /**
     * Nunjucks filter:
     * - toTitleCase
     * - toEncodeURI
     *
     */
    plugin.addFilter('toTitleCase', (str) =>
      str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
        .join(' ')
    );
    plugin.addFilter('toEncodeURI', (str) => encodeURI(str));

    /**
     * Nunjucks extension:
     * - Minify Json
     *
     */
    function minifyJsonExtension() {
      this.tags = ['startMinifyJson'];
      this.parse = (parser, nodes, lexer) => {
        const tok = parser.nextToken();
        parser.advanceAfterBlockEnd(tok.value);
        const body = parser.parseUntilBlocks('endMinifyJson');
        parser.advanceAfterBlockEnd();
        return new nunjucks.nodes.CallExtension(this, 'run', null, [body]);
      };
      this.run = (context, body) => {
        let minified;
        if (settings.site.minifyJson && process.env.NODE_ENV === 'production') {
          minified = pd.jsonmin(body());
        } else {
          minified = pd.json(body());
        }
        return new nunjucks.runtime.SafeString(minified);
      };
    }
    plugin.addExtension('minifyJsonExtension', new minifyJsonExtension());
  };

  const paths = {
    src: {
      // watch css path (only filename .njk)
      templates: './src/templates/**/*.+(njk)',
      // src path (only filename .njk)
      pages: './src/templates/pages/**/*.+(njk)'
    }
  };

  // nunjucks render
  gulp.task('nunjucks:render', () =>
    gulp
      .src(paths.src.pages)
      .pipe(
        nunjucksRender({
          ext: '.html',
          path: ['src'],
          envOptions: {
            autoescape: true,
            throwOnUndefined: true,
            trimBlocks: true,
            lstripBlocks: true,
            watch: false
          },
          manageEnv: manageEnvironment,
          data: {
            // Store string from config.yml
            config: config,
            // Dynamic css name
            cssNameDev: `style.${generateId}.css`,
            cssNameProd: `style.${generateId}.min.css`,
            // Dynamic js name
            jsNameDev: `app.${generateId}.js`,
            jsNameProd: `app.${generateId}.min.js`
          }
        })
      )
      .pipe(debug({ title: 'Rendering nunjucks to HTML:' }))
      .pipe(gulp.dest(output))
      .pipe(browserSync.stream())
  );

  // sitemap generator
  gulp.task('sitemap', () =>
    gulp
      .src(`${output}/**/*.html`, {
        read: false
      })
      .pipe(
        sitemap({
          // Get URL from config.json
          siteUrl: `${config.url}`
        })
      )
      .pipe(debug({ title: 'Generate sitemap:' }))
      .pipe(gulp.dest(output))
  );

  // inject sitemap url to robots.txt
  gulp.task('robots.txt', () =>
    gulp
      .src('./src/robots.txt')
      // inject after Allow: /
      //.pipe(inject.after('Allow: /', `\n\nSitemap: ${config.url}/sitemap.xml`))

      // append
      .pipe(inject.append(`\nSitemap: ${config.url}/sitemap.xml`))
      .pipe(debug({ title: 'Inject sitemap url:' }))
      .pipe(gulp.dest(output))
  );

  // watch nunjucks development mode
  gulp.task('watch:nunjucks', () => {
    // First run nunjucks:render then reload
    gulp.watch(paths.src.templates, gulp.series('nunjucks:render', reload));
  });
};
