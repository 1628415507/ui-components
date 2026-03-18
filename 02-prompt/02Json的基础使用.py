import json
# ====================== 对象转json ======================
d = {
    "name": "周杰轮",
    "age": 11,
    "gender": "男"
}
print("---------s------------")

s = json.dumps(d, ensure_ascii=False)
print(s)

l = [
    {
        "name": "周杰轮",
        "age": 11,
        "gender": "男"
    },
    {
        "name": "蔡依临",
        "age": 12,
        "gender": "女"
    },
    {
        "name": "小明",
        "age": 16,
        "gender": "男"
    }
]
# json.dumps转成json。
# ensure_ascii=False,避免乱码
print("---------l------------")
print(json.dumps(l, ensure_ascii=False))

# ====================== json转对象 ======================
json_str = '{"name": "周杰轮", "age": 11, "gender": "男"}'# 
json_array_str = '[{"name": "周杰轮", "age": 11, "gender": "男"}, {"name": "蔡依临", "age": 12, "gender": "女"}, {"name": "小明", "age": 16, "gender": "男"}]'


res_dict = json.loads(json_str)
print("---------res_dict------------")
print(res_dict, type(res_dict))

print("---------res_list------------")
res_list = json.loads(json_array_str)
print(res_list, type(res_list))

