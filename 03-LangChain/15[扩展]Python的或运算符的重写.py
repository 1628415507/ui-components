
class Test(object):
    def __init__(self, name):
        self.name = name

    def __or__(self, other):# a|b = a__or__b
        return MySequence(self, other)
    # 原__str__方法的输出的是内存地址，重写__str__使其输出原值
    def __str__(self): 
        return self.name


class MySequence(object):
    def __init__(self, *args):
        self.sequence = []
        for arg in args:
            self.sequence.append(arg)

    def __or__(self, other):
        self.sequence.append(other) #将 | 后的数值追加到sequence数组中
        return self
    # 当该方法被运行时执行
    def run(self):
        for i in self.sequence:
            print(i)


if __name__ == '__main__':
    a = Test('a')
    b = Test('b')
    c = Test('c')
    e = Test('e')
    f = Test('f')
    g = Test('g')

    d = a | b | c | e | f | g  # a.__or__(b)，即a调用了b
    d.run()
    print(type(d))
