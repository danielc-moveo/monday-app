// import axios from "../../axios";
import axios from "axios";
import { mondayPrivateInstance, mondayUserInstance } from "..";

export const sendVoiceMessage = async (params) => {
  const {
    mondayUserInstance,
    blob,
    currentItemId,
    messageNumber,
    voiceMessageTitle,
    userId,
  } = params;
  const fileName = `voice_description_${messageNumber}`;
  try {
    const file = _blobToFile(blob, fileName);
    const newUpdateId = await _createUpdate(
      mondayUserInstance,
      currentItemId,
      voiceMessageTitle,
      userId
    );

    await _addFileToUpdate(mondayUserInstance, newUpdateId, file);
    const creator = await getCreator(mondayUserInstance, userId);
    await mondayUserInstance.storage.instance.setItem(newUpdateId, creator.id);
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
  mondayUserInstance,
  currentItemId,
  voiceMessageTitle,
  userId
) => {
  const creator = await getCreator(mondayUserInstance, userId);
  const { name } = creator;
  const parsedVoiceMessageTitle =
    voiceMessageTitle.charAt(0).toUpperCase() + voiceMessageTitle.slice(1);

  const parsedName = name.charAt(0).toUpperCase() + name.slice(1);

  // const bodyString = `${parsedVoiceMessageTitle}`;
  const bodyString = `${parsedVoiceMessageTitle}`;

  const query = `mutation {
    create_update (item_id: ${currentItemId}, body: ${bodyString} ) {
    id
    }
    }`;
  const response = await mondayUserInstance.api(query);
  const { id } = response.data.create_update;
  return id;
};

const _addFileToUpdate = async (mondayUserInstance, newUpdateId, myfile) => {
  try {
    await mondayUserInstance.api(
      `
  mutation addFileToUpdate($file: File!) {
    add_file_to_update(
      update_id: ${newUpdateId},
      file: $file
    ) {
      id
    }
  }
`,
      {
        variables: { file: myfile },
      }
    );
    debugger;
  } catch (error) {
    debugger;
  }
};

const getCreator = async (mondayUserInstance, userId) => {
  const query = ` query { users ( ids : ${userId} ) { name, id, photo_tiny }
           }`;

  const response = await mondayUserInstance.api(query);
  return response.data.users[0];
};
