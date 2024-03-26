export const userVerificationSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
      username: {
        type: "string",
        minlength: 1,
      },
      verifyLinkTimestamp:{
        type:"string"
      },
      verified: {
        type: "boolean",
        default:false
      }
    },
    required: [ "username", "verifyLinkTimestamp", "verified"],
    additionalProperties: false,
  };
  