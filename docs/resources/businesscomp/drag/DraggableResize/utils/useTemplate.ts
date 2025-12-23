import request from '../../../../../../src/utils/request'
import type { DragConfig } from '../type/index'

export default class useTemplate {
  private dragConfig: DragConfig
  private url: string

  constructor (dragConfig: any, url) {
    // this.storageKey = dragConfig.code
    this.dragConfig = dragConfig
    this.url = url
  }

  saveMdInterfaceTemplate (level, saveTemplate) {
    // console.log(' saveTemplate】 -14', saveTemplate)
    return new Promise((resolve, reject) => {
      request({
        url: '/ilp-common-service/mdInterfaceTemplate/saveMdInterfaceTemplate',
        method: 'post',
        data: {
          ...saveTemplate,
          // mdInterfaceTemplateId: '',// saveTemplate?.mdInterfaceTemplateId || null,//可选,修改时必填,新增时不填
          templateType: 'LAYOUT', // 必填,模板类型:TABLE/FILTER/LAYOUT
          // templateName: `${level}_DEFAULT`,//可选,模板名称
          level, // 必填,模板级别:SYS/TENANT/USER
          url: this.url,
          isDefault: 1
        }
      })
        .then((res) => {
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }

  getLayoutTemplates() {
    return new Promise((resolve, reject) => {
      request({
        url: '/ilp-common-service/mdInterfaceTemplate/getLayoutTemplates',
        method: 'post',
        data: {
          url: this.url
        }
      })
        .then((res) => {
          if (res?.userLevelTemplates?.length) {
            // 取最新版本为默认模板
            const defaultUserTemp = res.userLevelTemplates.reduce((max, item) => {
              const maxTemplateContent = JSON.parse(max.templateContent)
              const curTemplateContent = JSON.parse(item.templateContent)
              return curTemplateContent.version > maxTemplateContent.version ? item : max
            })
            res.userLevelTemplates = res.userLevelTemplates?.map((it) => {
              it.isDefault = defaultUserTemp.mdInterfaceTemplateId === it.mdInterfaceTemplateId ? 1 : 0
              return it
            })
          }
          if (res?.tenantLevelTemplates?.length) {
            // 取最新版本为默认模板
            const defaultTenantTemp = res.tenantLevelTemplates.reduce((max, item) => {
              const maxTemplateContent = JSON.parse(max.templateContent)
              const curTemplateContent = JSON.parse(item.templateContent)
              return curTemplateContent.version > maxTemplateContent.version ? item : max
            })
            res.tenantLevelTemplates = res.tenantLevelTemplates?.map((it) => {
              it.isDefault = defaultTenantTemp.mdInterfaceTemplateId === it.mdInterfaceTemplateId ? 1 : 0
              return it
            })
          }
          resolve(res)
        })
        .catch((err) => {
          reject({})
        })
      // const store = JSON.parse(localStorage.getItem(this.storageKey) || '{}')
      // resolve({
      //   templateContent: store
      // })
    })
  }

  deleteLayout(templateId: string) {
    console.log('( templateId 】-69', templateId)
    return new Promise((resolve, reject) => {
      request({
        url: '/ilp-common-service/mdInterfaceTemplate/deleteById',
        method: 'post',
        data: templateId?.toString(),
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

  getTenant() {
    return new Promise((resolve, reject) => {
      request({
        url: '/ilp-mp-service/mpTenant/search',
        method: 'post',
        data: {
          pageNum: 1,
          pageSize: 10,
          status: 'ACTIVE'
        }
      })
        .then((res) => {
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }

  getSubscribesByTemplateId(mdInterfaceTemplateId: string) {
    return new Promise((resolve, reject) => {
      request({
        url: '/ilp-common-service/mdInterfaceTemplateSubscribe/getSubscribesByTemplateId',
        method: 'post',
        data: mdInterfaceTemplateId
      })
        .then((res) => {
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }

  saveSubscribes(data) {
    return new Promise((resolve, reject) => {
      request({
        url: '/ilp-common-service/mdInterfaceTemplateSubscribe/saveSubscribes',
        method: 'post',
        data
      })
        .then((res) => {
          resolve(res)
        })
        .catch(() => {
          reject(false)
        })
    })
  }
}

