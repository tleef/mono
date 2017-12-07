export default (options, template) => {
  if (options) {
    if (options.output) {
      setOption(template, 'output', options.output);
    }
  }

  return template;
}

const setOption = (template, key, value) => {
  if (!template.options) {
    template.options = {};
  }

  template.options[key] = value;
};
