import TabsView from "./classes/tabsView";
import guid from "./utils/guid";
import htmlTpl from "./utils/htmlTpl"

//set demo content;
function setDemoData(id) {
  if (!localStorage[id]) {
    let data = JSON.stringify([
      {
        id: guid(),
        title: 'Html5',
        name: 'tv1-html5',
        content: htmlTpl`<div style="padding-left:15%;float: left;width: 100%;">
      <img src="http://i.imgur.com/J0SjT57.png" style="float: left; padding-right: 15px;"/>
      <ul style="float: left;color: #575e6b;font-size: 17px;line-height: 35px;margin-top: 40px;padding-left: 80px;">
        <li>With HTML you can create your own Web site.&nbsp;<br></li>
        <li>This tutorial teaches you everything about HTML.&nbsp;<br></li>
        <li>HTML is easy to learn - You will enjoy it.<br></li>
      </ul>
      </div>
      <div style="float:left;padding-top: 40px;width: 100%;"><h3>New HTML5 Elements</h3>
          <p style="float: left;">The most interesting new elements are:New semantic elements like </p>
          <p style="float: left;">New semantic elements like <b>&lt;header&gt;</b>, <b>&lt;footer&gt;</b>, <b>&lt;article&gt;</b>, and <b>&lt;section&gt;</b>.</p>
          <p style="float: left;">New form control attributes like <b>number</b>, <b>date</b>, <b>time</b>, <b>calendar</b>, and <b>range</b>.</p>
          <p style="float: left;">New graphic elements: <b>&lt;svg&gt; </b>and <b>&lt;canvas&gt;</b>.</p>
      </div>
`
      },
      {
        id: guid(), title: 'CSS3', name: 'tv1-css3', content: htmlTpl`
      <div style="float:left;padding-top: 40px;width: 100%;"><h3>New HTML5 Elements</h3>
          <p style="float: left;">The most interesting new elements are:New semantic elements like </p>
          <p style="float: left;">New semantic elements like <b>&lt;header&gt;</b>, <b>&lt;footer&gt;</b>, <b>&lt;article&gt;</b>, and <b>&lt;section&gt;</b>.</p>
          <p style="float: left;">New form control attributes like <b>number</b>, <b>date</b>, <b>time</b>, <b>calendar</b>, and <b>range</b>.</p>
          <p style="float: left;">New graphic elements: <b>&lt;svg&gt; </b>and <b>&lt;canvas&gt;</b>.</p>
      </div>
      <img src="http://i.imgur.com/ZnTeRSa.jpg" style="float: left; padding-right: 15px;">
      <ul style="float: left;color: #575e6b;font-size: 17px;line-height: 35px;margin-top: 40px;padding-left: 80px;">
        <li>With HTML you can create your own Web site.&nbsp;<br></li>
        <li>This tutorial teaches you everything about HTML.&nbsp;<br></li>
        <li>HTML is easy to learn - You will enjoy it.<br></li>
      </ul>
      `
      },
      {
        id: guid(),
        title: 'JavaScript',
        name: 'tv1-javascript',
        content: htmlTpl`<div style="text-align: center;"><img src="http://i.imgur.com/hxHhK7v.jpg" width="638"></div>`
      }
    ]);
    localStorage[id] = data;
  }
}

var tabs = new TabsView(document.getElementById('tabsView'),
  {
    hashNav: true,
    beforeInit: setDemoData('tabsView')
  });


document.getElementById('goToTab').addEventListener('click', e=> {
  e.preventDefault();
  var num = document.getElementById('tabNumber').value;
  tabs.goToTab(num);
});

document.getElementById('goToName').addEventListener('click', e=> {
  e.preventDefault();
  let name = document.getElementById('tabName').value;
  tabs.activate(name);
});

//@TODO: demo form validation
document.getElementById('createTab').addEventListener('click', e=> {
  e.preventDefault();
  let name = document.getElementById('createdTabName').value,
    title = document.getElementById('createdTabTitle').value,
    content = document.getElementById('createdTabContent').innerHTML;

  tabs.addTab(title, name, content);
  document.getElementById('createdTabContent').innerHTML = '';
  document.getElementById('addTabForm').reset();
});

new nicEditor({fullPanel: true}).panelInstance('createdTabContent');


new TabsView(document.getElementById('tabsView2'), {hashNav: false});
new TabsView(document.getElementById('tabsView3'), {hashNav: true});
