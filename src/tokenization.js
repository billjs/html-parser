/**
 * html文档分词，返回一份分词表
 * 分词类别
 * 1.空白符：\s, \n, \t, \r, \f
 * 2.尖括号：<、>
 * 3.方括号：[、]
 * 4.叹号：!
 * 5.短横线：-
 * 6.等号：=
 * 7.双引号："
 * 8.单引号：'
 * 9.反斜杠：/
 * 10.标识符：[a-zA-Z_\-]
 * 11.字符串：
 *      双引号内的字符串("test"、"test\"test2")
 *      单引号内的字符串('test'、'test\'test2')
 *      =以后空白符以前未被单/双引号括起来的连续字符串(=test )
 * 12.文本：><内的全部字符
 * 13.注释：<!-- -->内的字符串
 * 14.CDATA：<![CDATA[ ]]>内的全部字符，包括空白符等特殊字符
 * 15.文档声明：<! >以内的字符串
 * @author luoying
 * @since 17/07/02
 */


const WHITESPACE_REG = /[\s\n\r\f\t]/
const IDENTIFIER_REG = /[a-zA-Z_]/
const IDENTIFIER_REG2 = /[a-zA-Z0-9_\-]/


/**
 * 分词
 * @param  {string} str html内容
 * @return {Array}      返回分词表
 */
const tokenize = (source) => {
  if (!source) return []

  let tokens = []

  for (let i = 0; i < source.length; i++) {
    let char = source[i]

    // 命中空白符，分词空白符
    if (WHITESPACE_REG.test(char)) {
      let token = tokenizeWhitespace(i, char, source)
      // 移动遍历指针到空白符之后
      i += token.value.length - 1
      tokens.push(token)
      continue
    }

    // 命中标签open符
    if (char === '<') {
      let nextChar = source[i + 1]
      // 非注释标签，分词出来标签open符
      if (nextChar !== '!') {
        tokens.push({ type: 'angle-bracket', value: char })
      }
      continue
    }

    // 注释标签，可以分词的类型有：注释、CDATA、文档声明
    if (char === '!') {
      let prevChar = source[i - 1]
      if (prevChar !== '<') throwError(char, i)

      let nextChar = source[i + 1]

      // 注释：<!-- -->内的字符串
      if (nextChar === '-') {
        let ts = tokenizeComments(i, char, source)
        i = ts.point
        tokens.push(...ts.tokens)
        continue
      }

      // CDATA：<![CDATA[ ]]>内的全部字符，包括空白符等特殊字符
      if (nextChar === '[') {
        let ts = tokenizeCDATAs(i, char, source)
        i = ts.point
        tokens.push(...ts.tokens)
        continue
      }

      // 文档声明：<! >以内的字符串
      let ts = tokenizeDocDeclarations(i, char, source)
      i = ts.point
      tokens.push(...ts.tokens)
      continue
    }

    // 命中标签close符
    if (char === '>') {
      tokens.push({ type: 'angle-bracket', value: char })
      let nextChar = source[i + 1]
      // >之后到<之前，紧跟着的是一串文本
      if (nextChar === '<') {
        // 确定是文本，分词文本
        let token = tokenizeText(i + 1, source)
        i += token.value.length
        tokens.push(token)
      }
      continue
    }

    if (char === '[' || char === ']') {
      tokens.push({ type: 'square-bracket', value: char })
      continue
    }

    // 命中单双引号，分词引号和字符串
    if (char === '"' || char === '\'') {
      // 开始引号
      tokens.push({ type: 'quote', value: char })
      let token = tokenizeString(i + 1, '', char, source)
      i += token.value.length
      tokens.push(token)
      // 闭合引号
      let quote = source[++i]
      tokens.push({ type: 'quote', value: quote })
      continue
    }

    if (char === '-') {
      tokens.push({ type: 'connector', value: char })
      continue
    }

    // 命中等号，分词等号和字符串（未被引号括起来的字符串）
    if (char === '=') {
      tokens.push({ type: 'equal-mark', value: char })

      let nextChar = source[i + 1]
      if (nextChar !== '"' && nextChar !== '\'') {
        // =以后是字符串（遇到空白符为止）
        let token = tokenizeString(i + 1, '', WHITESPACE_REG, source)
        i += token.value.length
        tokens.push(token)
      }
      continue
    }

    // 命中反斜杠
    if (char === '/') {
      tokens.push({ type: 'back-slant', value: char })
      continue
    }

    // 合法标识符开头（字母和_开头）
    if (IDENTIFIER_REG.test(char)) {
      // 分词出来合法标识符
      let token = tokenizeIdentifier(i, char, source)

      // 前一个分词
      // let prevToken = tokens[tokens.length - 1]
      //
      // if (prevToken.value === '<' || prevToken.value === '/') {
      //   // 若前一个分词是<或/，表示此标识符是标签名
      //   // 1.<后的合法标识符(<a 、<my-test 、<a>、<my-test>)
      //   // 2.</>内的合法标识符(</a>、</my-test>)
      //   token.type = 'tag-name'
      // } else if (prevToken.type === 'whitespace') {
      //   // 若前一个分词是空白符，表示此标识符是属性名
      //   // 1.空白符以后=以前的合法标识符( title=、 data-test=)
      //   // 2.前后空白符围绕的合法标识符( disabled 、 data-disabled )
      //   token.type = 'attribute-name'
      // } else {
      //   // 不能识别的标识符，分词出错
      //   throwError(token.value, i)
      // }

      // 移动遍历指针到标识符之后
      i += token.value.length - 1
      tokens.push(token)
      continue
    }

    // 不能识别的字符，分词出错
    throwError(char, i)
  }

  return tokens
}

