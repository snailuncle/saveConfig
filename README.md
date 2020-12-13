# saveConfig

version: 1.0.3
更新内容:
1. 添加`FileStorage`模块, 用于卸载app后, 依然留存界面配置信息
2. `function ViewIdListRegisterListener(viewIdList, storage, viewParent, isFileStorage)`  
   增加参数`isFileStorage`, 可不填, 如果填了, 就重新定义局部的storage

```

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
function ViewIdListRegisterListener (viewIdList, storage, viewParent) {}

```
