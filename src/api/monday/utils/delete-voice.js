export const deleteVmFromDb = async (mondayUserInstance, updateId) => {
  const query = `mutation {
        delete_update (id: ${updateId}) {
        id
        }
        }
        `;

  try {
    const response = await mondayUserInstance.api(query);
    return { msg: "success", deletedUpdateId: response.data.delete_update.id };
  } catch (error) {
    return {
      msg: error.message,
    };
  }
};
