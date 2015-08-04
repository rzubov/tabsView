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


/**
 * Search in object by id
 *
 * @param {array} source
 * @param {number} id
 * @return {number} index
 * */
export function findById(source, id) {
  for (let i = 0; i < source.length; i++) {
    if (source[i].id == id) {
      return i;
    }
  }
  return -1;
}


/**
 * Search in hash string  by parameter name
 *
 * @return {string} hash vars
 * */

export function getHashVars() {
  var vars = {};
  var parts = document.location.hash.replace(/[#&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value;
    });
  return vars;
}

