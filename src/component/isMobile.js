import React from "react"

export default function isMobile() {
  if (
    /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    return true
  } else {
    return false
  }
}
