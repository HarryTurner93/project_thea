/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createInterest = /* GraphQL */ `
  mutation CreateInterest(
    $input: CreateInterestInput!
    $condition: ModelInterestConditionInput
  ) {
    createInterest(input: $input, condition: $condition) {
      id
      email
    }
  }
`;
export const updateInterest = /* GraphQL */ `
  mutation UpdateInterest(
    $input: UpdateInterestInput!
    $condition: ModelInterestConditionInput
  ) {
    updateInterest(input: $input, condition: $condition) {
      id
      email
    }
  }
`;
export const deleteInterest = /* GraphQL */ `
  mutation DeleteInterest(
    $input: DeleteInterestInput!
    $condition: ModelInterestConditionInput
  ) {
    deleteInterest(input: $input, condition: $condition) {
      id
      email
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      zones {
        items {
          id
          name
        }
        nextToken
      }
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      zones {
        items {
          id
          name
        }
        nextToken
      }
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      zones {
        items {
          id
          name
        }
        nextToken
      }
    }
  }
`;
export const createZone = /* GraphQL */ `
  mutation CreateZone(
    $input: CreateZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    createZone(input: $input, condition: $condition) {
      id
      name
      user {
        id
        zones {
          nextToken
        }
      }
      sensors {
        items {
          id
          content
          name
          latitude
          longitude
        }
        nextToken
      }
    }
  }
`;
export const updateZone = /* GraphQL */ `
  mutation UpdateZone(
    $input: UpdateZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    updateZone(input: $input, condition: $condition) {
      id
      name
      user {
        id
        zones {
          nextToken
        }
      }
      sensors {
        items {
          id
          content
          name
          latitude
          longitude
        }
        nextToken
      }
    }
  }
`;
export const deleteZone = /* GraphQL */ `
  mutation DeleteZone(
    $input: DeleteZoneInput!
    $condition: ModelZoneConditionInput
  ) {
    deleteZone(input: $input, condition: $condition) {
      id
      name
      user {
        id
        zones {
          nextToken
        }
      }
      sensors {
        items {
          id
          content
          name
          latitude
          longitude
        }
        nextToken
      }
    }
  }
`;
export const createSensor = /* GraphQL */ `
  mutation CreateSensor(
    $input: CreateSensorInput!
    $condition: ModelSensorConditionInput
  ) {
    createSensor(input: $input, condition: $condition) {
      id
      content
      name
      latitude
      longitude
      zone {
        id
        name
        user {
          id
        }
        sensors {
          nextToken
        }
      }
      images {
        items {
          id
          url
          classes
        }
        nextToken
      }
    }
  }
`;
export const updateSensor = /* GraphQL */ `
  mutation UpdateSensor(
    $input: UpdateSensorInput!
    $condition: ModelSensorConditionInput
  ) {
    updateSensor(input: $input, condition: $condition) {
      id
      content
      name
      latitude
      longitude
      zone {
        id
        name
        user {
          id
        }
        sensors {
          nextToken
        }
      }
      images {
        items {
          id
          url
          classes
        }
        nextToken
      }
    }
  }
`;
export const deleteSensor = /* GraphQL */ `
  mutation DeleteSensor(
    $input: DeleteSensorInput!
    $condition: ModelSensorConditionInput
  ) {
    deleteSensor(input: $input, condition: $condition) {
      id
      content
      name
      latitude
      longitude
      zone {
        id
        name
        user {
          id
        }
        sensors {
          nextToken
        }
      }
      images {
        items {
          id
          url
          classes
        }
        nextToken
      }
    }
  }
`;
export const createImage = /* GraphQL */ `
  mutation CreateImage(
    $input: CreateImageInput!
    $condition: ModelImageConditionInput
  ) {
    createImage(input: $input, condition: $condition) {
      id
      url
      classes
      sensor {
        id
        content
        name
        latitude
        longitude
        zone {
          id
          name
        }
        images {
          nextToken
        }
      }
    }
  }
`;
export const updateImage = /* GraphQL */ `
  mutation UpdateImage(
    $input: UpdateImageInput!
    $condition: ModelImageConditionInput
  ) {
    updateImage(input: $input, condition: $condition) {
      id
      url
      classes
      sensor {
        id
        content
        name
        latitude
        longitude
        zone {
          id
          name
        }
        images {
          nextToken
        }
      }
    }
  }
`;
export const deleteImage = /* GraphQL */ `
  mutation DeleteImage(
    $input: DeleteImageInput!
    $condition: ModelImageConditionInput
  ) {
    deleteImage(input: $input, condition: $condition) {
      id
      url
      classes
      sensor {
        id
        content
        name
        latitude
        longitude
        zone {
          id
          name
        }
        images {
          nextToken
        }
      }
    }
  }
`;
