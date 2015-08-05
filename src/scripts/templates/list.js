import htmlList from '../utils/htmlTpl' ;
import htmlTab from './tab'
import htmlTabPane from './tabPane'


/**
 * Html template of tabs
 *
 * @return {html}
 */


export default  addr => htmlList`
        <div class="tabNavSection">
        <div class="container">
          <ul class="tabNav">
            ${addr.map(addr => htmlList`
            ${htmlTab(addr)}
            `)}
            <li class="addTab"></li>
          </ul>
        </div>
        </div>
        <div class="tabPanes container">
          ${addr.map(addr => htmlList`
          ${htmlTabPane(addr)}
          `)}
        </div>
    `;
