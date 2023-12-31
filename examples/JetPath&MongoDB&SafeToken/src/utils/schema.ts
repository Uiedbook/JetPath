export class schema {
  additionalProperties: boolean;
  schema:
    | Record<
        string,
        {
          err?: string | undefined;
          type?: string | number | object | undefined;
          maxLength?: number | undefined;
          minLength?: number | undefined;
          mustInclude?: string | string[] | undefined;
          mustNotBeLesserThan?: number | undefined;
          mustNotBeGreaterThan?: number | undefined;
          nullable?: boolean | undefined;
          RegExp?: RegExp | undefined;
          validator?: ((value: any) => boolean) | undefined;
        }
      >
    | { additionalProps?: boolean | undefined };
  constructor(
    schema:
      | Record<
          string,
          {
            err?: string;
            type?: string | number | object;
            maxLength?: number;
            minLength?: number;
            mustInclude?: string | string[];
            mustNotBeLesserThan?: number;
            mustNotBeGreaterThan?: number;
            nullable?: boolean;
            RegExp?: RegExp;
            validator?: (value: any) => boolean;
          }
        >
      | { additionalProps?: boolean }
  ) {
    if (!(typeof schema === "object" && !Array.isArray(schema))) {
      throw new Error("Given data scheme is invalid  " + schema);
    }
    if (typeof schema.additionalProps === "boolean") {
      this.additionalProperties = schema.additionalProps;
      delete schema.additionalProps;
    } else {
      this.additionalProperties = true;
    }
    this.schema = schema;
  }
  /**
   * @param {Record<string, Record<string, any>>} data
   */
  async validateData(data: any) {
    // @ts-ignore
    if (typeof data === "string" && data.includes("{")) {
      data = JSON.parse(data);
    }
    if (!(typeof data === "object" && !Array.isArray(data))) {
      throw new Error("Given data is invalid " + data);
    }
    for (const [prop, value] of Object.entries(this.schema)) {
      const {
        err,
        type,
        maxLength,
        minLength,
        mustInclude,
        mustNotBeLesserThan,
        mustNotBeGreaterThan,
        nullable,
        RegExp,
        validator,
      } = value;

      if (!data[prop] && nullable) {
        continue;
      }
      if (!data[prop] && !nullable) {
        console.log({data});
        if (err) {
          throw new Error(err);
        }
        throw new Error(` ${prop} is needed`);
      }
      if (typeof data[prop] !== "undefined") {
        if (validator && !validator(data[prop])) {
          if (err) {
            throw new Error(err);
          }
          throw new Error(` ${prop} must is invalid`);
        }
        // @ts-ignore
        if (typeof RegExp === "object" && !RegExp.test(data[prop])) {
          if (err) {
            throw new Error(err);
          }
          throw new Error(` ${prop} must is invalid`);
        }
        if (mustNotBeGreaterThan && Number(data[prop]) > mustNotBeGreaterThan) {
          if (err) {
            throw new Error(err);
          }
          throw new Error(
            ` ${prop} must not be greater than ${mustNotBeGreaterThan}`
          );
        }
        if (
          typeof data[prop] === "string" &&
          data[prop].trim() === "" &&
          nullable
        ) {
          if (err) {
            throw new Error(err);
          }
          throw new Error(` ${prop} cannot be empty `);
        }
        if (mustNotBeLesserThan && Number(data[prop]) < mustNotBeLesserThan) {
          if (err) {
            throw new Error(err);
          }
          throw new Error(
            `Given ${prop} must not be lesser than ${mustNotBeLesserThan}`
          );
        }
        if (typeof type === "string" && typeof data[prop] !== type) {
          if (err) {
            throw new Error(err);
          }
          throw new Error(
            // @ts-ignore
            ` ${prop} type is invalid ${data[prop]} expect ${this.schema[prop].type}`
          );
        } else {
          if (
            typeof type === "function" &&
            (!type(data[prop]) || typeof type(data[prop]) !== typeof type())
          ) {
            if (err) {
              throw new Error(err);
            }
            throw new Error(` ${prop} type is invalid ${data[prop]}`);
          }
        }
        if (
          maxLength &&
          typeof data[prop] === "string" &&
          data[prop].length > maxLength
        ) {
          if (err) {
            throw new Error(err);
          }
          throw new Error(` ${prop} length is greater than the one required `);
        }
        if (
          minLength &&
          typeof data[prop] === "string" &&
          data[prop].length < minLength
        ) {
          if (err) {
            throw new Error(err);
          }
          throw new Error(` ${prop} length is lesser than the one required `);
        }
        if (
          mustInclude &&
          !Array.isArray(mustInclude) &&
          typeof data[prop] === "string" &&
          !data[prop].includes(mustInclude)
        ) {
          if (err) {
            throw new Error(err);
          }
          throw new Error(`invalid ${prop}, does not includes ${mustInclude}`);
        }
        if (
          mustInclude &&
          Array.isArray(mustInclude) &&
          typeof data[prop] === "string"
        ) {
          let count = 0;
          for (let i = 0; i < mustInclude.length; i++) {
            if (data[prop].includes(mustInclude[i])) {
              count++;
            }
          }
          if (count > 0) {
            continue;
          }
          if (err) {
            throw new Error(err);
          }
          throw new Error(
            ` ${prop} does not includes ${[[...mustInclude].join(" , ")]}`
          );
        }
      } else {
        // additional prop
        if (!this.additionalProperties) {
          throw new Error(`value ${prop} is not needed`);
        }
      }
    }
  }
}

export function ancient(timestamp1 = new Date().toString()) {
  return {
    diff(timestamp2: string | number | Date) {
      const date1 = new Date(timestamp1);
      const date2 = new Date(timestamp2);
      // @ts-ignore
      const diffMilliseconds = Math.abs(date1 - date2);
      const diffSeconds = Math.floor(diffMilliseconds / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      const diffMonths = Math.floor(diffDays / 30);
      return {
        minutes: diffMinutes % 60,
        hours: diffHours % 24,
        day: diffDays % 30,
        month: diffMonths,
      };
    },
  };
}
export const put = (fro: any, to: any) => {
  for (const [k, v] of Object.entries(fro)) {
    if (Object.prototype.hasOwnProperty.call(to, k)) {
      to[k] = typeof v === "string" ? v.trim() : v;
    }
  }
  return to;
};
