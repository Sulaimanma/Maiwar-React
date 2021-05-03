/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getHeritage = /* GraphQL */ `
  query GetHeritage($id: ID!) {
    getHeritage(id: $id) {
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
export const listHeritages = /* GraphQL */ `
  query ListHeritages(
    $filter: ModelHeritageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHeritages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
