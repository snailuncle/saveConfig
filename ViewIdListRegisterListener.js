/**
 * @class  ViewIdListRegisterListener
 * @param {Array} viewIdList - 控件id列表
 * @param {Storage} storage - 本地存储
 * @method getViewType - 获取控件类型
 * @method listenerFunction - 不同类型控件的监听函数
 * @method registerlistener - 注册监听
 * @method restoreFunction - 还原函数
 * @method restore - 还原界面配置
 * @method setStateFunction - 设置控件状态函数
 * @method setState - 设置控件状态
 * @method getStateFunction - 获取控件状态函数
 * @method getState - 获取控件状态
 * @method getStateOfRadioGroup - 获取单选按钮组中, 选中状态的单选按钮id
 */

let FileStorage = require("./FileStorage");
importClass(android.text.TextWatcher);

function ViewIdListRegisterListener(viewIdList, storage, viewParent, isFileStorage) {
  let viewIdListType = getObjType(viewIdList);
  if ("Array" !== viewIdListType || viewIdList.length < 1 || !viewParent) {
    throw new Error("请传入数组, 且至少一个控件id");
  }
  if (!storage) {
    throw new Error("请传入storage");
  }
  if (!viewParent) {
    throw new Error("请传入viewParent");
  }
  if (isFileStorage) {
    storage = new FileStorage();
  }

  this.viewIdList = viewIdList;
  this.storage = storage;
  this.viewParent = viewParent;
  let that = this;
  this.listenerFunction = {
    EditText: function (viewId) {
      var myTextWatcher = new TextWatcher({
        onTextChanged: function (CharSequence, start, before, count) {
          that.storage.put(viewId, CharSequence.toString());
        },
      });
      that.viewParent[viewId].addTextChangedListener(myTextWatcher);
    },
    RadioButton: function (viewId) {
      var view = that.viewParent[viewId];
      view.setOnClickListener(function () {
        if (view.isChecked()) {
          that.storage.put(viewId, true);
          that.viewIdList.map((item) => {
            if (viewId !== item) {
              that.viewParent[item].setChecked(false);
              that.storage.put(item, false);
            }
          });
        }
      });
    },
    CheckBox: function (viewId) {
      let view = that.viewParent[viewId];
      view.on("check", function (checked) {
        that.storage.put(viewId, checked);
      });
    },
    Switch: function (viewId) {
      let view = that.viewParent[viewId];
      view.on("check", function (checked) {
        that.storage.put(viewId, checked);
      });
    },
    SeekBar: function (viewId) {
      let view = that.viewParent[viewId];
      var seekbarListener = new android.widget.SeekBar.OnSeekBarChangeListener({
        onProgressChanged: function (v, progress, fromUser) {
          that.storage.put(viewId, progress);
        },
      });
      view.setOnSeekBarChangeListener(seekbarListener);
    },
    Spinner: function (viewId) {
      let view = that.viewParent[viewId];
      var myAdapterListener = new android.widget.AdapterView.OnItemSelectedListener({
        onItemSelected: function (parent, view, position, id) {
          that.storage.put(viewId, id);
        },
      });
      view.setOnItemSelectedListener(myAdapterListener);
    },
  };
  this.restoreFunction = {
    EditText: function () {
      that.viewIdList.map((viewId) => {
        let value = that.storage.get(viewId) || "";

        that.viewParent[viewId].setText(value ? value.toString() : "");
      });
    },
    RadioButton: function () {
      that.viewIdList.map((viewId) => {
        let value = that.storage.get(viewId) || false;
        that.viewParent[viewId].checked = value;
      });
    },
    CheckBox: function () {
      that.viewIdList.map((viewId) => {
        let value = that.storage.get(viewId) || false;
        that.viewParent[viewId].checked = value;
      });
    },
    Switch: function () {
      that.viewIdList.map((viewId) => {
        let value = that.storage.get(viewId) || false;
        that.viewParent[viewId].checked = value;
      });
    },
    SeekBar: function () {
      that.viewIdList.map((viewId) => {
        let value = that.storage.get(viewId) || 0;
        that.viewParent[viewId].setProgress(value);
      });
    },
    Spinner: function () {
      that.viewIdList.map((viewId) => {
        let value = that.storage.get(viewId) || 0;
        that.viewParent[viewId].setSelection(value);
      });
    },
  };
}

