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
            creator_id
            assets {
              id
              public_url
            }
          }
        }}`;
  try {
    const updatesResponse = await mondayInstance.api(query);
    const processedUpdates = await getProcessedUpdates(
      mondayInstance,
      updatesResponse
    );
    return { msg: "success", messagesHistory: processedUpdates };
  } catch (error) {
    return { msg: error.message };
  }
};

const getProcessedUpdates = async (mondayInstance, updatesResponse) => {
  if (updatesResponse.data.items[0].updates.length > 0) {
    //has updates
    const updatesWithVoiceMemos = updatesResponse.data.items[0].updates.filter(
      ({ assets }) => assets.length && filterAssetsByAssetType(assets)
    );

    const processedUpdatesWithVoiceMemos = await Promise.all(
      updatesWithVoiceMemos.map(({ id, assets, creator_id }) =>
        getCreatorName(mondayInstance, creator_id).then((creatorName) => {
          const assetId = assets[0].id;
          const assetSrc = assets[0].public_url;
          return { creatorName, updateId: id, assetId, assetSrc };
        })
      )
    );
    return processedUpdatesWithVoiceMemos;
  }
  return null;
};

const filterAssetsByAssetType = (assets) => {
  return assets.filter(
    ({ public_url }) =>
      public_url.includes(`voice_description`) && public_url.includes(`.webm`)
  );
};

const getCreatorName = async (mondayInstance, creator_id) => {
  const query = ` query { users ( ids : ${creator_id} ) { name }
           }`;

  const response = await mondayInstance.api(query);
  return response.data.users[0].name;
};
