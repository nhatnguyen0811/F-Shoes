import React from 'react'

export default function Loading({ start }) {
  return (
    <div className="loading-container" style={{ textAlign: 'center' }}>
      <img
        className="loading-image"
        width={'300px'}
        src={require('../assets/gif/loading.gif')}
        alt="loading"
      />
      {start && <h3>Đang khởi động server, Vui lòng đợi...</h3>}
    </div>
  )
}
