export const calculate = (expression: string): number => {
  // 移除所有空格
  expression = expression.replace(/\s+/g, "");

  // 將表達式分解為數字和運算符
  const tokens = expression.match(/(\d+\.?\d*)|[+\-*/]/g) || [];

  // 確保格式正確
  if (!tokens.length || !/^\d/.test(expression) || !/\d$/.test(expression)) {
    throw new Error("無效的輸入");
  }

  // 先處理乘除
  let i = 1;
  while (i < tokens.length - 1) {
    if (tokens[i] === "*" || tokens[i] === "/") {
      const num1 = parseFloat(tokens[i - 1]);
      const num2 = parseFloat(tokens[i + 1]);
      
      // 檢查除以零的情況
      if (tokens[i] === "/" && num2 === 0) {
        throw new Error("不能除以零");
      }
      
      const result = tokens[i] === "*" ? num1 * num2 : num1 / num2;
      tokens.splice(i - 1, 3, result.toString());
      i--;
    } else {
      i++;
    }
  }

  // 再處理加減
  let result = parseFloat(tokens[0] ?? "0");
  for (i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const num = parseFloat(tokens[i + 1] ?? "0" );
    result = operator === "+" ? result + num : result - num;
  }

  return result;
};
