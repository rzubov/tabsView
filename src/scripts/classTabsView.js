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
      {title: 'Info', name: 'info', content:'text'},
      {title: 'Images', name: 'images'},
      {title: 'Recipes', name: 'recipes'}
    ]);
    localStorage[elem.id] = data;
    this.init(this.options);
  }

}
TabsView.prototype.getData= function(){
  const that = this;
  var list = html(JSON.parse(localStorage[that.elem.id]));
  var e = that.elem;
  e.innerHTML = list;
};
TabsView.prototype.saveData= function(){


};

TabsView.prototype.init = function (options) {
  const that = this;
  this.elem.addEventListener('click', e=>clickHandler(e));
  that.getData();
  function clickHandler(e) {
    "use strict";
    let target = e.target;
    if (target.dataset.tab) {
      that.activate(target)
    } else if (!target.classList.contains('edit') && target.parentNode.dataset.tab) {
      that.activate(target.parentNode)
    } else if (target.classList.contains('edit')) {
      var span = target.parentNode.getElementsByTagName('span')[0];
      that.activate(target.parentNode);
      span.setAttribute("contenteditable", true);
      target.parentNode.classList.add('editable');
      span.focus();
      span.addEventListener('focusout', e=>{
        var spans = that.elem.getElementsByTagName('span');
        for (let i = 0; i < spans.length; i++) {
          spans[i].setAttribute("contenteditable", false);
          spans[i].parentNode.classList.remove('editable');
        }
      })
    }
  }

  if (options.hashNav) {
    var initHash = that.hashNav.init.bind(that);
    initHash();
  }
};


TabsView.prototype.activate = function (tab) {
  var that = this;
  var tabPane = getAllElementsWithAttribute('data-pane', tab.dataset.tab);

  if (!tab.classList.contains('active')) {
    //change the tab page and update the active tab
    let list = this.elem.getElementsByTagName("li");

    for (let i = 0; i < list.length; i++) {
      let listItem = list[i],
        itemClassList = listItem.classList,
        itemDataSet = listItem.dataset;

      if (itemClassList.contains('active')) {
        itemClassList.remove('active');
        getAllElementsWithAttribute('data-pane', itemDataSet.tab).classList.remove('active-page');
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
    if (!hash) return;
    let tab = getAllElementsWithAttribute('data-tab', hash);
    this.activate(tab);
  },
  setHash: function (hash) {
    document.location.hash = hash;
  }
};

export default TabsView
