/**
 * 获取当前页面的信息
 */

/**
 * 获取当前页面 路由地址
 */
const getIndexPage=function(){
    let arr=getCurrentPages();
    return arr[arr.length-1]?arr[arr.length-1].__route__:"";
}

module.exports = {
  getIndexPage
}