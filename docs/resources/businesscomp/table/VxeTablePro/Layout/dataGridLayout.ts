// import request from '@/utils/request'
// import { TEMP_TYPE } from '@/enums/SystemEnum'
const enum TEMP_TYPE {
  USER = 'USER', // 用户级布局 principal_group_code != 1000 and is_super_admin != 1
  SYSTEM = 'SYS', // 系统级布局 principal_group_code = 1000
  TENANT = 'TENANT' // 租户级布局 principal_group_code != 1000 and is_super_admin = 1
}
function request(options: any) {
  return new Promise((resolve, reject) => {
    resolve()
  })
}
export default class dxLayout {
  private tableConfig: any
  private layoutTableId: string = ''
  private layoutPath: string = ''
  constructor($table: any, tableConfig: any) {
    this.tableConfig = tableConfig
    const tableId = $table.id
    this.layoutTableId = tableId
    this.layoutPath = tableConfig.layoutPath
    // console.log('【 layoutPath 】 -115', this.layoutPath)
  }
  getLayout(name: any, pathname: any) {
    return new Promise((resolve, reject) => {
      request({
        url: `/ilp-system-service/layout/get/${this.layoutTableId}/${name}`,
        method: 'get',
        params: { pathname }
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject({})
        })
    })
  }
  setDefaultLayout(data: any) {
    return new Promise((resolve, reject) => {
      request({
        url: '/ilp-system-service/tableLayout/updateDefault',
        method: 'post',
        data: data
      })
        .then((res) => {
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  postSaveLayout(saveData: any) {
    return new Promise((resolve, reject) => {
      request({
        url: '/ilp-common-service/mdInterfaceTemplate/saveMdInterfaceTemplate',
        method: 'post',
        data: saveData
      })
        .then((res) => {
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  deleteLayout(templateId: any) {
    return new Promise((resolve, reject) => {
      request({
        url: '/ilp-common-service/mdInterfaceTemplate/deleteById',
        method: 'post',
        data: templateId.toString(),
        headers: { 'Content-Type': 'text/plain' }
      })
        .then((res) => {
          resolve(true)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
  // 处理权限过滤:根据上级允许的字段过滤字段
  filterLayoutByAllowedFields(res: any, level: string) {
    const { sysLevelTemplate, tenantLevelTemplate, userLevelTemplates } = res
    const sysContent = sysLevelTemplate?.templateContent ? JSON.parse(sysLevelTemplate.templateContent) : null
    const tenantContent = tenantLevelTemplate?.templateContent ? JSON.parse(tenantLevelTemplate.templateContent) : null
    // 租户布局列过滤
    if (level === TEMP_TYPE.TENANT) {
      if (!sysContent) {
        return tenantLevelTemplate
      }
      const sysAllowedFields = sysContent.layout?.map((it: any) => it.field) || []
      // 过滤用户模板的布局,只保留租户级允许的字段
      const filteredLayout = (tenantContent?.layout || []).filter((layoutItem: any) => {
        return sysLevelTemplate ? sysAllowedFields.includes(layoutItem.field) : true
      })
      // 返回过滤后的用户模板
      return {
        ...tenantLevelTemplate,
        templateContent: JSON.stringify({
          ...tenantContent,
          layout: filteredLayout
        })
      }
    }
    // 用户布局列过滤
    if (level === TEMP_TYPE.USER) {
      const allowedLayout = tenantContent?.layout || sysContent?.layout || []
      const tenantAllowedFields = allowedLayout.map((it: any) => it.field) || []
      // 过滤用户级模板
      const list = userLevelTemplates.map((userTemplate: any) => {
        const userContent = userTemplate.templateContent ? JSON.parse(userTemplate.templateContent) : {}
        if (userTemplate.templateName === this.tableConfig.DEFAULT_TEMP_NAME) {
          //默认布局取上级的模板
          userContent.layout = tenantContent?.layout || sysContent?.layout || []
        }
        // 过滤用户模板的布局,只保留租户级允许的字段
        const filteredLayout = (userContent?.layout || []).filter((layoutItem: any) => {
          return tenantLevelTemplate || sysLevelTemplate ? tenantAllowedFields.includes(layoutItem.field) : true
        })
        // 返回过滤后的用户模板
        return {
          ...userTemplate,
          templateContent: JSON.stringify({
            ...userContent,
            layout: filteredLayout
          })
        }
      })
      return list
    }
  }
  // 解析TemplateContent
  getTemplateContentItem(item: any) {
    const templateContent = item?.templateContent ? JSON.parse(item.templateContent) : {}
    const newItem = {
      ...item,
      fixedColumns: templateContent.fixedColumns,
      version: templateContent.version,
      name: item.templateName,
      content: item.templateContent,
      contentParse: templateContent
    }
    return newItem
  }
  getTableTemplates() {
    if (!this.layoutTableId || !this.layoutPath) {
      return Promise.resolve([])
    }
    return new Promise(async (resolve, reject) => {
      request({
        url: '/ilp-common-service/mdInterfaceTemplate/getTableTemplates',
        method: 'post',
        data: {
          url: this.layoutPath,
          tableId: this.layoutTableId
        }
      })
        .then((res: any) => {
          const { sysLevelTemplate, tenantLevelTemplate, userLevelTemplates } = res
          // 系统布局
          if (sysLevelTemplate) {
            res.sysLevelTemplate = this.getTemplateContentItem(sysLevelTemplate)
          }
          // 租户布局
          if (tenantLevelTemplate) {
            const filterTenantLevelTemplate = this.filterLayoutByAllowedFields(res, TEMP_TYPE.TENANT)
            res.tenantLevelTemplate = this.getTemplateContentItem(filterTenantLevelTemplate)
          }
          // 用户布局
          if (userLevelTemplates.length) {
            res.userLevelTemplates = this.filterLayoutByAllowedFields(res, TEMP_TYPE.USER)
            res.userLevelTemplates = res.userLevelTemplates.map((template: any) => {
              return this.getTemplateContentItem(template)
            })
          }
          // console.log('【getTableTemplates】 -607', res)
          resolve(res)
        })
        .catch((err) => {
          reject([])
          console.error('【 err 】-607', err)
        })
    })
  }
}
