import {merge_options, findById} from "../utils/utils";
import Generator from "../utils/generator";
import htmlList from '../templates/list';
import htmlTpl from '../utils/htmlTpl' ;
import guid from '../utils/guid';
import htmlTab from '../templates/tab'
import htmlTabPane from '../templates/tabPane'


var hashInited = false,
  tabsPrefix = new Generator('tv'),
  namePrefix = new Generator('');

"use strict";

/**
 * Create events and html layouts for tabs
 *
 * @param elem                      container for tabs
 * @param {object} settings
 *
 * @class TabsView
 * */
class TabsView {
  constructor(elem, settings) {
    let defaults = {
      beforeInit: false,
      afterInit: false,
      hashNav: false
    };

    this.options = merge_options(defaults, settings);
    this.elem = elem;
    this.prefix = tabsPrefix.getNextId() + '-';


    if (!localStorage.newTabs) {
      localStorage.newTabs = 0;
    }

    if (!localStorage[elem.id]) {
      localStorage[elem.id] = '[]';
    }

    this.init();
  }

  /**
   * Initialize application, add listeners and render layout
   *
   * */

  init() {
    const that = this;
    if (that.options.beforeInit) that.options.beforeInit();

    that.render();

    that.elem.getElementsByClassName('tabNav')[0].addEventListener('click', e=>tabNavClick(e));
    function tabNavClick(e) {
      "use strict";
      //TODO: simplify delegation
      const target = e.target;

      if (target.dataset.tab) {
        that.activate(target.dataset.tab, true)
      } else if (target.classList.contains('addTab')) {
        that.addTab();

      } else if (!target.classList.contains('close') && !target.classList.contains('edit') && target.parentNode.dataset.tab) {
        that.activate(target.parentNode.dataset.tab, true);

        //Close tab
      } else if (target.classList.contains('close')) {
        that.removeTab(target.parentNode.dataset.id);

        //Edit tab title
      } else if (target.classList.contains('edit')) {
        let span = target.parentNode.getElementsByTagName('span')[0],

          targetDataSet = target.parentNode.dataset;
        that.activate(targetDataSet.tab, true);

        span.setAttribute("contenteditable", true);
        target.parentNode.classList.add('editable');
        span.focus();


        //Trigger blur on enter to save data and clear tags
        span.addEventListener('keypress', e=> {
          var code = e.keyCode || e.which;
          if (code == 13) {
            e.preventDefault();
            span.blur();
          }
        });

        span.addEventListener('focusout', ()=> {
          that.saveData(targetDataSet.id, span.innerText, 'title');
          span.setAttribute("contenteditable", false);
          span.parentNode.classList.remove('editable');
        });
      }
    }

    var editor,
      editorArea,
      content;

    this.elem.getElementsByClassName('tabPanes')[0].addEventListener('click', e=>tabPaneClick(e));
    function removeEditor(editorArea, content) {
      editorArea.removeInstance(content.id);
      editorArea = null;
      content.removeAttribute('id');
    }

    function tabPaneClick(e) {
      const target = e.target;

      if (target.classList.contains('edit')) {
        target.style.display = 'none';
        target.parentElement.getElementsByClassName('save')[0].style.display = 'block';
        content = target.parentElement.getElementsByClassName('tab-content')[0];
        content.setAttribute('id', that.prefix + 'editable');
        editorArea = new nicEditor({fullPanel: true}).panelInstance(content.id, {hasPanel: true});

        editor = target.parentElement.getElementsByClassName('nicEdit-main')[0];
        editor.focus();

        editor.addEventListener("keydown", function (e) {
          if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();
            that.saveData(target.parentNode.id, editor.innerHTML, 'content');
            target.style.display = 'block';
            target.parentElement.getElementsByClassName('save')[0].style.display = 'none';
            removeEditor(editorArea, content);
          }
        }, false);
      }
      if (target.classList.contains('save')) {
        target.style.display = 'none';
        target.parentElement.getElementsByClassName('edit')[0].style.display = 'block';
        that.saveData(target.parentNode.id, editor.innerHTML, 'content');
        removeEditor(editorArea, content);
      }
    }

    if (that.options.hashNav) {
      that.initHash();
    } else if (that.elem.querySelector('[data-tab]')) {
      that.activate(that.elem.querySelector('[data-tab]').dataset.tab)
    }

