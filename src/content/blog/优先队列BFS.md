---
abbrlink: da96cdb8
mathjax: true
categories:
  - OI学习笔记
  - 搜索
pubDate: 2023-05-14 00:00:00
description: 优先队列BFS讲解+例题
tags:
  - cpp
  - BFS
  - OI
  - 搜索
  - 优先队列
  - 二叉堆
title: 【搜索】优先队列BFS
image: https://saroprock.oss-cn-hangzhou.aliyuncs.com/img/BFS.jpg
---
## 前言

在讲解优先队列BFS之前，让我们回顾一下最普通的走迷宫问题：

> 对于一个迷宫，从起点开始，对于四周能扩展的点打上标记并加入队列。直到从队列取出来的点表示的位置为终点时，退出搜索

显然，在没有限制的情况下，我们只需要给出一条路径，如果把迷宫看成一个无向图，那么每一条边其实都是边权为一的无向边。但我们如果给每一条边不同的权值，一般的BFS就不能解决这个问题了，因为它会在找到一条路径时立刻退出，不能保证最短路径被扩展。实际上这种问题我们可以通过[最短路算法](https://www.saroprock.com/%E3%80%90%E5%9B%BE%E8%AE%BA%E3%80%91%E6%9C%80%E7%9F%AD%E8%B7%AF)求解，而今天我们则尝试用优先队列BFS进行求解。

## 优先队列BFS

### 方法一（不使用优先队列）

方法一非常暴力，仍然使用一般的广搜——采用一般的队列。

这时我们结束条件要进行更改，因为不能保证每一个状态第一次入队时就是最优解，所以只能允许每一个状态被多次更新多次，多次进出队列。也就是结束条件不再是找到终点，而是一直搜索，直到队列为空（迭代思想）。

此时整个广搜算法对搜索树进行了重复遍历更新，直到“收敛”到最优解。想法很暴力，时间复杂度也很暴力（笑）。在最坏情况下，时间复杂度会从O(N)增长到O(N^2)。这跟最短路的[Bellmon-Ford算法](https://www.saroprock.com/%e3%80%90%e5%9b%be%e8%ae%ba%e3%80%91%e6%9c%80%e7%9f%ad%e8%b7%af/#%E4%BA%8C%E3%80%81Bellmon-Ford_%E7%AE%97%E6%B3%95%E5%92%8C_SPFA)差不多（偷懒专用）。

### 方法二（使用优先队列）

这里我们把一般队列改成优先队列，相当于一个二叉堆。

我们可以从队列中取出**当前代价最小的状态进行扩展**（因为当前所有状态中没有比它更优的，所以以后也不会再更新它没有负权边），然后沿这这一条“最优解”道路往下，同时把其他新状态加入优先队列，不断搜索直到队列为空。

类比最短路的[Dijkstra算法](https://www.saroprock.com/%e3%80%90%e5%9b%be%e8%ae%ba%e3%80%91%e6%9c%80%e7%9f%ad%e8%b7%af/#%E4%B8%80%E3%80%81Dijkstra%E7%AE%97%E6%B3%95)，优先队列不像朴素Dijkstra一样寻找所有结点，BFS只会寻找当前有**可能为最优解的搜索树结点**，其逻辑类似于堆优化的Dijkstra算法，都是仅在可能情况下寻找最优解。类似的，在Dijkstra算法中，每一个结点只会被扩展一次，时间复杂度为$O(N)$。优先队列BFS也是如此，**当每一个状态第一次从队列中被取出时，就已经得到了从起始状态到该状态的最优解**，不管它会不会被再次取出，它已经是最优，我们可以直接跳过。所以在优先队列BFS中，**每个结点仍然只被扩展过一次，时间复杂度为$O(N)$**，加上维护二叉堆的代价，优先队列BFS的时间复杂度为$O(N log N)$，这与堆优化的Dijkstra算法类似。

## 例题UVA11367（洛谷评级：紫）

[题目跳转](https://www.luogu.com.cn/problem/UVA11367)

观察题目，可以发现这是一道优先队列BFS+DP。因为这一道题目中引入了油量的概念，所以此时$dist$数组不再是一维数组，而是一个二维数组，它表示所有城市结点和油量结点的集合。

因此，自然地，我们使用一个结构体$Node$来表示每个结点，$Node$包含三个值：**crd**，**oil**以及**cost**。其中crd是当前城市结点的下标 **（我们需要遍历这个城市结点的子城市）**，oil是油量下标，代表当前DP所存储的油量。cost则是从起点S到此结点的最小花费。同时，我们使用$dist[city][fuel]$数组来存储**被扩展**结点的最小cost。

回顾优先队列BFS，我们每次取出在当前状态下的最优解——cost最小的结点，因此我们需要一个小根堆储存$Node$，以cost为比较标准，把cost最小的结点放在堆顶，每次取出堆顶元素进行扩展。同样的，**因为每次取出的已经是当前结点的最优解**（优先队列BFS的特性），所以我们可以给此结点打上一个tag、标记，表示此结点已经被扩展过，无需再次扩展。又因为这个特性，我们无需一直搜索直到队列为空——只要有一次堆顶结点为目标结点，**我们就可以直接结束广度优先搜索，返回答案**。此时目标结点已经是最小值，无需扩展其他结点。

对于题目的每一个问题，我们都单独进行一次优先队列BFS，起始状态结点为$Node(start, 0)$（忽略cost）在每个状态$(crd，oil)$的分支有两条路：

1. 如果此时oil小于汽车油量C，并且子结点的$dist$不是最优 **（$dist[crd][oil + 1] > dist[crd][oil] + 当地油价$）**，则添加一个新的可能改变值的结点，扩展到新状态$(crd，oil + 1)$，同时给$dist[crd][oil + 1]$赋值为$dist[crd][oil]$加上当地油价的值。
2. 对于每一条从城市crd出发的边，若边权大小edge不超过此时油量oil（能开过去），并且并且子结点的dist不是最优 **（$dist[son][oil – edge] > crd结点的cost$）** ，则添加一个新的可能改变值的结点，扩展到新状态$(son，oil – edge)$，同时给$dist[son][oil – edge]$赋值为crd结点的cost。

我们不断取出当前队列中“花费最少的结点”进行扩展，并且更新$dist$的值，**直到终点T第一次被取出**，则停止广度优先搜索，返回T的cost，输出答案。

若直到队列为空也没有取出终点T，**说明没有路可以从起点S到终点T，此时输出impossible。**

下面是示例代码，结合注释应该可以看懂：

```c++
//主要思想：优先队列BFS+DP
#include <iostream>
#include <cstring>
#include <cstdio>
#include <queue>
#define MAX 2005
using namespace std;
int city, road; //当前的城市数和道路数
int C, S, T; //油量C、起点S和终点T
int head[MAX]; //代表一个城市
int toll[MAX]; //每个城市的油价
int edge[MAX * 10]; //储存边的值
int son[MAX * 10]; //子结点链
int ver[MAX * 10]; //代表有向边
/*
注意我们这里用二维数组存结点
因为我们动态规划时要找出最优
所以油量不同的同城市情况也是一个结点
*/
//dist的第一维是当前城市
//dist的第二维是当前油量
int dist[MAX][105]; //存储最小花费
bool tag[MAX][105]; //标记结点
int tot = 0;
struct Node
{
    int crd; //结点下标
    int oil; //到达此结点耗费的油量
    int cost; //到达此结点的总花费
    //结构体函数，方便我们添加结点
    Node(int c, int o, int t)
    {
        //给结点赋值
        crd = c;
        oil = o;
        cost = t;
    }
    //在优先队列中按所花的钱更少的排序，变成小根堆
    bool operator < (const Node &a) const
    {
        //你不用管a是什么，只把符号倒一下就可以了
        return cost > a.cost;
    }
};
priority_queue<Node> q; //存结点Node的小根堆
//没什么好说的邻接表函数
void add(int u, int v, int w)
{
    edge[++tot] = w;
    ver[tot] = v;
    son[tot] = head[u];
    head[u] = tot;
}
int BFS(int start)
{
    while(!q.empty()) q.pop(); //初始化小根堆q
    memset(dist, 0x3f, sizeof(dist)); //初始化dist
    memset(tag, 0, sizeof(tag)); //初始化tag
    q.push(Node(start, 0, 0)); //把起点推入小根堆
    dist[start][0] = 0; //赋值起点
    /*
    因为每次取出结点时，此结点是当前所有状态的最优解
    所以只要我们取出T结点，就可以马上退出广度优先搜索
    */
    //一直计算直到取出T结点
    while(!q.empty())
    {
        Node now = q.top(); //取出最小的结点
        q.pop(); //移出二叉堆
        if(now.crd == T) return now.cost; //如果取出T结点，直接退出
        if(tag[now.crd][now.oil]) continue; //确保此结点没有被扩展过
        tag[now.crd][now.oil] = true; //标记已经扩展过的结点
        //如果油箱没有满且子结点的dist不是最优，则添加一个新的可能改变值的结点
        if(now.oil < C && dist[now.crd][now.oil + 1] > now.cost + toll[now.crd])
        {
            dist[now.crd][now.oil + 1] = now.cost + toll[now.crd]; //更改此时的结点值
            q.push(Node(now.crd, now.oil + 1, now.cost + toll[now.crd])); //把这个更改过，可能影响下一个子结点的结点入队
        }
        //遍历此结点的子结点
        for(int i = head[now.crd]; i; i = son[i])
        {
            if(now.oil < edge[i]) continue; //如果油量不够开，直接continue
            //如果当前城市的子城市在油量为now.oil – edge[i]的情况不是最优解，则更改
            if(dist[ver[i]][now.oil – edge[i]] > now.cost)
            {
                 dist[ver[i]][now.oil – edge[i]] = now.cost; //更新子城市此时油量的dist
                 q.push(Node(ver[i], now.oil – edge[i], now.cost)); //把这个更改过，可能影响下一个子城市的结点入队
            }
        }
    }
    return -1; //如果队列空了都没能取出T结点，说明没有路可走到T结点
}
int main()
{
    scanf(“%d %d”, &city, &road);
    for(int i = 1; i <= city; i++) 
        scanf(“%d”, &toll[i]); //输入当前油价
    for(int i = 1; i <= road; i++)
    {
        int u, v, w;
        scanf(“%d %d %d”, &u, &v, &w);
        u++; v++; //因为我们下标从1开始，这里要把结点下标都加一
        //添加无向边，看成两条重复的有向边
        add(u, v, w);
        add(v, u, w);
    }
    int q;
    scanf(“%d”, &q);
    for(int i = 1; i <= q; i++)
    {
        scanf(“%d %d %d”, &C, &S, &T);
        S++; T++; //因为我们下标从1开始，这里要把起点和终点都加一
        int ans = BFS(S); //开始广度优先搜索
        if(ans == -1) //无解
            printf(“%s\n”, “impossible”);
        else 
            printf(“%d\n”,ans);
    }
    return 0;
}
```
