/**
 * html文档解析，返回一棵AST
 * 解析内容：
 * 1.标签（包含嵌套）
 * 2.普通属性名
 * 3.普通属性值
 * 4.事件属性
 * 5.事件代码
 * 6.内嵌样式
 * 7.内嵌脚本
 * 8.自定义标签
 *
 * 11.标签名：
 *      <后的合法标识符(<a 、<my-test 、<a>、<my-test>)
 *      </>内的合法标识符(</a>、</my-test>)
 * 12.属性名：
 *      空白符以后=以前的合法标识符( title=、 data-test=)
 *      前后空白符围绕的合法标识符( disabled 、 data-disabled )
 * 13.属性值：
 *      双引号内的字符串("test"、"test\"test2")
 *      单引号内的字符串('test'、'test\'test2')
 *      =以后空白符以前未被单/双引号括起来的连续字符串(=test )
 * @author luoying
 * @since 17/07/02
 */

const tokenization = require('./tokenization')

const parse = (str) => {
  let tokens = tokenization.tokenize(str)
  return tokens
}

exports.parse = parse
