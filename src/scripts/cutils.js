/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
export function merge_options(obj1, obj2) {
  var obj3 = {};
  for (let attrname in obj1) {
    obj3[attrname] = obj1[attrname];
  }
  for (let attrname in obj2) {
    obj3[attrname] = obj2[attrname];
  }
  return obj3;
}
export function getAllElementsWithAttribute(attribute, value) {
  var matchingElements =[];
  var allElements = document.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    if (allElements[i].getAttribute(attribute) === value) {
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }else if(!value&&allElements[i].getAttribute(attribute)){
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
}
