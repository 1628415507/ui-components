# SQL 知识梳理

## 一、DDL（数据定义语言）

DDL（Data Definition Language）用于定义和管理数据库结构，包括创建、修改和删除表与列等对象。


| 语句                                          | 作用              | 示例                                         |
| ------------------------------------------- | --------------- | ------------------------------------------ |
| `[CREATE TABLE](#10-创建表)`                   | 创建表（可在列定义中声明约束） | `CREATE TABLE 表名(列名 类型 约束, ...);`          |
| `[DROP TABLE](#11-删除表)`                     | 删除整张表           | `DROP TABLE 表名;`                           |
| `[ALTER TABLE ... RENAME](#12-修改表名)`        | 修改表名            | `ALTER TABLE 旧表名 RENAME 新表名;`              |
| `[ALTER TABLE ... CHANGE COLUMN](#13-修改列名)` | 修改列名（须重新指定列类型）  | `ALTER TABLE 表名 CHANGE COLUMN 旧列名 新列名 类型;` |
| `[ALTER TABLE ... ADD COLUMN](#14-添加新列)`    | 向表中添加新列         | `ALTER TABLE 表名 ADD COLUMN 新列名 类型;`        |
| `[ALTER TABLE ... DROP COLUMN](#15-删除指定列)`  | 删除表中的指定列        | `ALTER TABLE 表名 DROP COLUMN 列名;`           |


### 1.0 创建表

使用 `[CREATE TABLE](#一ddl数据定义语言)` 创建表，可在列定义中直接声明 `[PRIMARY KEY](#21-主键约束-primary-key)`、`[UNIQUE](#23-唯一性约束-unique)`、`[NOT NULL](#24-非空约束-not-null)` 等约束：

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

创建表时可通过 `DEFAULT` 指定列的默认值：

```sql
CREATE TABLE 表名(列名 类型 DEFAULT 默认值, ...);
```

### 1.1 删除表

使用 `[DROP TABLE](#一ddl数据定义语言)` 语句删除表：

```sql
DROP TABLE 表名;
```

### 1.2 修改表名

使用 `[ALTER TABLE ... RENAME](#一ddl数据定义语言)` 修改表名，关键字为 `RENAME`：

```sql
ALTER TABLE 旧表名 RENAME 新表名;
```

### 1.3 修改列名

使用 `[ALTER TABLE ... CHANGE COLUMN](#一ddl数据定义语言)` 修改列名，须同时指定新列名与数据类型：

```sql
ALTER TABLE 表名 CHANGE COLUMN 旧列名 新列名 类型;
```

### 1.4 添加新列

使用 `[ALTER TABLE ... ADD COLUMN](#一ddl数据定义语言)` 向表中添加新列：

```sql
ALTER TABLE 表名 ADD COLUMN 新列名 类型;
```

示例：在 `emp` 表中添加佣金列 `commission_pct`：

```sql
ALTER TABLE emp ADD COLUMN commission_pct FLOAT(4,2);
```

### 1.5 删除指定列

使用 `[ALTER TABLE ... DROP COLUMN](#一ddl数据定义语言)` 删除表中的指定列：

```sql
ALTER TABLE 表名 DROP COLUMN 列名;
```

示例：删除 `emp` 表中的 `commission_pct` 列：

```sql
ALTER TABLE emp DROP COLUMN commission_pct;
```

## 二、约束

数据库约束是对表中数据的进一步限制，保证数据的正确性、有效性和完整性；可理解为数据库提供的一种数据校验方式。


