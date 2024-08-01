---
abbrlink: ac6b0409
mathjax: true
categories:
  - 技术
  - OI学习笔记
  - 动态规划
pubDate: 2023-05-14 00:00:00
tags:
  - DP
  - 线性动态规划
  - cpp
  - OI
title: 【动态规划】LIS与LCS（最长上升子序列）
image: https://saroprock.oss-cn-hangzhou.aliyuncs.com/img/LIS%E4%B8%8ELCS.png
description: ...
---

## 引子-LIS 问题

这几天在学习**DP（动态规划）**，里面第一个接触到的问题就是**LIS**问题，这里简单概述如下:

> 给定一个长度为$N$的数列$A$，求数值单调递增的子序列的的长度最长是多少？

其中 LIS（最长上升子序列）指的是从序列 A 中选择若干个 i，使得$i_{1}<i_{2}<i_{3}...<i_{n}$的同时满足$A_{i_{1}}<A_{i_{2}}<A_{i_{3}}...<A_{i_{n}}$。

---

### LIS 的朴素解法

最朴素的想法就是用一个数组$DP[i]$表示在$1-i$范围内的 LIS 长度，初始化$DP[i]$为$1$（它自己一个数作为一个 LIS）。如果在小于$1-i$的范围内有满足 LIS 定义的情况，就可以转移$DP[i]$的值，代表选入这个范围和$A[i]$做为 LIS 的一部分。

我们要遍历到$DP[i]$时同时遍历所有在$1-i$内的状态，显然每次转移都是$O(N)$的时间复杂度，总复杂度为$O(N^2)$，状态转移方程如下：

$DP[i] = max(DP[i], DP[j] + 1) | (j < i)$

显然$O(N^2)$的时间复杂度是无法满足 OIer 的，因此我们要进行优化。

---

### LIS 的贪心二分优化

#### 优化思路

为什么朴素算法慢呢？因为我们把**所有**情况枚举了一遍，而最后留下的只有一种。LIS 的朴素算法在那些本不需要枚举的状态上浪费了时间，自然就不行了。

我们知道，LIS 是一个严格单增的数列，那么在两个 LIS 长度相同的情况下，我们希望它**能扩展到的长度**尽可能长，自然是希望**LIS 结尾元素尽可能小**。那么思路就有了，我们使用一个数组$G[i]$保存长度为$i$的 LIS 的结尾元素值记录当前最长的 LIS 长度为$tot$，对于每一个$A[i]$，如果$A[i] > G[tot]$，说明当前可以把$A[i]$接到这一条所谓最长的 LIS 后面，则$G[++tot] = A[i]$。

那么我们的问题就是如何维护$G$数组。其实很简单，思路就是我们上面的思路，但是有一个问题，如果$A[i] \leq G[tot]$，应该怎么办呢？

那么根据我们的优化思路，我们要尽可能确保当前$G$数组里面存储的是当前长度为$i$的 LIS 序列的最优解，也就是 `结尾元素尽可能小`的情况。所以我们要在$G$数组中找到**第一个**大于$A[i]$的元素$G[j]$，用$A[i]$更新$G[i]$。

> 可是如果单纯遍历，复杂度又双叒叕回到了$O(N^2)$级别，所以……

#### 二分优化

显然，$G$数组是一个单调递增的数组，自然地可以使用二分查找优化时间复杂度。把时间复杂度降到$O(N\,log\,N)$级别。

#### 代码整合

那么到目前为止，我们亲爱的$DP$数组就寿终正寝了，换成了我们新的$G$数组~~（`什么NTR剧情`）~~。

下面是代码示例，基础 LIS：

