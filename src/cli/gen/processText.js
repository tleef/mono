import writeFile from "../../core/writeFile";
import generateText from "../../core/generateText";

export default (template, options) => {
  const text = generateText(template);

  if (options.preview) {
    console.log(text);
  } else {
    let output = template.options && template.options.output;

    writeFile(output, text);
  }
}