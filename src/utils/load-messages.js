export const getContext = async (mondayInstance) => {
  try {
    const contextResponse = await mondayInstance.get("context");
    const { itemId, theme } = contextResponse.data;
    return {
      msg: "success",
      itemIdResponse: itemId,
      theme,
    };
  } catch (error) {
    return { msg: error.message };
  }
};

export const getVoiceMessagesHistory = async (mondayInstance, itemId) => {
  const query = ` query {items( ids : ${itemId}) {
          updates {
            id
            body
            created_at
            creator{
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
    const updatesResponse = await mondayInstance.api(query);
    const updatesWithVoiceMemos = await getFilteredUpdates(updatesResponse);
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
