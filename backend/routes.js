import express from 'express'
import { retrieveData, retrieveDataTest, retrieveXAxisData, runCpp } from './controls.js'

const router = express.Router()
//express router so we can organize our controls here. In the future there will probably be a get request for when bfs and dfs are clicked
//maybe a post request for when display is clicked idk


router.get('/api/test', retrieveData)
router.get('/api/retrieve-xaxis-data', retrieveXAxisData)
router.get('/api/run-cpp', runCpp)
router.get('/test', retrieveDataTest)

export default router