```cpp
#include <algorithm>
#include <iostream>
#include <cstdio>
#include <cmath>
#define MAX 100005
#define INF 1e9

using namespace std;

int A[MAX]; //存数字
int G[MAX]; //我们亲爱的G数组
int tot = 1;

int main()
{
    int N = 0; //长度
    for(int i = 1; i <= N; i++)
    {
        scanf("%d", &A[i]);
        G[i] == INF; //初始化为1e9
    }

    G[1] = A[1]; //我们开始的起点

    for(int i = 2; i <= N; i++)
    {
        if(A[i] > G[tot]) //只要能插入，就先插入
            G[++tot] = A[i]; //初始化最后一个元素值
        else
        {
            int l = 1, r = tot, mid; //新建变量
            while (l < r)
            {
                //基础二分查找
                mid = (l + r) >> 1;
                if(G[mid] > A[i]) r = mid;
                else l = mid + 1;
            }
            G[l] = min(G[l], A[i]); //赋值，加MIN保险
        }
    }

    printf("%d", tot); //输出答案

    return 0;
}
```

### LIS 例题

这里给出一道 LIS 模板题：[导弹拦截](https://www.luogu.com.cn/problem/P1020) LIS 经典。

将拦截的导弹的高度提出来成为原高度序列的一个子序列，根据题意这个子序列中的元素是单调不增的（即后一项总是不大于前一项），我们称为**单调不升子序列**。本问所求能拦截到的最多的导弹，即求**最长的单调不升子序列**。（其实只要判断改一下就好啦！）

#### 第一问

没什么好说的，跑一次示例代码完事。

> 注意这里$G$数组递减！请修改二分查找！

#### 第二问

那么既然是**单调不升子序列**，我们考虑朴素算法，那么$G$数组就要求存储最大的值，每次执行完一次计算，就把选中的元素移除。重复计算，直到全部移除，记录计算次数，输出为答案。

但是这样显然太笨了！我们要优化优化优化！

我们不妨改变一下$G$数组的含义，用$G[i]$存第$i$个系统当前能够拦截的高度，同时我们把这些系统按从小到大排列——类似于原来的$G$数组。显然每次遍历到导弹$A[i]$时，我们拿最小的$G[i] \geq A[i]$是最优解。然后更新$G[i]$的值，显然更新之后排列还是从小到大，$G$数组仍然是单调递增的，因此不需要重新排序。当然如果没有满足$G[i] \geq A[i]$的情况，就新增一个系统。

只要我们仍然保存时间复杂度在$O(N\,log\,N)$ 级别，可以通过$10^5$的数据。

#### 代码整合

下面是 AC 代码：

```cpp
#include <algorithm>
#include <iostream>
#include <cstring>
#include <cstdio>
#include <cmath>
#define MAX 100005
#define INF 1e9

using namespace std;

int A[MAX]; //存数字
int G[MAX];	//我们亲爱的G数组
int tot = 1;

int main()
{
	int N = 0; //长度
	while(~scanf("%d",&A[++N])); --N;

	G[1] = A[1]; //我们开始的起点

	for(int i = 2; i <= N; i++)
	{
		if(A[i] <= G[tot]) //只要能插入，就先插入
			G[++tot] = A[i]; //初始化最后一个元素值
		else
		{
	        int l = 1, r = tot, mid;
	        while (l < r)//获得下标，注意这里G数组递减
	        {
	        	//基础二分查找
	        	mid = (l + r) >> 1;
	        	if(G[mid] >= A[i]) l = mid + 1;
	        	else r = mid;
	        }
			G[l] = max(G[l], A[i]); //赋值，加MAX保险
		}
	}

	printf("%d\n", tot); //输出答案一

	//重置数据
	tot = 1;
	memset(G, INF, sizeof(G));
	G[1] = A[1];

	for(int i = 2; i <= N; i++)
	{
	    int l = 1, r = tot, mid;
	    while (l < r)//获得下标，当然也可能没有
	    {
	    	//基础二分查找
	    	mid = (l + r) >> 1;
	    	if(G[mid] >= A[i]) r = mid;
	    	else l = mid + 1;
	    }
		if(G[l] >= A[i]) G[l] = A[i]; //如果找得到，赋值
		else G[++tot] = A[i]; //如果找不到，初始化一个新的系统
	}

	printf("%d\n", tot); //输出答案二

	return 0;
}
```
