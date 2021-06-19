import { uniqueStr } from "./constants";

export const getContext = async (mondayUserInstance) => {
  try {
    const contextResponse = await mondayUserInstance.get("context");
    const {
      itemId,
      theme,
      user: { id },
    } = contextResponse.data;
    return {
      msg: "success",
      itemIdResponse: itemId,
      theme,
      id,
    };
  } catch (error) {
    return { msg: error.message };
  }
};

export const getVoiceMessagesHistory = async (mondayUserInstance, itemId) => {
  const query = ` query {items( ids : ${itemId}) {
          updates {
            id
            body
            created_at
            creator{
              id
              name
              photo_tiny
            }
            assets {
              id
              public_url
            }
          }
        }}`;
  try {
    const updatesResponse = await mondayUserInstance.api(query);
    const updatesWithVoiceMemos = await getFilteredUpdates(updatesResponse);

    // const updatesWithVoiceMemosAndCreator =
    //   await getUpdatesWithVoiceMemosAndCreator(
    //     mondayUserInstance,
    //     updatesWithVoiceMemos
    //   );

    return { msg: "success", messagesHistory: updatesWithVoiceMemos };
  } catch (error) {
    return { msg: error.message };
  }
};

const getFilteredUpdates = async (updatesResponse) => {
  if (updatesResponse.data.items[0].updates.length > 0) {
    //has updates
    const updatesWithVoiceMemos = updatesResponse.data.items[0].updates.filter(
      ({ assets }) => assets.length && filterAssetsByAssetType(assets)
    );

    return updatesWithVoiceMemos;
  }
  return null;
};

const filterAssetsByAssetType = (assets) => {
  return assets.filter(({ public_url }) =>
    public_url.includes(`voice_description`)
  ).length;
};

const getUpdatesWithVoiceMemosAndCreator = async (
  mondayUserInstance,
  updatesWithVoiceMemos
) => {
  let processedUpdates = [];
  for (const update of updatesWithVoiceMemos) {
    const splittedBody = update.body.split(uniqueStr);
    const title = splittedBody[0];
    const userId = splittedBody[1];

    const user = await getCreator(mondayUserInstance, userId).then((user) => {
      return user;
    });
    processedUpdates.push({
      user: { ...user },
      ...update,
      title,
    });
  }

  return processedUpdates;
};

export const getCreator = async (mondayUserInstance, userId) => {
  const query = ` query { users ( ids : ${userId} ) { name, id, photo_tiny }
           }`;

  const response = await mondayUserInstance.api(query);
  return response.data.users[0];
};
