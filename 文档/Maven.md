# 一、标准目录结构

Maven 采用**约定优于配置**的标准目录布局。根目录存在 `[pom.xml](#maven-pom)` 即标识为 Maven 工程；构建产物默认输出到 `target`。

Maven 标准目录结构示意

## 1.1 目录职责

| 路径 | 作用 |
| -------------------- | ---------------------------------- |
| `pom.xml` | Maven 工程标志与配置文件（[POM](#maven-pom)） |
| `src/main/java` | 项目主体 Java 源码；包名通常与 `groupId` 对应生成 |
| `src/main/resources` | 非 Java 资源：配置文件、静态资源、模板页等 |
| `src/main/webapp` | Web 资源目录（JSP、HTML 等），打包为 `war` 时使用 |
| `src/test/java` | 单元测试源码（如 JUnit） |
| `src/test/resources` | 仅测试阶段使用的配置与资源（可选） |
| `target` | 编译、打包等构建输出目录（class、jar 等） |

目录树示意：

```text
hello/
├── pom.xml                 # Maven 配置
├── src/
│   ├── main/               # 项目主体
│   │   ├── java/           # Java 源码（包由 groupId 生成，如 com.xushu）
│   │   ├── resources/      # 配置、静态资源、模板
│   │   └── webapp/         # Web 资源（仅 war 包项目）
│   │       ├── WEB-INF/    # Web 安全目录
│   │       └── index.jsp
│   └── test/               # 单元测试
│       ├── java/
│       └── resources/      # 测试专用配置（可选）
└── target/                 # 构建输出
```

## 1.2 约定目录的意义

Maven 目标是**尽可能自动化构建**。约定固定目录后，执行编译等任务时无需手工指定路径：自动从 `src/main/java` 读取源码，编译结果写入 `target`。

## 1.3 约定大于配置

若每个新项目都要手动配置「源码目录在哪、输出目录在哪」，会增加大量重复配置成本。Maven 用约定替代这类配置，降低上手与维护成本。

> 技术发展趋势：**约定大于配置，配置大于编码。**

Spring Boot 项目中的目录与依赖实践见 [SpringBoot.md · Maven 依赖管理](./SpringBoot.md#maven-pom)。

---

# 二、Maven 核心概念：POM

## 2.1 含义

**POM**（Project Object Model，项目对象模型）对应工程根目录的 `pom.xml`：描述项目坐标、依赖、插件与构建行为。有 `pom.xml` 即视为 Maven 项目。

坐标（GAV）与依赖声明示例（项目内实战）：

```xml 12:14:SpringBoot/springboot-quickstart/pom.xml
    <!-- 坐标信息，每个maven项目都会有一个唯一的坐标 -->
<groupId>com.itheima</groupId>
<artifactId>springboot-quickstart</artifactId>
<version>0.0.1-SNAPSHOT</version>

 <dependencies>
    <!-- 依赖1  -->
    <dependency>
        <!-- 坐标信息，每个maven项目都会有一个唯一的坐标 -->
        <groupId>com.itheima</groupId>
        <artifactId>springboot-quickstart</artifactId>
        <version>0.0.1-SNAPSHOT</version>
    </dependency>

    <!-- 依赖2  -->
    <dependency>
    
    </dependency>

 </dependencies>

```

| 节点 | 作用 | 示例 |
| -------------- | ----------------------- | ---------------------------------------------- |
| `groupId` | 组织/公司域名倒写，常作为**默认包名**前缀 | `com.itheima` |
| `artifactId` | 项目/模块名 | `springboot-quickstart` |
| `version` | 版本号 | `0.0.1-SNAPSHOT` |
| `packaging` | 打包方式，默认 `jar`；Web 项目需设为 `war` | `war` |
| `properties` | 定义变量（如 JDK 版本、依赖版本），供 `pom.xml` 引用 | 见下文 |
| `parent` | 继承父 POM，统一依赖版本等 | 见 [Spring Boot 父工程](./SpringBoot.md#maven-pom) |
| `dependencies` | 声明本模块直接依赖 | 含 `scope` 时可限定使用范围 |

## 2.2 依赖范围 (Scope)

`scope` 元素用于控制依赖的使用范围：即 Jar 包在哪些阶段（编译、测试、运行/打包）被加载和使用。

### 2.2.1 核心范围对比

| 范围 (Scope) | 编译 (`main`) | 测试 (`test`) | 运行/打包 | 典型示例 |
| :--- | :---: | :---: | :---: | :--- |
| **`compile`** (默认) | √ | √ | √ | 大多数第三方库（如 `log4j`） |
| **`test`** | × | √ | × | 单元测试框架（如 `junit`） |
| **`provided`** | √ | √ | × | 容器已提供的 API（如 `servlet-api`） |
| **`runtime`** | × | √ | √ | 仅运行时需要的实现（如 `mysql-connector`） |
| **`system`** | √ | √ | × | 本地 Jar 包（需配合 `systemPath` 使用，不推荐） |

### 2.2.2 场景说明

-   **`compile`**：最强的依赖。参与项目编译、测试、打包和运行。
-   **`test`**：仅在测试代码编译和执行时有效。打包时会被排除，避免生产环境携带测试工具。
-   **`provided`**：理论上参与编译和测试，但**不会被打包**。因为运行环境（如 Tomcat）已提供该 Jar，打包进入会导致冲突（如 `servlet-api`）。
-   **`runtime`**：跳过编译阶段（代码中不直接引用该类，通过反射或接口调用），但测试和运行时必须存在。
-   **`system`**：与 `provided` 类似，但不从仓库下载，而是引用本地文件系统路径的 Jar。

> **最佳实践**：如果拿不准范围，通常保留默认的 `compile` 即可确保功能正常；从中央仓库复制坐标时，直接保留其自带的 `scope` 配置。

## 2.3 属性定义与变量引用（properties）

通过 `<properties>` 定义变量，可实现依赖版本的集中管理，避免多处硬编码。

**实战配置示例：**

```xml
<properties>
    <!-- 设置 JDK 编译版本 -->
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding> 
    
    <!-- 自定义依赖版本变量 -->
    <javax.servlet.version>3.1.0</javax.servlet.version>
</properties>

<dependencies>
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <!-- 引用变量 -->
        <version>${javax.servlet.version}</version>
    </dependency>
</dependencies>
```

父工程与起步依赖（Starter）属于 Spring Boot 场景，详见 [SpringBoot.md · Maven 依赖管理](./SpringBoot.md#maven-pom)，此处不重复展开。

---

# 三、Maven 构建生命周期与常用命令

Maven 的构建过程被划分为一系列阶段（Phases），这些阶段按顺序执行，共同构成了**生命周期**。

## 3.1 核心构建阶段

| 阶段 | 作用 | 说明 |
| :--- | :--- | :--- |
| `clean` | 清理 | 删除 `target`目录 |
| `compile` | 编译 | 编译 `src/main/java` 下的源码 |
| `test` | 测试 | 执行单元测试（默认跳过测试阶段则不会生成包） |
| `package` | 打包 | 将编译后的代码打包成 `jar` 或 `war` |
| `install` | 安装 | 将打好的包安装到**本地仓库**，供其它项目引用 |
| `deploy` | 部署 | 将包上传到**私服/中央仓库**（通常在企业级开发中使用） |

## 3.2 常用命令执行要求

1. **必须在 `pom.xml` 所在目录执行**：Maven 依赖 `pom.xml` 描述项目，若在该目录下找不到此文件，执行构建命令（如 `mvn package`）会报错：`The goal you specified requires a project to execute but there is no POM in this directory`。
2. **阶段连续性**：执行某个阶段时，Maven 会自动执行该阶段之前的**所有**阶段。例如执行 `mvn package`，会自动触发 `compile` 和 `test`。
3. **组合命令**：常用 `mvn clean package` 确保每次打包前都清理旧产物。

> 注意：`mvn -v` 命令用于查看版本信息，与项目构建无关，可在任意目录下执行。
