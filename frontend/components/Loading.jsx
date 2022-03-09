import React from 'react'

function Loading() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgb(241, 242, 243); display: block; shape-rendering: auto;" width="244px" height="244px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
    <g transform="translate(50 42)">
      <g transform="scale(0.8)">
        <g transform="translate(-50 -50)">
          <polygon fill="#facc15" points="72.5 50 50 11 27.5 50 50 50">
            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.282051282051282s" values="0 50 38.5;360 50 38.5" keyTimes="0;1"></animateTransform>
          </polygon>
          <polygon fill="#eab308" points="5 89 50 89 27.5 50">
            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.282051282051282s" values="0 27.5 77.5;360 27.5 77.5" keyTimes="0;1"></animateTransform>
          </polygon>
          <polygon fill="#fde047" points="72.5 50 50 89 95 89">
            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.282051282051282s" values="0 72.5 77.5;360 72 77.5" keyTimes="0;1"></animateTransform>
          </polygon>
        </g>
      </g>
    </g>
    </svg>
  )
}

export default Loading