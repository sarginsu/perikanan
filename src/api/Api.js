const SteinStore = require("stein-js-client");
const store = new SteinStore(
  process.env.REACT_APP_API_SARGINSU
);

const storeEfishery = new SteinStore(
  process.env.REACT_APP_API_URL
);

export async function getList() {
  try {
    let list = await store.read("list");
    list = list.filter(item => item.uuid);
    return list;
  } catch (error) {
    return error;
  }
}

export async function searchList(filter) {
  try {
    return await store.read("list", { search: filter });
  } catch (error) {
    return error;
  }
}

export async function addRow(arrayData) {
  try {
    return await store.append("list", arrayData);
  } catch (error) {
    return error;
  }
}

export async function editRow(id, data) {
  try {
    return await store.edit("list", {
      search: { uuid: id },
      set: data
    })
  } catch (error) {
    return error;
  }
}

export async function deleteRow(id) {
  try {
    return await store.delete("list", {
      search: { uuid: id }
    });
  } catch (error) {
    return error;
  }
};

export async function getSize() {
  try {
    return await storeEfishery.read("option_size");
  } catch (error) {
    return error;
  }
};

export async function getArea() {
  try {
    return await storeEfishery.read("option_area");
  } catch (error) {
    return error;
  }
};