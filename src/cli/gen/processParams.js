'use strict';

import inquirer from 'inquirer';
import chalk from 'chalk';

import validateValue from '../../core/validateValue'
import T from '../../core/T'

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
            let choice = formatChoice(key, option, null, T.optionalString);

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
      const asnwer = answers.genParamsList;

      if (asnwer === '#EXIT#') {
        return;
      }

      let asnwerParts = asnwer.split('.');

      if (asnwerParts[0] === 'params') {
        await editParam(asnwerParts[1]);
      } else if (asnwerParts[0] === 'options') {
        await editOption(asnwerParts[1]);
      }
    });
  };

  const editParam = async (key) => {
    let param = template.params[key];
    if (T.is(T.array, param.type)) {
      await editArrayParam(key);
      return;
    }

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

  const editArrayParam = async (key) => {
    const genEditArrayParam = {
      type: 'list',
      name: 'genEditArrayParam',
      message: () => {
        let param = template.params[key];
        return `Edit param ${formatChoice(key, param.value, param.default, param.type)}:`;
      },
      choices: () => {
        let param = template.params[key];
        let choices = [];
        let arr = param.value || param.default || [];

        choices = choices.concat([
          new inquirer.Separator(),
          {
            type: 'separator',
            line: chalk.dim.bold('Values'),
          },
          new inquirer.Separator()
        ]);

        if (arr.length) {
          choices = choices.concat(arr.map((v, i) => {
            return {
              name: String(v),
              value: i,
              short: String(v),
            }
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

        choices.push(
          {
            name: 'Done',
            value: '#EXIT#',
            short: 'Done',
          },
          {
            name: 'Add',
            value: '#ADD#',
            short: 'Add',
          },
          {
            name: 'Delete',
            value: '#DELETE#',
            short: 'Delete',
          }
        );

        return choices;
      }
    };

    await inquirer.prompt(genEditArrayParam).then(async (answers) => {
      const answer = answers.genEditArrayParam;

      if (answer === '#EXIT#') {
        await listParams();
        return;
      }

      if (answer === '#DELETE#') {
        await deleteArrayParamIndex(key);
        return;
      }

      if (answer === '#ADD#') {

      }

      await editArrayParamIndex(key, answer);
    });
  };

  const editArrayParamIndex = async (key, i) => {
    const genEditArrayParamIndex = {
      type: 'input',
      name: 'genEditArrayParamIndex',
      message: () => {
        let param = template.params[key];
        let value = param.value && param.value[i];
        let defaultValue = param.default && param.default[i];
        let type = T.getArrayType(param.type);

        return `Edit index ${formatChoice(i, value, defaultValue, type)}:`;
      },
      validate: (input) => {
        let param = template.params[key];
        let type = T.getArrayType(param.type);

        let res = validateParam(input, type);

        if (!res.valid) {
          return `Please enter a valid ${type}`
        }

        return true;
      },
    };

    await inquirer.prompt(genEditArrayParamIndex).then(async (answers) => {
      let param = template.params[key];
      let type = T.getArrayType(param.type);
      let arr = param.value || param.default || [];

      let res = validateParam(answers.genEditArrayParamIndex, type);
      arr[i] = res.value;

      template.params[key].value = arr;

      await editArrayParam(key);
    });
  };

  const deleteArrayParamIndex = async (key) => {
    const genDeleteArrayParamIndex = {
      type: 'checkbox',
      name: 'genDeleteArrayParamIndex',
      message: 'Delete index(s):',
      choices: () => {
        let param = template.params[key];
        let choices = [];
        let arr = param.value || param.default || [];

        choices = choices.concat([
          new inquirer.Separator(),
          {
            type: 'separator',
            line: chalk.dim.bold('Values'),
          },
          new inquirer.Separator()
        ]);

        if (arr.length) {
          choices = choices.concat(arr.map((v, i) => {
            return {
              name: String(v),
              value: i,
              short: String(v),
            }
          }));
        }

        return choices;
      }
    };

    await inquirer.prompt(genDeleteArrayParamIndex).then(async (answers) => {
      let delIndexes = answers.genDeleteArrayParamIndex || [];

      if (delIndexes.length) {
        let param = template.params[key];
        let arr = param.value || param.default || [];

        delIndexes.forEach((i) => {
          arr.splice(i, 1);
        });

        template.params[key].value = arr;
      }

      await editArrayParam(key);
    });
  };

  const editOption = async (key) => {
    const genEditOption = {
      type: 'input',
      name: 'genEditOption',
      message: () => {
        let option = template.options[key];
        return `Edit option ${formatChoice(key, option, null, T.optionalString)}:`;
      },
    };

    await inquirer.prompt(genEditOption).then(async (answers) => {
      let res = validateParam(answers.genEditOption, T.optionalString);

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
  if (T.is(T.string, type)) {
    v = `'${v}'`
  } else if (T.is(T.array, type)) {
    v = `[${v.length}]`
  }

  return v;
};

const formatChoice = (key, value, defaultValue, type) => {
  let required = T.is('optional', type) ? '': chalk.red('*');
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