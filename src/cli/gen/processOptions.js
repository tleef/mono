export default (options, template) => {
  if (options) {
    if (options.output) {
      template.options.output = options.output;
    }
  }

  return template;
}