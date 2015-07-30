import {merge_options} from "./cutils";
import htmlList from './templates/list';
import htmlTpl from './htmlTpl' ;
import guid from './utils/guid';
import htmlTab from './templates/tab'
import htmlTabPane from './templates/tabPane'
"use strict";
class TabsView {
  constructor(elem, settings) {
    "use strict";
    let defaults = {
      container: ".article-tab",
      opener: ".article-heading",
      activeClass: "active",
      hashNav: false
    };
    this.options = merge_options(defaults, settings);
    this.elem = elem;

    if (!localStorage.newTabs) {
      localStorage.newTabs = 0;
    }

    if (!localStorage[elem.id]) {
      localStorage[elem.id] = '[]';
    }
    this.init(this.options);
  }

}
TabsView.prototype.getData = function () {
  const that = this;
  var list = htmlList(JSON.parse(localStorage[that.elem.id]));
  var e = that.elem;
  e.innerHTML = list;
};
TabsView.prototype.saveData = function () {


};

TabsView.prototype.init = function (options) {
  const that = this;
  that.getData();

  this.elem.getElementsByClassName('tabNav')[0].addEventListener('click', e=>tabNavClick(e));
  function tabNavClick(e) {
    "use strict";
    //TODO: simplify delegation
    const target = e.target;

    if (target.dataset.tab) {
      that.activate(target.dataset.tab)
    } else if (target.classList.contains('addTab')) {
      that.addTab();
    } else if (!target.classList.contains('close') && !target.classList.contains('edit') && target.parentNode.dataset.tab) {
      that.activate(target.parentNode.dataset.tab)
    } else if (target.classList.contains('close')) {
      that.removeTab(target.parentNode.dataset.id)
    } else if (target.classList.contains('edit')) {
      var span = target.parentNode.getElementsByTagName('span')[0];
      that.activate(target.parentNode.dataset.tab);
      span.setAttribute("contenteditable", true);
      target.parentNode.classList.add('editable');
      span.focus();

      span.addEventListener('keypress', e=> {
        var code = e.keyCode || e.which;
        if (code == 13) {
          e.preventDefault();
          that.saveTitle(target.parentNode.dataset.id, span)
        }
      });

      span.addEventListener('focusout', e=> {
        let spans = that.elem.getElementsByTagName('span');
        for (let i = 0; i < spans.length; i++) {
          spans[i].setAttribute("contenteditable", false);
          spans[i].parentNode.classList.remove('editable');
        }

        that.saveTitle(target.parentNode.dataset.id, span)

      });
    }
  }

  this.elem.getElementsByClassName('tabPanes')[0].addEventListener('click', e=>tabPaneClick(e));
  function tabPaneClick(e) {
    const target = e.target;
    if (target.classList.contains('edit')) {
      var content = target.parentElement.getElementsByClassName('tab-content')[0];
      content.setAttribute('id', 'editable');
      let editor = new nicEditor({fullPanel: true}).panelInstance(content.id);
      content.focus();

      content.addEventListener("keydown", function (e) {
        if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
          e.preventDefault();
          that.saveContent(target.parentNode.id, content);
          editor.removeInstance(content.id);
          editor = null;
          content.removeAttribute('id');
        }
      }, false);
    }
    if (target.classList.contains('save')) {
      that.saveContent(target.parentNode.id, content);
      content.removeAttribute('id');
    }
  }

  that.elem.addEventListener("dblclick", e=> {
    //TODO: set to all tab
    if (e.target.dataset.tab) {
      that.removeTab(e.target.dataset.id)
    }
  }, true);

  if (that.options.hashNav) {
    var initHash = that.hashNav.init.bind(that);
    initHash();
  } else {
    that.activate(that.elem.querySelector('data-tab').dataset.tab)
  }
};

