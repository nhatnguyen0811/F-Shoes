import React from 'react'

export default function Empty() {
  return (
    <div
      style={{
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        minHeight: '100px',
        width: '100%',
      }}>
      <img src={require('../assets/image/no-data.png')} alt="No-data" />
    </div>
  )
}
