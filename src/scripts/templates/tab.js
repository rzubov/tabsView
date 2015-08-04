import htmlTab from '../utils/htmlTpl' ;

/**
 * Html template of tab
 *
 * @return {html}
 */

export default  addr => htmlTab`
  <li draggable="true" data-tab="${addr.name}" data-id="${addr.id}"><span>$${addr.title}</span><i class="edit"></i><i class="close"></i></li>
`;
