import typescript from 'rollup-plugin-typescript2';

// global var to assign build settings object
let EXPORT_BUILD_OPTS;

// code snippet to accept custom target build paths if specified in cmd-line.
let DIST_DIR;
if (!("DIST_DIR" in process.env)) {
  DIST_DIR = "dist";
} else {
  DIST_DIR = process.env.DIST_DIR;
};

// default configuration options for building Essentia.js core JS API and add-on modules
let defaultBuildOpts = [{
  input: 'src/typescript/core_api.ts', // our source file
  output: [
    {
    file: DIST_DIR + '/essentia.js-core.es.js',
    format: 'es' // the preferred format
    },
    {
    file: DIST_DIR + '/essentia.js-core.js',
    format: 'iife',
    name: 'Essentia' // the global which can be used in a browser
    }
  ],
  plugins: [
    typescript({
    typescript: require('typescript'),
    }),
  ]
}, {
 input: 'src/typescript/plot.ts', // our source file
 output: [
  {
   file: DIST_DIR + '/essentia.js-plot.es.js',
   format: 'es' // the preferred format
  },
  {
   file: DIST_DIR + '/essentia.js-plot.js',
   format: 'iife',
   name: 'EssentiaPlot' // the global which can be used in a browser
  }
 ],
 plugins: [
  typescript({
   typescript: require('typescript'),
  }),
 ]
}, {
  input: 'src/typescript/extractor.ts', // our source file
  output: [
   {
    file: DIST_DIR + '/essentia.js-extractor.es.js',
    format: 'es' // the preferred format
   },
   {
    file: DIST_DIR + '/essentia.js-extractor.js',
    format: 'iife',
    name: 'EssentiaExtractor' // the global which can be used in a browser
   }
  ],
  plugins: [
   typescript({
    typescript: require('typescript'),
   }),
  ]
 },
]

// code snippet to adapt cmd-line options for building builds with/without add-on modules.
let IS_ADDON;
if (!("ESSENTIAJS_ADDON" in process.env)) {
  EXPORT_BUILD_OPTS = defaultBuildOpts;
} else {
  IS_ADDON = Boolean(Number(process.env.ESSENTIAJS_ADDON));
  if (IS_ADDON) {
    EXPORT_BUILD_OPTS = defaultBuildOpts;
  } else {
    defaultBuildOpts.forEach(function (item, index) {
      // remove all the add-on modules from build settings
      if (index >= 0) defaultBuildOpts.pop();
    });
    EXPORT_BUILD_OPTS = defaultBuildOpts;
  }
};

export default EXPORT_BUILD_OPTS;