'use strict';

import inquirer from 'inquirer';
import chalk from 'chalk';

import validateValue from '../../core/validateValue'

export default async (template) => {
  const listParams = async () => {
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
              let choice = formatChoice(key, param.value, param.default, param.type);

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
            let option = template.options[key];
            let choice = formatChoice(key, option, null, '?string');

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

    await inquirer.prompt(genParamsList).then(async (answers) => {
      const key = answers.genParamsList;

      if (key === '#EXIT#') {
        return;
      }

      let keyParts = key.split('.');

      if (keyParts[0] === 'params') {
        await editParam(keyParts[1]);
      } else if (keyParts[0] === 'options') {
        await editOption(keyParts[1]);
      }
    });
  };

  const editParam = async (key) => {
    const genEditParam = {
      type: 'input',
      name: 'genEditParam',
      message: () => {
        let param = template.params[key];
        return `Edit param ${formatChoice(key, param.value, param.default, param.type)}:`;
      },
      validate: (input) => {
        let param = template.params[key];

        let res = validateParam(input, param.type);

        if (!res.valid) {
          return `Please enter a valid ${param.type}`
        }

        return true;
      },
    };

    await inquirer.prompt(genEditParam).then(async (answers) => {
      let param = template.params[key];
      let res = validateParam(answers.genEditParam, param.type);

      template.params[key].value = res.value;

      await listParams();
    });
  };

  const editOption = async (key) => {
    const genEditOption = {
      type: 'input',
      name: 'genEditOption',
      message: () => {
        let option = template.options[key];
        return `Edit option ${formatChoice(key, option, null, '?string')}:`;
      },
    };

    await inquirer.prompt(genEditOption).then(async (answers) => {
      let res = validateParam(answers.genEditOption, '?string');

      template.options[key] = res.value;

      await listParams();
    });
  };

  const main = async () => {
    await listParams();
  };

  await main();

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

const formatChoice = (key, value, defaultValue, type) => {
  let required = type.startsWith('?') ? '': chalk.red('*');
  let choice = `${key}${required}`;

  if (value != null) {
    let v = formatValue(value, type);
    choice = `${choice} (${chalk.green(v)})`
  } else if (defaultValue != null) {
    let v = formatValue(defaultValue, type);
    choice = `${choice} (${chalk.blue(v)})`
  }

  return choice;
};

const validateParam = (input, type) => {
  if (input === '') {
    input = null;
  }

  return validateValue(input, type);
};