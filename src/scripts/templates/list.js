import html from '../htmlTpl' ;
export default  addr => html`
       <ul class="simple-tabs" id="demo-tabs">
        ${addr.map(addr => html`
          <li data-tab="${addr.name}" data-id="${addr.id}"><span>$${addr.title}</span><i class="edit"></i><i class="close"></i></li>
        `)}
        <li class="addTab"><i class="add"></i></li>
        </ul>
          <div data-pane='info' id="info" class="tab-page">
    <div class="ninety-percent-pad">
      Pork pastrami ground round t-bone. Brisket swine doner rump meatball bacon.
      Shankle tri-tip pork belly jerky venison chicken chuck tongue hamburger andouille kevin.
      Flank frankfurter rump shankle brisket hamburger, shank short ribs pork l oin tail
      andouille swine ribeye leberkas. Pork biltong shank venison, jerky tongue sirloin
      boudin tenderloin corned beef. Short ribs cow ham hock, meatloaf jerky pork chop pork
      belly flank hamburger shoulder filet mignon. Meatloaf tri-tip meatball ribeye.

      <a href="http://baconipsum.com/"><h4>Ipsum courtesy of BaconIpsum.com</h4></a>
    </div>
  </div>
  <div data-pane='images' id="images" class="tab-page">
    <div class="ninety-percent-pad">
      <img src="http://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Schweinebauch-1.jpg/800px-Schweinebauch-1.jpg"
           width="100%" height="auto">
    </div>
  </div>

  <div data-pane='recipes' id="recipes" class="tab-page">
    <div class="ninety-percent-pad">
      <p>Step 1: fry bacon</p>

      <p>Step 2: eat bacon</p>

      <p>Step 3: repeat</p>
    </div>
  </div>
    `;

