'use strict';

import inquirer from 'inquirer';
import chalk from 'chalk';

export default (template) => {
  const listParams = () => {
    const genParamsList = {
      type: 'list',
      name: 'genParamsList',
      message: 'Make selection',
      choices: () => {
        let choices = [];

        if (template.params) {
          const paramKeys = Object.keys(template.params);

          if (paramKeys.length) {
            choices = choices.concat([
              new inquirer.Separator(),
              {
                type: 'separator',
                line: chalk.dim.bold('Params'),
              },
              new inquirer.Separator()
            ]);

            choices = choices.concat(paramKeys.map((key) => {
              let choice = key;
              let param = template.params[key];

              if (param.value !== undefined) {
                choice = `${key} (${chalk.green(param.value)})`
              } else if (param.default !== undefined) {
                choice = `${key} (${chalk.blue(param.default)})`
              }

              return {
                name: choice,
                value: `params.${key}`,
                short: key,
              };
            }));
          }
        }

        if (template.options) {
          const optionKeys = Object.keys(template.options);

          if (optionKeys.length) {
            choices = choices.concat([
              new inquirer.Separator(),
              {
                type: 'separator',
                line: chalk.dim.bold('Options'),
              },
              new inquirer.Separator()
            ]);
          }

          choices = choices.concat(optionKeys.map((key) => {
            let choice = key;
            let option = template.options[key];

            if (option !== undefined) {
              choice = `${key} (${chalk.green(option)})`
            }

            return {
              name: choice,
              value: `options.${key}`,
              short: key,
            };
          }));
        }

        choices.push(new inquirer.Separator());
        choices.push({
          name: 'Done',
          value: '#EXIT#',
          short: 'Done',
        });

        return choices;
      }
    };

    inquirer.prompt(genParamsList).then(answers => {
      const key = answers.genParamsList;

      if (key === '#EXIT#') {
        return;
      }

      let keyParts = key.split('.');

      if (keyParts[0] === 'params') {
        editParam(keyParts[1]);
      } else if (keyParts[0] === 'options') {
        editOption(keyParts[1]);
      }
    });
  };

  const editParam = (key) => {
    const genEditParam = {
      type: 'input',
      name: 'genEditParam',
      message: () => {
        let message = `Edit ${key} param:`;
        let param = template.params[key];

        if (param.value !== undefined) {
          message = `Edit param ${key} (${chalk.green(param.value)}):`
        } else if (param.default !== undefined) {
          message = `Edit param ${key} (${chalk.blue(param.default)}):`
        }

        return message;
      },
    };

    inquirer.prompt(genEditParam).then(answers => {
      template.params[key].value = answers.genEditParam;

      listParams();
    });
  };

  const editOption = (key) => {
    const genEditOption = {
      type: 'input',
      name: 'genEditOption',
      message: () => {
        let message = `Edit ${key} option:`;
        let option = template.options[key];

        if (option !== undefined) {
          message = `Edit option ${key} (${chalk.green(option)}):`
        }

        return message;
      },
    };

    inquirer.prompt(genEditOption).then(answers => {
      template.options[key] = answers.genEditOption;

      listParams();
    });
  };

  const main = () => {
    listParams();
  };

  main();

  return template;
}