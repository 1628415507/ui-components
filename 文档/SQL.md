# SQL 知识梳理

## 一、DDL（数据定义语言）

DDL（Data Definition Language）用于定义和管理数据库结构，包括创建、修改和删除表与列等对象。

| 语句 | 作用 | 示例 |
| :--- | :--- | :--- |
| [`CREATE TABLE`](#10-创建表) | 创建表（可在列定义中声明约束） | `CREATE TABLE 表名(列名 类型 约束, ...);` |
| [`DROP TABLE`](#11-删除表) | 删除整张表 | `DROP TABLE 表名;` |
| [`ALTER TABLE ... RENAME`](#12-修改表名) | 修改表名 | `ALTER TABLE 旧表名 RENAME 新表名;` |
| [`ALTER TABLE ... CHANGE COLUMN`](#13-修改列名) | 修改列名（须重新指定列类型） | `ALTER TABLE 表名 CHANGE COLUMN 旧列名 新列名 类型;` |
| [`ALTER TABLE ... ADD COLUMN`](#14-添加新列) | 向表中添加新列 | `ALTER TABLE 表名 ADD COLUMN 新列名 类型;` |
| [`ALTER TABLE ... DROP COLUMN`](#15-删除指定列) | 删除表中的指定列 | `ALTER TABLE 表名 DROP COLUMN 列名;` |

### 1.0 创建表

使用 [`CREATE TABLE`](#一ddl数据定义语言) 创建表，可在列定义中直接声明 [`PRIMARY KEY`](#21-主键约束-primary-key)、[`UNIQUE`](#23-唯一性约束-unique)、[`NOT NULL`](#24-非空约束-not-null) 等约束：

```sql
CREATE TABLE 表名(
  列名 类型 约束,
  ...
);
```

示例：创建 `depts` 表，`department_id` 为主键且自动增长，`department_name` 不允许重复，`location_id` 不允许空值：

```sql
CREATE TABLE depts(
  department_id INT PRIMARY KEY AUTO_INCREMENT,
  department_name VARCHAR(30) UNIQUE,
  location_id INT NOT NULL
);
```

### 1.1 删除表

使用 [`DROP TABLE`](#一ddl数据定义语言) 语句删除表：

```sql
DROP TABLE 表名;
```

### 1.2 修改表名

使用 [`ALTER TABLE ... RENAME`](#一ddl数据定义语言) 修改表名，关键字为 `RENAME`：

```sql
ALTER TABLE 旧表名 RENAME 新表名;
```

### 1.3 修改列名

使用 [`ALTER TABLE ... CHANGE COLUMN`](#一ddl数据定义语言) 修改列名，须同时指定新列名与数据类型：

```sql
ALTER TABLE 表名 CHANGE COLUMN 旧列名 新列名 类型;
```

### 1.4 添加新列

使用 [`ALTER TABLE ... ADD COLUMN`](#一ddl数据定义语言) 向表中添加新列：

```sql
ALTER TABLE 表名 ADD COLUMN 新列名 类型;
```

示例：在 `emp` 表中添加佣金列 `commission_pct`：

```sql
ALTER TABLE emp ADD COLUMN commission_pct FLOAT(4,2);
```

### 1.5 删除指定列

使用 [`ALTER TABLE ... DROP COLUMN`](#一ddl数据定义语言) 删除表中的指定列：

```sql
ALTER TABLE 表名 DROP COLUMN 列名;
```

示例：删除 `emp` 表中的 `commission_pct` 列：

```sql
ALTER TABLE emp DROP COLUMN commission_pct;
```

## 二、约束

数据库约束是对表中数据的进一步限制，保证数据的正确性、有效性和完整性；可理解为数据库提供的一种数据校验方式。

| 约束 | 作用 | 关键规则 |
| :--- | :--- | :--- |
| [`PRIMARY KEY`（主键）](#21-主键约束-primary-key) | 唯一标识表中每条记录 | 不允许 NULL，不允许重复 |
| [`FOREIGN KEY`（外键）](#22-外键约束-foreign-key) | 维护表间参照关系 | 常与主键配合，值须存在于被引用表 |
| [`UNIQUE`（唯一性）](#23-唯一性约束-unique) | 确保列值唯一 | 一表可有多个，允许 NULL |
| [`NOT NULL`（非空）](#24-非空约束-not-null) | 禁止字段为空 | 可作用于多列，允许重复值 |
| [`CHECK`（检查）](#25-检查约束-check) | 按自定义条件校验数据 | MySQL 当前不支持 |

### 2.1 主键约束 (Primary Key)

[`PRIMARY KEY`](#二约束) 是使用最频繁的约束，一般每张表都会设置主键，用于唯一标识每条记录（如学生信息表中的学号）。

| 类型 | 说明 |
| :--- | :--- |
| 单一主键 | 使用一个列作为主键列，该列值重复时违反唯一约束 |
| 联合主键 | 使用多个列作为主键列，多列值组合相同时违反唯一约束 |

### 2.2 外键约束 (Foreign Key)

[`FOREIGN KEY`](#二约束) 常与 [`PRIMARY KEY`](#21-主键约束-primary-key) 一起使用，用来确保数据的一致性。

修改表添加外键约束：

```sql
ALTER TABLE 表名 ADD CONSTRAINT 约束名 FOREIGN KEY(列名) REFERENCES 参照的表名(参照的列名);
```

### 2.3 唯一性约束 (Unique)

[`UNIQUE`](#二约束) 与 [`PRIMARY KEY`](#21-主键约束-primary-key) 都能确保列值唯一；区别在于唯一约束在一个表中可以有多个，且允许列值为 NULL。

### 2.4 非空约束 (Not Null)

[`NOT NULL`](#二约束) 用来约束表中的字段不能为空。

删除非空约束：

```sql
ALTER TABLE 表名 MODIFY 列名 类型 NULL;
```

示例：删除 `emp` 表中 `salary` 的非空约束：

```sql
ALTER TABLE emp MODIFY salary FLOAT(8,2) NULL;
```

### 2.5 检查约束 (Check)

[`CHECK`](#二约束) 由用户自定义约束条件，确保数据满足特定规则；MySQL 当前不支持该约束。
