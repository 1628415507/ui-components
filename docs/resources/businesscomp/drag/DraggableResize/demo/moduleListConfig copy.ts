// configs/mainOrder.ts
import { EL_ENUM } from '../type/elementEnum'
import type { ModuleIF } from '../type/index'
// import { useI18n } from 'vue-i18n'
// 可选:引入自定义组件
// import clientOrganization from '../components/clientOrganization.vue'
// import goRemarks from '../components/goRemarks.vue'

export function getModuleList(params: any): ModuleIF[] {
  // const { t } = useI18n()
  // 临时实现 t 函数，实际应该使用 i18n
  const t = (key: string, defaultValue?: string) => defaultValue || key
  const { orderData, readOnlyPage, dicts, openMawbDialog, selectCarrier, openPartyDialog } = params

  // 基本信息模块
  const basicInfo: ModuleIF = {
    groupName: 'mainOrderTab', // 拖拽分组名称,groupName相同可互相拖拽
    moduleId: 'basicInfoCard', // 唯一标识,对应DragElement的moduleId
    visible: false, // 模块是否在DragModule中显示为可拖拽卡片
    title: t('nls.BASIC_INFO', '基本信息'),
    span: 24,
    elementLists: [
      // 联想控件示例
      {
        elementId: 'aexBusiness_carrier',
        span: 4,
        prop: 'aexBusiness.carrier',
        nameProp: 'aexBusiness.carrierName', //显示名称字段
        label: t('nls.CARRIER', '航司'),
        uiType: EL_ENUM.ASSOCIATE,
        componentName: 'ILPMdCarrier', // 联想控件名称
        select: selectCarrier, // 选择回调
        disabled: readOnlyPage
      },
      // 自定义标签示例:包含复选框和链接
      {
        elementId: 'aforder_mawbNo',
        span: 4,
        prop: 'aforder.mawbNo',
        label: t('nls.MBL_NO', '主单号'),
        uiType: EL_ENUM.SLOT, // 使用插槽自定义内容
        customLabel: {
          items: [
            {
              type: 'text',
              text: t('nls.MBL_NO', '主单号')
            },
            {
              type: 'checkbox',
              prop: 'aforder.isUseMawbList', //复选框绑定字段
              label: '',
              style: 'margin-left:auto;',
              change: (val) => {
                params.changeMawbCode(val)
              }
            },
            {
              type: 'link',
              text: t('nls.SELECT_MBL', '挑选主单号'),
              disabled: readOnlyPage,
              click: openMawbDialog
            }
          ]
        }
      },
      // 自定义组件示例
      {
        elementId: 'clientOrganization',
        span: 4,
        prop: '',
        label: t('nls.CLIENT_ORG', '委托单位'),
        uiType: EL_ENUM.COMPONENT
        // component: clientOrganization // 直接引用组件
      },
      // 字典下拉示例
      {
        elementId: 'aexBusiness_bizMode',
        span: 4,
        prop: 'aexBusiness.bizMode',
        label: t('nls.BIZ_MODE', '业务模式'),
        uiType: EL_ENUM.DICT_SELECT,
        dictName: 'AEX_BIZ_MODE', //字典数据编码
        dictOption: dicts?.AEX_BIZ_MODE, // 字典数据
        disabled: readOnlyPage
      },
      // 日期时间示例
      {
        elementId: 'afOrder_preEtd',
        span: 4,
        prop: 'aforder.preEtd',
        label: t('nls.PRE_ETD', '预计离港日'),
        uiType: EL_ENUM.DATETIME,
        disabled: readOnlyPage
      }
    ]
  }

  // 货物信息模块(支持二级嵌套拖拽)
  const cargoInfo: ModuleIF = {
    groupName: 'mainOrderTab',
    moduleId: 'cargoInfoId',
    title: t('nls.CARGO_INFO', '货物信息'),
    span: 24,
    // 第一层嵌套
    elementLists: [
      // 货物信息-左侧(可嵌套拖拽区域)
      {
        elementId: 'cargoInfo_left',
        span: 16,
        label: t('nls.CARGO_INFO_LEFT', '货物信息-左侧'),
        requiredable: false, // 不允许配置必填
        deletable: false, // 不允许删除
        groupName: 'mainOrderTab',
        // 第二层嵌套
        elementLists: [
          {
            elementId: 'aforder_custBizNo',
            span: 6,
            prop: 'aforder.custBizNo',
            label: t('nls.CUST_BIZ_NO', '客户订单号'),
            uiType: EL_ENUM.INPUT,
            disabled: readOnlyPage
          },
          // 35字符分隔输入框
          {
            elementId: 'airCargoPreM_goodsNameEn',
            span: 12,
            prop: 'airCargoPreM.goodsNameEn',
            label: t('nls.GOODS_NAME_EN', '英文品名'),
            uiType: EL_ENUM.DIVIDER_INPUT,
            rows: 3,
            disabled: readOnlyPage
          },
          // 复选框示例
          {
            elementId: 'airCargoPreM_isRe',
            span: 6,
            prop: 'airCargoPreM.isRe',
            label: '',
            uiType: EL_ENUM.CHECKBOX,
            checkboxLabel: t('nls.IS_RE', '退运货'),
            trueValue: 1,
            falseValue: 0,
            showLabel: false // 不显示label,只显示复选框
          }
        ]
      },
      // 货物信息-右侧(使用插槽自定义)
      {
        elementId: 'cargoInfo_right',
        span: 8,
        prop: '',
        label: t('nls.CARGO_INFO_RIGHT', '货物信息-右侧'),
        requiredable: false,
        deletable: false,
        uiType: EL_ENUM.SLOT // 插槽类型不支持跨模块拖拽
      }
    ]
  }

  // 收发通模块(使用customLabel添加链接)
  const shippingInfo: ModuleIF = {
    groupName: 'mainOrderTab',
    moduleId: 'shippingInfoId',
    title: t('nls.SHIPPING_INFO', '收发通'),
    span: 24,
    elementLists: [
      {
        elementId: 'goShipper_partyName',
        span: 12,
        prop: 'goShipper.partyId',
        nameProp: 'goShipper.partyName',
        label: t('nls.SHIPPER', '发货人'),
        uiType: EL_ENUM.ASSOCIATE,
        componentName: 'ILPMdShipper',
        customLabel: {
          items: [
            { type: 'text', text: t('nls.SHIPPER', '发货人') },
            {
              type: 'link',
              text: t('nls.EDIT', '编辑'),
              style: 'margin-left:auto;',
              click: () => openPartyDialog('shipper'),
              disabled: readOnlyPage
            }
          ]
        }
      }
    ]
  }

  // 备注信息模块(使用复选框组)
  const remarkInfo: ModuleIF = {
    groupName: 'mainOrderTab',
    moduleId: 'remarkInfoId',
    title: t('nls.REMARK_INFO', '备注信息'),
    span: 24,
    elementLists: [
      {
        elementId: 'checkItems',
        span: 24,
        prop: 'checkItems',
        label: t('nls.CHECK_ITEMS', '勾选项'),
        uiType: EL_ENUM.CHECKBOX_GROUP,
        checkboxOptions: [
          { label: t('nls.NEED_FUMIGATION', '熏蒸'), value: 'needFumigation' },
          { label: t('nls.NEED_WAREHOUSE', '仓储'), value: 'needWarehouse' },
          { label: t('nls.NEED_INSURANCE', '保险'), value: 'needInsurance' }
        ],
        showLabel: false
      },
      // 自定义组件:备注列表
      {
        elementId: 'goRemarks',
        span: 24,
        prop: '',
        label: '',
        uiType: EL_ENUM.COMPONENT
        // component: goRemarks,
        // showLabel: false
      }
    ]
  }

  return [basicInfo, cargoInfo, shippingInfo, remarkInfo]
}

