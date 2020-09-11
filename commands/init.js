'use strict'
const exec = require('child_process').exec
const co = require('co')
const config = require('../template')
const chalk = require('chalk');
const ora = require('ora')
const inquirer = require('inquirer')
const tplNames = Object.keys(config.tpl);

module.exports = () => {
  co(function* () {
    let promptList = [
      {
        type: 'list',
        message: '请选择模版',
        name: 'tplName',
        choices: tplNames
      },
      {
        type: 'input',
        message: '请输入项目名字',
        name: 'projectName',
        validate (val) {
          if (val !== '') {
            return true
          }
          return '项目名称不能为空'
        }
      }
    ]

    inquirer.prompt(promptList).then(answers => {
      let ind = config.tpl[answers.tplName]
      let gitUrl = `${ind.url}`
      // git命令，远程拉取项目并自定义项目名
      let cmdStr = `git clone ${gitUrl} ${answers.projectName} && cd ${answers.projectName} && git checkout ${ind.branch}`
      let spinner = ora('\n Start generating...');
      spinner.start();
      exec(cmdStr, (error, stdout, stderr) => {
        spinner.stop();
        if (error) {
          console.log(error)
          process.exit()
        }
        console.log(chalk.green('\n √ Generation completed!'))
        console.log(`\n cd ${answers.projectName} && npm install \n`)
        process.exit()
      })
    })

  })
}