const FormInput = {
  "komoditas": {
    "type": "text",
    "required": true,
    "defaultValue": "Ikan "
  },
  "price": {
    "type": "number",
    "required": true,
    "defaultValue": "40000"
  },
  "size": {
    "type": "select",
    "required": true,
    "options": [],
    "defaultValue": "90"
  },
  "area_kota": {
    "type": "select",
    "required": true,
    "options": [],
    // "defaultValue": "MEDAN"
  },
  "Simpan": {
    "type": "submit",
  }
}

export default FormInput;