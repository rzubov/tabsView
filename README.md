Tabs View Layout
=======
ECMAScript 2015 web-app that create tabs view control. 

Created with WebStorm IDE

![alt tag](https://api.monosnap.com/rpc/file/download?id=4eM2NByjKeQ8bVkVw2VFjSC8lkvpJ6)

## Installation

```
npm install
```

### Use Gulp tasks


* `gulp` or `gulp serve` to build an optimized version of your application in `/dist` and launch a browser sync server on your source files
* `gulp clean` to clean `/dist` folder
* `gulp build` to build an optimized version of your application in `/dist`


### Usage
```html
 <div id="tabsView"></div>
```

```js
let element = document.getElementById('tabsView'),
    tabs = new TabsView(element);
```

### Options

```js
let element = document.getElementById('tabsView'),
    tabs = new TabsView(element,{
            hashNav: false,            //set true to activate hash navigation to save tabs state
            draggable: false,          //set true if you want be able to sort tabs with drag and drop
            beforeInit:function(){},   
            afterInit:function(){}
      }
    });
```
