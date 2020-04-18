/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateInterest = /* GraphQL */ `
  subscription OnCreateInterest {
    onCreateInterest {
      id
      email
    }
  }
`;
export const onUpdateInterest = /* GraphQL */ `
  subscription OnUpdateInterest {
    onUpdateInterest {
      id
      email
    }
  }
`;
export const onDeleteInterest = /* GraphQL */ `
  subscription OnDeleteInterest {
    onDeleteInterest {
      id
      email
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateZone = /* GraphQL */ `
  subscription OnCreateZone {
    onCreateZone {
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
export const onUpdateZone = /* GraphQL */ `
  subscription OnUpdateZone {
    onUpdateZone {
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
export const onDeleteZone = /* GraphQL */ `
  subscription OnDeleteZone {
    onDeleteZone {
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
export const onCreateSensor = /* GraphQL */ `
  subscription OnCreateSensor {
    onCreateSensor {
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
export const onUpdateSensor = /* GraphQL */ `
  subscription OnUpdateSensor {
    onUpdateSensor {
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
export const onDeleteSensor = /* GraphQL */ `
  subscription OnDeleteSensor {
    onDeleteSensor {
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
export const onCreateImage = /* GraphQL */ `
  subscription OnCreateImage {
    onCreateImage {
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
export const onUpdateImage = /* GraphQL */ `
  subscription OnUpdateImage {
    onUpdateImage {
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
export const onDeleteImage = /* GraphQL */ `
  subscription OnDeleteImage {
    onDeleteImage {
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
