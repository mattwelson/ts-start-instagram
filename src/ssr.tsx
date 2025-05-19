import { getRouterManifest } from '@tanstack/react-start/router-manifest'
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'

import { createRouter } from './router'

let streamHandler = defaultStreamHandler

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(streamHandler)
