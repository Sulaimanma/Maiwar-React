export const isOutOfMaxBounds = (latitude, longitude, maxBounds) => {
  const [[swLng, swLat], [neLng, neLat]] = maxBounds

  return (
    longitude < swLng ||
    longitude > neLng ||
    latitude < swLat ||
    latitude > neLat
  )
}
