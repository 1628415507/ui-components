>  [Redis 知识梳理](https://www.bilibili.com/video/BV1cr4y1671t/?spm_id_from=333.337.search-card.all.click)
> Redis (Remote Dictionary Server) 诞生于 2009 年，是一个**基于内存**的键值型 NoSQL 数据库。

# 一、 SQL vs NoSQL 核心对比

在选择数据库时，需要根据业务场景在传统关系型数据库（SQL）与非关系型数据库（NoSQL）之间进行权衡。


| 特性       | SQL (关系型数据库)             | NoSQL (非关系型数据库)             |
| -------- | ------------------------ | --------------------------- |
| **数据结构** | 结构化 (Structured)，表格式     | 非结构化/半结构化，格式灵活              |
| **数据关联** | 关联的 (Relational)，支持强外键约束 | 无关联的 (Non-relational)       |
| **查询方式** | SQL 查询 (标准语法)            | 非 SQL 查询 (API 或特定语法)        |
| **事务特性** | ACID (原子性、一致性、隔离性、持久性)   | BASE (基本可用、软状态、最终一致性)       |
| **存储方式** | 磁盘存储 (Disk)              | 内存存储 (Memory)               |
| **扩展性**  | 垂直扩展 (提高单机性能)            | 水平扩展 (通过集群增加节点)             |
| **使用场景** | 数据结构固定、相关业务对安全性/一致性要求高   | 数据结构不固定、对一致性/安全性要求不高、对性能要求高 |




## 1.1 NoSQL 常见分类


| 类型           | 代表产品            | 核心特点                 |
| ------------ | --------------- | -------------------- |
| **键值类型**     | [Redis](#redis) | 极高性能，常用于缓存、会话管理      |
| **文档类型**     | MongoDB         | 灵活的 JSON 结构，适合复杂嵌套数据 |
| **列类型**      | HBase           | 适合海量数据存储与随机查询        |
| **Graph 类型** | Neo4j           | 擅长处理复杂的社交关系或路径搜索     |




# 二、 Redis 核心特征

Redis 以其极高的**读写速度**和丰富的数据类型成为最受欢迎的键值存储系统。

- 查询Redis缓存比查询SQL的速度更快


| 特性         | 说明                                                                  |
| ---------- | ------------------------------------------------------------------- |
| **键值型**    | 以 Key-Value 形式存储，Value 支持 String, **List, Set, Hash, ZSet** 等多种数据结构 |
| **单线程**    | 核心网络 IO 与键值读写由单线程完成，每个命令具备原子性，避免了多线程竞争                              |
| **低延迟/快**  | 基于内存操作，使用 IO 多路复用模型，具备良好的底层数据结构编码优化                                 |
| **持久化**    | 支持 RDB (内存快照) 和 AOF (追加文件) 两种方式，平衡性能与数据安全性                          |
| **高可用与扩展** | 支持主从集群、分片集群，可实现高可用与水平扩展                                             |
| **多语言支持**  | 提供丰富的多语言客户端 SDK，方便各类应用集成                                            |


---



# 三、 Redis 安装

- 先安装linux
- 安装redis
- 修改启动配置文件；开机自启



# 四、 Redis 通用命令

与具体 Value 类型无关、多数场景均可使用的命令。在 `redis-cli` 中可用 `help [command]` 查看用法摘要，例如 `help keys` 会输出 `KEYS pattern` 及说明。


| 命令         | 作用                     | 示例 / 注意                                              |
| ---------- | ---------------------- | ---------------------------------------------------- |
| **KEYS**   | 按模式列出匹配的 key           | `KEYS` * 列出全部；`KEYS a`* 匹配前缀；**生产环境不建议使用**（全库扫描可能阻塞） |
| **DEL**    | 删除指定 key               | `DEL key [key ...]`；`help del` 可查语法                  |
| **EXISTS** | 判断 key 是否存在            | `EXISTS key`                                         |
| **EXPIRE** | 为 key 设置过期时间（秒），到期自动删除 | `EXPIRE key seconds`                                 |
| **TTL**    | 查看 key 剩余存活时间（秒）       | 无过期或 key 不存在时返回值语义以 `help ttl` 为准                    |


```text
127.0.0.1:6379> help keys
KEYS pattern
summary: Find all keys matching the given pattern

<!-- 列出全部 -->
127.0.0.1:6379> KEYS *
1) "age"
2) "name"

<!-- 匹配前缀a开头的key值 -->
127.0.0.1:6379> KEYS a*
1) "age"
```



# 五、 String 类型与 key 规范

Redis 中最基础的 Value 类型；value 虽为字符串，按内容可分为三类。无论哪种形态，底层均以**字节数组**存储（编码方式不同）；单个 String 值最大 **512MB**。


| 形态         | 说明            | 示例（key → value）       |
| ---------- | ------------- | --------------------- |
| **string** | 普通字符串         | `msg` → `hello world` |
| **int**    | 整数，可做自增、自减    | `num` → `10`          |
| **float**  | 浮点数，可按步长自增、自减 | `score` → `92.5`      |




## 5.1 key 的结构

- key 可由多段英文单词组成，段间用冒号 `:` 分隔，形成层级，便于区分业务。
- 推荐形态为 `项目名:业务名:类型:id`，段数可按需要增减。


| KEY               | VALUE                                     |
| ----------------- | ----------------------------------------- |
| `heima:user:1`    | `{"id":1, "name": "Jack", "age": 21}`     |
| `heima:product:1` | `{"id":1, "name": "小米11", "price": 4999}` |


值为 Java 对象时，先序列化为 **JSON 字符串**再写入 Redis；应用侧存取见 [Spring Boot 整合 Redis](#spring-boot-redis) 中的 `StringRedisTemplate`。

## 5.2 String 常见命令


| 命令              | 作用                   | 语法                               | 示例                                                                   |
| --------------- | -------------------- | -------------------------------- | -------------------------------------------------------------------- |
| **SET**         | 添加或修改 String 键值对     | `SET key value`                  | `SET msg "hello world"`                                              |
| **GET**         | 按 key 获取 value       | `GET key`                        | `GET msg`                                                            |
| **MSET**        | 批量添加多个键值对            | `MSET key value [key value ...]` | `MSET name Jack age 21`                                              |
| **MGET**        | 按多个 key 批量获取 value   | `MGET key [key ...]`             | `MGET name age`                                                      |
| **INCR**        | 整型 value 自增 1        | `INCR key`                       | `INCR num`（value 须为整数形态）                                             |
| **INCRBY**      | 整型 value 按步长自增       | `INCRBY key increment`           | `INCRBY num 2`                                                       |
| **INCRBYFLOAT** | 浮点 value 按步长自增       | `INCRBYFLOAT key increment`      | `INCRBYFLOAT score 0.5`                                              |
| **SETNX**       | 仅当 key 不存在时写入，否则不执行  | `SETNX key value`                | `SETNX lock 1`                                                       |
| **SETEX**       | 写入 String 并指定过期时间（秒） | `SETEX key seconds value`        | `SETEX token 3600 abc`；等价于 SET 后配合 [EXPIRE](#redis-generic-commands) |




## 5.3 Hash 类型与常见命令

- Hash（哈希）在单个 key 下保存多组 **field-value**，**适合同一实体的多个属性**；
- field 与 value 均为字符串。
- key 命名仍遵循 [key 结构](#redis-key-structure)，例如 `heima:user:1`、`heima:user:2` 各自包含 `name`、`age` 等 field（与 [String](#redis-string) 存整段 JSON 是不同建模方式）。


| 命令          | 作用                       | 语法                                        | 示例                                      |
| ----------- | ------------------------ | ----------------------------------------- | --------------------------------------- |
| **HSET**    | 添加或修改指定 field            | `HSET key field value`                    | `HSET heima:user:1 name Jack`           |
| **HGET**    | 获取指定 field 的 value       | `HGET key field`                          | `HGET heima:user:1 name`                |
| **HMSET**   | 批量设置多个 field             | `HMSET key field value [field value ...]` | `HMSET heima:user:1 name Jack age 21`   |
| **HMGET**   | 批量获取多个 field             | `HMGET key field [field ...]`             | `HMGET heima:user:1 name age`           |
| **HGETALL** | 获取 key 下全部 field 与 value | `HGETALL key`                             | `HGETALL heima:user:1`                  |
| **HKEYS**   | 获取 key 下全部 field         | `HKEYS key`                               | `HKEYS heima:user:1`                    |
| **HVALS**   | 获取 key 下全部 value         | `HVALS key`                               | `HVALS heima:user:1`                    |
| **HINCRBY** | 指定 field 按步长自增（整型）       | `HINCRBY key field increment`             | `HINCRBY heima:user:1 age 1`            |
| **HSETNX**  | 仅当 field 不存在时写入，否则不执行    | `HSETNX key field value`                  | `HSETNX heima:user:1 phone 13800000000` |




## 5.4 List 类型与常见命令

List（列表）可视为双向链表结构（类似 Java 的 `LinkedList`），支持从两端插入与弹出，也可按索引区间读取。特征：**有序**、**元素可重复**、**头尾插入/删除快**、**按位置查询需遍历，速度一般**。


| 命令         | 作用                             | 语法                                | 示例                                         |
| ---------- | ------------------------------ | --------------------------------- | ------------------------------------------ |
| **LPUSH**  | 从列表左侧插入一个或多个元素                 | `LPUSH key element [element ...]` | `LPUSH heima:queue:msg a b`                |
| **LPOP**   | 移除并返回左侧第一个元素；列表为空时返回 nil       | `LPOP key`                        | `LPOP heima:queue:msg`                     |
| **RPUSH**  | 从列表右侧插入一个或多个元素                 | `RPUSH key element [element ...]` | `RPUSH heima:queue:msg c`                  |
| **RPOP**   | 移除并返回右侧第一个元素                   | `RPOP key`                        | `RPOP heima:queue:msg`                     |
| **LRANGE** | 返回下标区间内全部元素（含两端）               | `LRANGE key start stop`           | `LRANGE heima:queue:msg 0 -1`（`-1` 表示最后一个） |
| **BLPOP**  | 同 LPOP，列表为空时阻塞等待，超时仍无元素则返回 nil | `BLPOP key [key ...] timeout`     | `BLPOP heima:queue:msg 10`（最多等待 10 秒）      |
| **BRPOP**  | 同 RPOP，列表为空时阻塞等待               | `BRPOP key [key ...] timeout`     | `BRPOP heima:queue:msg 10`                 |




## 5.5 Set 类型与常见命令

Set（集合）结构与 Java 的 `HashSet` 类似，可看作 value 恒为 null 的 HashMap；底层为哈希表。特征：**无序**、**元素不可重复**、**查找快**、支持**交集、并集、差集**等集合运算。


| 命令            | 作用                               | 语法                             | 示例                                 |
| ------------- | -------------------------------- | ------------------------------ | ---------------------------------- |
| **SADD**      | 向 set 添加一个或多个 member             | `SADD key member [member ...]` | `SADD heima:tags:1 java redis`     |
| **SREM**      | 移除 set 中的指定 member               | `SREM key member [member ...]` | `SREM heima:tags:1 redis`          |
| **SCARD**     | 返回 set 中 member 个数               | `SCARD key`                    | `SCARD heima:tags:1`               |
| **SISMEMBER** | 判断 member 是否在 set 中              | `SISMEMBER key member`         | `SISMEMBER heima:tags:1 java`      |
| **SMEMBERS**  | 返回 set 中全部 member                | `SMEMBERS key`                 | `SMEMBERS heima:tags:1`            |
| **SINTER**    | 求多个 key 对应 set 的交集               | `SINTER key [key ...]`         | `SINTER heima:set:s1 heima:set:s2` |
| **SDIFF**     | 求多个 key 对应 set 的差集（以第一个 key 为基准） | `SDIFF key [key ...]`          | `SDIFF heima:set:s1 heima:set:s2`  |
| **SUNION**    | 求多个 key 对应 set 的并集               | `SUNION key [key ...]`         | `SUNION heima:set:s1 heima:set:s2` |




## 5.6 SortedSet（ZSet）类型与常见命令

SortedSet（有序集合，Redis 中常称 **ZSet**）是带 **score** 的有序 set：每个 member 唯一，按 score 排序。概念上类似 Java 的 `TreeSet`，但底层一般为 **跳表 + 哈希表** 组合实现。特征：**可排序**、**member 不重复**、**查询快**；常用于**排行榜**等场景。


| 命令                          | 作用                               | 语法                                         | 示例                                      |
| --------------------------- | -------------------------------- | ------------------------------------------ | --------------------------------------- |
| **ZADD**                    | 添加 member 并指定 score；已存在则更新 score | `ZADD key score member [score member ...]` | `ZADD heima:rank:game 100 jack 95 rose` |
| **ZREM**                    | 删除指定 member                      | `ZREM key member [member ...]`             | `ZREM heima:rank:game rose`             |
| **ZSCORE**                  | 获取 member 的 score                | `ZSCORE key member`                        | `ZSCORE heima:rank:game jack`           |
| **ZRANK**                   | 获取 member 按 score 升序的排名（从 0 起）   | `ZRANK key member`                         | `ZRANK heima:rank:game jack`            |
| **ZCARD**                   | 返回 member 个数                     | `ZCARD key`                                | `ZCARD heima:rank:game`                 |
| **ZCOUNT**                  | 统计 score 落在闭区间内的 member 个数       | `ZCOUNT key min max`                       | `ZCOUNT heima:rank:game 90 100`         |
| **ZINCRBY**                 | 将 member 的 score 增加指定步长          | `ZINCRBY key increment member`             | `ZINCRBY heima:rank:game 5 jack`        |
| **ZRANGE**                  | 按 score 升序，取下标区间内的 member        | `ZRANGE key start stop`                    | `ZRANGE heima:rank:game 0 2`            |
| **ZRANGEBYSCORE**           | 按 score 升序，取 score 区间内的 member   | `ZRANGEBYSCORE key min max`                | `ZRANGEBYSCORE heima:rank:game 90 100`  |
| **ZDIFF / ZINTER / ZUNION** | 对多个 ZSet 求差集、交集、并集               | `ZDIFF numkeys key [key ...]` 等            | `ZINTER 2 heima:zset:s1 heima:zset:s2`  |


默认按 score **升序**排名与区间；需要**降序**时在命令的 `Z` 后插入 `REV`（如 `ZREVRANK`、`ZREVRANGE`），例如 `ZREVRANGE heima:rank:game 0 0` 可取排行榜第一名。

# 六、 Java 客户端：Jedis

[Jedis](https://github.com/redis/jedis) 是常用的 Java Redis 客户端：创建 `Jedis` 实例后，**方法名与 Redis 命令一致**（如 `set` 对应 SET、`get` 对应 GET），便于对照 [String 常见命令](#redis-string-commands) 等 CLI 小节。基本步骤：**引入依赖 → 建立连接 → 调用 API → 释放资源**；生产环境更推荐 [连接池](#redis-jedis-pool) 替代频繁直连。

## 6.1 Maven 依赖

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.7.0</version>
</dependency>
```



## 6.2 连接、操作与释放


| 步骤         | 语法                      | 示例                                                   |
| ---------- | ----------------------- | ---------------------------------------------------- |
| 建立连接       | `new Jedis(host, port)` | `jedis = new Jedis("192.168.150.101", 6379);`        |
| 认证（若服务端开启） | `jedis.auth(password)`  | `jedis.auth("123321");`                              |
| 选择逻辑库      | `jedis.select(index)`   | `jedis.select(0);`                                   |
| 写入 String  | `jedis.set(key, value)` | `jedis.set("name", "张三");`                           |
| 读取 String  | `jedis.get(key)`        | `jedis.get("name");`                                 |
| 释放连接       | `jedis.close()`         | 在 `@AfterEach` 中 `if (jedis != null) jedis.close();` |


```java
private Jedis jedis;

@BeforeEach
void setUp() {
    jedis = new Jedis("192.168.150.101", 6379); // 连接虚拟机中的redis库
    jedis.auth("123321");
    jedis.select(0);
}

@Test
void testString() {
    String result = jedis.set("name", "张三");
    System.out.println("result = " + result);
    String name = jedis.get("name");
    System.out.println("name = " + name);
}

@AfterEach
void tearDown() {
    if (jedis != null) {
        jedis.close(); //关闭redis连接
    }
}
```



## 6.3 Jedis 连接池

`Jedis` 实例**线程不安全**，频繁 `new Jedis` / `close` 也有性能损耗，推荐使用 **JedisPool** 统一管理连接。从池中 `getResource()` 得到的 `Jedis`，用完后仍调用 `close()`，连接会**归还池**而非物理断开（用法与 [6.2](#redis-jedis-direct) 中释放资源一致）。


| 配置项          | 语法                                 | 示例                                       |
| ------------ | ---------------------------------- | ---------------------------------------- |
| 最大连接数        | `JedisPoolConfig#setMaxTotal(int)` | `jedisPoolConfig.setMaxTotal(8);`        |
| 最大空闲连接       | `setMaxIdle(int)`                  | `jedisPoolConfig.setMaxIdle(8);`         |
| 最小空闲连接       | `setMinIdle(int)`                  | `jedisPoolConfig.setMinIdle(0);`         |
| 获取连接最大等待（毫秒） | `setMaxWaitMillis(long)`           | `jedisPoolConfig.setMaxWaitMillis(200);` |



| 步骤    | 语法                                                     | 示例                                                                         |
| ----- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| 创建连接池 | `new JedisPool(config, host, port, timeout, password)` | `new JedisPool(jedisPoolConfig, "192.168.150.101", 6379, 1000, "123321");` |
| 借用连接  | `jedisPool.getResource()`                              | `Jedis jedis = JedisConnectionFactory.getJedis();`                         |
| 归还连接  | `jedis.close()`                                        | 在 `finally` 或 `@AfterEach` 中关闭                                             |


```java
public class JedisConnectionFactory {
    private static final JedisPool jedisPool;

    static {
        JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
        jedisPoolConfig.setMaxTotal(8);
        jedisPoolConfig.setMaxIdle(8);
        jedisPoolConfig.setMinIdle(0);
        jedisPoolConfig.setMaxWaitMillis(200);
        jedisPool = new JedisPool(jedisPoolConfig, "192.168.150.101", 6379,
                1000, "123321");
    }

    public static Jedis getJedis() {
        return jedisPool.getResource();
    }
}
```

> 本仓库业务模块采用 Spring Data Redis，见下一节；Jedis 多用于学习或对连接生命周期的直接控制。



# 七、 Spring Boot 整合 Redis

[Spring Data Redis](https://spring.io/projects/spring-data-redis) 是 Spring Data 中面向 Redis 的集成模块：默认基于 **Lettuce** 客户端（亦可选 Jedis），通过 **RedisTemplate** 统一 API，并支持发布订阅、Sentinel/Cluster、序列化等能力。Java 侧整合步骤：**引入依赖 → 配置** `[Redis/hm-dianping](../Redis/hm-dianping)` 下 `application.yaml` **→ 注入 Template 使用**。

## 7.1 Maven 依赖

本仓库 `[Redis/hm-dianping/pom.xml](../Redis/hm-dianping/pom.xml)` 已引入：

```xml
<!--redis坐标-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

启用 **Lettuce 连接池**时还需 `commons-pool2`（课件示例；`[Redis/hm-dianping/pom.xml](../Redis/hm-dianping/pom.xml)` 已声明）：

```xml
<!--连接池依赖-->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```



## 7.2 环境配置

Spring Boot **3.x** 使用 `spring.data.redis` 前缀。本仓库 `[Redis/hm-dianping/src/main/resources/application.yaml](../Redis/hm-dianping/src/main/resources/application.yaml)` 为 Boot **2.x**，使用 `spring.redis` 前缀，片段如下：

```yaml
spring:
  redis:
    host: 192.168.150.101
    port: 6379 #redis的默认端口号
    password: 123321
    lettuce:
      pool:
        max-active: 10
        max-idle: 10
        min-idle: 1
```

课件中常见写法（Boot 2.x 为 `spring.redis`；Boot 3 请将同级项移到 `spring.data.redis` 下）含密码与 Lettuce 连接池，与 [Jedis 连接池](#redis-jedis-pool) 中 `maxTotal` / `maxIdle` / `minIdle` / `maxWaitMillis` 含义对应：


| 配置项                       | 作用                | 课件示例值 |
| ------------------------- | ----------------- | ----- |
| `lettuce.pool.max-active` | 连接池最大连接数（在用 + 空闲） | `8`   |
| `lettuce.pool.max-idle`   | 池中最多保留的空闲连接数      | `8`   |
| `lettuce.pool.min-idle`   | 池中至少维持的空闲连接数      | `0`   |
| `lettuce.pool.max-wait`   | 获取连接的最大等待时间（毫秒）   | `100` |


```yaml
spring:
  data:
    redis:
      host: 192.168.150.101
      port: 6379
      password: 123321
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
          max-wait: 100
```



## 7.3 RedisTemplate 与数据类型 API

`RedisTemplate` 封装各类 Redis 命令；不同 Value 类型的 API 分属不同 `*Operations`，与第五节 CLI 小节对应关系如下。


| API                           | 返回值类型             | 说明                               |
| ----------------------------- | ----------------- | -------------------------------- |
| `redisTemplate.opsForValue()` | `ValueOperations` | [String](#redis-string-commands) |
| `redisTemplate.opsForHash()`  | `HashOperations`  | [Hash](#redis-hash-commands)     |
| `redisTemplate.opsForList()`  | `ListOperations`  | [List](#redis-list-commands)     |
| `redisTemplate.opsForSet()`   | `SetOperations`   | [Set](#redis-set-commands)       |
| `redisTemplate.opsForZSet()`  | `ZSetOperations`  | [ZSet](#redis-zset-commands)     |
| `redisTemplate` 自身            | —                 | 通用命令（如 `delete`）                 |


注入与 String 测试（课件写法）：

```java
@Autowired
private RedisTemplate redisTemplate;

@Test
void testString() {
    redisTemplate.opsForValue().set("name", "李四");
    Object name = redisTemplate.opsForValue().get("name");
    System.out.println("name = " + name);
}
```



## 7.4 StringRedisTemplate 与序列化

为节省空间、避免默认 JSON 序列化带来的可读性与工具兼容问题，本仓库业务与测试统一使用 `StringRedisTemplate`：

- key、value 默认均为 **String 序列化**；
- 存 Java 对象时需**手动** JSON 序列化/反序列化（与 [key 结构](#redis-key-structure) 中 JSON 字符串建模一致）。


| 方法              | 作用           | 示例                                   |
| --------------- | ------------ | ------------------------------------ |
| `opsForValue()` | 操作 String 类型 | `ops.set(key, value, timeout, unit)` |
| `opsForHash()`  | 操作 Hash 类型   | `ops.put(key, hashKey, value)`       |
| `delete(key)`   | 删除 key       | `stringRedisTemplate.delete(key)`    |


- `opsForValue()` 的 `set` / `get` 及带过期参数的 `set` 分别对应 [String 常见命令](#redis-string-commands) 中的 SET、GET、SETEX（或 SET + EXPIRE）；
- `opsForHash()` 的 `put` / `get` 对应 [Hash 常见命令](#redis-hash-commands) 中的 HSET、HGET。

**RedisTemplate 序列化常见两种做法**（二选一，勿混用同一 key）：


| 方案           | 做法                                                                       |
| ------------ | ------------------------------------------------------------------------ |
| **方案一**      | 自定义 `RedisTemplate`，将序列化器改为 `GenericJackson2JsonRedisSerializer`，由框架读写对象 |
| **方案二（本仓库）** | 使用 `StringRedisTemplate`，写入前 `ObjectMapper` 等转为 JSON 字符串，读取后再反序列化为对象     |




### 7.4.1 实战示例：存取与过期控制

```java
// Redis/hm-dianping/src/main/java/com/hmdp/service/impl/UserServiceImpl.java

ValueOperati ons<String, String> operations = stringRedisTemplate.opsForValue();
operations.set("username","zhangsan");
operations.set("id","1",15, TimeUnit.SECONDS);//15秒后过期,过期后会被redis删除，就无法获取到了

System.out.println(operations.get("id"));
```



# 八、 业务实战：基于 Redis 的 Token 会话管控

alt text
alt text

- 实战功能
alt text
- 实战表
alt text

在无状态的 JWT 架构中，Redis 常用于实现 Token 的主动失效（如退出登录、改密）。

## 8.1 核心流程

1. **登录成功**：生成 JWT 后，将其作为 Key（或 Value）存入 Redis，并设置与 JWT 一致的过期时间。
2. **拦截校验**：[登录拦截器](#login-interceptor) 从请求头获取 Token 后，需在 Redis 中查询是否存在，不存在则视为已失效。
3. **状态变更**：用户退出登录或修改密码时，从 Redis 中删除对应的 Token，实现强制下线。



## 8.2 拦截器逻辑实现

在 `[Redis/hm-dianping](../Redis/hm-dianping)` 的 `[RefreshTokenInterceptor.java](../Redis/hm-dianping/src/main/java/com/hmdp/utils/RefreshTokenInterceptor.java)` 中，通过 Redis 校验 Token 有效性（课件 `big-event` 为 JWT + `LoginInterceptor` 写法，本模块为 Hash 存用户 + 拦截器刷新 TTL）：

```java
// Redis/hm-dianping/src/main/java/com/hmdp/utils/RefreshTokenInterceptor.java

@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    String token = request.getHeader("Authorization");
    try {
        // 从 Redis 获取相同 Token
        ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
        String redisToken = operations.get(token);
        if (redisToken == null) {
            // Redis 中无记录，说明 Token 已失效
            throw new RuntimeException();
        }
        
        Map<String, Object> claims = JwtUtil.parseToken(token);
        ThreadLocalUtil.set(claims);
        return true;
    } catch (Exception e) {
        response.setStatus(401);
        return false;
    }
}
```



## 8.3 登录与登出管理

在 `[Redis/hm-dianping](../Redis/hm-dianping)` 的 `[UserServiceImpl.java](../Redis/hm-dianping/src/main/java/com/hmdp/service/impl/UserServiceImpl.java)` 中管理 Token 的生命周期：


| 动作        | 核心代码片段                                            | 业务目的          |
| --------- | ------------------------------------------------- | ------------- |
| **登录**    | `operations.set(token, token, 1, TimeUnit.HOURS)` | 记录在线会话，同步过期时间 |
| **改密/退出** | `operations.getOperations().delete(token)`        | 强制失效当前 Token  |




# 九、Redis 实战



## [（一）Redis 缓存实战 {#redis-cache-chapter}](https://www.bilibili.com/video/BV1cr4y1671t/?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=47)

应用侧将热点数据放入 [Redis](#redis)，用 [Spring Boot 整合 Redis](#spring-boot-redis) 中的 `StringRedisTemplate` 读写 JSON 字符串，是典型的 **Cache-Aside（旁路缓存）**：读时先查缓存，未命中再查库并回写；写库后通过删缓存或更新缓存保持与数据库一致。商铺查询与更新见本节 [CacheClient](#redis-cache-client) 与 [缓存更新](#redis-cache-update)。

### 9.1 认识缓存与读路径模型 {#redis-cache-model}

**缓存**指具备高效读写能力的 **数据暂存区域**（本实战以 [Redis](#redis) 承载）。与 [9.2](#redis-cache-concepts) 汇总表中的「缓存」行互补：本节讲通用价值与成本，下表描述典型 **读缓存** 链路。


| 维度     | 说明                                                                                                                                              |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **作用** | 降低后端（如数据库）负载；提高服务读写响应速度                                                                                                                         |
| **成本** | 开发与封装成本；部署与监控等运维成本；缓存与持久化数据源之间的 **一致性问题**（更新策略见 [9.3](#redis-cache-update)，异常场景见 [9.4](#redis-cache-penetration)～[9.6](#redis-cache-breakdown)） |


**读路径（Cache-Aside 查询）**


| 步骤      | 说明                                                                 |
| ------- | ------------------------------------------------------------------ |
| **请求**  | 客户端先访问 Redis                                                       |
| **命中**  | key 存在且为有效数据，直接返回                                                  |
| **未命中** | Redis 无数据，查询数据库                                                    |
| **写缓存** | 将库中结果写入 Redis（常配合 [EXPIRE / SETEX](#redis-string-commands) 设置 TTL） |
| **响应**  | 将数据返回客户端                                                           |




### 9.2 概念与问题汇总 {#redis-cache-concepts}


| 主题              | 含义                                  | 本仓库实战要点                                                                             |
| --------------- | ----------------------------------- | ----------------------------------------------------------------------------------- |
| **缓存**          | 将高频访问数据放在内存型存储，降低数据库压力、缩短响应时间       | 与第二节「低延迟」一致；key 形态见 [key 结构](#redis-key-structure)                                  |
| **Cache-Aside** | 业务代码负责读缓存、回写缓存、写库后维护缓存              | `ShopServiceImpl#queryById` 经 `CacheClient` 查询；`update` 后 `delete` 商铺 key           |
| **缓存更新策略**      | 写库与写/删缓存的先后顺序                       | 商铺更新采用 **先更新数据库，再删除缓存**（见 [9.3](#redis-cache-update)）                               |
| **缓存穿透**        | 查询不存在的数据，缓存与库均无，请求反复打到 DB           | **空值缓存**：`CACHE_NULL_TTL` + 空字符串占位（见 [9.4](#redis-cache-penetration)）               |
| **缓存雪崩**        | 大量 key 在同一时刻过期，或 Redis 不可用，请求集中打 DB | 课件手段见 [9.5](#redis-cache-avalanche)；[Redis/hm-dianping](../Redis/hm-dianping) 未单独演示 |
| **缓存击穿**        | 热点 key 过期瞬间，并发同时查库                  | **互斥锁重建**或**逻辑过期 + 异步重建**（见 [9.6](#redis-cache-breakdown)）                          |
| **工具封装**        | 将「查缓存 → 回源 → 写缓存」与治理逻辑收敛到组件         | `CacheClient` 提供三种查询模板（见 [9.7](#redis-cache-client)）                                |




### 9.3 缓存更新策略 {#redis-cache-update}

[9.2](#redis-cache-concepts) 汇总表已说明本仓库写路径采用 **先更新数据库、再删除缓存**；本节从「如何维护缓存与库的一致性」展开，并落到 [Redis/hm-dianping](../Redis/hm-dianping) 商铺更新代码。

#### 9.3.1 三种维护方式（按一致性需求选型）


| 方式       | 机制                                                              | 一致性 | 维护成本 | 典型场景                                                   |
| -------- | --------------------------------------------------------------- | --- | ---- | ------------------------------------------------------ |
| **内存淘汰** | 不主动维护；内存紧张时由 Redis 淘汰 key，下次读再回源建缓存                             | 差   | 无    | 低一致性，如店铺类型等变更不频繁、可容忍短暂旧数据                              |
| **超时剔除** | 写入缓存时设置 TTL（见 [EXPIRE / SETEX](#redis-string-commands)），到期自动删除  | 一般  | 低    | 作兜底：即使主动删缓存失败，过期后仍会回源                                  |
| **主动更新** | 业务在写库时同步删缓存或更新缓存（见下文 [Cache-Aside](#redis-cache-aside-pattern)） | 好   | 高    | 高一致性，如商铺详情（本仓库 `CACHE_SHOP_TTL` 与 `update` 删 key 组合使用） |


高一致性场景常见组合：**主动更新 + TTL 兜底**（读路径回写时带过期时间，见 [9.1](#redis-cache-model) 与 `RedisConstants.CACHE_SHOP_TTL`）。

#### 9.3.2 主动更新：三种架构模式 {#redis-cache-aside-pattern}


| 模式                     | 谁维护一致性                     | 特点                                                         |
| ---------------------- | -------------------------- | ---------------------------------------------------------- |
| **Cache-Aside（旁路缓存）**  | 调用方（业务代码）读缓存、回写缓存，写库后删/改缓存 | 与 [第九章](#redis-cache-chapter) 及 `CacheClient` 一致；**本仓库采用** |
| **Read/Write Through** | 缓存组件作为统一入口，内部同步写库与缓存       | 对调用方透明，需专用缓存中间件或封装层                                        |
| **Write Behind**       | 调用方只写缓存，异步线程批量落库           | 吞吐高，库与缓存为最终一致，适合日志、计数等非强一致场景                               |




#### 9.3.3 Cache-Aside 写路径的三点取舍

- **删缓存还是改缓存？**  
写库后 **删除缓存**（让下次读触发回源再写入），而不是每次把新值写入缓存。直接「更新缓存」会产生大量无效写，且并发下容易写入中间态。
- **库与缓存如何一起成功或失败？**  
单体可在同一 **本地事务** 内先写库再删缓存（删缓存失败可重试或依赖 TTL）；跨服务需分布式事务或补偿（如 TCC），本仓库 `ShopServiceImpl#update` 使用 `@Transactional` 保证库更新在同一事务边界内。
- **先删缓存还是先写库？**
  - **先删缓存、再写库**：另一线程可能在库未更新前回源，把 **旧值** 写回缓存，随后写库完成，导致缓存长期为旧数据（不一致窗口大）。
  - **先写库、再删缓存（推荐）**：仍可能出现「写库并删缓存之后，另有读请求把旧值写回缓存」的极小概率竞态，但写库通常远慢于写缓存，该窗口极短；课件与生产实践均优先此顺序。
- 读路径（与 [9.1](#redis-cache-model) 一致）：命中则返回；未命中则查库、写入缓存并设置 TTL（`CacheClient#queryWithPassThrough` 使用 `CACHE_SHOP_TTL`）。
- 写路径（本仓库）：`updateById` 后 `stringRedisTemplate.delete(CACHE_SHOP_KEY + id)`。

```java
// Redis/hm-dianping/src/main/java/com/hmdp/service/impl/ShopServiceImpl.java
    @Override
    @Transactional // 事务注解，保证数据库和缓存的一致性
    public Result update(Shop shop) {
        Long id = shop.getId(); // 店铺id   
        if (id == null) {
            return Result.fail("店铺id不能为空");
        }
        // 1.更新数据库
        updateById(shop); // 更新数据库
        // 2.删除缓存
        stringRedisTemplate.delete(CACHE_SHOP_KEY + id); // 更新数据后，删除缓存防止缓存与数据库不一致
        return Result.ok();
    }
```



### 9.4 缓存穿透 {#redis-cache-penetration}

[9.2](#redis-cache-concepts) 汇总表中的 **缓存穿透** 指：请求的数据在 **缓存与数据库都不存在**，持续发起此类请求会反复绕过缓存访问 DB。治理通常 **缓存层 + 接口/风控层** 组合；本仓库读路径以 `CacheClient#queryWithPassThrough` 为主（`ShopServiceImpl#queryById`）。

#### 9.4.1 解决方案归纳

alt text


| 手段            | 要点                     | [Redis/hm-dianping](../Redis/hm-dianping)        |
| ------------- | ---------------------- | ------------------------------------------------ |
| **缓存 null 值** | 库无结果时写入短 TTL 占位，后续不再打库 | **采用**（见 [9.4.2](#redis-cache-penetration-null)） |
| **布隆过滤**      | 先判 key 是否可能存在，不存在则直接拒绝 | 未实现                                              |
| **增强 id 复杂度** | 降低遍历、猜测 id 规律的风险       | 商铺 `id` 为自增 `Long`，未单独做雪花等改造                     |
| **基础格式校验**    | 入口拒绝非法参数，减少无效回源        | `ShopController`：`@PathVariable Long id`         |
| **用户权限校验**    | 读接口鉴权，缩小可被滥用的访问面       | 商铺详情查询未单独演示                                      |
| **热点参数限流**    | 限制异常或高频访问，保护 DB        | 未单独演示                                            |


上图两种 **纯缓存层** 手段对比如下（与表中前两行对应）：


| 方案        | 优点               | 缺点                                  |
| --------- | ---------------- | ----------------------------------- |
| **缓存空对象** | 实现简单、易维护         | 占少量内存；占位期内新建同 id 可能短暂读不到（删缓存或等 TTL） |
| **布隆过滤器** | 内存占用低、不产生大量空 key | 需与数据同步；存在「可能存在」误判                   |




#### 9.4.2 本仓库：缓存空对象读路径 {#redis-cache-penetration-null}

流程与 [9.1](#redis-cache-model) 类似，差异在 **库也无数据** 时仍写缓存，避免恶意或高频的非法 id 打穿 DB：

1. 读 Redis：`get` 到非空 JSON → 反序列化返回。
2. `get` 到 **空字符串**（`""`）→ 视为已缓存的「不存在」，**不再查库**，返回 `null`（业务层转失败提示）。
3. `get` 为 `null`（真正未命中）→ 查库；若仍为 `null`，`set(key, "", CACHE_NULL_TTL, MINUTES)` 后返回 `null`；若有数据则按正常 TTL 回写（`CACHE_SHOP_TTL`）。

空值与有效 JSON 的区分依赖：`StrUtil.isNotBlank(json)` 为真才当命中；`json != null` 且非 blank 时即为空值占位（Redis 中存的是 `""`，`get` 非 `null`）。

```java
// Redis/hm-dianping/src/main/java/com/hmdp/service/impl/ShopServiceImpl.java

@Override
public Result queryById(Long id) {
    // 解决缓存穿透
    Shop shop = cacheClient
            .queryWithPassThrough(CACHE_SHOP_KEY, id, Shop.class, this::getById, CACHE_SHOP_TTL, TimeUnit.MINUTES);
    if (shop == null) {
        return Result.fail("店铺不存在！");
    }
    return Result.ok(shop);
}
```

```java
// Redis/hm-dianping/src/main/java/com/hmdp/utils/CacheClient.java（queryWithPassThrough 核心片段）

String json = stringRedisTemplate.opsForValue().get(key);
if (StrUtil.isNotBlank(json)) {
    return JSONUtil.toBean(json, type);
}
if (json != null) {
    return null;
}
R r = dbFallback.apply(id);
if (r == null) {
    stringRedisTemplate.opsForValue().set(key, "", CACHE_NULL_TTL, TimeUnit.MINUTES);
    return null;
}
this.set(key, r, time, unit);
return r;
```

`RedisConstants.CACHE_NULL_TTL` 为 **2**（分钟），故意短于商铺正常缓存 TTL，减轻「后来新增了该 id 却仍被空值挡住」的时间窗口；商铺 **更新/删除** 时仍应删 `cache:shop:{id}`（见 [9.3](#redis-cache-update)）。互斥锁、逻辑过期模板中的空值处理与上一致，见 [9.6](#redis-cache-breakdown)、[9.7](#redis-cache-client)。

### 9.5 缓存雪崩 {#redis-cache-avalanche}

- **缓存雪崩** 指：在同一时段内，**大量缓存 key 同时过期** ，导致读请求集体未命中，或 **Redis 服务宕机/不可用** 导致请求绕过缓存，数据库在短时间内承受极高并发。
- 与 [9.6 缓存击穿](#redis-cache-breakdown) 不同：击穿针对 **单个热点 key** 过期瞬间的并发回源，雪崩强调 **规模性失效** 或 **缓存层整体故障**。

alt text

#### 9.5.1 常见解决方案


| 手段                | 要点                                            | [Redis/hm-dianping](../Redis/hm-dianping)                           |
| ----------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| **TTL 加随机值**      | 写入缓存时在基础过期时间上叠加随机偏移，避免批量预热/同时写入的 key 同一时刻集体过期 | `CacheClient#set` 使用入参固定 TTL（如 `CACHE_SHOP_TTL = 30` 分钟），**未**做随机偏移 |
| **Redis 集群提高可用性** | 主从、哨兵或分片集群，降低单点宕机导致全量打库的概率                    | 第二节特性表 **高可用与扩展**；工程为单机 Redis 接入，**未**配置集群                          |
| **降级与限流**         | 缓存不可用或回源压力过大时，接口限流、熔断或返回兜底数据，保护 DB            | **未**单独演示                                                           |
| **多级缓存**          | 业务侧增加本地缓存（如 Caffeine）再访问 Redis，分担热点与故障流量      | **未**单独演示                                                           |


读路径仍依赖 [9.1](#redis-cache-model) 的 TTL 兜底；写路径删缓存见 [9.3](#redis-cache-update)。热点 key 并发重建见 [9.6](#redis-cache-breakdown)。

### 9.6 缓存击穿 {#redis-cache-breakdown}

- **缓存击穿**（热点 key 问题）：**高并发访问** 的 key 在 **物理过期或逻辑过期** 且 **回源重建成本较高（查询需要等待的时间较久）** 时，大量线程同时未命中并查库，DB 瞬时承压。
- 与 [9.5 雪崩](#redis-cache-avalanche) 不同，击穿强调 **单个热点**；与 [9.4 穿透](#redis-cache-penetration) 不同，穿透是 **数据本身不存在**。

常见两类方案对比如下；`CacheClient` 分别提供 `queryWithMutex`、`queryWithLogicalExpire`（空值防穿透逻辑与 [9.4.2](#redis-cache-penetration-null) 一致）。`ShopServiceImpl#queryById` 默认仍用 `queryWithPassThrough`，击穿方案在源码中为 **注释切换**。


| 方案       | 优点                                    | 缺点                                                                         |
| -------- | ------------------------------------- | -------------------------------------------------------------------------- |
| **互斥锁**  | 无额外包装结构、实现相对简单、回源后写入的缓存与 DB 一致        | 未抢到锁的线程需等待重试，吞吐受影响；锁超时与重试策略需设计，否则存在长时间自旋或异常场景                              |
| **逻辑过期** | 命中后 **直接返回**（过期则返回旧数据），线程无需同步等待回源，性能好 | 短期内可能读到过期数据；需 `RedisData` 等包装与线程池异步重建，实现更复杂、占一定内存；逻辑过期的本质是永久有效，自行根据保存的时间判断 |


锁 key 前缀：`RedisConstants.LOCK_SHOP_KEY`（`lock:shop:` + id）；`tryLock` 使用 `SET key NX` 并设 **10 秒** 过期（`LOCK_SHOP_TTL`），避免进程异常导致死锁。

#### 9.6.1 互斥锁：`queryWithMutex` {#redis-cache-breakdown-mutex}

alt text

1. 读缓存：有有效 JSON → 返回；空字符串占位 → 按穿透处理返回 `null`。
2. 未命中 → `tryLock(lock:shop:{id})`；**失败**则 `Thread.sleep(50)` 后 **递归重试** 整个查询。
3. **成功** → 查库；无数据则写空值缓存；有数据则 `set` 带 TTL 回写，最后在 `finally` 中 `delete` 释放锁。

```java
// Redis/hm-dianping/src/main/java/com/hmdp/utils/CacheClient.java（互斥锁核心）

boolean isLock = tryLock(lockKey);
if (!isLock) {
    Thread.sleep(50);
    return queryWithMutex(keyPrefix, id, type, dbFallback, time, unit); // 递归重新执行
}
r = dbFallback.apply(id);
// ... 空值 / 写缓存 ...
```

```java
// Redis/hm-dianping/src/main/java/com/hmdp/utils/CacheClient.java

private boolean tryLock(String key) {
    // 获取锁，setIfAbsent：如果key不存在，则设置值为1，并返回true，如果key存在，则返回false
    Boolean flag = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", 10, TimeUnit.SECONDS);
    return BooleanUtil.isTrue(flag);
}
```

```java
// Redis/hm-dianping/src/main/java/com/hmdp/service/impl/ShopServiceImpl.java（切换示例，默认未启用）

// Shop shop = cacheClient
//         .queryWithMutex(CACHE_SHOP_KEY, id, Shop.class, this::getById, CACHE_SHOP_TTL, TimeUnit.MINUTES);
```



#### 9.6.2 逻辑过期：`queryWithLogicalExpire` {#redis-cache-breakdown-logical}

alt text
Redis 中 **不设 key 的 TTL**（或长期存在），在 value 内嵌 **逻辑过期时间**：

```java
// Redis/hm-dianping/src/main/java/com/hmdp/utils/RedisData.java

@Data
public class RedisData {
    private LocalDateTime expireTime;
    private Object data;
}
```

`setWithLogicalExpire` 将 `{ data, expireTime }` 序列化写入；读路径 `queryWithLogicalExpire`：

1. 无缓存 → 返回 `null`（需 **预热**，见下）。
2. 反序列化为 `RedisData`，若 `expireTime` **未过期** → 返回业务对象。
3. 若 **已过期** → 尝试 `tryLock`；抢到锁则在 `CACHE_REBUILD_EXECUTOR` 中异步查库并 `setWithLogicalExpire` 重建，**当前请求仍返回过期数据**；未抢到锁同样返回过期数据，避免集体等待。

```java
// Redis/hm-dianping/src/main/java/com/hmdp/utils/CacheClient.java（逻辑过期重建片段）

if (expireTime.isAfter(LocalDateTime.now())) {
    return r;
}
String lockKey = LOCK_SHOP_KEY + id;
boolean isLock = tryLock(lockKey);
if (isLock) {
    CACHE_REBUILD_EXECUTOR.submit(() -> {
        try {
            R newR = dbFallback.apply(id);
            this.setWithLogicalExpire(key, newR, time, unit);
        } finally {
            unlock(lockKey);
        }
    });
}
return r;
```

预热示例（测试类写入带逻辑过期的商铺缓存）：

```java
// Redis/hm-dianping/src/test/java/com/hmdp/HmDianPingApplicationTests.java

Shop shop = shopService.getById(1L);
cacheClient.setWithLogicalExpire(CACHE_SHOP_KEY + 1L, shop, 10L, TimeUnit.SECONDS);
```

```java
// Redis/hm-dianping/src/main/java/com/hmdp/service/impl/ShopServiceImpl.java（queryById 切换示例）

// Shop shop = cacheClient
//         .queryWithLogicalExpire(CACHE_SHOP_KEY, id, Shop.class, this::getById, 20L, TimeUnit.SECONDS);
```

课件常用 **JMeter** 对商铺查询接口做高并发压测，对比穿透/击穿方案下 DB 压力；本仓库未提交 `.jmx` 文件。三种读模板的方法签名与选用场景见 [9.7](#redis-cache-client)。

### 9.7 缓存工具封装 {#redis-cache-client}



## （二）优惠券秒杀实战 {#seckill-chapter}



### 实现订单自增id

用户抢购优惠券时会生成订单并写入 `tb_voucher_order`（`id` 为 `bigint` 主键，DDL 未使用自增，见 `Redis/hm-dianping/src/main/resources/db/hmdp.sql`）。若订单主键仍依赖数据库自增，在秒杀等高并发场景下常见问题是：

- **id 规律明显**：连续递增易被猜测，暴露业务量或带来爬取风险。
- **受单表容量与单点序列限制**：分库分表后难以保证全局唯一，扩展性差。

分布式场景下通常引入 **全局 ID 生成器**：在分布式系统中生成 **全局唯一** 的 id，一般需满足下列特性：


| 特性      | 含义            | `RedisIdWorker` 中的体现                              |
| ------- | ------------- | ------------------------------------------------- |
| **唯一性** | 任意两次生成不重复     | 时间戳 + Redis `INCR` 序列拼接                           |
| **高可用** | 发号服务持续可用      | 依赖 Redis；Redis 故障会影响发号（需集群/哨兵等保障，见第二节 **高可用与扩展**） |
| **高性能** | 高并发下快速发号      | `INCR` 原子递增；测试见下文 `testIdWorker`                  |
| **递增性** | 整体趋势递增，利于索引   | 高位为相对时间戳，低位为当日递增序列                                |
| **安全性** | 不易被简单猜中下一单 id | 非连续自增 1、2、3，含时间戳与按日隔离的序列                          |




### 全局 ID 生成器：`RedisIdWorker` {#redis-id-worker}

发号逻辑（`nextId(String keyPrefix)`）：

1. **时间戳**：当前秒级时间减去固定起点 `BEGIN_TIMESTAMP`（`1640995200L`，即 2022-01-01 00:00:00 UTC）。
2. **序列号**：Redis key `icr:{keyPrefix}:{yyyy:MM:dd}` 上执行 `INCR`，按 **天** 分 key，避免单 key 计数无限增大。
3. **拼接**：`timestamp << 32 | count`（序列占 **32** 位，`COUNT_BITS = 32`）。

业务发订单号示例：`VoucherOrderServiceImpl` 中 `redisIdWorker.nextId("order")`。

```java
// Redis/hm-dianping/src/main/java/com/hmdp/utils/RedisIdWorker.java

public long nextId(String keyPrefix) {
    // 1.生成时间戳
    LocalDateTime now = LocalDateTime.now();
    long nowSecond = now.toEpochSecond(ZoneOffset.UTC); // 当前时间戳
    long timestamp = nowSecond - BEGIN_TIMESTAMP; // 时间戳

    // 2.生成序列号
    // 2.1.获取当前日期，精确到天
    String date = now.format(DateTimeFormatter.ofPattern("yyyy:MM:dd"));
    // 2.2.自增长
    long count = stringRedisTemplate.opsForValue().increment("icr:" + keyPrefix + ":" + date);// 自增长:拼上日期，避免超过key的自增长范围

    // 3.拼接并返回
    return timestamp << COUNT_BITS | count; // 拼接:时间戳左移32位，然后与序列号进行或运算
}
```



#### 并发压测：`testIdWorker`

`HmDianPingApplicationTests#testIdWorker` 使用 **500** 线程池提交 **300** 个任务，每个任务循环 **100** 次调用 `nextId("order")`（合计 **3 万** 次发号），`CountDownLatch` 等待全部结束后打印耗时，用于观察 Redis 发号在高并发下的性能。

```java
// Redis/hm-dianping/src/test/java/com/hmdp/HmDianPingApplicationTests.java

@Test
void testIdWorker() throws InterruptedException {
    CountDownLatch latch = new CountDownLatch(300); // 创建一个计数器，用于等待所有线程完成
    // Runnable: 一个接口，用于定义一个任务，run方法中定义任务的内容。无返回值，无参数。
    Runnable task = () -> {
        for (int i = 0; i < 100; i++) {
            long id = redisIdWorker.nextId("order");
            System.out.println("id = " + id);
        }
        latch.countDown(); // 计数器减1
    };
    long begin = System.currentTimeMillis(); // 开始时间
    for (int i = 0; i < 300; i++) {
        es.submit(task);
    }
    latch.await(); // 等待所有线程完成
    long end = System.currentTimeMillis(); // 结束时间
    System.out.println("time = " + (end - begin)); // 打印时间差
}
```