const throwError = (chars, point) => {
  throw new Error(`tokenize error for \`${chars}\` at: ${point}`)
}

// 空白符分词
// 连续的空白符组合在一起
const tokenizeWhitespace = (start, startChar, source) => {
  let token = {
    type: 'whitespace',
    value: startChar
  }
  for (let i = start + 1; i < source.length; i++) {
    let char = source[i]
    if (WHITESPACE_REG.test(char)) {
      token.value += char
      continue
    }
    break
  }
  return token
}

// 标识符分词
// 连续的字母、数字、_、-组合在一起
const tokenizeIdentifier = (start, startChar, source) => {
  let token = {
    type: 'identifier',
    value: startChar
  }
  for (let i = start + 1; i < source.length; i++) {
    let char = source[i]
    if (IDENTIFIER_REG2.test(char)) {
      token.value += char
      continue
    }
    break
  }
  return token
}

// 字符串分词
// 1.成对单引号或双引号包起来的字符串内容
// 2.=以后空白符以前未被单/双引号括起来的连续字符串
// 遇到转义的单/双引号，不处理
const tokenizeString = (start, startChar, closer, source) => {
  let token = {
    type: 'string',
    value: startChar
  }
  let isRegCloser = Object.prototype.toString.call(closer) === '[object RegExp]'
  let escaped = false
  for (let i = start; i < source.length; i++) {
    let char = source[i]
    if (escaped) {
      escaped = false
    } else if (char === '\\') {
      escaped = true
    } else if (isRegCloser ? closer.test(char) : char === closer) {
      break
    }
    token.value += char
  }
  return token
}

// 属性值分词
// 1.单引号内的字符串('test'、'test\'test2')
// 2.双引号内的字符串("test"、"test\"test2")
// 3.=以后空白符以前未被单/双引号括起来的连续字符串(=test )
/*const tokenizeAttributeValue = (current, currentChar, str) => {
  let token = {
    type: 'attribute-value',
    value: ''
  }

  // 单/双引号包起来的属性值
  if (currentChar === '"' || currentChar === '\'') {
    let t = tokenizeString(current, currentChar, str)
    token.value = t.value
    return token
  }

  token.value += currentChar

  for (let i = current + 1; i < str.length; i++) {
    let char = str.charAt(i)
    if (!WHITESPACE_REG.test(char)) {
      token.value += char
      continue
    }
    break
  }

  return token
}*/

// 注释分词
// <!-- -->内的字符串
const tokenizeComments = (start, startChar, source) => {
  let tokens = []
  let point = start - 1

  let commentStart = source.substr(point, 4)
  // 不能匹配<!--注释开始标识，分词出错
  if (commentStart !== '<!--') throwError(startChar, point)

  tokens.push({ type: 'comment-start', value: commentStart })
  point += commentStart.length

  let token = { type: 'comment', value: '' }
  tokens.push(token)

  let end = false
  for (point; point < source.length; point++) {
    let char = source[point]
    if (char === '-') {
      let commentEnd = source.substr(point, 3)
      if (commentEnd === '-->') {
        end = true
        break
      }
    }
    token.value += char
  }

  // 无-->注释结束标识，则分词出错
  if (!end) throwError(token.value, point)
  tokens.push({ type: 'comment-end', value: '-->' })
  point += 3

  return { tokens, point }
}

// CDATA分词
// <![CDATA[ ]]>内的全部字符，包括空白符等特殊字符
const tokenizeCDATAs = (start, startChar, source) => {
  let tokens = []
  let point = start - 1

  let cdataStart = source.substr(point, 9)
  if (cdataStart !== '<![CDATA[') throwError(cdataStart, point)

  tokens.push({ type: 'cdata-start', value: cdataStart })
  point += cdataStart.length

  let token = { type: 'cdata', value: '' }
  tokens.push(token)

  let end = false
  for (point; point < source.length; point++) {
    let char = source[point]
    if (char === ']') {
      let cdataEnd = source.substr(point, 3)
      if (cdataEnd === ']]>') {
        end = true
        break
      }
    }
    token.value += char
  }

  if (!end) throwError(token.value, point)
  tokens.push({ type: 'cdata-end', value: ']]>'})
  point += 3

  return { tokens, point }
}

// 文档声明分词
// <! >以内的字符串
const tokenizeDocDeclarations = (start, startChar, source) => {
  let tokens = []
  let point = start - 1

  let declarationStart = source.substr(point, 2)
  if (declarationStart !== '<!') throwError(declarationStart, point)

  tokens.push({ type: 'doc-declaration-start', value: declarationStart })
  point += declarationStart.length

  let token = { type: 'doc-declaration', value: '' }
  tokens.push(token)

  let end = false
  for (point; point < source.length; point++) {
    let char = source[point]
    if (char !== '>') {
      token.value += char
    } else {
      end = true
      break
    }
  }

  if (!end) throwError(token.value, point)
  tokens.push({ type: 'doc-declaration-end', value: '>' })

  return { tokens, point }
}

// 文本分词
// ><内的字符串
const tokenizeText = (start, source) => {
  let token = { type: 'text', value: '' }
  for (start; start < source.length; start++) {
    let char = source[start]
    if (char !== '<') {
      token.value += char
      continue
    }
    break
  }
  return token
}


exports.tokenize = tokenize
