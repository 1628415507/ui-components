<!--
 * @Description: 
 * @Date: 2024-10-31 15:18:02
 * @LastEditTime: 2024-10-31 15:33:31
-->
<template>
  <el-tree
    class="tree-line"
    style="max-width: 600px"
    :data="data"
    :props="defaultProps"
    @node-click="handleNodeClick"
  />
</template>

<script lang="ts" setup>
interface Tree {
  label: string
  children?: Tree[]
}

const handleNodeClick = (data: Tree) => {
  console.log(data)
}

const data: Tree[] = [
  {
    label: 'Level one 1',
    children: [
      {
        label: 'Level two 1-1',
        children: [
          {
            label: 'Level three 1-1-1'
          }
        ]
      }
    ]
  },
  {
    label: 'Level one 2',
    children: [
      {
        label: 'Level two 2-1',
        children: [
          {
            label: 'Level three 2-1-1'
          }
        ]
      },
      {
        label: 'Level two 2-2',
        children: [
          {
            label: 'Level three 2-2-1'
          }
        ]
      }
    ]
  },
  {
    label: 'Level one 3',
    children: [
      {
        label: 'Level two 3-1',
        children: [
          {
            label: 'Level three 3-1-1'
          }
        ]
      },
      {
        label: 'Level two 3-2',
        children: [
          {
            label: 'Level three 3-2-1'
          }
        ]
      }
    ]
  }
]

const defaultProps = {
  children: 'children',
  label: 'label'
}
</script>
<style lang="scss">
// 树添加指示线线
.tree-line {
  & > .el-tree-node > .el-tree-node__children::before {
    border-left: none !important;
    content: none !important;
  }

  .el-tree-node {
    position: relative;

    // padding-left: 16px; // 缩进量
    .el-tree-node__content {
      padding-left: 0px !important;
    }

    .el-tree-node__children {
      padding-left: 16px; // 缩进量
    }

    // 当前层最后一个节点的竖线高度固定
    &:last-child::before {
      height: 38px; // 可以自己调节到合适数值
    }

    // 横线
    // &::after {
    //   content: '';
    //   width: 24px;
    //   height: 20px;
    //   position: absolute;
    //   left: -3px;
    //   top: 12px;
    //   border-width: 1px;
    //   // border-top: 1px dashed #e6e6e6;
    // }
  }

  // 竖线
  .el-tree-node::before,
  .el-tree-node__children::before {
    content: '';
    height: 100%;
    width: 1px;
    position: absolute;
    left: -3px;
    top: 0; //-26px;
    border-width: 1px;
    border-left: 1px dashed #e6e6e6;
  }

  // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
  & > .el-tree-node::after {
    border-top: none;
  }

  & > .el-tree-node::before {
    border-left: none;
  }

  // 展开关闭的icon
  .el-tree-node__expand-icon {
    font-size: 16px;

    // 叶子节点（无子节点）
    &.is-leaf {
      color: transparent;
      // display: none; // 也可以去掉
    }
  }
}
</style>
