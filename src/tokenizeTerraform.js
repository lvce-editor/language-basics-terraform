/**
 * @enum number
 */
export const State = {
  TopLevelContent: 1,
  InsideLineComment: 2,
  AfterVariableName: 3,
  AfterAssignmentEqualSign: 4,
  AfterVariableValue: 5,
  AfterKeyword: 6,
  AfterKeywordAndHasSeenWhitespace: 7,
  InsideDoubleQuoteString: 8,
  InsideSingleQuoteString: 9,
  InsideDoubleQuoteStringAfterBackslash: 10,
  InsideSingleQuoteStringAfterBackslash: 11,
}

/**
 * @enum {number}
 */
export const TokenType = {
  Whitespace /* Whitespace */: 0,
  TypeName /* TypeName */: 35,
  PlainText /* Text */: 117,
  Comment /* Comment */: 60,
  String /* String */: 50,
  Numeric /* Numeric */: 30,
  FunctionName /* FunctionName */: 112,
  TypeNamePrimitive /* TypeNamePrimitive */: 36,
  Text /* Text */: 117,
  PunctuationTag /* PunctuationTag */: 228,
  TagName /* TagName */: 118,
  AttributeName /* AttributeName */: 119,
  Punctuation /* Punctuation */: 10,
  Error /* Error */: 141,
  PunctuationString /* PunctuationString */: 11,
  Keyword: /* Keyword */ 951,
  VariableName: /* VariableName */ 952,
  None: 57,
  KeywordExport: 90,
  VariableValueString: 91,
  LanguageConstant: 92,
  VariableValue: 93,
  NewLine: 94,
}

export const TokenMap = {
  [TokenType.Whitespace]: 'Whitespace',
  [TokenType.TypeName]: 'TypeName',
  [TokenType.PlainText]: 'PlainText',
  [TokenType.Comment]: 'Comment',
  [TokenType.String]: 'String',
  [TokenType.Numeric]: 'Numeric',
  [TokenType.FunctionName]: 'FunctionName',
  [TokenType.TypeNamePrimitive]: 'TypeNamePrimitive',
  [TokenType.Text]: 'Text',
  [TokenType.PunctuationTag]: 'PunctuationTag',
  [TokenType.TagName]: 'TagName',
  [TokenType.AttributeName]: 'AttributeName',
  [TokenType.Punctuation]: 'Punctuation',
  [TokenType.Error]: 'Error',
  [TokenType.PunctuationString]: 'PunctuationString',
  [TokenType.Keyword]: 'Keyword',
  [TokenType.None]: 'None',
  [TokenType.KeywordExport]: 'KeywordExport',
  [TokenType.VariableValueString]: 'String',
  [TokenType.LanguageConstant]: 'LanguageConstant',
  [TokenType.VariableValue]: 'String',
  [TokenType.VariableName]: 'JsonPropertyName',
  [TokenType.NewLine]: 'NewLine',
}

const RE_WHITESPACE_NEWLINE = /^\n/
const RE_CURLY_OPEN = /^\{/
const RE_CURLY_CLOSE = /^\}/
const RE_SQUARE_OPEN = /^\[/
const RE_SQUARE_CLOSE = /^\]/
const RE_COMMA = /^,/
const RE_COLON = /^:/
const RE_NUMERIC =
  /^((0(x|X)[0-9a-fA-F]*)|(([0-9]+\.?[0-9]*)|(\.[0-9]+))((e|E)(\+|-)?[0-9]+)?)/

