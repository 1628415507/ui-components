export const enum ROLE_TYPE {
  USER = 'U', // 用户级布局 principal_group_code != 1000 and is_super_admin != 1
  SYSTEM = 'S', // 系统级布局 principal_group_code = 1000
  TENANT = 'T' // 租户级布局 principal_group_code != 1000 and is_super_admin = 1
}

// 模板类型
export const enum TEMP_TYPE {
  USER = 'USER', // 用户级布局 principal_group_code != 1000 and is_super_admin != 1
  SYSTEM = 'SYS', // 系统级布局 principal_group_code = 1000
  TENANT = 'TENANT' // 租户级布局 principal_group_code != 1000 and is_super_admin = 1
}

export const enum ROW_STATUS {
  NEW = 4,
  MODIFIED = 16,
  DELETE = 8,
  ORIGIN = 2
}

