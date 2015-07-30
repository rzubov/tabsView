import htmlList from '../htmlTpl' ;
import htmlTab from './tab'
import htmlTabPane from './tabPane'

export default  addr => htmlList`
       <ul class="tabNav">
        ${addr.map(addr => htmlList`
          ${htmlTab(addr)}
        `)}
        <li class="addTab"><i class="add"></i></li>
        </ul>
        <div class="tabPanes">
          ${addr.map(addr => htmlList`
           ${htmlTabPane(addr)}
           `)}
        </div>
    `;