| 约束                                        | 作用         | 关键规则             |
| ----------------------------------------- | ---------- | ---------------- |
| `PRIMARY KEY`[（主键）](#21-主键约束-primary-key) | 唯一标识表中每条记录 | 不允许 NULL，不允许重复   |
| `FOREIGN KEY`[（外键）](#22-外键约束-foreign-key) | 维护表间参照关系   | 常与主键配合，值须存在于被引用表 |
| `UNIQUE`[（唯一性）](#23-唯一性约束-unique)         | 确保列值唯一     | 一表可有多个，允许 NULL   |
| `NOT NULL`[（非空）](#24-非空约束-not-null)       | 禁止字段为空     | 可作用于多列，允许重复值     |
| `CHECK`[（检查）](#25-检查约束-check)             | 按自定义条件校验数据 | MySQL 当前不支持      |


### 2.1 主键约束 (Primary Key)

`[PRIMARY KEY](#二约束)` 是使用最频繁的约束，一般每张表都会设置主键，用于唯一标识每条记录（如学生信息表中的学号）。


| 类型   | 说明                        |
| ---- | ------------------------- |
| 单一主键 | 使用一个列作为主键列，该列值重复时违反唯一约束   |
| 联合主键 | 使用多个列作为主键列，多列值组合相同时违反唯一约束 |


### 2.2 外键约束 (Foreign Key)

`[FOREIGN KEY](#二约束)` 常与 `[PRIMARY KEY](#21-主键约束-primary-key)` 一起使用，用来确保数据的一致性。

修改表添加外键约束：

```sql
ALTER TABLE 表名 ADD CONSTRAINT 约束名 FOREIGN KEY(列名) REFERENCES 参照的表名(参照的列名);
```

### 2.3 唯一性约束 (Unique)

`[UNIQUE](#二约束)` 与 `[PRIMARY KEY](#21-主键约束-primary-key)` 都能确保列值唯一；区别在于唯一约束在一个表中可以有多个，且允许列值为 NULL。

### 2.4 非空约束 (Not Null)

`[NOT NULL](#二约束)` 用来约束表中的字段不能为空。

删除非空约束：

```sql
ALTER TABLE 表名 MODIFY 列名 类型 NULL;
```

示例：删除 `emp` 表中 `salary` 的非空约束：

```sql
ALTER TABLE emp MODIFY salary FLOAT(8,2) NULL;
```

### 2.5 检查约束 (Check)

`[CHECK](#二约束)` 由用户自定义约束条件，确保数据满足特定规则；MySQL 当前不支持该约束。

## 三、DML（数据操纵语言）

DML（Data Manipulation Language）用于对表中的数据进行增、删、改等操作。


| 语句                             | 作用       | 示例                             |
| ------------------------------ | -------- | ------------------------------ |
| `[UPDATE](#31-更新数据-update)`    | 更新表中已有数据 | `UPDATE 表名 SET 列名=值 WHERE 条件;` |
| `[DELETE](#32-删除数据-delete)`    | 按条件删除数据  | `DELETE FROM 表名 WHERE 条件;`     |
| `[TRUNCATE](#33-清空表-truncate)` | 清空表中全部数据 | `TRUNCATE TABLE 表名;`           |


### 3.1 更新数据 (UPDATE)

使用 `[UPDATE](#三dml数据操纵语言)` 更新表中数据，可同时修改多列，须通过 `WHERE` 指定更新条件：

```sql
UPDATE 表名 SET 列名=值, 列名=值 WHERE 条件;
```

### 3.2 删除数据 (DELETE)

使用 `[DELETE](#三dml数据操纵语言)` 按条件删除表中的数据：

```sql
DELETE FROM 表名 WHERE 条件;
```

### 3.3 清空表 (TRUNCATE)

使用 `[TRUNCATE](#三dml数据操纵语言)` 清空表中全部数据：

```sql
TRUNCATE TABLE 表名;
```

## 四、DQL（数据查询语言）

DQL（Data Query Language）用于从表中查询数据，核心语句为 `SELECT`。


| 语法                              | 作用                | 示例                                       |
| ------------------------------- | ----------------- | ---------------------------------------- |
| `[SELECT](#四dql数据查询语言)`         | 查询指定列             | `SELECT 列名 FROM 表名 WHERE 条件;`            |
| `[DISTINCT](#44-去重查询-distinct)` | 去除结果中的重复行         | `SELECT DISTINCT 列名 FROM 表名;`            |
| `[列别名](#42-列别名)`                | 为结果列指定显示名称        | `SELECT 列名 AS 列别名 FROM 表名;`              |
| `[表别名](#43-表别名)`                | 为表指定短名，用于限定列      | `SELECT 表别名.列名 FROM 表名 AS 表别名 WHERE 条件;` |
| `[NULL](#41-null空值)`            | 表示缺失、未知或不适用的值     | `列名 IS NULL`                             |
| `[比较条件](#45-比较条件)`              | 用于 `WHERE` 子句比较过滤 | `列名 > 值`                                 |
| `[IN](#46-in-条件)`               | 测试值是否在列表中         | `列名 IN (值1, 值2)`                         |
| `[LIKE](#47-like-条件)`           | 通配符模糊匹配           | `列名 LIKE 'S%'`                           |
| `[优先规则](#48-优先规则)`              | 运算符求值顺序           | 见 [4.8](#48-优先规则)                        |
| `[ORDER BY](#49-排序-order-by)`   | 对查询结果排序           | `ORDER BY 列名 DESC`                       |


### 4.1 NULL（空值）

`[NULL](#四dql数据查询语言)` 是一个未分配的、未知的或不适用的值；**不是 `0`，也不是空格**（`0` 是数字，空格是字符）。若一行中某列缺少数据值，该值被置为 `NULL`。

```sql
SELECT last_name, job_id, salary, commission_pct
FROM employees;
```

查询结果中，`commission_pct` 为空表示该员工无佣金（如 King、Kochhar），有值则表示存在佣金比例（如 Zlotkey 为 `.2`）。

NULL 条件包括 `IS NULL` 与 `IS NOT NULL`，用于空值测试；**不能使用 `=` 或 `<>` 判断 NULL**，因为 NULL 不能等于或不等于任何值。

```sql
SELECT 列名 FROM 表名 WHERE 列名 IS NULL;
SELECT 列名 FROM 表名 WHERE 列名 IS NOT NULL;
```

### 4.2 列别名

使用 `[列别名](#四dql数据查询语言)` 为查询结果中的列指定显示名称，`AS` 关键字可省略：

```sql
SELECT 列名 AS 列别名 FROM 表名 WHERE 条件;
```

示例：

```sql
SELECT last_name AS name, commission_pct comm
FROM employees;
```

结果列标题显示为 `NAME` 与 `COMM`。

### 4.3 表别名

使用 `[表别名](#四dql数据查询语言)` 为表指定短名，通过 `表别名.列名` 限定列来源：

```sql
SELECT 表别名.列名 FROM 表名 AS 表别名 WHERE 条件;
```

### 4.4 去重查询 (DISTINCT)

使用 `[DISTINCT](#四dql数据查询语言)` 去除结果中的重复行（去重是以整行来判断是否重复的）：

```sql
SELECT DISTINCT 列名 FROM 表名;
```

### 4.5 比较条件

`[比较条件](#四dql数据查询语言)` 用于 `WHERE` 子句中对列值进行比较过滤：


| 运算        | 含义   |
| --------- | ---- |
| `=`       | 等于   |
| `>`       | 大于   |
| `>=`      | 大于等于 |
| `<`       | 小于   |
| `<=`      | 小于等于 |
| `<>`、`!=` | 不等于  |


### 4.6 IN 条件

使用 `[IN](#四dql数据查询语言)` 成员条件测试列值是否在列表中：

```sql
SELECT 列名 FROM 表名 WHERE 列名 IN (值1, 值2, ...);
```

### 4.7 LIKE 条件

使用 `[LIKE](#四dql数据查询语言)` 对字符串执行通配符搜索，搜索条件可包含文字或数字：


| 通配符 | 含义      |
| --- | ------- |
| `%` | 零个或多个字符 |
| `_` | 一个字符    |


```sql
SELECT 列名 FROM 表名 WHERE 列名 LIKE '模式';
```

示例：查询 `first_name` 以 `S` 开头的员工：

```sql
SELECT first_name
FROM employees
WHERE first_name LIKE 'S%';
```

### 4.8 优先规则

`[WHERE](#四dql数据查询语言)` 子句中多个条件按以下顺序求值（数字越小优先级越高）：


| 求值顺序 | 运算                                |
| ---- | --------------------------------- |
| 1    | 算术运算                              |
| 2    | 连字操作                              |
| 3    | 比较操作                              |
| 4    | `IS [NOT] NULL`、`LIKE`、`[NOT] IN` |
| 5    | `[NOT] BETWEEN`                   |
| 6    | `NOT` 逻辑条件                        |
| 7    | `AND` 逻辑条件                        |
| 8    | `OR` 逻辑条件                         |


可使用圆括号改变优先规则。

### 4.9 排序 (ORDER BY)

使用 `[ORDER BY](#四dql数据查询语言)` 对查询结果排序：

```sql
SELECT 列名 FROM 表名 ORDER BY 列名 [ASC | DESC];
```

**多列排序**：`ORDER BY` 列表的顺序就是排序的顺序；先按第一列排序，相同值再按后续列排序。

```sql
SELECT last_name, department_id, salary
FROM employees
ORDER BY department_id, salary DESC;
```

**使用列别名排序**：可在 `ORDER BY` 中引用 `[列别名](#42-列别名)`：

```sql
SELECT employee_id, last_name, salary*12 annsal
FROM employees
ORDER BY annsal;
```

## 五、SQL 函数

SQL 函数用于在查询中对数据进行转换、提取与计算，常见分类包括 [字符函数](#51-字符函数)、[日期函数](#52-日期函数) 与 [通用函数](#53-通用函数)。


| 分类               | 作用                      |
| ---------------- | ----------------------- |
| [字符函数](#51-字符函数) | 大小写转换、字符串拼接、截取与替换等      |
| [日期函数](#52-日期函数) | 获取当前日期时间、提取日期部分、计算日期间隔等 |
| [通用函数](#53-通用函数) | 条件判断、NULL 值处理等          |


### 5.1 字符函数

#### 5.1.1 大小写处理函数


| 函数                      | 描述             | 示例                                |
| ----------------------- | -------------- | --------------------------------- |
| `LOWER(s)` | `LCASE(s)` | 将字符串 `s` 转换为小写 | `SELECT LOWER("OLDLU"); -- oldlu` |
| `UPPER(s)` | `UCASE(s)` | 将字符串 `s` 转换为大写 | `SELECT UPPER("oldlu"); -- OLDLU` |


#### 5.1.2 字符处理函数


| 函数                          | 描述                                   | 示例                                                                   |
| --------------------------- | ------------------------------------ | -------------------------------------------------------------------- |
| `LENGTH(s)`                 | 返回字符串 `s` 的长度                        | `SELECT LENGTH("oldlu"); -- 5`                                       |
| `CONCAT(s1,s2,...sn)`       | 将多个字符串合并为一个                          | `SELECT CONCAT("sxt ", "teacher", ", oldlu"); -- sxt teacher, oldlu` |
| `LPAD(s1,len,s2)`           | 在 `s1` 开始处填充 `s2`，使长度达到 `len`        | `SELECT LPAD('oldlu',8,'x'); -- xxxoldlu`                            |
| `LTRIM(s)`                  | 去掉字符串 `s` 开始处的空格                     | `SELECT LTRIM(" oldlu"); -- oldlu`                                   |
| `REPLACE(s,s1,s2)`          | 将 `s` 中的 `s1` 替换为 `s2`               | `SELECT REPLACE('oldlu','o','O'); -- Oldlu`                          |
| `REVERSE(s)`                | 将字符串 `s` 的顺序反转                       | `SELECT REVERSE('abc'); -- cba`                                      |
| `RPAD(s1,len,s2)`           | 在 `s1` 结尾处填充 `s2`，使长度达到 `len`        | `SELECT RPAD('oldlu',8,'x'); -- oldluxxx`                            |
| `RTRIM(s)`                  | 去掉字符串 `s` 结尾处的空格                     | `SELECT RTRIM("oldlu "); -- oldlu`                                   |
| `SUBSTR(s,start,length)`    | 从 `s` 的 `start` 位置截取长度为 `length` 的子串 | `SELECT SUBSTR("OLDLU", 2, 3); -- LDL`                               |
| `SUBSTRING(s,start,length)` | 同 `SUBSTR`，截取指定子串                    | `SELECT SUBSTRING("OLDLU", 2, 3); -- LDL`                            |


### 5.2 日期函数

MySQL 允许直接使用字符串表示日期，格式须为 `'YYYY-MM-DD HH:MI:SS'` 或 `'YYYY/MM/DD HH:MI:SS'`。


| 函数                | 描述                              | 示例                                                   |
| ----------------- | ------------------------------- | ---------------------------------------------------- |
| `CURDATE()`       | 返回当前日期                          | `SELECT CURDATE(); -- 2018-09-19`                    |
| `CURTIME()`       | 返回当前时间                          | `SELECT CURTIME(); -- 19:59:02`                      |
| `CURRENT_DATE()`  | 返回当前日期                          | `SELECT CURRENT_DATE(); -- 2018-09-19`               |
| `CURRENT_TIME()`  | 返回当前时间                          | `SELECT CURRENT_TIME(); -- 19:59:02`                 |
| `DATE()`          | 从日期或日期时间表达式中提取日期值               | `SELECT DATE("2017-06-15"); -- 2017-06-15`           |
| `DATEDIFF(d1,d2)` | 计算 `d1` 到 `d2` 之间相隔的天数          | `SELECT DATEDIFF('2001-01-01','2001-02-02'); -- -32` |
| `DAY(d)`          | 返回日期值 `d` 的日期部分                 | `SELECT DAY("2017-06-15"); -- 15`                    |
| `DAYNAME(d)`      | 返回日期 `d` 是星期几                   | `SELECT DAYNAME('2011-11-11 11:11:11'); -- Friday`   |
| `DAYOFMONTH(d)`   | 计算日期 `d` 是本月的第几天                | `SELECT DAYOFMONTH('2011-11-11 11:11:11'); -- 11`    |
| `DAYOFWEEK(d)`    | 返回日期 `d` 是星期几（1 星期日，2 星期一，以此类推） | `SELECT DAYOFWEEK('2011-11-11 11:11:11'); -- 6`      |
| `DAYOFYEAR(d)`    | 计算日期 `d` 是本年的第几天                | `SELECT DAYOFYEAR('2011-11-11 11:11:11');`           |


### 5.3 通用函数

`[通用函数](#五sql-函数)` 用于条件判断与 `[NULL](#41-null空值)` 值处理：


| 函数                                 | 描述                                         | 示例                                                                                 |
| ---------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------- |
| `IF(expr,v1,v2)`                   | 若 `expr` 成立返回 `v1`，否则返回 `v2`               | `SELECT IF(1 > 0, '正确', '错误'); -- 正确`                                              |
| `IFNULL(v1,v2)`                    | 若 `v1` 不为 NULL 返回 `v1`，否则返回 `v2`           | `SELECT IFNULL(null, 'Hello Word'); -- Hello Word`                                 |
| `ISNULL(expression)`               | 判断表达式是否为 NULL                              | `SELECT ISNULL(NULL); -- 1`                                                        |
| `NULLIF(expr1,expr2)`              | 若 `expr1` 与 `expr2` 相等返回 NULL，否则返回 `expr1` | `SELECT NULLIF(25, 25); -- NULL`                                                   |
| `COALESCE(expr1,expr2,...,expr_n)` | 从左向右返回第一个非 NULL 表达式                        | `SELECT COALESCE(NULL, NULL, NULL, 'bjsxt.com', NULL, 'google.com'); -- bjsxt.com` |
| `CASE ... END`                     | 按条件分支返回值，首个匹配成立后后续不再执行                     | 见下方示例                                                                              |


`CASE` 表示函数开始，`END` 表示结束；`condition` 成立则返回对应 `result`，全部不成立则返回 `ELSE` 的 `result`：

```sql
SELECT CASE 'oldlu'
  WHEN 'oldlu' THEN 'OLDLU'
  WHEN 'admin' THEN 'ADMIN'
  ELSE 'kevin'
END;
```

## 六、表连接

多表查询通过连接将多个表的数据组合在一起。MySQL 5.7 支持部分 SQL99 标准。


| 连接类型                                          | 作用               | 示例                                                    |
| --------------------------------------------- | ---------------- | ----------------------------------------------------- |
| [表别名](#61-表别名多表查询)                            | 简化多表查询、快速标识列所属表  | `FROM 表1 e, 表2 d WHERE e.id = d.id`                   |
| [自连接](#62-自连接)                                | 单表按层级或关联关系自关联    | `FROM employees worker JOIN employees manager ON ...` |
| [CROSS JOIN](#63-交叉连接-cross-join)             | 两表笛卡尔积（交叉乘积）     | `FROM 表1 CROSS JOIN 表2`                               |
| [NATURAL JOIN](#64-自然连接-natural-join)         | 按同名同类型列自动等值连接    | `FROM 表1 NATURAL JOIN 表2`                             |
| [INNER JOIN](#65-内连接-inner-join)              | 返回两表匹配的行（交集）     | `FROM 表1 INNER JOIN 表2 ON 条件`                         |
| [多表连接](#66-多表连接on-子句)                         | 连续 `ON` 连接三张及以上表 | `JOIN 表2 ON ... JOIN 表3 ON ...`                       |
| [LEFT OUTER JOIN](#68-左外连接-left-outer-join)   | 返回左表全部行及右表匹配行    | `FROM 表1 LEFT OUTER JOIN 表2 ON 条件`                    |
| [RIGHT OUTER JOIN](#69-右外连接-right-outer-join) | 返回右表全部行及左表匹配行    | `FROM 表1 RIGHT OUTER JOIN 表2 ON 条件`                   |
| [FULL OUTER JOIN](#610-全外连接-full-outer-join) | 返回两表全部行（MySQL 需 UNION 模拟） | 见 [6.10](#610-全外连接-full-outer-join)                    |


### 6.1 表别名（多表查询）

多表连接中常用 `[表别名](#43-表别名)` 简化查询，便于数据库引擎快速识别列所属表。

**定义原则**：

- 别名不宜过长，越短越好
- 别名应有意义（如取表名首字母）
- 表别名仅对当前 `SELECT` 语句有效

```sql
SELECT e.employee_id, e.last_name, e.department_id,
       d.department_id, d.location_id
FROM employees e, departments d 
WHERE e.department_id = d.department_id;
```

### 6.2 自连接

`[自连接](#六表连接)` 将同一张表视为两个逻辑表进行关联，常用于层级关系查询（如员工与经理）：

```sql
SELECT worker.last_name AS employee, manager.last_name AS manager
FROM employees worker
JOIN employees manager
ON worker.manager_id = manager.employee_id;
```

`worker` 表中的 `manager_id` 等于 `manager` 表中的 `employee_id`。

### 6.3 交叉连接 (CROSS JOIN)（少用）

`[CROSS JOIN](#六表连接)` 产生两表的交叉乘积，等同于两表之间的笛卡尔积：

```sql
SELECT last_name, department_name
FROM employees
CROSS JOIN departments;
```

### 6.4 自然连接 (NATURAL JOIN)

`[NATURAL JOIN](#六表连接)` 基于两表中**所有同名且同数据类型**的列进行等值连接，选取这些列值均相等的行。

若列名相同但数据类型不同，使用 `NATURAL JOIN` 会报错。

### 6.5 内连接 (INNER JOIN)

`[INNER JOIN](#六表连接)` 连接两个表，仅返回匹配的行（交集），`INNER` 关键字可省略：

```sql
SELECT 查询列表
FROM 表1 别名
INNER JOIN 连接表 ON 连接条件;
```

```sql
SELECT e.last_name, d.department_name
FROM employees e
INNER JOIN departments d
ON e.department_id = d.department_id;
```

### 6.6 多表连接（ON 子句）

使用 `[ON](#六表连接)` 子句可连续连接多张表，每次 `JOIN` 指定一组连接条件：

```sql
SELECT employee_id, city, department_name
FROM employees e
JOIN departments d
  ON d.department_id = e.department_id
JOIN locations l
  ON d.location_id = l.location_id;
```

### 6.7 外连接 (OUTER JOIN)

`[外连接](#六表连接)` 在内连接结果基础上，额外返回某一侧（或两侧）未匹配的行：


| 连接类型    | 说明                      |
| ------- | ----------------------- |
| 内连接     | 仅返回两表匹配的行               |
| 左（右）外连接 | 返回内连接结果，同时返回左（右）表中未匹配的行 |
| 全外连接    | 返回内连接结果，同时返回左、右两侧未匹配的行  |


**孤儿数据**：被连接列的值为 `[NULL](#41-null空值)` 的数据，无法与另一表匹配。

### 6.8 左外连接 (LEFT OUTER JOIN)

`[LEFT OUTER JOIN](#六表连接)` 返回**左表全部**行及右表匹配行；右表无匹配时，右表列补 `NULL`：

```sql
SELECT e.last_name, e.department_id, d.department_name
FROM employees e
LEFT OUTER JOIN departments d
ON (e.department_id = d.department_id);
```

### 6.9 右外连接 (RIGHT OUTER JOIN)

`[RIGHT OUTER JOIN](#六表连接)` 返回**右表全部**行及左表匹配行；左表无匹配时，左表列补 `NULL`：

```sql
SELECT e.last_name, e.department_id, d.department_name
FROM employees e
RIGHT OUTER JOIN departments d
ON (e.department_id = d.department_id);
```

### 6.10 全外连接 (FULL OUTER JOIN)

[`FULL OUTER JOIN`](#67-外连接-outer-join) 返回两表全部行（左表与右表并集）；**MySQL 不支持 `FULL OUTER JOIN`**，可通过 `UNION` 模拟：

| 关键字 | 说明 |
| :--- | :--- |
| `UNION` | 合并两个结果集并返回唯一行（去重） |
| `UNION ALL` | 简单合并两个结果集，保留重复行 |

```sql
(SELECT 投影列 FROM 表1 LEFT OUTER JOIN 表2 ON 连接条件)
UNION
(SELECT 投影列 FROM 表1 RIGHT OUTER JOIN 表2 ON 连接条件);
```
