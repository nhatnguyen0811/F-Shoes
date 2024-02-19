import { Html5QrcodeScanner } from 'html5-qrcode'
import React, { useEffect, useRef } from 'react'

export default function Scanner({ handleScan, setOpen, setScanner }) {
  const scannerRef = useRef(null)

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    })

    function success(result) {
      handleScan(result)
      setOpen(false)
    }

    scannerRef.current.render(success)
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [handleScan, setOpen])

  return <div id="reader"></div>
}
