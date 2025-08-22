import { configure } from "vee-validate";

export default function setupVeeValidate() {
  configure({
    validateOnInput: true,
    validateOnBlur: true,
  });
}
