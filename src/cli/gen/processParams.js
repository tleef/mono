'use strict';

import inquirer from 'inquirer';
import chalk from 'chalk';

import validateValue from '../../core/validateValue'

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
              let param = template.params[key];
              let choice = formatChoice(key, param);

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

            if (option != null) {
              choice = `${key} ('${chalk.green(option)}')`
            }

            return {
              name: choice,
              value: `options.${key}`,
              short: key,
            };
          }));
        }

        choices = choices.concat([
          new inquirer.Separator(),
          {
            type: 'separator',
            line: chalk.dim.bold('Menu'),
          },
          new inquirer.Separator()
        ]);

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
        let param = template.params[key];
        return `Edit param ${formatChoice(key, param)}:`;
      },
      validate: (input) => {
        let param = template.params[key];

        let res = validateValue(input, param.type);

        if (!res.valid) {
          return `Please enter a valid ${param.type}`
        }

        return true;
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

        if (option != null) {
          message = `Edit option ${key} ('${chalk.green(option)}'):`
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

const formatValue = (v, type) => {
  if (type === 'string' || type === '?string') {
    v = `'${v}'`
  } else if (type.startsWith('array') || type.startsWith('?array')) {
    v = `[${v.length}]`
  }

  return v;
};

const formatChoice = (key, param) => {
  let choice = key;

  if (param.value != null) {
    let v = formatValue(param.value, param.type);
    choice = `${key} (${chalk.green(v)})`
  } else if (param.default != null) {
    let v = formatValue(param.default, param.type);
    choice = `${key} (${chalk.blue(v)})`
  }

  return choice;
};