function getViewType(view) {
  if (view.getTag && view.getTag()) {
    let viewType = view.getTag();
    if (["EditText", "RadioButton", "CheckBox", "Switch", "SeekBar", "Spinner"].indexOf(viewType) !== -1) {
      return view.getTag();
    }
  }
  let result = view.accessibilityClassName;
  result = result.replace("android.widget.", "");
  return result;
}
ViewIdListRegisterListener.prototype.getStateOfRadioGroup = function (radioIdList, viewParent) {
  this.viewParent = viewParent;
  var len = radioIdList.length;
  for (var i = 0; i < len; i++) {
    let radioId = radioIdList[i];
    let viewType = getViewType(viewParent[radioId]);
    if (viewType !== "RadioButton") {
      throw new Error("该控件不是单选按钮: " + radioId);
    }
    if (viewParent[radioId].checked) {
      return radioId;
    }
  }
};
ViewIdListRegisterListener.prototype.setStateFunction = {
  EditText: function (viewId, value, viewParent) {
    viewParent[viewId].setText(value ? value.toString() : "");
  },
  RadioButton: function (viewId, value, viewParent, radioIdList) {
    if (!value) {
      return true;
    }
    var len = radioIdList.length;
    for (var i = 0; i < len; i++) {
      viewParent[radioIdList[i]].checked = false;
    }
    viewParent[viewId].checked = value;
  },
  CheckBox: function (viewId, value, viewParent) {
    viewParent[viewId].checked = value;
  },
  Switch: function (viewId, value, viewParent) {
    viewParent[viewId].checked = value;
  },
  SeekBar: function (viewId, value, viewParent) {
    viewParent[viewId].setProgress(value);
  },
  Spinner: function (viewId, value, viewParent) {
    viewParent[viewId].setSelection(value);
  },
};
ViewIdListRegisterListener.prototype.getStateFunction = {
  EditText: function (viewId, viewParent) {
    return viewParent[viewId].text();
  },
  RadioButton: function (viewId, viewParent) {
    return viewParent[viewId].checked;
  },
  CheckBox: function (viewId, viewParent) {
    return viewParent[viewId].checked;
  },
  Switch: function (viewId, viewParent) {
    return viewParent[viewId].checked;
  },
  SeekBar: function (viewId, viewParent) {
    return viewParent[viewId].getProgress();
  },
  Spinner: function (viewId, viewParent) {
    return viewParent[viewId].setSelection();
  },
};

ViewIdListRegisterListener.prototype.getViewType = function () {
  // log(view.accessibilityClassName)
  // android.widget.TextView 文本控件
  // android.widget.ImageView 图片控件
  // android.widget.Button 按钮控件
  // android.widget.EditText 输入框控件
  // android.widget.RadioButton 单选按钮
  // android.widget.AbsListView 列表控件
  // android.widget.LinearLayout 线性布局
  // android.widget.FrameLayout 帧布局
  // android.widget.RelativeLayout 相对布局
  // android.widget.RelativeLayout 相对布局
  // android.support.v7.widget.RecyclerView 通常也是列表控件
  var len = this.viewIdList.length;
  if (len === 1) {
    let view = this.viewParent[this.viewIdList[0]];
    return (this.viewType = getViewType(view));
  }
  let viewType = false;
  for (var i = 0; i < len; i++) {
    if (!viewType) {
      let view = this.viewParent[this.viewIdList[0]];
      viewType = getViewType(view);
      continue;
    }
    let view = this.viewParent[this.viewIdList[i]];
    let viewType2 = getViewType(view);
    if (viewType !== viewType2) {
      throw new Error("请传入相同类型的控件id");
    }
  }
  return (this.viewType = viewType);
};

ViewIdListRegisterListener.prototype.registerlistener = function () {
  let viewType = this.getViewType();
  if (!this.listenerFunction[viewType]) {
    throw new Error("没有添加该类型的控件监听函数: " + viewType);
  }
  this.viewIdList.map((viewId) => {
    this.listenerFunction[viewType](viewId);
  });
};

ViewIdListRegisterListener.prototype.restore = function () {
  let viewType = this.getViewType();
  if (!this.restoreFunction[viewType]) {
    throw new Error("没有添加该类型的控件还原函数: " + viewType);
  }
  this.viewIdList.map((viewId) => {
    this.restoreFunction[viewType](viewId);
  });
};
ViewIdListRegisterListener.prototype.setState = function (viewId, value, viewParent, viewIdList) {
  this.viewParent = viewParent;

  let viewType = getViewType(this.viewParent[viewId]);
  if (!this.setStateFunction[viewType]) {
    throw new Error("没有添加该类型的控件设置状态函数: " + viewType);
  }
  this.setStateFunction[viewType](viewId, value, viewParent, viewIdList);
};
ViewIdListRegisterListener.prototype.getState = function (viewId, viewParent) {
  this.viewParent = viewParent;
  let viewType = getViewType(this.viewParent[viewId]);
  if (!this.getStateFunction[viewType]) {
    throw new Error("没有添加该类型的控件获取状态函数: " + viewType);
  }
  return this.getStateFunction[viewType](viewId, viewParent);
};

function getObjType(obj) {
  // JavaScript 标准文档中定义: [[Class]] 的值只可能是下面字符串中的一个： Arguments, Array, Boolean, Date, Error, Function, JSON, Math, Number, Object, RegExp, String.
  var result = Object.prototype.toString.call(obj);
  result = result.match(/ \w+/)[0];
  result = result.replace(/ /g, "");
  return result;
}

module.exports = ViewIdListRegisterListener;
