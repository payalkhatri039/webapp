export const userSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    firstName: {
      type: "string",
      minlength: 1,
    },
    lastName: {
      type: "string",
      minlength: 1,
    },
    username: {
      type: "string",
      minlength: 1,
    },
    password: {
      type: "string",
      minlength: 1,
    },
  },
  required: ["firstName", "lastName", "username", "password"],
  additionalProperties: false,
};
