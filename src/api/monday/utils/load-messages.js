export const getContext = async (mondayUserInstance) => {
  try {
    const contextResponse = await mondayUserInstance.get('context');
    const {
      itemId,
      theme,
      user: { id },
      boardId,
    } = contextResponse.data;
    return {
      msg: 'success',
      itemIdResponse: itemId,
      theme,
      id,
      boardId,
    };
  } catch (error) {
    return { msg: error.message };
  }
};

export const getVoiceMessagesHistory = async (mondayUserInstance, itemId, boardId) => {
  const query = `query {boards (ids: ${boardId}){
          updates {
            id
            body
            item_id
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
    const updatesResponseByBoardId = await mondayUserInstance.api(query);
    const updatesWithVoiceMemos = await getFilteredUpdates(
      updatesResponseByBoardId.data.boards[0].updates,
      itemId
    );

    return { msg: 'success', messagesHistory: updatesWithVoiceMemos };
  } catch (error) {
    return { msg: error.message };
  }
};

const getFilteredUpdates = async (updates, itemId) => {
  if (updates.length > 0) {
    const updatesWithVoiceMemos = updates.filter(
      ({ assets, item_id }) =>
        assets.length && item_id === itemId.toString() && filterAssetsByAssetType(assets)
    );
    return updatesWithVoiceMemos;
  }
  return null;
};

const filterAssetsByAssetType = (assets) => {
  return assets.filter(({ public_url }) => public_url.includes(`voice_description_`)).length;
};
