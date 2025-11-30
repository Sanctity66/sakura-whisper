# 代码规范化与功能完善计划

## 目标描述

对现有代码进行规范化整理，确保功能完整性。重点在于实现数据持久化（LocalStorage）、拆分臃肿组件、解耦业务逻辑、以及统一代码风格（中文注释）。

## 用户审查要求

- [ ] 确认是否同意将 `Dashboard.tsx` 中的子组件拆分为独立文件。
- [ ] 确认是否同意将交易处理逻辑提取到 `utils` 中。

## 拟修改内容

### Utils 层重构

#### [MODIFY] [tradeCalculations.ts](file:///d:/sakura-whisper/utils/tradeCalculations.ts)

- 新增 `processTradeLog` 函数：封装开仓、平仓（全平/部分平仓）的核心逻辑，减少 UI 组件负担。

### 组件拆分与重构

#### [NEW] [DashboardOverview.tsx](file:///d:/sakura-whisper/components/DashboardOverview.tsx)

- 从 `Dashboard.tsx` 中提取概览视图组件。

#### [NEW] [HistoryList.tsx](file:///d:/sakura-whisper/components/HistoryList.tsx)

- 从 `Dashboard.tsx` 中提取历史记录列表组件。

#### [NEW] [TradeCard.tsx](file:///d:/sakura-whisper/components/TradeCard.tsx)

- 提取通用的卡片 UI 组件。

#### [MODIFY] [Dashboard.tsx](file:///d:/sakura-whisper/components/Dashboard.tsx)

- 移除内联组件定义。
- 集成 `storageUtils`：
  - 初始化时加载数据。
  - 数据变更时自动保存。
- 使用 `processTradeLog` 替代原本复杂的 `handleSaveTrade` 逻辑。
- 将所有英文注释翻译为中文。

### 其他组件规范化

#### [MODIFY] [JournalView.tsx](file:///d:/sakura-whisper/components/JournalView.tsx)

- 检查并补充中文注释。
- 确保类型安全。

#### [MODIFY] [ProfitChart.tsx](file:///d:/sakura-whisper/components/ProfitChart.tsx)

- 检查并补充中文注释。

#### [MODIFY] [Navigation.tsx](file:///d:/sakura-whisper/components/Navigation.tsx)

- 检查并补充中文注释。

## 验证计划

### 自动化测试

- 无（本项目暂无测试框架）。

### 手动验证

1. **数据持久化验证**：
    - 添加一笔交易。
    - 刷新页面。
    - 确认交易记录依然存在。
2. **功能完整性验证**：
    - **开仓**：记录一笔新交易，确认出现在“持仓”列表中。
    - **平仓**：对持仓进行平仓操作，确认从“持仓”移至“历史”，并正确计算盈亏。
    - **部分平仓**：对持仓进行部分平仓，确认剩余数量正确，且生成一笔历史记录。
    - **删除**：删除历史记录，确认消失。
3. **UI 检查**：
    - 确认拆分后的组件渲染正常，样式无崩坏。
    - 确认动画效果（如淡入、浮动）依然流畅。
