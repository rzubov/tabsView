import htmlTabPane from '../htmlTpl' ;

export default  addr => htmlTabPane`
    <div class="tab-page" data-pane="${addr.name}" id="${addr.id}">
       <i class="edit"></i>
       <h3>$${addr.title}</h3>
       <div class="tab-content">
                ${addr.content || ''}
       </div>
    </div>
`;
