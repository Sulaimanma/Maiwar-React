/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getHeritages = /* GraphQL */ `
  query GetHeritages($id: ID!) {
    getHeritages(id: $id) {
      id
      surveyDate
      siteNumber
      heritageType
      GPSCoordinates
      routeExaminedOrNot
      examinedRouteLocation
      accessRouteCoordinate
      inspectionPerson
      InspectionCarriedOut
      photo
      photoDescription
      video
      videoDescription
      visibility
      siteIssue
      identifiedOrNot
      additionalComments
      clearedToProceed
      heritageFieldOfficer
      technicalAdvisor
      coordinator
      revised
      createdAt
      updatedAt
    }
  }
`;
export const listHeritagess = /* GraphQL */ `
  query ListHeritagess(
    $filter: ModelHeritagesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHeritagess(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        surveyDate
        siteNumber
        heritageType
        GPSCoordinates
        routeExaminedOrNot
        examinedRouteLocation
        accessRouteCoordinate
        inspectionPerson
        InspectionCarriedOut
        photo
        photoDescription
        video
        videoDescription
        visibility
        siteIssue
        identifiedOrNot
        additionalComments
        clearedToProceed
        heritageFieldOfficer
        technicalAdvisor
        coordinator
        revised
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
