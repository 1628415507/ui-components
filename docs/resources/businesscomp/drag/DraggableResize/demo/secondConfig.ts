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
  const { GROUPNAME, readOnlyPage, dicts, openMawbDialog, selectCarrier, openPartyDialog } = params

  // 基本信息模块
  const basicInfo: ModuleIF = {
    groupName: GROUPNAME.SECOND, // 拖拽分组名称,groupName相同可互相拖拽
    moduleId: 'baseInfoCard', // 唯一标识,对应DragElement的moduleId
    title: t('nls.BASIC_INFO', '次要基本信息'),
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
      },
      {
        elementId: 'airCargoPreM_goodsNameEn',
        span: 12,
        prop: 'airCargoPreM.goodsNameEn',
        label: t('nls.GOODS_NAME_EN', '英文品名'),
        uiType: EL_ENUM.TEXTAREA,
        rows: 3,
        disabled: readOnlyPage
      },
      // 自定义标签示例:包含复选框和链接
      {
        elementId: 'aforder_mawbNo',
        span: 4,
        prop: 'aforder.mawbNo',
        label: t('nls.MBL_NO', '单号'),
        uiType: EL_ENUM.INPUT, // 使用插槽自定义内容
        customLabel: {
          items: [
            {
              type: 'text',
              text: t('nls.MBL_NO', '单号')
            },
            {
              type: 'checkbox',
              prop: 'aforder.isUseMawbList', //复选框绑定字段
              label: '',
              style: 'margin-left:auto;',
              change: (val) => {
                // params.changeMawbCode(val)
              }
            },
            {
              type: 'link',
              text: t('nls.SELECT_MBL', '文字链接'),
              disabled: readOnlyPage,
              click: openMawbDialog
            }
          ]
        }
      },
      // 日期时间示例
      {
        elementId: 'afOrder_preEtd',
        span: 4,
        prop: 'aforder.preEtd',
        label: t('nls.PRE_ETD', '时间'),
        uiType: EL_ENUM.DATETIME,
        disabled: readOnlyPage
      }
    ]
  }

  return [basicInfo]
}

