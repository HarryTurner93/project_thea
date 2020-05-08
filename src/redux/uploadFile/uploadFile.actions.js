import uploadFileTypes from './uploadFile.types'
import uuid from 'react-uuid'

import {API, graphqlOperation, Storage} from 'aws-amplify';
import * as mutations from "../../graphql/mutations";

export const setUploadFile = data => ({
  type: uploadFileTypes.SET_UPLOAD_FILE,
  payload: data,
})

export const setUploadProgress = (id, progress) => ({
  type: uploadFileTypes.SET_UPLOAD_PROGRESS,
  payload: {
    id,
    progress,
  },
})

export const successUploadFile = id => ({
  type: uploadFileTypes.SUCCESS_UPLOAD_FILE,
  payload: id,
})

export const failureUploadFile = id => ({
  type: uploadFileTypes.SUCCESS_UPLOAD_FILE,
  payload: id,
})

export const uploadFile = (files, sensor) => dispatch => {

  if (files.length) {
    files.forEach(async file => {
      const formPayload = new FormData()
      formPayload.append('file', file.file)
      try {
        let id = uuid()
        Storage.put(id, file.file,  {
          contentType: file.file.type,
          progressCallback(progress) {
            const { loaded, total } = progress
            const percentageProgress = Math.floor((loaded/total) * 100)
            dispatch(setUploadProgress(file.id, percentageProgress))
          }
        })
        .then((result) => {
          const payload = { id: result.key, url: result.key, classes: "dummy:1.0,", imageSensorId: sensor.id };
          API.graphql(graphqlOperation(mutations.createImage, {input: payload}))
          .then((apiresult) => {
            dispatch(successUploadFile(file.id))
          })
        })

      } catch (error) {
        dispatch(failureUploadFile(file.id))
      }
    })
  }
}

