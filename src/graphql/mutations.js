/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createHeritage = /* GraphQL */ `
  mutation CreateHeritage(
    $input: CreateHeritageInput!
    $condition: ModelHeritageConditionInput
  ) {
    createHeritage(input: $input, condition: $condition) {
      id
      title
      description
      Icon
      VideoName
      AudioName
      SceneToLoad
      uuid
      user
      latitude
      longitude
      createdAt
      updatedAt
    }
  }
`;
export const updateHeritage = /* GraphQL */ `
  mutation UpdateHeritage(
    $input: UpdateHeritageInput!
    $condition: ModelHeritageConditionInput
  ) {
    updateHeritage(input: $input, condition: $condition) {
      id
      title
      description
      Icon
      VideoName
      AudioName
      SceneToLoad
      uuid
      user
      latitude
      longitude
      createdAt
      updatedAt
    }
  }
`;
export const deleteHeritage = /* GraphQL */ `
  mutation DeleteHeritage(
    $input: DeleteHeritageInput!
    $condition: ModelHeritageConditionInput
  ) {
    deleteHeritage(input: $input, condition: $condition) {
      id
      title
      description
      Icon
      VideoName
      AudioName
      SceneToLoad
      uuid
      user
      latitude
      longitude
      createdAt
      updatedAt
    }
  }
`;
