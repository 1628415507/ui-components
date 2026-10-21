-- 1.参数列表
-- 1.1.优惠券id
local voucherId = ARGV[1]
-- 1.2.用户id
local userId = ARGV[2]
-- 1.3.订单id
local orderId = ARGV[3]

-- 2.数据key
-- 2.1.库存key
local stockKey = 'seckill:stock:' .. voucherId
-- 2.2.订单key
local orderKey = 'seckill:order:' .. voucherId

-- 3.脚本业务
-- 3.1.判断库存是否充足 get stockKey
if(tonumber(redis.call('get', stockKey)) <= 0) then
    -- 3.2.库存不足，返回1
    return 1
end

-- 3.2. sismember：判断 member 是否在 set 中
-- ismember判断用户userId是否在orderKey的集合中，如果存在，说明是重复下单，返回2
if(redis.call('sismember', orderKey, userId) == 1) then
    -- 3.3.存在，说明是重复下单，返回2
    return 2
end

-- 3.4.扣库存 incrby stockKey -1,将stockKey的值减1
redis.call('incrby', stockKey, -1)  
-- 3.5.下单（保存用户）sadd orderKey userId,将用户userId添加到orderKey的集合中
redis.call('sadd', orderKey, userId) 
-- 3.6.发送消息到队列中， XADD stream.orders * k1 v1 k2 v2 ...
-- 将用户userId、优惠券voucherId、订单id orderId添加到stream.orders的流中
redis.call('xadd', 'stream.orders', '*', 'userId', userId, 'voucherId', voucherId, 'id', orderId) 
return 0