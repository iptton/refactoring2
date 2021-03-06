---
marp: true
---

问题：

- 代码组织不清晰，但还在可忍受限度内。
- 程序能正常工作，“不清晰”只是个美学意义上的判断，机器不在乎“好不好看”
- 但，当我们需要修改系统时，就涉及人了。
- 如果很难找到修改点，那就可能犯错，引入 bug 。

> 如果你要给程序添加特性，但发现代码因缺少良好结构而不易于更改，那就先重构使得容易添加特性，再添加特性。

本例中，我们用户希望对系统做更改后，可以添加HTML格式的输出。

-----

- 添加一个参数：isHtml 然后在函数内进行对此进行判断，修改字符串
- 复制一份: 最`"安全"`的作法

-----

重构第一步：让自己即将修改的代码拥有一组可靠的测试

提炼函数执行要点：
- 如果有工具，用工具辅助
- 使用单测保证功能正确
- 每次提炼完毕都跑一次单测
- 如果测试通过，git提交，以便后续回滚
- 接下来需要进行函数内变量改名，比如 thisAmount 改为 result
- 函数参数重命名

提炼变量
- 内联变量，减少局部变量，使提炼函数更容易（play参数）