    if (that.options.afterInit) that.options.afterInit();
  }


  /**
   * Render html layout
   *
   * */
  render() {
    const that = this;
    var list = htmlList(JSON.parse(localStorage[that.elem.id]));
    var e = that.elem;
    e.innerHTML = list;
  }


  /**
   * Save data of tab title or content
   *
   * @param {number} id                   unique id of tab
   * @param {html} content                html content or text
   * @param {string} field                field name
   *
   * */


  saveData(id, content, field) {
    const that = this;
    let data = JSON.parse(localStorage[that.elem.id]),
      index = findById(data, id);

    if (index > -1)
      data[index][field] = content;

    localStorage[that.elem.id] = JSON.stringify(data);
  }


  /**
   * Remove tab from html and database
   *
   * @param {number} id                    unique id of tab
   *
   * */


  removeTab(id) {
    const that = this;
    let tabPane = document.getElementById(id),
      tabItem = document.querySelector('[data-id="' + id + '"]'),
      data = JSON.parse(localStorage[that.elem.id]),
      index = findById(data, id);

    data.splice(index, 1);
    localStorage[that.elem.id] = JSON.stringify(data);


    tabPane.parentElement.removeChild(tabPane);
    tabItem.parentElement.removeChild(tabItem);

    if (tabItem.classList.contains('active') && !(that.elem.querySelectorAll('.tabNav li').length < 2)) this.activate(false, true);


  }


  /**
   * Add tab to html and save to database
   *
   * @param {text} title                  title of new tab
   * @param {string} name                 name of new tab
   * @param {html} content                html content for new tab
   *
   * */


  addTab(title, name, content) {

    const that = this;
    let data = JSON.parse(localStorage[that.elem.id]),
      newTabs = localStorage.newTabs,
      tabsPanel = that.elem.getElementsByClassName('addTab')[0],
      tabPanes = that.elem.getElementsByClassName('tabPanes')[0],
      newTab = {
        id: guid(),
        title: title ? title : 'New Tab ' + newTabs,
        name: that.prefix + (name ? name.replace(/[^a-zA-Z]+/g, '') : 'newTab' + newTabs),
        content: content ? content : 'Click on edit to set content'
      };
    if (that.elem.querySelector('[data-tab=' + newTab.name + ']')) {
      newTab.name += namePrefix.getNextId();
    }

    localStorage.newTabs = parseInt(localStorage.newTabs) + 1;
    data.push(newTab);
    localStorage[that.elem.id] = JSON.stringify(data);

    tabsPanel.insertAdjacentHTML('beforebegin', htmlTab(newTab));
    tabPanes.insertAdjacentHTML('beforeend', htmlTabPane(newTab));

    if (that.elem.querySelectorAll('.tabNav li').length < 3) {
      that.activate(false, true);
    }
  }


  /**
   * Set active to tab
   *
   * @param {string} tabName                  unique tab name
   * @param {boolean} setHash                 set hash
   *
   *
   * */


  activate(tabName, setHash) {
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
          let itemPane = that.elem.querySelector('[data-pane=' + itemDataSet.tab + ']');
          itemPane.classList.remove('active-page');
          let saveBtn = itemPane.getElementsByClassName('save')[0];
          if (getComputedStyle(saveBtn).display == 'block')saveBtn.click();

        }
      }
      tab.classList.add('active');
      tabPane.classList.add('active-page');

      if (that.options.hashNav && setHash)that.setHash(tab.dataset.tab);
    }
  }


  /**
   * Set active to tab by id
   *
   * @param {string} id                  unique tab id
   *
   * */
  goToTab(id) {
    let tabsList = this.elem.querySelectorAll('[data-tab]');
    if (id > 0 && id <= tabsList.length) {
      let name = tabsList[id - 1].dataset.tab;
      this.activate(name, true);
    }
  }


  /**
   * Set hash
   *
   * @param {string} hash
   *
   * */
  setHash(hash) {
    document.location.hash = hash;
  }


  /**
   * Initialize hash and set active tab
   *
   * */
  initHash() {
    let tab;
    let hash = document.location.hash.replace('#', '');
    let setHash = false;

    if (hash && this.elem.querySelector('[data-tab="' + hash + '"]') && !hashInited) {
      hashInited = true;
      setHash = true;
      tab = hash;
    } else {
      let elem = this.elem.querySelector('[data-tab]');
      tab = elem ? elem.dataset.tab : null;
    }

    if (tab) this.activate(tab, setHash);
  }
}


export default TabsView
