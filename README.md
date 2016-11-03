# vue-play-cli

Run vue-play app with ease.

## Install

```bash
# use npm to install if you're from old school ;)
$ yarn global add vue-play-cli
```

## Quick start

Write your components and play entry:

```js
// ./play/index.js
import {play} from 'vue-play'
import ButtonExample from '../examples/Button.vue'

play('Button', module)
  .add('with text', ButtonExample)
```

### Play it

```bash
vue-play start
```

### Build it

```bash
vue-play build
```

## Customize

### Play Entry

This is not a webpack entry, the easiest way to change it is via command-cli options:

```bash
vue-play [command] ./path/to/play.js
```

### Webpack Config

Merge your webpack config into the base config.

```bash
vue-play [command] --webpack-config ./path/to/webpack.config.js
```

If you want to change `play entry` via webpack config, simply set and alias:

```js
module.exports = {
  resolve: {
    alias: {
      'play-entry': '/path/to/play/entry.js'
    }
  }
}
```

**Note**: When you're extending the webpack config, try not to remove these properties:

```js
{
  // the essential entries
  entry: {app, preview},
  resovle: {
    alias: {
      'play-entry' // the path to your `play entry` file
    }
  },
  // they are html-webpack-plugin
  plugins: [0, 1]
}
```
