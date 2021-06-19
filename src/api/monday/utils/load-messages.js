export const getContext = async (mondayUserInstance) => {
  try {
    const contextResponse = await mondayUserInstance.get('context');
    const {
      itemId,
      theme,
      user: { id },
    } = contextResponse.data;
    return {
      msg: 'success',
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
    return { msg: 'success', messagesHistory: updatesWithVoiceMemos };
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
  return assets.filter(({ public_url }) => public_url.includes(`voice_description`)).length;
};
