import TabsView from "./classTabsView";
import guid from "./utils/guid";
import htmlTpl from "./htmlTpl"

//set demo content;
var data = JSON.stringify([
  {
    id: guid(), title: 'Info', name: 'info', content: htmlTpl`Pork pastrami ground round t-bone. Brisket swine doner rump meatball bacon.
  Shankle tri-tip pork belly jerky venison chicken chuck tongue hamburger andouille kevin.
  Flank frankfurter rump shankle brisket hamburger, shank short ribs pork l oin tail
andouille swine ribeye leberkas. Pork biltong shank venison, jerky tongue sirloin
boudin tenderloin corned beef. Short ribs cow ham hock, meatloaf jerky pork chop pork
belly flank hamburger shoulder filet mignon. Meatloaf tri-tip meatball ribeye.

<a href="http://baconipsum.com/"><h4>Ipsum courtesy of BaconIpsum.com</h4></a>`
  },
  {id: guid(), title: 'Images', name: 'images'},
  {id: guid(), title: 'Recipes', name: 'recipes'}
]);

if (!localStorage['tabs-container']) {
  localStorage['tabs-container'] = data;
}
var tabs = new TabsView(document.getElementById('tabs-container'), {hashNav: true});
document.getElementById('goToTab').addEventListener('click', e=> {
  e.preventDefault();
  var num =document.getElementById('tabNumber').value;
  tabs.goToTab(num);
});

/*var tabs2 = new TabsView(document.getElementById('tabs-container2'), {hashNav: true});

 document.getElementById('goToSlide').addEventListener('click', e=> {
 e.preventDefault();
 tabs.goToTab('images')
 });*/
