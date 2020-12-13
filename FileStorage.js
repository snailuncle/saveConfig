function FileStorage(name) {
  this.name = name || "UIConfigInfo";
  let filepath = files.join(files.getSdcardPath(), this.name, "UIConfigInfo.json");
  if (files.exists(filepath)) {
    let fileContent = files.read(filepath);
    if (!isJSON(fileContent)) {
      throw new Error("文件内容不是json格式, 请检查数据是否修改错误, 我就不擅自修改了");
    }
  } else {
    files.createWithDirs(filepath);
    files.write(filepath, JSON.stringify({}));
  }
  this.filepath = filepath;
}

function isJSON(str) {
  if (typeof str == "string") {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == "object" && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log("error：" + str + "!!!" + e);
      return false;
    }
  }
  console.log("It is not a string!");
}

FileStorage.prototype.put = function (key, value) {
  if (typeof value == "undefined") {
    throw new TypeError("value cannot be undefined");
  }
  let data = this.readData();
  data[key] = value;
  this.writeData(data);
};
FileStorage.prototype.readData = function () {
  let data = files.read(this.filepath);
  return JSON.parse(data);
};
FileStorage.prototype.writeData = function (data) {
  files.write(this.filepath, JSON.stringify(data));
};

FileStorage.prototype.get = function (key, defaultValue) {
  let data = this.readData();
  var value = data[key];
  if (!value) {
    return defaultValue;
  }
  return value;
};

module.exports = FileStorage;
