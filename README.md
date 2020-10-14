jumpstart
=======

Config and boilerplate free dev/build tool.

Preview
----------

![](https://user-images.githubusercontent.com/25524993/96020434-4e5eb680-0e4e-11eb-93a1-1d7b8fdaaf39.gif)

Installation
------------

#### Global installation
```
npm i -g jumpstart-cli
```

#### Local installation
```
npm i -D jumpstart-cli
```

Usage
-----

#### Globally installed
```
jumpstart
```

#### Locally installed
```
./node_modules/.bin/jumpstart
```

#### Not installed
```
npx jumpstart-cli
```

Examples
--------

#### Webpack
```sh
# javascript
echo "alert('Hello World')" > src/index.js

# typescript
echo "
  message:string = "Hello World"
  alert('Hello World')
" > src/index.ts

# lightscript
echo "alert! 'Hello World'" > src/index.lsc

jumpstart start
jumpstart bulid
```

#### Jest
```sh
# javascript
echo "it('example', () => expect(4).toBe(3))" > example.test.js

# typescript
echo "
  it('example', () => {
    const example:number = 3
    expect(4).toBe(example)
  })
" > example.test.ts

# lightscript
echo "it! 'example', -> expect(4).toBe(3)" > example.test.lsc

jumpstart test
```

#### ESLint
```sh
# javascript
echo "console.log('Hello World')" > src/example.js

# typescript
echo "
  message:string = "Hello World"
  alert('Hello World')
" > src/example.ts

# lightscript
echo "console.log! 'Hello World'" > src/example.lsc

jumpstart lint
```

#### Babel
```sh
# javascript
echo "console.log({ ...foo })" > example.js
jumpstart compile example.js

# typescript
echo "
  message:string = "Hello World"
  alert('Hello World')
" > src/index.ts
jumpstart compile example.ts

# lightscript
echo "console.log! { ...foo }" > example.lsc
jumpstart compile example.lsc
```

#### PostCSS
```sh
# css
echo ".foo { bar: baz }" > example.css
jumpstart css example.css

# sass
echo ".foo { .bar { baz: qux } }" > example.scss
jumpstart css example.scss

# less
echo ".foo { .bar { baz: qux } }" > example.less
jumpstart css example.less
```
#### MDX
```sh
npm i jumpstart-cli babel-loader @mdx-js/loader
```
```js
import React from 'react'
import { render } from 'react-dom'

import Page from '!babel-loader?configFile=jumpstart-cli/babel!@mdx-js/loader!./page.mdx'

render(<Page/>, document.getElementById('root'))
```
