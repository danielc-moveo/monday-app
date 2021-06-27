export const sendVoiceMessage = async (params) => {
  const { mondayUserInstance, blob, currentItemId, messageNumber, title, userId } = params;
  const fileName = `voice_description_${messageNumber}`;
  try {
    const file = _blobToFile(blob, fileName);
    const { id: newUpdateId, created_at } = await _createUpdate(
      mondayUserInstance,
      currentItemId,
      title,
      userId
    );

    const processedFileUploadResponse = await _addFileToUpdate(mondayUserInstance, newUpdateId, file);
    return {
      msg: 'success',
      processedResponse: {
        ...processedFileUploadResponse,
        id: newUpdateId,
        body: title,
        created_at,
      },
    };
  } catch (error) {
    return {
      msg: error.message,
    };
  }
};

const _blobToFile = (theBlob, fileName) => {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  const processedBlob = theBlob.slice(0, theBlob.size, 'video/mp4');
  const newFile = new File([theBlob], fileName, {
    type: processedBlob.type,
  });

  return newFile;
};

const _createUpdate = async (mondayUserInstance, currentItemId, title) => {
  const parsedVoiceMessageTitle = title.charAt(0).toUpperCase() + title.slice(1);

  const bodyString = `Voice message : ${parsedVoiceMessageTitle}`;

  const query = `mutation {
    create_update (item_id: ${currentItemId}, body: "${bodyString}" ) {
    id,
    created_at
    }
    }`;
  const response = await mondayUserInstance.api(query);
  const { id, created_at } = response.data.create_update;
  return { id, created_at };
};

const _addFileToUpdate = async (mondayUserInstance, newUpdateId, myfile) => {
  try {
    const addFileResponse = await mondayUserInstance.api(
      `
  mutation addFileToUpdate($file: File!) {
    add_file_to_update(
      update_id: ${newUpdateId},
      file: $file
    ) {
      public_url,
      uploaded_by {
        id,
        name,
        photo_tiny
      }
    }
  }
`,
      {
        variables: { file: myfile },
      }
    );
    const processedFileUploadResponse = {
      assets: [{ public_url: addFileResponse.data.add_file_to_update.public_url }],
      creator: {
        id: addFileResponse.data.add_file_to_update.uploaded_by.id,
        name: addFileResponse.data.add_file_to_update.uploaded_by.name,
        photo_tiny: addFileResponse.data.add_file_to_update.uploaded_by.photo_tiny,
      },
    };
    return processedFileUploadResponse;
  } catch (error) {}
};
