interface IResultProps {
  result: boolean;
  errors: string[];
}

export class PasswordValidator {
  private SPECIALCHARS = ["!", "@", "#", "%", "$", "&", "*", "^", "~", "?"];
  private PASSWORD_MIN_LENGTH = 16;
  private PASSWORD_MAX_LENGTH = 32;
  private splittedPassword: string[] = [];
  private ascii: number[] = [];
  private resultObj: IResultProps = { result: true, errors: [] };

  constructor(private readonly password: string) {
    this.splitPassword();
    this.ascii = this.toAscci(this.splittedPassword);
  }

  checkSize(): boolean {
    return (
      this.password.length >= this.PASSWORD_MIN_LENGTH &&
      this.password.length <= this.PASSWORD_MAX_LENGTH
    );
  }

  splitPassword(): void {
    this.splittedPassword = this.password.split("");
  }

  checkSpecialCharacters(): boolean {
    const specialCharacters = this.splittedPassword.reduce((specials, char) => {
      if (this.SPECIALCHARS.includes(char)) specials++;
      return specials;
    }, 0);

    return specialCharacters >= 2;
  }

  toAscci(password: string[]): number[] {
    return password.map((char) => char.charCodeAt(0));
  }

  checkUpperAndLower(): boolean {
    let upper = this.ascii.reduce((upper, num) => {
      const isUpperCase = num >= 65 && num <= 90;
      if (isUpperCase) upper++;
      return upper;
    }, 0);

    let lower = this.ascii.reduce((lower, num) => {
      const isLowerCase = num >= 97 && num <= 122;
      if (isLowerCase) lower++;
      return lower;
    }, 0);

    const hasUpperAndLower = upper !== 0 && lower !== 0;
    return hasUpperAndLower;
  }

  checkSequence(): boolean {
    const formattedPass = this.splittedPassword.map((char) =>
      char.toLowerCase()
    );

    const ascii = this.toAscci(formattedPass);

    const sequences = ascii.reduce((acc, curr, idx) => {
      const middle = ascii[idx + 1];
      const last = ascii[idx + 2];
      if (middle === curr + 1 && last === curr + 2) acc++;
      return acc;
    }, 0);
    return sequences > 0;
  }

  validate() {
    const sizeIsValid = this.checkSize();
    if (!sizeIsValid) {
      this.resultObj.result = false;
      this.resultObj.errors.push("Invalid size!");
    }

    const hasSpecialChars = this.checkSpecialCharacters();
    if (!hasSpecialChars)
      this.resultObj.errors.push("Missing special characters!");

    const hasUpperAndLower = this.checkUpperAndLower();
    if (!hasUpperAndLower) {
      this.resultObj.result = false;
      this.resultObj.errors.push(
        "Password must have upper and lower characters!"
      );
    }

    const hasSequence = this.checkSequence();
    if (hasSequence) {
      this.resultObj.result = false;
      this.resultObj.errors.push("Password can't have sequence characters!");
    }
    return this.resultObj;
  }
}
const pass = "@34$dg34103fap013jalA10248";
const passwordValidator = new PasswordValidator(pass);
console.log(passwordValidator.validate());
