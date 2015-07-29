import {merge_options, getAllElementsWithAttribute} from "./cutils";
import html from './templates/list';

class TabsView {
  constructor(elem, settings) {
    "use strict";
    var defaults = {
      container: ".article-tab",
      opener: ".article-heading",
      activeClass: "active",
      hashNav: false
    };
    this.options = merge_options(defaults, settings);
    this.elem = elem;
    var data = JSON.stringify([
      {id: 1, title: 'Info', name: 'info', content: 'text'},
      {id: 2, title: 'Images', name: 'images'},
      {id: 3, title: 'Recipes', name: 'recipes'}
    ]);
    if (!localStorage[elem.id]) {
      localStorage[elem.id] = data;
    }
    this.init(this.options);
  }

}
TabsView.prototype.getData = function () {
  const that = this;
  var list = html(JSON.parse(localStorage[that.elem.id]));
  var e = that.elem;
  e.innerHTML = list;
};
TabsView.prototype.saveData = function () {


};

TabsView.prototype.init = function (options) {
  const that = this;
  this.elem.addEventListener('click', e=>clickHandler(e));
  that.getData();
  function clickHandler(e) {
    "use strict";
    //TODO: simplify delegation
    const target = e.target;

    if (target.dataset.tab) {
      that.activate(target)
    }else if(target.classList.contains('addTab')){
      console.log('addTab');
      that.addTab();
    } else if (!target.classList.contains('close') && !target.classList.contains('edit') && target.parentNode.dataset.tab) {
      that.activate(target.parentNode)
    } else if (target.classList.contains('close')) {
      that.removeTab(target.parentNode.dataset.id)
    } else if (target.classList.contains('edit')) {
      var span = target.parentNode.getElementsByTagName('span')[0];
      that.activate(target.parentNode);
      span.setAttribute("contenteditable", true);
      target.parentNode.classList.add('editable');
      span.focus();

      span.addEventListener('keypress', e=> {
        var code = e.keyCode || e.which;
        if (code == 13) {
          e.preventDefault();
          that.saveTitle(target.parentNode.dataset.id, span.innerHTML)
        }
      });

      span.addEventListener('focusout', e=> {
        let spans = that.elem.getElementsByTagName('span');
        for (let i = 0; i < spans.length; i++) {
          spans[i].setAttribute("contenteditable", false);
          spans[i].parentNode.classList.remove('editable');
        }

        that.saveTitle(target.parentNode.dataset.id, span.innerHTML)

      });
    }
  }

  that.elem.addEventListener("dblclick", e=> {
    //TODO: set to all tab
    if (e.target.dataset.tab) {
      that.removeTab(e.target.dataset.id)
    }
  }, true);

  if (options || that.options.hashNav) {
    var initHash = that.hashNav.init.bind(that);
    initHash();
  }
};

TabsView.prototype.saveTitle = function (id, text) {
  const that = this;

  let data = JSON.parse(localStorage[that.elem.id]);

  function findById(source, id) {
    for (let i = 0; i < source.length; i++) {
      if (source[i].id == id) {
        data[i].title = text;
        return false;
      }
    }
  }

  findById(data, id);
  localStorage[that.elem.id] = JSON.stringify(data);

  that.init()
};

TabsView.prototype.removeTab = function (id) {
  console.log(id);
  const that = this;

  var data = JSON.parse(localStorage[that.elem.id]);

  function findById(source, elId) {
    for (let i = 0; i < source.length; i++) {
      if (source[i].id == elId) {
        data.splice(i, 1);
        console.log(data);
        return false;
      }
    }
  }

  findById(data, id);
  console.log(data);
  localStorage[that.elem.id] = JSON.stringify(data);
  document.location.hash = '';
  that.init()
};

TabsView.prototype.addTab = function (id) {
  const that = this;
  var data = JSON.parse(localStorage[that.elem.id]);
  var newTab ={
    id:'',
    title:'New Tab'
  }
};

TabsView.prototype.activate = function (tab) {
  var that = this;
  var tabPane = getAllElementsWithAttribute('data-pane', tab.dataset.tab)[0];

  if (!tab.classList.contains('active')) {
    //change the tab page and update the active tab
    let list = this.elem.getElementsByTagName("li");

    for (let i = 0; i < list.length; i++) {
      let listItem = list[i],
        itemClassList = listItem.classList,
        itemDataSet = listItem.dataset;

      if (itemClassList.contains('active')) {
        itemClassList.remove('active');
        getAllElementsWithAttribute('data-pane', itemDataSet.tab)[0].classList.remove('active-page');
      }
    }
    tab.classList.add('active');
    tabPane.classList.add('active-page');
    if (that.options.hashNav)that.hashNav.setHash(tab.dataset.tab);
  }
};
TabsView.prototype.goToTab = function (name) {
  let tab = getAllElementsWithAttribute('data-tab', name);
  this.activate(tab);
};
TabsView.prototype.hashNav = {
  init: function () {
    let hash = document.location.hash.replace('#', '');
    let tab;
    if (!hash) {
      tab = getAllElementsWithAttribute('data-tab')[0];
    } else {
      tab = getAllElementsWithAttribute('data-tab', hash)[0];
    }
    if (tab)this.activate(tab);
  },
  setHash: function (hash) {
    document.location.hash = hash;
  }
};

export default TabsView
