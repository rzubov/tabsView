import htmlTabPane from '../utils/htmlTpl' ;


/**
 * Html template of tab pane
 *
 * @return {html}
 */


export default  addr => htmlTabPane`
    <div class="tab-page" data-pane="${addr.name}" id="${addr.id}">
       <i class="edit"></i>
       <i class="save"></i>
       <div class="tab-content">
                ${addr.content || 'Click on edit to set content' }
       </div>
    </div>
`;
