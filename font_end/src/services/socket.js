import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import { socketUrl } from './url'
let stompClient = null

export const connectStompClient = () => {
  return new Promise((resolve, reject) => {
    const socket = new SockJS(socketUrl)
    stompClient = Stomp.over(socket)

    stompClient.connect(
      {},
      () => {
        stompClient.activate()
        resolve()
      },
      (error) => {
        reject(error)
      },
    )
  })
}

export const getStompClient = () => stompClient
