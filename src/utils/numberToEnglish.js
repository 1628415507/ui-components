/*
 * @Description: 数字转英文写法
 * @Date: 2025-01-06 14:05:57
 * @LastEditTime: 2025-01-06 15:52:45
 */
const tally = {
  singleEn: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
  tenEn: ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
  dozensEn: ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
  overHundred: ['hundred', 'thousand', 'million', 'billion', 'trillion', 'quadrillion']
}

//转换千分位显示，例：1000000 = 1,000,000
function toThousands(num) {
  num = (num || 0).toString()
  let result = ''
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result
    num = num.slice(0, num.length - 3)
  }
  if (num) {
    result = num + result
  }
  return result
}

//转换整数部分
function convertInteger(n) {
  try {
    let splitNum = toThousands(n).split(',')
    console.log('【 splitNum 】-33', splitNum)
    let result = ''
    for (let i = 0; i < splitNum.length; i++) {
      //如果是 0百 则不显示
      let hundredFlag = false
      if (splitNum[i].length == 3) {
        if (splitNum[i].substring(0, 1) !== '0') {
          hundredFlag = true
          result += tally.singleEn[splitNum[i].substring(0, 1)] + ' ' //百位
          result += tally.overHundred[0]
        }
        if (doubleDight(splitNum[i].substring(1)) != '') {
          hundredFlag = true
          result += ' and ' + doubleDight(splitNum[i].substring(1))
        }
      } else if (splitNum[i].length == 2) {
        hundredFlag = true
        result += doubleDight(splitNum[i]) //十位
      } else if (splitNum[i].length == 1) {
        hundredFlag = true
        result += tally.singleEn[splitNum[i]] //个位
      }
      //添加千分位单位（数字超过1000，每三位数字分配一个单位）
      if (hundredFlag) {
        if (i < splitNum.length - 1) {
          result += ' ' + tally.overHundred[splitNum.length - 1 - i] + ' '
        }
      }
    }
    return result
  } catch (ex) {
    console.error(ex)
  }
}
//转换小数部分
function convertDecimal(n) {
  let decimalList = n.split('')
  let result = ''
  for (let item of decimalList) {
    result += convertInteger(item) + ' '
  }
  return result
}
//组合两位数
function doubleDight(n) {
  let result = ''
  if (parseInt(n) != 0) {
    let dd = n.split('')
    if (dd[0] < 1) {
      result = tally.singleEn[dd[1]]
    } else if (dd[0] == 1) {
      result = tally.tenEn[dd[1]]
    } else {
      if (dd[1] == '0') {
        result = tally.dozensEn[dd[0] - 2]
      } else {
        result = tally.dozensEn[dd[0] - 2] + '-' + tally.singleEn[dd[1]]
      }
    }
  }
  return result
}
function toEnglish(n) {
  let regxInteger = /^([0-9]{1,}([.][0-9]*)?)$/
  if (!regxInteger.test(parseInt(n))) {
    console.error('toEnglish：传入值必须是数值类型')
    return 'Error：Must in digital format'
  }

  // 分割整数和小数（如果有小数的话）
  let splitNumList = n.toString().split('.')
  let integerNum = convertInteger(splitNumList[0]) //整数部分
  let decimalNum = '' //小数部分
  // 如果分割长度是2，说明有小数
  if (splitNumList.length == 2) {
    if (splitNumList[1].length <= 2) {
      decimalNum = convertDecimal(splitNumList[1])
    } else {
      return n // 如果小数超过2位，不转换，返回原数据
    }
  }
  //返回转换结果
  return integerNum + (decimalNum == '' ? '' : ' point ' + decimalNum)
}
export default { toEnglish }
