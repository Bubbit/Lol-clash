import merge from 'deepmerge';
// use createSpaConfig for bundling a Single Page App
import { createSpaConfig } from '@open-wc/building-rollup';
import copy from "rollup-plugin-copy-assets";

// use createBasicConfig to do regular JS to JS bundling
// import { createBasicConfig } from '@open-wc/building-rollup';

const baseConfig = createSpaConfig({
  // use the outputdir option to modify where files are output
  outputDir: 'public',

  // if you need to support older browsers, such as IE11, set the legacyBuild
  // option to generate an additional build just for this browser
  // legacyBuild: true,

  // development mode creates a non-minified build for debugging or development
  developmentMode: process.env.ROLLUP_WATCH === 'true',

  // set to true to inject the service worker registration into your index.html
  injectServiceWorker: false,
});

export default merge(baseConfig, {
  // if you use createSpaConfig, you can use your index.html as entrypoint,
  // any <script type="module"> inside will be bundled by rollup
  input: './index.html',
  plugins: [
    copy({
      assets: [
        // You can include directories
        "assets/champion",
        "assets/ranked-emblems",
        "assets/ranked-positions",
        "assets/opgg_map.png",
        "assets/league_clash2020.jpg",
        "assets/poro.png",
        "assets/load01.gif",
        "assets/lunar_revel2019_pig.png",
        "mocks/*.json"
        // You can also include files
      ],
    }),
  ],

  // alternatively, you can use your JS as entrypoint for rollup and
  // optionally set a HTML template manually
  // input: './app.js',
});