const RE_NEWLINE_WHITESPACE = /^\n\s*/
const RE_BLOCK_COMMENT_START = /^\/\*/
const RE_BLOCK_COMMENT_CONTENT = /^.+(?=\*\/|$)/s
const RE_BLOCK_COMMENT_END = /^\*\//
const RE_UNKNOWN_VALUE = /^[^\}\{\s,"]+/
const RE_IMPORT = /^[a-zA-Z\.]+/
const RE_SEMICOLON = /^;/
const RE_LINE_COMMENT = /^(?:\/\/|#).*/s
const RE_ROUND_OPEN = /^\(/
const RE_ROUND_CLOSE = /^\)/
const RE_DOT = /^\./
const RE_PUNCTUATION = /^[\(\)=\+\-><\.,\/\*\^\[\]\{\}\|:]/
const RE_ANYTHING_UNTIL_END = /^.+/s
const RE_START_OF_FUNCTION = /^( )*\(/
const RE_COLON_COLON = /^::/
const RE_BASH_SLASH = /^\\/
const RE_ANY_CHAR = /^./
const RE_SQUARE_OPEN_SQUARE_OPEN = /^\[\[/
const RE_SQUARE_CLOSE_SQUARE_CLOSE = /^\]\]/
const RE_STRING_MULTILINE_CONTENT = /^.+?(?=\]\]|$)/s
const RE_KEYWORD =
  /^(?:var|type|switch|struct|select|return|range|package|map|interface|import|if|goto|go|func|default|continue|const|chan|case|break)\b/
const RE_TEXT = /^.+/s
const RE_WHITESPACE = /^\s+/
const RE_WHITESPACE_SINGLE_LINE = /^( |\t)+/
const RE_DOUBLE_QUOTE = /^"/
const RE_VARIABLE_NAME = /^[a-zA-Z\_]+/
const RE_EQUAL_SIGN = /^=/
const RE_NUMBER =
  /^\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\.?[0-9]*)|(\.[0-9]+))((e|E)(\+|-)?[0-9]+)?)\b/

const RE_KEYWORD_EXPORT = /^export(?=(\t| ))/
const RE_CONSTANT = /^(true|false|null)(?=\s|$)/i
const RE_VARIABLE_VALUE = /^[^\n"'#]+/
const RE_SINGLE_QUOTE = /^'/
const RE_NEWLINE_AND_WHITESPACE = /^\n\s*/
const RE_BACKSLASH = /^\\/
const RE_EVERYTHING = /^./
const RE_QUOTE_SINGLE = /^'/
const RE_QUOTE_DOUBLE = /^"/
const RE_QUOTE_BACKTICK = /^`/
const RE_STRING_SINGLE_QUOTE_CONTENT = /^[^'\\]+/
const RE_STRING_DOUBLE_QUOTE_CONTENT = /^[^"\\]+/
const RE_STRING_BACKTICK_QUOTE_CONTENT = /^[^`\\\$]+/
const RE_STRING_ESCAPE = /^\\./

export const initialLineState = {
  state: State.TopLevelContent,
}

export const hasArrayReturn = true

/**
 * @param {string} line
 * @param {any} lineState
 */
export const tokenizeLine = (line, lineState) => {
  let next = null
  let index = 0
  let tokens = []
  let token = TokenType.None
  let state = lineState.state
  while (index < line.length) {
    const part = line.slice(index)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_WHITESPACE))) {
          token = TokenType.Whitespace
          state = State.TopLevelContent
        } else if ((next = part.match(RE_LINE_COMMENT))) {
          token = TokenType.Comment
          state = State.TopLevelContent
        } else if ((next = part.match(RE_QUOTE_DOUBLE))) {
          token = TokenType.Punctuation
          state = State.InsideDoubleQuoteString
        } else if ((next = part.match(RE_ANYTHING_UNTIL_END))) {
          token = TokenType.Text
          state = State.TopLevelContent
        } else {
          throw new Error('no')
        }
        break
      case State.InsideDoubleQuoteString:
        if ((next = part.match(RE_QUOTE_DOUBLE))) {
          token = TokenType.Punctuation
          state = State.TopLevelContent
        } else if ((next = part.match(RE_STRING_DOUBLE_QUOTE_CONTENT))) {
          token = TokenType.String
          state = State.InsideDoubleQuoteString
        } else if ((next = part.match(RE_STRING_ESCAPE))) {
          token = TokenType.String
          state = State.InsideDoubleQuoteString
        } else if ((next = part.match(RE_BACKSLASH))) {
          token = TokenType.String
          state = State.InsideDoubleQuoteString
        } else {
          throw new Error('no')
        }
        break
      default:
        throw new Error('no')
    }
    const tokenLength = next[0].length
    index += tokenLength
    tokens.push(token, tokenLength)
  }
  return {
    state,
    tokens,
  }
}
