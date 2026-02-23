---
title: 代码随想录
date: '2025-01-05 11:30:18'
updated: '2025-01-20 00:11:27'
permalink: /post/dai-ma-sui-xiang-lu-1kc5wn.html
comments: true
toc: true
categories: ['随笔']
tags: ['记录']
---

# 代码随想录

- 参考：https://programmercarl.com/

# 数组

1. [704. 二分查找](https://leetcode.cn/problems/binary-search/)
2. [27. 移除元素](https://leetcode.cn/problems/remove-element/)，一次遍历解决
3. [977. 有序数组的平方](https://leetcode.cn/problems/squares-of-a-sorted-array/)
4. [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)，前缀和+二分查找NlogN，滑动窗口On复杂度

# 动态规划

- 股票类

1. [121. 买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)，买入只能从0往下减，规避了多次交易的问题
2. [122. 买卖股票的最佳时机 II](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/)，可以多次交易，买入可以继承之前无股票的历史收益
3. [123. 买卖股票的最佳时机 III](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii/)，只可以两次交易，定义四组变量即可，依次迭代
4. [188. 买卖股票的最佳时机 IV](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv/)，K次交易就是K种状态，第K次交易有，第K次交易无（递推公式，第K次有是从第K次有or第K-1次没有买入的；K次无以此类推）
5. [309. 买卖股票的最佳时机含冷冻期](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/)，三种状态，注意分清不持有是有两种的，1是冷冻期，2是非冷冻期
6. [714. 买卖股票的最佳时机含手续费](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)，状态更简单，递推加一个手续费即可

- 序列类问题

1. [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)，DP方法是On2，可以用虚拟子序列的方式
2. [674. 最长连续递增序列](https://leetcode.cn/problems/longest-continuous-increasing-subsequence/)，DP方法，只要比前面大就可以加1
3. [718. 最长重复子数组](https://leetcode.cn/problems/maximum-length-of-repeated-subarray/)，DP方法很自然，可以优化到On的空间复杂度
4. [1143. 最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)，DP方法很自然，同样可以优化到ON复杂度
5. [1035. 不相交的线](https://leetcode.cn/problems/uncrossed-lines/)，就是最长公共子序列，因为序列不相交就要是公共子序列的方向
6. [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)，DP方法很自然，递推是历史和0的最大值+当前值
7. [392. 判断子序列](https://leetcode.cn/problems/is-subsequence/)，<span data-type="text" style="background-color: var(--b3-card-success-background); color: var(--b3-card-success-color);">简单</span> 感觉这个更适合双指针来做（看了眼解答，貌似是编辑距离的开端）
8. [115. 不同的子序列](https://leetcode.cn/problems/distinct-subsequences/)，<span data-type="text" style="background-color: var(--b3-card-error-background); color: var(--b3-card-error-color);">困难</span>  

    ```python
            # 这下双指针不灵了，试试DP？
            # DP[i][j]表示s[:i]中有K个t[:j]
            # 递推：等于的话DP[i-1][j-1]+DP[i-1][j]，不等于的话DP[i-1][j]
    ```
9. [583. 两个字符串的删除操作](https://leetcode.cn/problems/delete-operation-for-two-strings/)，<span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">中等</span> 字符串编辑类DP，递归即可
10. [72. 编辑距离](https://leetcode.cn/problems/edit-distance/)，<span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">中等</span> 字符串编辑类DP，递归公式和583不同，思路一致
11. [647. 回文子串](https://leetcode.cn/problems/palindromic-substrings/)，<span data-type="text" style="background-color: var(--b3-card-warning-background); color: var(--b3-card-warning-color);">中等</span> 回文串系列，难点是设计DP上，区间DP

- 打家劫舍类
- 背包问题
- 其他

# 面经题目

1. [560. 和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)
2. 替换后最长的重复字符串 424 - 双指针 ✅
3. 连续子数组最大和 53 ✅
4. 买股票问题

# TOP100

之前是把链表之前的刷完了，先从动态规划开始刷

1. 2024.07.22 lc 198 279 322 ✅
2. 2024.07.23 lc 139 300 ✅
3. 2024.07.24 lc 152 ✅ 416 ❌（背包问题忘了）
4. 2024.07.31 lc 416 ✅ 32 ✅（捡起背包问题，同时降维）32题不熟

开始贪心算法

1. 2024.07.31 lc 121 ✅ 55 ✅ 45 ✅（需要复习，思路和边界条件）
2. 2024.08.03 lc 763 ✅

开始堆栈

1. 2024.08.03 lc 20 ✅ 155 ✅ 394 ✅ 739 ✅ 84 ✅ （需要复习，栈的思路）
2. 2024.08.05 lc 215 ✅ 345 ✅（熟悉堆的定义，345是215的变体）
3. 2024.08.06 lc 295 ✅（用二分查找的方法做出来了，插入数据的复杂度高，还是两个最大最小堆好用）

> 最小堆（Min Heap）是一种特殊的二叉树数据结构，它具有以下特性：
>
> 1. **完全二叉树**：
>    - 最小堆是一个完全二叉树，这意味着除了最后一层外，每一层都被完全填满。
>    - 如果最后一层没有填满，则节点都靠左排列。
> 2. **堆性质**：
>    - 对于每一个节点 `i`（除了根节点），它的值都大于或等于其父节点的值。
>    - 即如果节点 `i` 的父节点是 `parent(i)`，则有 `heap[parent(i)] <= heap[i]`。
>    - 因此，根节点（索引为0）始终是最小值。
> 3. **数组表示**：
>    - 最小堆通常使用数组来表示，其中：
>      - 父节点 `i` 的索引为 `(i - 1) // 2`。
>      - 左子节点的索引为 `2 * i + 1`。
>      - 右子节点的索引为 `2 * i + 2`。
>
> 这些性质保证了最小堆的根节点始终是最小值，这使得最小堆非常适合用于需要频繁访问最小值的场景，如优先队列。

开始二分查找

1. 2024.08.06 lc 35 ✅
2. 2024.08.07 lc 74 ✅ 34 ✅
3. 2024.08.27 lc 33 ✅ 4 ✅
4. 2024.08.28 lc 153 ✅

开始图论

1. 2024.09.01 lc 200 ✅ 994 ✅ 广度优先搜索不熟悉 207 ✅ 广度优先搜索

开始回溯法：判断结束条件，判断如何往下走，判断是否满足条件，核心是穷举（通过dfs或者递归的方式解决）

1. 2024.09.01 lc 46 78 17 39（组合总和，回溯和dp背包也可以）22（括号生成，是否满足条件） 79 131 51 ✅

继续链表

1. 2024.09.01 lc 24 ✅

开始多维DP

1. 2024.09.02 lc 62 64 5 ✅
2. 2024.09.07 lc 1143 ✅

其他，感觉价值不大

1. 2024.09.07 lc 136(位运算) 169(超过半数) 75(三个颜色排序) 31 (下一个排列没问题) 287 (看成环形链表) ✅

返回头，刷链表之前的

1. 2024.09.07 lc 23 （合并K个有序链表，困难） ✅ 148 (归并排序，主要取中点的逻辑)
2. [排序方法](https://www.runoob.com/w3cnote/ten-sorting-algorithm.html)：归并排序、快速排序、堆排序

开始动态规划，[参考](https://programmercarl.com/%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92%E7%90%86%E8%AE%BA%E5%9F%BA%E7%A1%80.html#%E7%AE%97%E6%B3%95%E5%85%AC%E5%BC%80%E8%AF%BE)​[ 代码随想录](https://programmercarl.com/)

1. 2024.09.21：lc

- [746. 使用最小花费爬楼梯](https://leetcode.cn/problems/min-cost-climbing-stairs/)
- [63. 不同路径 II](https://leetcode.cn/problems/unique-paths-ii/)
- [343. 整数拆分](https://leetcode.cn/problems/integer-break/)，优化方法是，只需要考虑拆成2和3的情况，因为可证明dpi>=2xdpi-2>=4xdpi-4，后续就不用拆了
- [96. 不同的二叉搜索树](https://leetcode.cn/problems/unique-binary-search-trees/)
- [198. 打家劫舍](https://leetcode.cn/problems/house-robber/)
- [213. 打家劫舍 II](https://leetcode.cn/problems/house-robber-ii/)
- [337. 打家劫舍 III](https://leetcode.cn/problems/house-robber-iii/) 树形DP，后序遍历，递归写即可，不是特别熟悉
- [121. 买卖股票的最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/) 股票类的DP方法，都是记录多种状态，后续的状态更新依赖于前面的各个状态
- [122. 买卖股票的最佳时机 II](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/)
- [123. 买卖股票的最佳时机 III](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii/)，4种状态，第12次买入卖出，记录依次更新
- [188. 买卖股票的最佳时机 IV](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv/)
- [309. 买卖股票的最佳时机含冷冻期](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/)
- [714. 买卖股票的最佳时机含手续费](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)
- [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/) 序列问题，用DP就是On2的复杂度，还可以贪心（但是不好想）

2. 2024.10.06：lc，两个子序列类的问题，都可以尝试DP来做

- [674. 最长连续递增序列](https://leetcode.cn/problems/longest-continuous-increasing-subsequence/)
- [718. 最长重复子数组](https://leetcode.cn/problems/maximum-length-of-repeated-subarray/)
- [1143. 最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)
- [1035. 不相交的线](https://leetcode.cn/problems/uncrossed-lines/)，不相交的线，其实就是两个序列数字的相对顺序一致，所以就是最长公共子序列，二者一模一样
- [53. 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)
- [392. 判断子序列](https://leetcode.cn/problems/is-subsequence/)，不需要DP，双指针即可
- [115. 不同的子序列](https://leetcode.cn/problems/distinct-subsequences/)
- [583. 两个字符串的删除操作](https://leetcode.cn/problems/delete-operation-for-two-strings/)
- [72. 编辑距离](https://leetcode.cn/problems/edit-distance/)，和583思路一样，操作种类多其实是dp递推的时候公式不同
- [647. 回文子串](https://leetcode.cn/problems/palindromic-substrings/)
- [516. 最长回文子序列](https://leetcode.cn/problems/longest-palindromic-subsequence/)，第一次做错了，迭代顺序要想清楚！

3. 2024.10.07：lc，背包问题！刷题[参考](https://leetcode.cn/circle/discuss/u9jlGz/)
