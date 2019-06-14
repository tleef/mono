import path from 'path'

export default (template, options, templatePath) => {
  if (options) {
    if (options.output) {
      setOption(template, 'output', options.output);
    }
  }

  let output = template.options && template.options.output;

  if (!output) {
    const parts = path.parse(templatePath);
    output = parts.name;
  }

  setOption(template, 'output', output);

  return template;
}

const setOption = (template, key, value) => {
  if (!template.options) {
    template.options = {};
  }

  template.options[key] = value;
};
