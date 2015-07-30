import htmlTab from '../htmlTpl' ;

export default  addr => htmlTab`
  <li data-tab="${addr.name}" data-id="${addr.id}"><span>$${addr.title}</span><i class="edit"></i><i class="close"></i></li>
`;
