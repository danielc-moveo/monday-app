import axios from "../api/axios";
import { mondayInstance } from "../api/monday";

export const getVoiceMessagesHistory = async () => {
  const query = ` query {items {
        updates {
          id
          body
          assets {
            id
            public_url
          }
        }
      }}`;

  const updatesResponse = await mondayInstance.api(query);
  //process response...
};

export const _blobToFile = (theBlob, fileName) => {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  const processedBlob = theBlob.slice(0, theBlob.size, "video/mp4");
  debugger;
  const newFile = new File([theBlob], fileName, {
    type: processedBlob.type,
  });

  return newFile;
};

export const _createUpdate = async (itemId) => {
  const query = `mutation {
        create_update (item_id: ${itemId}, body: "This update is for a new video") {
        id
        }
        }`;
  const response = await mondayInstance.api(query);

  const { id } = response.data.create_update;
  return id;
};

export const _addFileToUpdate = async (newUpdateId, file) => {
  const formData = new FormData();
  formData.append("variables[file]", file, "filename.mp4");

  const noVariableQuery = `mutation addFile($file: File!) {add_file_to_update (update_id: ${newUpdateId}, file: $file) {id}}`;
  formData.append("query", noVariableQuery);

  try {
    const res = await axios.post(process.env.REACT_APP_BASE_URL, formData);
  } catch (error) {
    //internal 500 server error
  }
};

export const _createColumn = async (boardId, columnName) => {
  const query = `mutation {
        create_column (board_id: ${boardId}, title: ${columnName}, column_type: file) {
        id
        }
        }`;
  const response = await mondayInstance.api(query);
  const { id } = response.data.create_column;
  return id;
};

export const _addFileToColumn = async (itemId, newColumnId, file) => {
  const formData = new FormData();
  formData.append("variables[file]", file, "filename.mp4");

  const noVariableQuery = `mutation addFile($file: File!) {  add_file_to_column (item_id: ${itemId}, column_id: ${newColumnId},file: $file) {id}}`;
  formData.append("query", noVariableQuery);

  try {
    const res = await axios.post(process.env.REACT_APP_BASE_URL, formData);
  } catch (error) {
    //internal 500 server error
  }
};
