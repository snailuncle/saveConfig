"ui";

/*
 * @Description: 保存界面配置, 单独设置控件状态, 获取单选按钮组的选中按钮的id
 * @Version: 2.0
 * @author: 家
 * @QQ: 203118908
 * @bilibili: 晓宇小凡
 * @Date: 2020-02-23 00:31:07
 * @LastEditors: 家
 * @LastEditTime: 2020-12-13 20:51:04
 */

let ViewIdListRegisterListener = require("./ViewIdListRegisterListener");

let viewHeight = "150px";
let textSize = "20sp";
ui.layout(
  <vertical margin="20">
    <text textSize="25sp" textStyle="bold" gravity="center" textColor="#ff00ff">
      {" "}
      功能: 保存界面配置
    </text>
    <vertical>
      <input id="input1" w="*" h="{{viewHeight}}" tag="EditText" />
      <input id="input2" w="*" h="{{viewHeight}}" tag="EditText" />
      <input id="input3" w="*" h="{{viewHeight}}" tag="EditText" />
    </vertical>
    <radiogroup id="fbName">
      <horizontal>
        <radio id="radio1" text="选项1"></radio>
        <radio id="radio2" text="选项2"></radio>
        <radio id="radio3" text="选项3"></radio>
        <radio id="radio4" text="选项4"></radio>
        <radio id="radio5" text="选项5"></radio>
      </horizontal>
    </radiogroup>
    <button id="btn">hello world</button>
    <horizontal weightSum="5">
      <checkbox id="cb1" h="*" w="0dp" layout_weight="1"></checkbox>
      <checkbox id="cb2" h="*" w="0dp" layout_weight="1"></checkbox>
      <checkbox id="cb3" h="*" w="0dp" layout_weight="1"></checkbox>
      <checkbox id="cb4" h="*" w="0dp" layout_weight="1"></checkbox>
      <checkbox id="cb5" h="*" w="0dp" layout_weight="1"></checkbox>
    </horizontal>
    <horizontal>
      <spinner id="spinner1" h="*" w="0dp" layout_weight="1" entries="男|女|未知" />
      <spinner id="spinner2" h="*" w="0dp" layout_weight="1" entries="猪|拱|白菜" />
    </horizontal>
    <horizontal>
      <Switch id="switch1" h="*" w="0dp" layout_weight="1" />
      <Switch id="switch2" h="*" w="0dp" layout_weight="1" />
      <Switch id="switch3" h="*" w="0dp" layout_weight="1" />
    </horizontal>
    <seekbar id="seekbar" w="*" h="100" max="100" />
    <horizontal>
      <text text="作者: " textSize="{{textSize}}" h="*" w="0dp" layout_weight="1"></text>
      <text text="家" textSize="{{textSize}}" h="*" w="0dp" layout_weight="1"></text>
    </horizontal>
    <horizontal>
      <text text="ＱＱ: " textSize="{{textSize}}" h="*" w="0dp" gravity="center_vertical" layout_weight="1"></text>
      <button
        id="qq"
        text="203118908"
        textSize="{{textSize}}"
        textStyle="bold"
        h="*"
        w="0dp"
        layout_weight="1"
        style="Widget.AppCompat.Button.Colored"
      ></button>
    </horizontal>
  </vertical>
);

ui.qq.click(() => {
  setClip(ui.qq.text());
  toastLog("已复制QQ号");
  app.startActivity({
    action: "android.intent.action.VIEW",
    data: "mqqwpa://im/chat?chat_type=wpa&uin=" + ui.qq.text(),
  });
});

let storage = storages.create("UIConfigInfo");
let 需要备份和还原的控件id列表集合 = [
  ["input1", "input2", "input3"],
  ["radio1", "radio2", "radio3", "radio4", "radio5"],
  ["cb1", "cb2", "cb3", "cb4", "cb5"],
  ["spinner1", "spinner2"],
  ["switch1", "switch2", "switch3"],
  ["seekbar"],
];
需要备份和还原的控件id列表集合.map((viewIdList) => {
  let inputViewIdListRegisterListener = new ViewIdListRegisterListener(viewIdList, storage, ui, true);
  inputViewIdListRegisterListener.registerlistener();
  inputViewIdListRegisterListener.restore();
});

// 单独设置某个控件的状态
// 设置单选按钮3 为选中状态
setTimeout(function () {
  ViewIdListRegisterListener.prototype.setState("radio3", true, ui, ["radio1", "radio2", "radio3", "radio4", "radio5"]);
}, 2000);
// 设置输入框3 的文本内容
ViewIdListRegisterListener.prototype.setState("input3", "这个是三号输入框", ui);

// 单独获取某个控件的状态
// 获取单选按钮1 的状态
let radio1State = ViewIdListRegisterListener.prototype.getState("radio1", ui);
// 获取输入框1 的文本内容
let input1State = ViewIdListRegisterListener.prototype.getState("input1", ui);

let info = {
  radio1State: radio1State,
  input1State: input1State,
};
info = util.format(info);
log(info);

// 获取单选按钮组中, 选中状态的单选按钮id

let radioId = ViewIdListRegisterListener.prototype.getStateOfRadioGroup(
  ["radio1", "radio2", "radio3", "radio4", "radio5"],
  ui
);
log("单选按钮被勾选了: " + radioId);