TabsView.prototype.saveTitle = function (id, span) {
  const that = this;
  let data = JSON.parse(localStorage[that.elem.id]);

  function findById(source, id) {
    for (let i = 0; i < source.length; i++) {
      if (source[i].id == id) {
        data[i].title = span.innerText;
        return false;
      }
    }
  }

  findById(data, id);
  span.setAttribute("contenteditable", false);
  span.parentNode.classList.remove('editable');
  localStorage[that.elem.id] = JSON.stringify(data);
};

TabsView.prototype.saveContent = function (id, span) {
  const that = this;
  let data = JSON.parse(localStorage[that.elem.id]);

  function findById(source, id) {
    for (let i = 0; i < source.length; i++) {
      if (source[i].id == id) {
        data[i].content = span.innerHTML;
        return false;
      }
    }
  }

  findById(data, id);

  localStorage[that.elem.id] = JSON.stringify(data);
};

TabsView.prototype.removeTab = function (id) {
  const that = this;
  let tabPane = document.getElementById(id),
    tabItem = document.querySelector('[data-id="' + id + '"]'),
    data = JSON.parse(localStorage[that.elem.id]);

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

  localStorage[that.elem.id] = JSON.stringify(data);

  if (tabItem.classList.contains('active')) this.activate();
  tabPane.parentElement.removeChild(tabPane);
  tabItem.parentElement.removeChild(tabItem);
  document.location.hash = '';

};

TabsView.prototype.addTab = function () {
  const that = this;
  let data = JSON.parse(localStorage[that.elem.id]),
    newTabs = localStorage.newTabs,
    tabsPanel = that.elem.getElementsByClassName('addTab')[0],
    tabPanes = that.elem.getElementsByClassName('tabPanes')[0],
    newTab = {
      id: guid(),
      title: 'New Tab ' + newTabs,
      name: 'newTab' + newTabs,
      content: 'Click on edit to set content'
    };

  localStorage.newTabs = parseInt(localStorage.newTabs) + 1;
  data.push(newTab);
  localStorage[that.elem.id] = JSON.stringify(data);

  tabsPanel.insertAdjacentHTML('beforebegin', htmlTab(newTab));
  tabPanes.insertAdjacentHTML('beforeend', htmlTabPane(newTab));
};

TabsView.prototype.activate = function (tabName) {
  const that = this;

  if (!tabName) tabName = that.elem.querySelector('[data-tab]').dataset.tab;

  let tabPane = that.elem.querySelector('[data-pane=' + tabName + ']'),
    tab = that.elem.querySelector('[data-tab=' + tabName + ']');

  if (!tab.classList.contains('active')) {
    //change the tab page and update the active tab
    let list = that.elem.getElementsByTagName("li");

    for (let i = 0; i < list.length; i++) {
      let listItem = list[i],
        itemClassList = listItem.classList,
        itemDataSet = listItem.dataset;

      if (itemClassList.contains('active')) {
        itemClassList.remove('active');
        that.elem.querySelector('[data-pane=' + itemDataSet.tab + ']').classList.remove('active-page');
      }
    }
    tab.classList.add('active');
    tabPane.classList.add('active-page');
    if (that.options.hashNav)that.hashNav.setHash(tab.dataset.tab);
  }
};
TabsView.prototype.goToTab = function (id) {
  let tabsList = this.elem.querySelectorAll('[data-tab]');
  if (id > 0 && id <= tabsList.length) {
    let name = tabsList[id - 1].dataset.tab;
    this.activate(name);
  }
};
TabsView.prototype.hashNav = {
  init: function () {
    let hash = document.location.hash.replace('#', ''),
      tab;
    if (hash && this.elem.querySelector('[data-tab="' + hash + '"]')) {
      tab = hash;
    } else {
      tab = this.elem.querySelector('[data-tab]').dataset.tab;
    }
    if (tab) this.activate(tab);
  },
  setHash: function (hash) {
    document.location.hash = hash;
  }
};

export default TabsView
