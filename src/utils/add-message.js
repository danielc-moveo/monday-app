import axios from "../api/axios";

export const sendVoiceMessage = async (params) => {
  const {
    mondayInstance,
    blob,
    currentItemId,
    messageNumber,
    voiceMessageTitle,
  } = params;
  const fileName = `voice_description_${messageNumber}`;
  try {
    const file = _blobToFile(blob, fileName);
    const newUpdateId = await _createUpdate(
      mondayInstance,
      currentItemId,
      voiceMessageTitle
    );
    await _addFileToUpdate(newUpdateId, file);
    return {
      msg: "success",
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
  const processedBlob = theBlob.slice(0, theBlob.size, "video/mp4");
  const newFile = new File([theBlob], fileName, {
    type: processedBlob.type,
  });

  return newFile;
};

const _createUpdate = async (
  mondayInstance,
  currentItemId,
  voiceMessageTitle
) => {
  const query = `mutation {
        create_update (item_id: ${currentItemId}, body: ${voiceMessageTitle}) {
        id
        }
        }`;
  const response = await mondayInstance.api(query);

  const { id } = response.data.create_update;
  return id;
};

const _addFileToUpdate = async (newUpdateId, file) => {
  const formData = new FormData();
  formData.append("variables[file]", file, file.name);
  const noVariableQuery = `mutation addFile($file: File!) {add_file_to_update (update_id: ${newUpdateId}, file: $file) {id}}`;
  formData.append("query", noVariableQuery);
  const res = await axios.post(process.env.REACT_APP_BASE_URL, formData);
};

const _createColumn = async (mondayInstance, boardId, columnName) => {
  const query = `mutation {
        create_column (board_id: ${boardId}, title: ${columnName}, column_type: file) {
        id
        }
        }`;
  const response = await mondayInstance.api(query);
  const { id } = response.data.create_column;
  return id;
};

const _addFileToColumn = async (itemId, newColumnId, file) => {
  const formData = new FormData();
  formData.append("variables[file]", file, file.name);

  const noVariableQuery = `mutation addFile($file: File!) {  add_file_to_column (item_id: ${itemId}, column_id: ${newColumnId},file: $file) {id}}`;
  formData.append("query", noVariableQuery);

  try {
    const res = await axios.post(process.env.REACT_APP_BASE_URL, formData);
  } catch (error) {
    //internal 500 server error
  }
};
