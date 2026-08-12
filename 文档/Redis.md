# Redis 知识梳理

Redis (Remote Dictionary Server) 诞生于 2009 年，是一个**基于内存**的键值型 NoSQL 数据库。

## 一、 SQL vs NoSQL 核心对比

在选择数据库时，需要根据业务场景在传统关系型数据库（SQL）与非关系型数据库（NoSQL）之间进行权衡。

| 特性 | SQL (关系型数据库) | NoSQL (非关系型数据库) |
| :--- | :--- | :--- |
| **数据结构** | 结构化 (Structured)，表格式 | 非结构化/半结构化，格式灵活 |
| **数据关联** | 关联的 (Relational)，支持强外键约束 | 无关联的 (Non-relational) |
| **查询方式** | SQL 查询 (标准语法) | 非 SQL 查询 (API 或特定语法) |
| **事务特性** | ACID (原子性、一致性、隔离性、持久性) | BASE (基本可用、软状态、最终一致性) |
| **存储方式** | 磁盘存储 (Disk) | 内存存储 (Memory) |
| **扩展性** | 垂直扩展 (提高单机性能) | 水平扩展 (通过集群增加节点) |
| **使用场景** | 数据结构固定、相关业务对安全性/一致性要求高 | 数据结构不固定、对一致性/安全性要求不高、对性能要求高 |

### 1.1 NoSQL 常见分类

| 类型 | 代表产品 | 核心特点 |
| :--- | :--- | :--- |
| **键值类型** | [Redis](#redis) | 极高性能，常用于缓存、会话管理 |
| **文档类型** | MongoDB | 灵活的 JSON 结构，适合复杂嵌套数据 |
| **列类型** | HBase | 适合海量数据存储与随机查询 |
| **Graph 类型** | Neo4j | 擅长处理复杂的社交关系或路径搜索 |

## 二、 Redis 核心特征 <a id="redis"></a>

Redis 以其极高的读写速度和丰富的数据类型成为最受欢迎的键值存储系统。

| 特性 | 说明 |
| :--- | :--- |
| **键值型** | 以 Key-Value 形式存储，Value 支持 String, List, Set, Hash, ZSet 等多种数据结构 |
| **单线程** | 核心网络 IO 与键值读写由单线程完成，每个命令具备原子性，避免了多线程竞争 |
| **低延迟/快** | 基于内存操作，使用 IO 多路复用模型，具备良好的底层数据结构编码优化 |
| **持久化** | 支持 RDB (内存快照) 和 AOF (追加文件) 两种方式，平衡性能与数据安全性 |
| **高可用与扩展** | 支持主从集群、分片集群，可实现高可用与水平扩展 |
| **多语言支持** | 提供丰富的多语言客户端 SDK，方便各类应用集成 |

---

## 三、 Spring Boot 整合 Redis

在 Java 项目中，通常使用 `spring-boot-starter-data-redis` 快速集成（参考 `SpringBoot/big-event/pom.xml`）。

### 3.1 环境配置

在 `application.yml` 中配置连接信息：

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
```

### 3.2 核心工具类：StringRedisTemplate

项目首选使用 `StringRedisTemplate` 进行操作，它已预设 String 序列化器，有效避免乱码问题。

| 方法 | 作用 | 示例 |
| :--- | :--- | :--- |
| `opsForValue()` | 操作字符串类型数据 (ValueOperations) | `ops.set(key, value, timeout, unit)` |
| `opsForHash()` | 操作哈希类型数据 | `ops.put(key, hashKey, value)` |
| `delete(key)` | 删除指定的 Key | `redisTemplate.delete(key)` |

#### 3.2.1 实战示例：存取与过期控制

```java
@Autowired
private StringRedisTemplate stringRedisTemplate;

public void redisDemo() {
    ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
    
    // 存储键值对并设置 15 秒过期
    operations.set("id", "1", 15, TimeUnit.SECONDS);
    
    // 获取键值
    String val = operations.get("id");
}
```

## 四、 业务实战：基于 Redis 的 Token 会话管控

在无状态的 JWT 架构中，Redis 常用于实现 Token 的主动失效（如退出登录、改密）。

### 4.1 核心流程

1. **登录成功**：生成 JWT 后，将其作为 Key（或 Value）存入 Redis，并设置与 JWT 一致的过期时间。
2. **拦截校验**：[登录拦截器](#login-interceptor) 从请求头获取 Token 后，需在 Redis 中查询是否存在，不存在则视为已失效。
3. **状态变更**：用户退出登录或修改密码时，从 Redis 中删除对应的 Token，实现强制下线。

### 4.2 拦截器逻辑实现 <a id="login-interceptor"></a>

在 `LoginInterceptor.java` 中，通过 Redis 校验 Token 有效性：

```java
// SpringBoot/big-event/src/main/java/com/itheima/interceptors/LoginInterceptor.java

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

### 4.3 登录与登出管理

在 `UserController.java` 中管理 Token 的生命周期：

| 动作 | 核心代码片段 | 业务目的 |
| :--- | :--- | :--- |
| **登录** | `operations.set(token, token, 1, TimeUnit.HOURS)` | 记录在线会话，同步过期时间 |
| **改密/退出** | `operations.getOperations().delete(token)` | 强制失效当前 Token |
